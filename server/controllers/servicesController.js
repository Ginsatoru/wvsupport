const fs = require("fs");
const path = require("path");
const ServicesContent = require("../models/ServicesContent");

const MAX_SERVICES = 12;

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
    console.error(`Services ${label} error:`, error);
    res.status(500).json({ success: false, message: `Failed to ${label}` });
  }
};

// ── Public: GET /api/content/services/active?lang=en|km — data: null until it's been edited ──
const getActiveServices = handle("load services", async (req, res) => {
  const doc = await ServicesContent.findOne();
  if (!doc) return res.json({ success: true, data: null });
  const data = doc.getLocalizedContent(req.query.lang);
  data.items = data.items.map((item) => ({ ...item, image: fullUrl(req, item.image) }));
  res.json({ success: true, data });
});

// ── Admin: both languages ──
const getServicesAdmin = handle("load services", async (req, res) => {
  const doc = await ServicesContent.findOne().lean();
  if (!doc) return res.json({ success: true, data: null });
  res.json({
    success: true,
    data: { ...doc, items: doc.items.map((item) => ({ ...item, image: fullUrl(req, item.image) })) },
  });
});

// ── Admin: save — "content" JSON + optional files image0..image4 ──
const saveServices = handle("save services", async (req, res) => {
  let c;
  try {
    c = JSON.parse(req.body.content || "{}");
  } catch {
    removeUploads(req);
    return res.status(400).json({ success: false, message: "Invalid form data" });
  }

  const doc = (await ServicesContent.findOne()) || new ServicesContent();
  const oldImages = doc.items.map((item) => item.image);

  doc.title = text(c.title);
  doc.subtitle = text(c.subtitle);
  doc.stats = [0, 1, 2].map((i) => text(c.stats?.[i]));
  // Cards in the order sent (added / removed / edited); image file i belongs to card i
  doc.items = (Array.isArray(c.items) ? c.items : []).slice(0, MAX_SERVICES).map((item, i) => {
    const file = uploadedImage(req, i);
    return {
      key: str(item?.key),
      title: text(item?.title),
      description: text(item?.description),
      image: file ? `uploads/${file.filename}` : storedPath(req, item?.image),
    };
  });
  await doc.save();

  // Delete images that were replaced or reset
  const stillUsed = new Set(doc.items.map((item) => item.image));
  oldImages.filter((p) => !stillUsed.has(p)).forEach(removeFile);

  res.json({ success: true, message: "Services saved" });
});

module.exports = { getActiveServices, getServicesAdmin, saveServices, MAX_SERVICES };