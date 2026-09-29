const fs = require("fs");
const path = require("path");
const TechContent = require("../models/TechContent");

const DEVICE_COUNT = 4;
const AVATAR_COUNT = 4;

// ── Helpers ──
const str = (value) => (typeof value === "string" ? value.trim() : "");
const text = (value) => ({ en: str(value?.en), km: str(value?.km) });
const origin = (req) => `${req.protocol}://${req.get("host")}/`;
const fullUrl = (req, p) => (p && p.startsWith("uploads/") ? origin(req) + p : p || "");
const storedPath = (req, url) => (str(url).startsWith(origin(req)) ? str(url).slice(origin(req).length) : str(url));
const removeFile = (p) => p && p.startsWith("uploads/") && fs.unlink(path.join(__dirname, "..", p), () => {});
const uploaded = (req, field) => req.files?.[field]?.[0];
const removeUploads = (req) => Object.values(req.files || {}).flat().forEach((f) => fs.unlink(f.path, () => {}));
const withUrls = (req, data) => ({ ...data, image: fullUrl(req, data.image), avatars: (data.avatars || []).map((a) => fullUrl(req, a)) });

const handle = (label, fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    removeUploads(req);
    console.error(`Tech ${label} error:`, error);
    res.status(500).json({ success: false, message: `Failed to ${label}` });
  }
};

// ── Public: GET /api/content/tech/active?lang=en|km — data: null until it's been edited ──
const getActiveTech = handle("load tech section", async (req, res) => {
  const doc = await TechContent.findOne();
  res.json({ success: true, data: doc ? withUrls(req, doc.getLocalizedContent(req.query.lang)) : null });
});

// ── Admin: both languages ──
const getTechAdmin = handle("load tech section", async (req, res) => {
  const doc = await TechContent.findOne().lean();
  res.json({ success: true, data: doc ? withUrls(req, doc) : null });
});

// ── Admin: save — "content" JSON + optional files "image" and avatar0..avatar3 ──
const saveTech = handle("save tech section", async (req, res) => {
  let c;
  try {
    c = JSON.parse(req.body.content || "{}");
  } catch {
    removeUploads(req);
    return res.status(400).json({ success: false, message: "Invalid form data" });
  }

  const doc = (await TechContent.findOne()) || new TechContent();
  const oldImages = [doc.image, ...doc.avatars];

  TechContent.TEXT_FIELDS.forEach((field) => (doc[field] = text(c[field])));
  doc.devices = [...Array(DEVICE_COUNT)].map((_, i) => text(c.devices?.[i]));
  doc.statNumber = str(c.statNumber);
  doc.buttonLink = str(c.buttonLink);

  const person = uploaded(req, "image");
  doc.image = person ? `uploads/${person.filename}` : storedPath(req, c.image);
  doc.avatars = [...Array(AVATAR_COUNT)].map((_, i) => {
    const file = uploaded(req, `avatar${i}`);
    return file ? `uploads/${file.filename}` : storedPath(req, c.avatars?.[i]);
  });
  await doc.save();

  // Delete images that were replaced or reset
  const stillUsed = new Set([doc.image, ...doc.avatars]);
  oldImages.filter((p) => !stillUsed.has(p)).forEach(removeFile);

  res.json({ success: true, message: "Tech section saved" });
});

module.exports = { getActiveTech, getTechAdmin, saveTech, AVATAR_COUNT };