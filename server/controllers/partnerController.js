const fs = require("fs");
const path = require("path");
const Partner = require("../models/Partner");

// ── Helpers ──
const str = (value) => (typeof value === "string" ? value.trim() : "");
const fullUrl = (req, p) => (!p || p.startsWith("http") ? p || "" : `${req.protocol}://${req.get("host")}/${p}`);
const toPublic = (req, partner) => ({ _id: partner._id, name: partner.name, image: fullUrl(req, partner.image), order: partner.order });
const removeFile = (p) => p && !p.startsWith("http") && fs.unlink(path.join(__dirname, "..", p), () => {});
const removeUpload = (req) => req.file && fs.unlink(req.file.path, () => {});

const handle = (label, fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    removeUpload(req);
    console.error(`Partner ${label} error:`, error);
    res.status(500).json({ success: false, message: `Failed to ${label}` });
  }
};

const notFound = (req, res) => {
  removeUpload(req);
  res.status(404).json({ success: false, message: "Logo not found" });
};

// First use: copy in the logos the site shipped with
const ensureSeeded = async () => {
  if ((await Partner.estimatedDocumentCount()) === 0) {
    await Partner.insertMany(Partner.DEFAULTS.map((p, order) => ({ ...p, order })));
  }
};

// ── Public + admin: all logos in display order — GET /api/content/partners ──
exports.list = handle("fetch logos", async (req, res) => {
  await ensureSeeded();
  const partners = await Partner.find().sort({ order: 1, createdAt: 1 }).lean();
  res.json({ success: true, data: partners.map((p) => toPublic(req, p)) });
});

// ── Admin: add a logo (name + image) ──
exports.create = handle("add logo", async (req, res) => {
  const name = str(req.body.name);
  if (!name || !req.file) {
    removeUpload(req);
    return res.status(400).json({ success: false, message: "Name and logo image are required" });
  }
  const last = await Partner.findOne().sort({ order: -1 }).lean();
  const partner = await Partner.create({ name, image: `uploads/${req.file.filename}`, order: (last?.order ?? -1) + 1 });
  res.status(201).json({ success: true, message: "Logo added", data: toPublic(req, partner) });
});

// ── Admin: rename and/or replace the image ──
exports.update = handle("update logo", async (req, res) => {
  const partner = await Partner.findById(req.params.id);
  if (!partner) return notFound(req, res);

  const name = str(req.body.name);
  if (name) partner.name = name;
  if (req.file) {
    removeFile(partner.image);
    partner.image = `uploads/${req.file.filename}`;
  }
  await partner.save();
  res.json({ success: true, message: "Logo updated", data: toPublic(req, partner) });
});

// ── Admin: delete (and its uploaded file) ──
exports.remove = handle("delete logo", async (req, res) => {
  const partner = await Partner.findByIdAndDelete(req.params.id);
  if (!partner) return notFound(req, res);
  removeFile(partner.image);
  res.json({ success: true, message: "Logo deleted" });
});

// ── Admin: save a new order — body { ids: [...] } in display order ──
exports.reorder = handle("reorder logos", async (req, res) => {
  const ids = Array.isArray(req.body.ids) ? req.body.ids : [];
  await Partner.bulkWrite(ids.map((id, order) => ({ updateOne: { filter: { _id: id }, update: { order } } })));
  res.json({ success: true, message: "Order saved" });
});