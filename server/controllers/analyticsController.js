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