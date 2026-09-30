const fs = require("fs");
const path = require("path");
const AboutPageContent = require("../models/AboutPageContent");

const FACT_COUNT = 3;
const VALUE_COUNT = 3;

// ── Helpers ──
const str = (value) => (typeof value === "string" ? value.trim() : "");
const text = (value) => ({ en: str(value?.en), km: str(value?.km) });
const origin = (req) => `${req.protocol}://${req.get("host")}/`;
const fullUrl = (req, p) => (p && p.startsWith("uploads/") ? origin(req) + p : p || "");
const storedPath = (req, url) => (str(url).startsWith(origin(req)) ? str(url).slice(origin(req).length) : str(url));
const removeFile = (p) => p && p.startsWith("uploads/") && fs.unlink(path.join(__dirname, "..", p), () => {});
const removeUpload = (req) => req.file && fs.unlink(req.file.path, () => {});
const withUrls = (req, data) => ({ ...data, image: fullUrl(req, data.image) });

const handle = (label, fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    removeUpload(req);
    console.error(`About page ${label} error:`, error);
    res.status(500).json({ success: false, message: `Failed to ${label}` });
  }
};

// ── Public: GET /api/content/about-page/active?lang=en|km — data: null until it's been edited ──
const getActiveAboutPage = handle("load about page", async (req, res) => {
  const doc = await AboutPageContent.findOne();
  res.json({ success: true, data: doc ? withUrls(req, doc.getLocalizedContent(req.query.lang)) : null });
});

// ── Admin: both languages ──
const getAboutPageAdmin = handle("load about page", async (req, res) => {
  const doc = await AboutPageContent.findOne().lean();
  res.json({ success: true, data: doc ? withUrls(req, doc) : null });
});

// ── Admin: save — "content" JSON + optional file "image" ──
const saveAboutPage = handle("save about page", async (req, res) => {
  let c;
  try {
    c = JSON.parse(req.body.content || "{}");
  } catch {
    removeUpload(req);
    return res.status(400).json({ success: false, message: "Invalid form data" });
  }

  const doc = (await AboutPageContent.findOne()) || new AboutPageContent();
  const oldImage = doc.image;

  AboutPageContent.TEXT_FIELDS.forEach((field) => (doc[field] = text(c[field])));
  doc.facts = [...Array(FACT_COUNT)].map((_, i) => text(c.facts?.[i]));
  doc.values = [...Array(VALUE_COUNT)].map((_, i) => ({
    title: text(c.values?.[i]?.title),
    description: text(c.values?.[i]?.description),
  }));
  doc.image = req.file ? `uploads/${req.file.filename}` : storedPath(req, c.image);
  await doc.save();

  if (oldImage !== doc.image) removeFile(oldImage);
  res.json({ success: true, message: "About page saved" });
});

module.exports = { getActiveAboutPage, getAboutPageAdmin, saveAboutPage };