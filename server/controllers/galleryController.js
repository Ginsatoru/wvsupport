const fs = require("fs");
const path = require("path");
const GalleryContent = require("../models/GalleryContent");

const MAX_PER_ROW = 12;

// ── Helpers ──
const str = (value) => (typeof value === "string" ? value.trim() : "");
const text = (value) => ({ en: str(value?.en), km: str(value?.km) });
const origin = (req) => `${req.protocol}://${req.get("host")}/`;
const fullUrl = (req, p) => (p && p.startsWith("uploads/") ? origin(req) + p : p || "");
const storedPath = (req, url) => (str(url).startsWith(origin(req)) ? str(url).slice(origin(req).length) : str(url));
const removeFile = (p) => p && p.startsWith("uploads/") && fs.unlink(path.join(__dirname, "..", p), () => {});
const removeUploads = (req) => (req.files || []).forEach((f) => fs.unlink(f.path, () => {}));
const withUrls = (req, data) => ({
  ...data,
  topRow: (data.topRow || []).map((p) => fullUrl(req, p)),
  bottomRow: (data.bottomRow || []).map((p) => fullUrl(req, p)),
});

const handle = (label, fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    removeUploads(req);
    console.error(`Gallery ${label} error:`, error);
    res.status(500).json({ success: false, message: `Failed to ${label}` });
  }
};

// ── Public: GET /api/content/gallery/active?lang=en|km — data: null until it's been edited ──
const getActiveGallery = handle("load gallery", async (req, res) => {
  const doc = await GalleryContent.findOne();
  res.json({ success: true, data: doc ? withUrls(req, doc.getLocalizedContent(req.query.lang)) : null });
});

// ── Admin: both languages ──
const getGalleryAdmin = handle("load gallery", async (req, res) => {
  const doc = await GalleryContent.findOne().lean();
  res.json({ success: true, data: doc ? withUrls(req, doc) : null });
});

// ── Admin: save ──
// "content" JSON: rows are lists of existing photos (URL / "default:<n>") or "new:<i>" = the i-th uploaded file in "photos"
const saveGallery = handle("save gallery", async (req, res) => {
  let c;
  try {
    c = JSON.parse(req.body.content || "{}");
  } catch {
    removeUploads(req);
    return res.status(400).json({ success: false, message: "Invalid form data" });
  }

  const files = req.files || [];
  const toStored = (entry) => {
    const value = str(entry);
    if (value.startsWith("new:")) {
      const file = files[Number(value.slice(4))];
      return file ? `uploads/${file.filename}` : "";
    }
    return storedPath(req, value);
  };
  const row = (list) => (Array.isArray(list) ? list : []).map(toStored).filter(Boolean).slice(0, MAX_PER_ROW);

  const doc = (await GalleryContent.findOne()) || new GalleryContent();
  const oldPhotos = [...doc.topRow, ...doc.bottomRow];

  doc.eyebrow = text(c.eyebrow);
  doc.title = text(c.title);
  doc.topRow = row(c.topRow);
  doc.bottomRow = row(c.bottomRow);
  await doc.save();

  // Delete uploaded photos that were removed (and any uploads that didn't make it into a row)
  const stillUsed = new Set([...doc.topRow, ...doc.bottomRow]);
  oldPhotos.filter((p) => !stillUsed.has(p)).forEach(removeFile);
  files.filter((f) => !stillUsed.has(`uploads/${f.filename}`)).forEach((f) => fs.unlink(f.path, () => {}));

  res.json({ success: true, message: "Gallery saved" });
});

module.exports = { getActiveGallery, getGalleryAdmin, saveGallery, MAX_PER_ROW };