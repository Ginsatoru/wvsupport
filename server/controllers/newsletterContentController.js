const fs = require("fs");
const path = require("path");
const NewsletterContent = require("../models/NewsletterContent");

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
    console.error(`Newsletter section ${label} error:`, error);
    res.status(500).json({ success: false, message: `Failed to ${label}` });
  }
};

// ── Public: GET /api/content/newsletter-section/active?lang=en|km — data: null until it's been edited ──
const getActiveNewsletterContent = handle("load newsletter section", async (req, res) => {
  const doc = await NewsletterContent.findOne();
  res.json({ success: true, data: doc ? withUrls(req, doc.getLocalizedContent(req.query.lang)) : null });
});

// ── Admin: both languages ──
const getNewsletterContentAdmin = handle("load newsletter section", async (req, res) => {
  const doc = await NewsletterContent.findOne().lean();
  res.json({ success: true, data: doc ? withUrls(req, doc) : null });
});

// ── Admin: save — "content" JSON + optional file "image" ──
const saveNewsletterContent = handle("save newsletter section", async (req, res) => {
  let c;
  try {
    c = JSON.parse(req.body.content || "{}");
  } catch {
    removeUpload(req);
    return res.status(400).json({ success: false, message: "Invalid form data" });
  }

  const doc = (await NewsletterContent.findOne()) || new NewsletterContent();
  const oldImage = doc.image;

  NewsletterContent.TEXT_FIELDS.forEach((field) => (doc[field] = text(c[field])));
  doc.image = req.file ? `uploads/${req.file.filename}` : storedPath(req, c.image);
  await doc.save();

  if (oldImage !== doc.image) removeFile(oldImage);
  res.json({ success: true, message: "Newsletter section saved" });
});

module.exports = { getActiveNewsletterContent, getNewsletterContentAdmin, saveNewsletterContent };