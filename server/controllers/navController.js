const fs = require("fs");
const path = require("path");
const NavContent = require("../models/NavContent");

const MAX_LINKS = 5; // what fits on the mobile bottom bar
const LANGS = ["en", "km"];

// ── Helpers ──
const str = (value) => (typeof value === "string" ? value.trim() : "");
const text = (value) => ({ en: str(value?.en), km: str(value?.km) });
const origin = (req) => `${req.protocol}://${req.get("host")}/`;
const fullUrl = (req, p) => (p && p.startsWith("uploads/") ? origin(req) + p : p || "");
const storedPath = (req, url) => (str(url).startsWith(origin(req)) ? str(url).slice(origin(req).length) : str(url));
const removeFile = (p) => p && p.startsWith("uploads/") && fs.unlink(path.join(__dirname, "..", p), () => {});
const removeUploads = (req) => Object.values(req.files || {}).flat().forEach((f) => fs.unlink(f.path, () => {}));
const flagField = (lang) => `flag_${lang}`;

// Flag images → full URLs
const withUrls = (req, data) => {
  const languages = data.languages || {};
  return {
    ...data,
    languages: Object.fromEntries(LANGS.map((l) => [l, { ...languages[l], flag: fullUrl(req, languages[l]?.flag) }])),
  };
};

const handle = (label, fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    removeUploads(req);
    console.error(`Navbar ${label} error:`, error);
    res.status(500).json({ success: false, message: `Failed to ${label}` });
  }
};

// ── Public: GET /api/content/nav/active?lang=en|km — data: null until it's been edited ──
const getActiveNav = handle("load navbar", async (req, res) => {
  const doc = await NavContent.findOne();
  res.json({ success: true, data: doc ? withUrls(req, doc.getLocalizedContent(req.query.lang)) : null });
});

// ── Admin: both languages ──
const getNavAdmin = handle("load navbar", async (req, res) => {
  const doc = await NavContent.findOne().lean();
  res.json({ success: true, data: doc ? withUrls(req, doc) : null });
});

// ── Admin: save — "content" JSON + optional files flag_en / flag_km ──
const saveNav = handle("save navbar", async (req, res) => {
  let c;
  try {
    c = JSON.parse(req.body.content || "{}");
  } catch {
    removeUploads(req);
    return res.status(400).json({ success: false, message: "Invalid form data" });
  }

  const links = (Array.isArray(c.links) ? c.links : [])
    .slice(0, MAX_LINKS)
    .map((l) => ({ label: text(l?.label), href: str(l?.href), icon: str(l?.icon) }))
    .filter((l) => l.label.en && l.href);
  if (!links.length) {
    removeUploads(req);
    return res.status(400).json({ success: false, message: "Add at least one menu link" });
  }

  const doc = (await NavContent.findOne()) || new NavContent();
  const oldFlags = LANGS.map((l) => doc.languages?.[l]?.flag);

  doc.links = links;
  doc.ctaText = text(c.ctaText);
  doc.ctaLink = str(c.ctaLink);
  doc.loginText = text(c.loginText);
  doc.languages = Object.fromEntries(
    LANGS.map((l) => {
      const file = req.files?.[flagField(l)]?.[0];
      return [
        l,
        {
          flag: file ? `uploads/${file.filename}` : storedPath(req, c.languages?.[l]?.flag),
          short: str(c.languages?.[l]?.short),
          name: str(c.languages?.[l]?.name),
        },
      ];
    })
  );
  await doc.save();

  // Delete flags that were replaced or reset
  const stillUsed = new Set(LANGS.map((l) => doc.languages[l].flag));
  oldFlags.filter((p) => p && !stillUsed.has(p)).forEach(removeFile);

  res.json({ success: true, message: "Navbar saved" });
});

module.exports = { getActiveNav, getNavAdmin, saveNav, flagFields: LANGS.map(flagField) };