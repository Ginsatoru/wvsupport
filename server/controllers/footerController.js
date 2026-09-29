const FooterContent = require("../models/FooterContent");

const MAX_COLUMNS = 4;
const MAX_LINKS = 10;
const MAX_SOCIALS = 8;

// ── Helpers ──
const str = (value) => (typeof value === "string" ? value.trim() : "");
const text = (value) => ({ en: str(value?.en), km: str(value?.km) });
const list = (value, max) => (Array.isArray(value) ? value : []).slice(0, max);

const handle = (label, fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    console.error(`Footer ${label} error:`, error);
    res.status(500).json({ success: false, message: `Failed to ${label}` });
  }
};

// ── Public: GET /api/content/footer/active?lang=en|km — data: null until it's been edited ──
const getActiveFooter = handle("load footer", async (req, res) => {
  const doc = await FooterContent.findOne();
  res.json({ success: true, data: doc ? doc.getLocalizedContent(req.query.lang) : null });
});

// ── Admin: both languages ──
const getFooterAdmin = handle("load footer", async (req, res) => {
  res.json({ success: true, data: await FooterContent.findOne().lean() });
});

// ── Admin: save — JSON body ──
const saveFooter = handle("save footer", async (req, res) => {
  const c = req.body || {};
  const doc = (await FooterContent.findOne()) || new FooterContent();

  doc.description = text(c.description);
  doc.followLabel = text(c.followLabel);
  doc.columns = list(c.columns, MAX_COLUMNS).map((col) => ({
    heading: text(col?.heading),
    links: list(col?.links, MAX_LINKS)
      .map((l) => ({ label: text(l?.label), href: str(l?.href) }))
      .filter((l) => l.label.en && l.href),
  }));
  doc.socials = list(c.socials, MAX_SOCIALS)
    .map((s) => ({ platform: str(s?.platform), url: str(s?.url) }))
    .filter((s) => s.platform && s.url);
  await doc.save();

  res.json({ success: true, message: "Footer saved" });
});

module.exports = { getActiveFooter, getFooterAdmin, saveFooter };