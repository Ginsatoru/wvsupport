// controllers/analyticsController.js
const Visit = require("../models/Visit");
const { parseUserAgent } = require("../utils/userAgentParser");
const { getCountryFromIP } = require("../utils/geoIP");

const DEVICE_TYPES = ["desktop", "tablet", "mobile", "bot", "unknown"];
// What counts as a view: real people, recorded by the current tracker.
// Views from before the tracker fix have no viewId and were inflated (tab switches
// counted as views), so they are left out of every figure. Nothing is deleted.
const COUNTED = { deviceType: { $ne: "bot" }, viewId: { $exists: true } };

// ── Helpers ──
const str = (value, max) => (typeof value === "string" ? value.trim().slice(0, max) : "");
const num = (value, max) => Math.min(Math.max(Number(value) || 0, 0), max);
const clientIp = (req) =>
  req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || req.socket?.remoteAddress || "unknown";

const handle = (label, fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    console.error(`Analytics ${label} error:`, error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// Midnight `daysAgo` days back in the viewer's timezone (tzOffset = JS getTimezoneOffset(), in minutes)
const startOfDay = (tzOffset, daysAgo = 0) => {
  const local = new Date(Date.now() - tzOffset * 60000);
  local.setUTCHours(0, 0, 0, 0);
  local.setUTCDate(local.getUTCDate() - daysAgo);
  return new Date(local.getTime() + tzOffset * 60000);
};

const clampTz = (value) => Math.min(Math.max(Number(value) || 0, -840), 840);

// Page views + unique visitors between two dates
const countRange = async (from, to) => {
  const [stats] = await Visit.aggregate([
    { $match: { ...COUNTED, createdAt: { $gte: from, $lt: to } } },
    { $group: { _id: null, views: { $sum: 1 }, visitors: { $addToSet: "$visitorId" } } },
  ]);
  return { views: stats?.views || 0, visitors: stats?.visitors.length || 0 };
};

// ── Public: record one page view — POST /api/analytics/track ──
exports.trackVisit = handle("track", async (req, res) => {
  const viewId = str(req.body?.viewId, 100);
  const path = str(req.body?.path, 500);
  const visitorId = str(req.body?.visitorId, 100);
  if (!viewId || !path || !visitorId) {
    return res.status(400).json({ success: false, error: "viewId, path and visitorId are required" });
  }

  const ip = clientIp(req);
  const userAgent = req.headers["user-agent"] || "";
  let agent = {};
  try {
    agent = parseUserAgent(userAgent) || {};
  } catch {
    // keep defaults
  }
  const country = await Promise.resolve()
    .then(() => getCountryFromIP(ip))
    .catch(() => null);

  // Upsert on viewId so a retried request never counts twice
  await Visit.updateOne(
    { viewId },
    {
      $setOnInsert: {
        viewId,
        path,
        visitorId,
        ip,
        userAgent,
        country: country || "Unknown",
        browser: agent.browser || "unknown",
        os: agent.os || "unknown",
        deviceType: DEVICE_TYPES.includes(agent.deviceType) ? agent.deviceType : "unknown",
      },
    },
    { upsert: true }
  );

  res.status(201).json({ success: true });
});

// ── Public: time / clicks / scroll for a view — POST /api/analytics/engagement ──
// Updates the existing view only; never creates one.
exports.trackEngagement = handle("engagement", async (req, res) => {
  const viewId = str(req.body?.viewId, 100);
  if (!viewId) return res.status(400).json({ success: false, error: "viewId is required" });

  const e = req.body?.engagement || {};
  await Visit.updateOne(
    { viewId },
    {
      $set: {
        "engagement.clicks": num(e.clicks, 10000),
        "engagement.scrollDepth": num(e.scrollDepth, 1),
        "engagement.timeSpent": num(e.timeSpent, 86400),
      },
    }
  );
  res.status(204).end();
});

// ── Admin: dashboard overview — GET /api/analytics/overview?tzOffset=-420 ──
// Today vs the same point in time yesterday, in the admin's timezone.
exports.getOverviewStats = handle("overview", async (req, res) => {
  const tzOffset = clampTz(req.query.tzOffset);
  const now = new Date();

  const [today, yesterday, totalViews] = await Promise.all([
    countRange(startOfDay(tzOffset), now),
    countRange(startOfDay(tzOffset, 1), new Date(now.getTime() - 24 * 60 * 60 * 1000)),
    Visit.countDocuments(COUNTED),
  ]);

  res.set("Cache-Control", "no-store");
  res.json({
    todayViews: today.views,
    todayVisitors: today.visitors,
    yesterdayViews: yesterday.views,
    yesterdayVisitors: yesterday.visitors,
    totalViews,
  });
});

// ── Admin: detailed summary — GET /api/analytics/summary?days=30&trendDays=7 ──
exports.getAnalyticsSummary = handle("summary", async (req, res) => {
  const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);
  const since = { ...COUNTED, createdAt: { $gte: daysAgo(num(req.query.days, 365) || 30) } };
  const trendSince = { ...COUNTED, createdAt: { $gte: daysAgo(num(req.query.trendDays, 365) || 7) } };

  const [totalVisits, visitorIds, topCountries, engagement, visitTrends] = await Promise.all([
    Visit.countDocuments(since),
    Visit.distinct("visitorId", since),
    Visit.aggregate([
      { $match: since },
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]),
    Visit.aggregate([
      { $match: since },
      {
        $group: {
          _id: null,
          avgClicks: { $avg: "$engagement.clicks" },
          avgScrollDepth: { $avg: "$engagement.scrollDepth" },
          avgTimeSpent: { $avg: "$engagement.timeSpent" },
        },
      },
    ]),
    Visit.aggregate([
      { $match: trendSince },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]),
  ]);

  res.set("Cache-Control", "no-store");
  res.json({
    totalVisits,
    uniqueVisitors: visitorIds.length,
    topCountries: topCountries.map((c) => ({ country: c._id, count: c.count })),
    engagement: engagement[0] || { avgClicks: 0, avgScrollDepth: 0, avgTimeSpent: 0 },
    visitTrends: visitTrends.map((t) => ({ date: t._id, count: t.count })),
  });
});

// ── Admin: views chart — GET /api/analytics/trends?range=Day|Week|Month|Year&tzOffset=-420 ──
// Day: today in 4-hour blocks · Week: last 7 days · Month: last 7 months · Year: last 7 years
const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

// Work in "local time as UTC fields", then shift back to real time for the query
const buildBuckets = (range, tzOffset) => {
  const shift = tzOffset * 60000;
  const local = new Date(Date.now() - shift);
  const y = local.getUTCFullYear();
  const m = local.getUTCMonth();
  const d = local.getUTCDate();
  const fmt = (ms, opts) => new Date(ms).toLocaleString("en-US", { timeZone: "UTC", ...opts });
  const bucket = (fromLocal, toLocal, label) => ({ from: new Date(fromLocal + shift), to: new Date(toLocal + shift), label });

  if (range === "Day") {
    const midnight = Date.UTC(y, m, d);
    return [0, 4, 8, 12, 16, 20].map((h) =>
      bucket(midnight + h * HOUR, midnight + (h + 4) * HOUR, fmt(midnight + h * HOUR, { hour: "numeric" }).replace(" ", "").toLowerCase())
    );
  }
  if (range === "Week") {
    return [6, 5, 4, 3, 2, 1, 0].map((ago) => {
      const start = Date.UTC(y, m, d - ago);
      return bucket(start, start + DAY, fmt(start, { weekday: "short" }));
    });
  }
  if (range === "Year") {
    return [6, 5, 4, 3, 2, 1, 0].map((ago) =>
      bucket(Date.UTC(y - ago, 0, 1), Date.UTC(y - ago + 1, 0, 1), String(y - ago))
    );
  }
  // Month (default)
  return [6, 5, 4, 3, 2, 1, 0].map((ago) =>
    bucket(Date.UTC(y, m - ago, 1), Date.UTC(y, m - ago + 1, 1), fmt(Date.UTC(y, m - ago, 1), { month: "short" }))
  );
};

exports.getViewTrends = handle("trends", async (req, res) => {
  const range = ["Day", "Week", "Month", "Year"].includes(req.query.range) ? req.query.range : "Month";
  const buckets = buildBuckets(range, clampTz(req.query.tzOffset));

  const counts = await Promise.all(
    buckets.map(({ from, to }) => Visit.countDocuments({ ...COUNTED, createdAt: { $gte: from, $lt: to } }))
  );

  res.set("Cache-Control", "no-store");
  res.json({ range, points: buckets.map((b, i) => ({ label: b.label, value: counts[i] })) });
});

// ══════════════════════════════════════════════════════════════════
// Dashboard — stat cards + recent activity — GET /api/analytics/dashboard?tzOffset=-420&limit=5
// ══════════════════════════════════════════════════════════════════
const Message = require("../models/Message");
const ContactMessage = require("../models/ContactMessage");
const NewsletterEmail = require("../models/newsletterModel");
const User = require("../models/User");
const Settings = require("../models/Settings");

// Every editable CMS section: model, name and where it's edited in the admin
const CMS_ROUTE = "/admin-panel/frontend";
const CONTENT_SECTIONS = [
  ["FrontendContent", "Hero Banner", "home/hero"],
  ["Partner", "Partner Logos", "home/partners"],
  ["ServicesContent", "Home Services", "home/services"],
  ["AboutContent", "Home About", "home/about"],
  ["TechContent", "Tech section", "home/tech"],
  ["WorkContent", "Work section", "home/work"],
  ["GalleryContent", "Gallery", "home/gallery"],
  ["NewsletterContent", "Newsletter section", "home/newsletter"],
  ["AboutPageContent", "About Us page", "about/about-page"],
  ["ServicesPageContent", "Services page", "services/services-page"],
  ["FaqContent", "FAQ", "faq/faq"],
  ["CareersContent", "Careers page", "careers/careers-page"],
  ["LegalContent", "Terms & Conditions", "legal/legal"],
  ["NavContent", "Navbar", "global/nav"],
  ["NewsPopup", "News Popup", "global/news-popup"],
  ["FooterContent", "Footer", "global/footer"],
].map(([model, name, route]) => ({ model: require(`../models/${model}`), name, route: `${CMS_ROUTE}/${route}` }));

// When a document was created / last changed (falls back to the id's own timestamp)
const createdOf = (doc) => doc.createdAt || doc._id?.getTimestamp?.();
const changedOf = (doc) => doc.updatedAt || doc.lastUpdated || createdOf(doc);

// % change, one decimal (no previous value → +100% if anything happened)
const pctChange = (current, previous) =>
  previous ? Math.round(((current - previous) / previous) * 1000) / 10 : current ? 100 : 0;

// Friendly names for the site's pages (anything else shows its path)
const PAGE_NAMES = {
  "/": ["Home Page", "home"],
  "/aboutus": ["About Us", "about"],
  "/services": ["Services", "services"],
  "/contact": ["Contact Page", "contact"],
  "/faq": ["FAQ", "faq"],
  "/careers": ["Careers", "careers"],
  "/legal": ["Legal", "legal"],
};
// "/Services/?ref=x" → "/services"
const cleanPath = (path = "") => {
  const p = path.split(/[?#]/)[0].toLowerCase().replace(/\/+$/, "");
  return p || "/";
};

// Chat threads with a visitor line the admin hasn't read yet
const UNREAD_CHAT = { messages: { $elemMatch: { sender: "user", status: { $ne: "read" } } } };

exports.getDashboard = handle("dashboard", async (req, res) => {
  const tzOffset = clampTz(req.query.tzOffset);
  const limit = Math.min(Math.max(Number(req.query.limit) || 5, 1), 50);
  const now = new Date();

  // 7 daily buckets (oldest → today), plus this week vs the week before
  const dayStarts = [...Array(7)].map((_, i) => startOfDay(tzOffset, 6 - i));
  const weekStart = dayStarts[0];
  const prevWeekStart = startOfDay(tzOffset, 13);
  const dayIndex = (date) => {
    for (let i = 6; i >= 0; i--) if (date >= dayStarts[i]) return i;
    return -1;
  };
  const perDay = (dates) => {
    const counts = Array(7).fill(0);
    dates.forEach((d) => {
      const i = dayIndex(new Date(d));
      if (i >= 0) counts[i] += 1;
    });
    return counts;
  };
  // Running total at the end of each day, from creation dates
  const cumulative = (dates) =>
    dayStarts.map((_, i) => {
      const end = i < 6 ? dayStarts[i + 1] : now;
      return dates.filter((d) => new Date(d) < end).length;
    });

  const [
    week, prevWeek, dailyTraffic,
    unreadChats, unreadEmails, chatLines, emailDates,
    subscriberDates, userDocs, contentDocs,
  ] = await Promise.all([
    countRange(weekStart, now),
    countRange(prevWeekStart, weekStart),
    Promise.all(dayStarts.map((start, i) => countRange(start, i < 6 ? dayStarts[i + 1] : now))),
    Message.countDocuments(UNREAD_CHAT),
    ContactMessage.countDocuments({ read: false }),
    // Visitor chat lines in the last 14 days
    Message.aggregate([
      { $match: { updatedAt: { $gte: prevWeekStart } } },
      { $unwind: "$messages" },
      { $match: { "messages.sender": "user", "messages.timestamp": { $gte: prevWeekStart } } },
      { $project: { _id: 0, t: "$messages.timestamp" } },
    ]),
    ContactMessage.find({ createdAt: { $gte: prevWeekStart } }).select("createdAt").lean(),
    NewsletterEmail.find().select("createdAt").lean(),
    User.find().select("createdAt").lean(),
    Promise.all(CONTENT_SECTIONS.map((s) => s.model.findOne().select("createdAt updatedAt").lean())),
  ]);

  // ── Cards ──
  const incoming = [...chatLines.map((l) => l.t), ...emailDates.map((e) => e.createdAt)];
  const incomingThisWeek = incoming.filter((d) => new Date(d) >= weekStart).length;
  const incomingLastWeek = incoming.length - incomingThisWeek;

  const subDates = subscriberDates.map((s) => s.createdAt || s._id.getTimestamp());
  const userDates = userDocs.map(createdOf);
  const contentDates = contentDocs.filter(Boolean).map(createdOf);
  const countBefore = (dates, date) => dates.filter((d) => new Date(d) < date).length;

  const stats = [
    {
      key: "views",
      label: "Total Views",
      value: week.views,
      change: pctChange(week.views, prevWeek.views),
      series: dailyTraffic.map((d) => d.views),
    },
    {
      key: "visitors",
      label: "Unique Visitors",
      value: week.visitors,
      change: pctChange(week.visitors, prevWeek.visitors),
      series: dailyTraffic.map((d) => d.visitors),
    },
    {
      key: "messages",
      label: "New Messages",
      value: unreadChats + unreadEmails,
      change: pctChange(incomingThisWeek, incomingLastWeek),
      series: perDay(incoming),
    },
    {
      key: "subscribers",
      label: "Subscribers",
      value: subDates.length,
      change: pctChange(subDates.length, countBefore(subDates, weekStart)),
      series: cumulative(subDates),
    },
    {
      key: "content",
      label: "Published Content",
      value: contentDates.length,
      change: pctChange(contentDates.length, countBefore(contentDates, weekStart)),
      series: cumulative(contentDates),
    },
    {
      key: "users",
      label: "Active Users",
      value: userDates.length,
      change: pctChange(userDates.length, countBefore(userDates, weekStart)),
      series: cumulative(userDates),
    },
  ];

  // ── Recent activity (built from existing timestamps) ──
  const [latestChats, latestEmails, latestSubs, latestUsers, settings, latestContent] = await Promise.all([
    // Newest visitor line per chat thread
    Message.aggregate([
      { $unwind: "$messages" },
      { $match: { "messages.sender": "user" } },
      { $sort: { "messages.timestamp": -1 } },
      {
        $group: {
          _id: "$_id",
          sessionId: { $first: "$sessionId" },
          name: { $first: "$user.name" },
          content: { $first: "$messages.content" },
          time: { $first: "$messages.timestamp" },
          status: { $first: "$messages.status" },
        },
      },
      { $sort: { time: -1 } },
      { $limit: limit },
    ]),
    ContactMessage.find().sort({ createdAt: -1 }).limit(limit).select("name subject createdAt read").lean(),
    NewsletterEmail.find().sort({ createdAt: -1 }).limit(limit).select("email createdAt seen").lean(),
    User.find().sort({ createdAt: -1 }).limit(limit).select("name email createdAt").lean(),
    Settings.findOne().select("lastUpdated").lean(),
    Promise.all(
      CONTENT_SECTIONS.map((s) => s.model.findOne().sort({ updatedAt: -1 }).select("createdAt updatedAt").lean())
    ),
  ]);

  const activity = [
    ...latestChats.map((c) => ({
      type: "chat",
      id: c.sessionId,
      title: "New chat message",
      detail: `From: ${c.name || "Visitor"}${c.content ? ` · ${c.content.slice(0, 60)}` : ""}`,
      time: c.time,
      unread: c.status !== "read",
      link: "/admin-panel/inbox",
    })),
    ...latestEmails.map((e) => ({
      type: "email",
      id: String(e._id),
      title: "New message received",
      detail: `From: ${e.name}${e.subject ? ` · ${e.subject}` : ""}`,
      time: e.createdAt,
      unread: !e.read,
      link: "/admin-panel/inbox",
    })),
    ...latestSubs.map((s) => ({
      type: "subscriber",
      id: String(s._id),
      title: "New subscriber",
      detail: `${s.email} subscribed to your newsletter`,
      time: s.createdAt || s._id.getTimestamp(),
      unread: s.seen === false,
      link: "/admin-panel/subscribers",
    })),
    ...latestUsers.map((u) => ({
      type: "user",
      title: "New user registered",
      detail: `${u.name || u.email} was added to the dashboard`,
      time: createdOf(u),
      unread: false,
      link: "/admin-panel/users",
    })),
    ...latestContent
      .map((doc, i) =>
        doc
          ? {
              type: "content",
              title: "Content updated",
              detail: `${CONTENT_SECTIONS[i].name} was updated`,
              time: changedOf(doc),
              unread: false,
              link: CONTENT_SECTIONS[i].route,
            }
          : null
      )
      .filter(Boolean),
    ...(settings?.lastUpdated
      ? [
          {
            type: "settings",
            title: "Settings changed",
            detail: "Site settings were updated",
            time: settings.lastUpdated,
            unread: false,
            link: "/admin-panel/settings",
          },
        ]
      : []),
  ]
    .filter((a) => a.time)
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, limit);

  // ── Popular content: top pages, last 30 days vs the 30 before ──
  const DAY_MS = 24 * 60 * 60 * 1000;
  const last30 = new Date(now.getTime() - 30 * DAY_MS);
  const prev30 = new Date(now.getTime() - 60 * DAY_MS);
  const pathCounts = await Visit.aggregate([
    { $match: { ...COUNTED, createdAt: { $gte: prev30 } } },
    { $group: { _id: { path: "$path", recent: { $gte: ["$createdAt", last30] } }, count: { $sum: 1 } } },
  ]);
  const pages = {};
  pathCounts.forEach(({ _id, count }) => {
    const path = cleanPath(_id.path);
    if (path.startsWith("/admin")) return;
    pages[path] = pages[path] || { views: 0, prev: 0 };
    pages[path][_id.recent ? "views" : "prev"] += count;
  });
  const popular = Object.entries(pages)
    .filter(([, p]) => p.views > 0)
    .sort((a, b) => b[1].views - a[1].views)
    .slice(0, 4)
    .map(([path, p]) => ({
      path,
      name: PAGE_NAMES[path]?.[0] || path,
      type: PAGE_NAMES[path]?.[1] || "other",
      views: p.views,
      change: pctChange(p.views, p.prev),
    }));

  // ── Inbox preview: 3 newest unread chats / emails ──
  const [unreadThreadDocs, unreadEmailDocs] = await Promise.all([
    Message.find(UNREAD_CHAT).sort({ updatedAt: -1 }).limit(3).select("sessionId user messages").lean(),
    ContactMessage.find({ read: false })
      .sort({ lastReplyAt: -1, createdAt: -1 })
      .limit(3)
      .select("name subject message messages createdAt")
      .lean(),
  ]);
  const snippetOf = (line, fallback = "") =>
    (line?.content || (line?.attachments?.length ? "Sent an attachment" : fallback)).slice(0, 90);
  const inbox = [
    ...unreadThreadDocs.map((t) => {
      const lines = t.messages.filter((m) => m.sender === "user");
      const last = lines[lines.length - 1];
      return {
        type: "chat",
        id: t.sessionId,
        name: t.user?.name || "Visitor",
        subject: "Live chat",
        snippet: snippetOf(last),
        time: last?.timestamp,
        unread: lines.filter((m) => m.status !== "read").length,
      };
    }),
    ...unreadEmailDocs.map((e) => {
      const lines = (e.messages || []).filter((m) => m.sender === "user");
      const last = lines[lines.length - 1];
      return {
        type: "email",
        id: String(e._id),
        name: e.name,
        subject: e.subject,
        snippet: snippetOf(last, e.message || ""),
        time: last?.timestamp || e.createdAt,
        unread: 1,
      };
    }),
  ]
    .filter((m) => m.time)
    .sort((a, b) => new Date(b.time) - new Date(a.time))
    .slice(0, 3);

  res.set("Cache-Control", "no-store");
  res.json({ success: true, stats, activity, popular, inbox });
});