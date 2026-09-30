const fs = require("fs");
const path = require("path");
const CareersContent = require("../models/CareersContent");

const VALUE_COUNT = 3;
const MAX_OPENINGS = 10;

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
    console.error(`Careers ${label} error:`, error);
    res.status(500).json({ success: false, message: `Failed to ${label}` });
  }
};

// ── Public: GET /api/content/careers/active?lang=en|km — data: null until it's been edited ──
const getActiveCareers = handle("load careers page", async (req, res) => {
  const doc = await CareersContent.findOne();
  res.json({ success: true, data: doc ? withUrls(req, doc.getLocalizedContent(req.query.lang)) : null });
});

// ── Admin: both languages ──
const getCareersAdmin = handle("load careers page", async (req, res) => {
  const doc = await CareersContent.findOne().lean();
  res.json({ success: true, data: doc ? withUrls(req, doc) : null });
});

// ── Admin: save — "content" JSON + optional file "image" ──
const saveCareers = handle("save careers page", async (req, res) => {
  let c;
  try {
    c = JSON.parse(req.body.content || "{}");
  } catch {
    removeUpload(req);
    return res.status(400).json({ success: false, message: "Invalid form data" });
  }

  const doc = (await CareersContent.findOne()) || new CareersContent();
  const oldImage = doc.image;

  CareersContent.TEXT_FIELDS.forEach((field) => (doc[field] = text(c[field])));
  doc.buttonLink = str(c.buttonLink);
  doc.values = [...Array(VALUE_COUNT)].map((_, i) => ({
    title: text(c.values?.[i]?.title),
    description: text(c.values?.[i]?.description),
  }));
  doc.openings = (Array.isArray(c.openings) ? c.openings : [])
    .slice(0, MAX_OPENINGS)
    .map((o) => ({ title: text(o?.title), type: text(o?.type), description: text(o?.description) }))
    .filter((o) => o.title.en);
  doc.image = req.file ? `uploads/${req.file.filename}` : storedPath(req, c.image);
  await doc.save();

  if (oldImage !== doc.image) removeFile(oldImage);
  res.json({ success: true, message: "Careers page saved" });
});

module.exports = { getActiveCareers, getCareersAdmin, saveCareers };