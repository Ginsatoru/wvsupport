const FaqContent = require("../models/FaqContent");

const MAX_ITEMS = 30;

// ── Helpers ──
const str = (value) => (typeof value === "string" ? value.trim() : "");
const text = (value) => ({ en: str(value?.en), km: str(value?.km) });

const handle = (label, fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    console.error(`FAQ ${label} error:`, error);
    res.status(500).json({ success: false, message: `Failed to ${label}` });
  }
};

// ── Public: GET /api/content/faq/active?lang=en|km — data: null until it's been edited ──
const getActiveFaq = handle("load FAQ", async (req, res) => {
  const doc = await FaqContent.findOne();
  res.json({ success: true, data: doc ? doc.getLocalizedContent(req.query.lang) : null });
});

// ── Admin: both languages ──
const getFaqAdmin = handle("load FAQ", async (req, res) => {
  res.json({ success: true, data: await FaqContent.findOne().lean() });
});

// ── Admin: save — JSON body ──
const saveFaq = handle("save FAQ", async (req, res) => {
  const c = req.body || {};
  const items = (Array.isArray(c.items) ? c.items : [])
    .slice(0, MAX_ITEMS)
    .map((item) => ({ question: text(item?.question), answer: text(item?.answer) }))
    .filter((item) => item.question.en && item.answer.en);
  if (!items.length) return res.status(400).json({ success: false, message: "Add at least one question" });

  const doc = (await FaqContent.findOne()) || new FaqContent();
  doc.eyebrow = text(c.eyebrow);
  doc.title = text(c.title);
  doc.intro = text(c.intro);
  doc.items = items;
  await doc.save();

  res.json({ success: true, message: "FAQ saved" });
});

module.exports = { getActiveFaq, getFaqAdmin, saveFaq };