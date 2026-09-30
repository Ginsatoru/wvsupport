const LegalContent = require("../models/LegalContent");

const MAX_SECTIONS = 20;

// ── Helpers ──
const str = (value) => (typeof value === "string" ? value.trim() : "");
const text = (value) => ({ en: str(value?.en), km: str(value?.km) });

const handle = (label, fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    console.error(`Legal ${label} error:`, error);
    res.status(500).json({ success: false, message: `Failed to ${label}` });
  }
};

// ── Public: GET /api/content/legal/active?lang=en|km — data: null until it's been edited ──
const getActiveLegal = handle("load legal page", async (req, res) => {
  const doc = await LegalContent.findOne();
  res.json({ success: true, data: doc ? doc.getLocalizedContent(req.query.lang) : null });
});

// ── Admin: both languages ──
const getLegalAdmin = handle("load legal page", async (req, res) => {
  res.json({ success: true, data: await LegalContent.findOne().lean() });
});

// ── Admin: save — JSON body ──
const saveLegal = handle("save legal page", async (req, res) => {
  const c = req.body || {};
  const sections = (Array.isArray(c.sections) ? c.sections : [])
    .slice(0, MAX_SECTIONS)
    .map((s) => ({ title: text(s?.title), body: text(s?.body) }))
    .filter((s) => s.title.en && s.body.en);
  if (!sections.length) return res.status(400).json({ success: false, message: "Add at least one section" });

  const doc = (await LegalContent.findOne()) || new LegalContent();
  doc.eyebrow = text(c.eyebrow);
  doc.title = text(c.title);
  doc.sections = sections;
  await doc.save();

  res.json({ success: true, message: "Legal page saved" });
});

module.exports = { getActiveLegal, getLegalAdmin, saveLegal };