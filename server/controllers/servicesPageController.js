const fs = require("fs");
const path = require("path");
const ServicesPageContent = require("../models/ServicesPageContent");

const MAX_SERVICES = 12;
const MAX_PRODUCTS = 6;

// ── Helpers ──
const str = (value) => (typeof value === "string" ? value.trim() : "");
const text = (value) => ({ en: str(value?.en), km: str(value?.km) });
const list = (value, max) => (Array.isArray(value) ? value : []).slice(0, max);
const origin = (req) => `${req.protocol}://${req.get("host")}/`;
const fullUrl = (req, p) => (p && p.startsWith("uploads/") ? origin(req) + p : p || "");
const storedPath = (req, url) => (str(url).startsWith(origin(req)) ? str(url).slice(origin(req).length) : str(url));
const removeFile = (p) => p && p.startsWith("uploads/") && fs.unlink(path.join(__dirname, "..", p), () => {});
const uploaded = (req, field) => req.files?.[field]?.[0];
const removeUploads = (req) => Object.values(req.files || {}).flat().forEach((f) => fs.unlink(f.path, () => {}));
const withUrls = (req, data) => ({
  ...data,
  image: fullUrl(req, data.image),
  services: (data.services || []).map((s) => ({ ...s, image: fullUrl(req, s.image) })),
});

const handle = (label, fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    removeUploads(req);
    console.error(`Services page ${label} error:`, error);
    res.status(500).json({ success: false, message: `Failed to ${label}` });
  }
};

// ── Public: GET /api/content/services-page/active?lang=en|km — data: null until it's been edited ──
const getActiveServicesPage = handle("load services page", async (req, res) => {
  const doc = await ServicesPageContent.findOne();
  res.json({ success: true, data: doc ? withUrls(req, doc.getLocalizedContent(req.query.lang)) : null });
});

// ── Admin: both languages ──
const getServicesPageAdmin = handle("load services page", async (req, res) => {
  const doc = await ServicesPageContent.findOne().lean();
  res.json({ success: true, data: doc ? withUrls(req, doc) : null });
});

// ── Admin: save — "content" JSON + optional files "image" (intro) and service0..service11 ──
const saveServicesPage = handle("save services page", async (req, res) => {
  let c;
  try {
    c = JSON.parse(req.body.content || "{}");
  } catch {
    removeUploads(req);
    return res.status(400).json({ success: false, message: "Invalid form data" });
  }

  const doc = (await ServicesPageContent.findOne()) || new ServicesPageContent();
  const oldImages = [doc.image, ...doc.services.map((s) => s.image)];

  ServicesPageContent.TEXT_FIELDS.forEach((field) => (doc[field] = text(c[field])));

  const intro = uploaded(req, "image");
  doc.image = intro ? `uploads/${intro.filename}` : storedPath(req, c.image);

  // Panels in the order sent (added / removed / edited); file service<i> belongs to panel i
  doc.services = list(c.services, MAX_SERVICES).map((s, i) => {
    const file = uploaded(req, `service${i}`);
    return {
      key: str(s?.key),
      title: text(s?.title),
      description: text(s?.description),
      image: file ? `uploads/${file.filename}` : storedPath(req, s?.image),
    };
  });

  doc.products = list(c.products, MAX_PRODUCTS)
    .map((p) => ({ title: text(p?.title), description: text(p?.description), href: str(p?.href) }))
    .filter((p) => p.title.en && p.href);
  await doc.save();

  // Delete images that were replaced, reset or removed
  const stillUsed = new Set([doc.image, ...doc.services.map((s) => s.image)]);
  oldImages.filter((p) => !stillUsed.has(p)).forEach(removeFile);

  res.json({ success: true, message: "Services page saved" });
});

module.exports = { getActiveServicesPage, getServicesPageAdmin, saveServicesPage, MAX_SERVICES };