const fs = require("fs");
const path = require("path");
const WorkContent = require("../models/WorkContent");

const TOOL_COUNT = 4;
const CARD_COUNT = 4;

// ── Helpers ──
const str = (value) => (typeof value === "string" ? value.trim() : "");
const text = (value) => ({ en: str(value?.en), km: str(value?.km) });
const origin = (req) => `${req.protocol}://${req.get("host")}/`;
const fullUrl = (req, p) => (p && p.startsWith("uploads/") ? origin(req) + p : p || "");
const storedPath = (req, url) => (str(url).startsWith(origin(req)) ? str(url).slice(origin(req).length) : str(url));
const removeFile = (p) => p && p.startsWith("uploads/") && fs.unlink(path.join(__dirname, "..", p), () => {});
const uploaded = (req, field) => req.files?.[field]?.[0];
const removeUploads = (req) => Object.values(req.files || {}).flat().forEach((f) => fs.unlink(f.path, () => {}));
const withUrls = (req, data) => ({
  ...data,
  image: fullUrl(req, data.image),
  tools: (data.tools || []).map((t) => ({ ...t, logo: fullUrl(req, t.logo) })),
});

const handle = (label, fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    removeUploads(req);
    console.error(`Work ${label} error:`, error);
    res.status(500).json({ success: false, message: `Failed to ${label}` });
  }
};

// ── Public: GET /api/content/work/active?lang=en|km — data: null until it's been edited ──
const getActiveWork = handle("load work section", async (req, res) => {
  const doc = await WorkContent.findOne();
  res.json({ success: true, data: doc ? withUrls(req, doc.getLocalizedContent(req.query.lang)) : null });
});

// ── Admin: both languages ──
const getWorkAdmin = handle("load work section", async (req, res) => {
  const doc = await WorkContent.findOne().lean();
  res.json({ success: true, data: doc ? withUrls(req, doc) : null });
});

// ── Admin: save — "content" JSON + optional files "image" and tool0..tool3 (logos) ──
const saveWork = handle("save work section", async (req, res) => {
  let c;
  try {
    c = JSON.parse(req.body.content || "{}");
  } catch {
    removeUploads(req);
    return res.status(400).json({ success: false, message: "Invalid form data" });
  }

  const doc = (await WorkContent.findOne()) || new WorkContent();
  const oldImages = [doc.image, ...doc.tools.map((t) => t.logo)];

  WorkContent.TEXT_FIELDS.forEach((field) => (doc[field] = text(c[field])));
  doc.buttonLink = str(c.buttonLink);
  doc.cards = [...Array(CARD_COUNT)].map((_, i) => ({
    title: text(c.cards?.[i]?.title),
    description: text(c.cards?.[i]?.description),
  }));
  doc.tools = [...Array(TOOL_COUNT)].map((_, i) => {
    const file = uploaded(req, `tool${i}`);
    return {
      name: str(c.tools?.[i]?.name),
      logo: file ? `uploads/${file.filename}` : storedPath(req, c.tools?.[i]?.logo),
    };
  });
  const person = uploaded(req, "image");
  doc.image = person ? `uploads/${person.filename}` : storedPath(req, c.image);
  await doc.save();

  // Delete images that were replaced or reset
  const stillUsed = new Set([doc.image, ...doc.tools.map((t) => t.logo)]);
  oldImages.filter((p) => !stillUsed.has(p)).forEach(removeFile);

  res.json({ success: true, message: "Work section saved" });
});

module.exports = { getActiveWork, getWorkAdmin, saveWork, TOOL_COUNT };