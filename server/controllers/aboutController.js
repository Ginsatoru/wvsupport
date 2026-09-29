const fs = require("fs");
const path = require("path");
const AboutContent = require("../models/AboutContent");

const CARD_COUNT = 4;

// ── Helpers ──
const str = (value) => (typeof value === "string" ? value.trim() : "");
const text = (value) => ({ en: str(value?.en), km: str(value?.km) });
const origin = (req) => `${req.protocol}://${req.get("host")}/`;
const fullUrl = (req, p) => (p && p.startsWith("uploads/") ? origin(req) + p : p || "");
const storedPath = (req, url) => (str(url).startsWith(origin(req)) ? str(url).slice(origin(req).length) : str(url));
const removeFile = (p) => p && p.startsWith("uploads/") && fs.unlink(path.join(__dirname, "..", p), () => {});
const uploadedImage = (req, i) => req.files?.[`image${i}`]?.[0];
const removeUploads = (req) => Object.values(req.files || {}).flat().forEach((f) => fs.unlink(f.path, () => {}));

const handle = (label, fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    removeUploads(req);
    console.error(`About ${label} error:`, error);
    res.status(500).json({ success: false, message: `Failed to ${label}` });
  }
};

// ── Public: GET /api/content/about/active?lang=en|km — data: null until it's been edited ──
const getActiveAbout = handle("load about section", async (req, res) => {
  const doc = await AboutContent.findOne();
  if (!doc) return res.json({ success: true, data: null });
  const data = doc.getLocalizedContent(req.query.lang);
  data.cards = data.cards.map((card) => ({ ...card, image: fullUrl(req, card.image) }));
  res.json({ success: true, data });
});

// ── Admin: both languages ──
const getAboutAdmin = handle("load about section", async (req, res) => {
  const doc = await AboutContent.findOne().lean();
  if (!doc) return res.json({ success: true, data: null });
  res.json({
    success: true,
    data: { ...doc, cards: doc.cards.map((card) => ({ ...card, image: fullUrl(req, card.image) })) },
  });
});

// ── Admin: save — "content" JSON + optional files image0..image3 (one per card) ──
const saveAbout = handle("save about section", async (req, res) => {
  let c;
  try {
    c = JSON.parse(req.body.content || "{}");
  } catch {
    removeUploads(req);
    return res.status(400).json({ success: false, message: "Invalid form data" });
  }

  const doc = (await AboutContent.findOne()) || new AboutContent();
  const oldImages = doc.cards.map((card) => card.image);

  doc.title = text(c.title);
  doc.cards = [...Array(CARD_COUNT)].map((_, i) => {
    const card = c.cards?.[i];
    const file = uploadedImage(req, i);
    return {
      title: text(card?.title),
      description: text(card?.description),
      image: file ? `uploads/${file.filename}` : storedPath(req, card?.image),
      buttonText: text(card?.buttonText),
      buttonLink: str(card?.buttonLink),
    };
  });
  await doc.save();

  // Delete images that were replaced or reset
  const stillUsed = new Set(doc.cards.map((card) => card.image));
  oldImages.filter((p) => !stillUsed.has(p)).forEach(removeFile);

  res.json({ success: true, message: "About section saved" });
});

module.exports = { getActiveAbout, getAboutAdmin, saveAbout, CARD_COUNT };