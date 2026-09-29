const fs = require("fs");
const path = require("path");
const HeroContent = require("../models/FrontendContent");

// ── Helpers ──
const str = (value) => (typeof value === "string" ? value.trim() : "");
const text = (value, fallback = "") => ({ en: str(value?.en) || fallback, km: str(value?.km) });

const uploadedPath = (file) => (file ? `uploads/${file.filename}` : null);
const removeFile = (relativePath) => {
  if (!relativePath || relativePath.startsWith("http")) return;
  fs.unlink(path.join(__dirname, "..", relativePath), () => {});
};
const uploadedFiles = (req) => ({
  background: req.files?.backgroundImage?.[0],
  person: req.files?.personImage?.[0],
});
const removeUploads = (req) => Object.values(uploadedFiles(req)).forEach((f) => f && fs.unlink(f.path, () => {}));

// Stored "uploads/x" → full URL for the browser
const fullUrl = (req, p) => (!p || p.startsWith("http") ? p || "" : `${req.protocol}://${req.get("host")}/${p}`);
const withUrls = (req, hero) => ({
  ...hero,
  backgroundImage: fullUrl(req, hero.backgroundImage),
  personImage: fullUrl(req, hero.personImage),
});

const handle = (label, fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    removeUploads(req);
    console.error(`Hero ${label} error:`, error);
    res.status(500).json({ success: false, message: `Failed to ${label}` });
  }
};

const notFound = (req, res) => {
  removeUploads(req);
  res.status(404).json({ success: false, message: "Hero content not found" });
};

// Form sends all text/links/flags as one JSON string in "content"
const readContent = (req) => {
  try {
    const c = JSON.parse(req.body.content || "{}");
    return {
      data: {
        title: text(c.title),
        subtitle: text(c.subtitle),
        primaryCtaText: text(c.primaryCtaText, "Learn More"),
        secondaryCtaText: text(c.secondaryCtaText, "Get Started"),
        primaryCtaLink: str(c.primaryCtaLink) || "/services",
        secondaryCtaLink: str(c.secondaryCtaLink) || "/contact",
        features: (Array.isArray(c.features) ? c.features : []).slice(0, 3).map((f) => text(f)),
        testimonial: text(c.testimonial),
        isActive: !!c.isActive,
      },
      removePersonImage: !!c.removePersonImage,
    };
  } catch {
    return null;
  }
};

const invalid = (req, res, message) => {
  removeUploads(req);
  res.status(400).json({ success: false, message });
};

// Only one hero can be active
const deactivateOthers = (id) => HeroContent.updateMany(id ? { _id: { $ne: id } } : {}, { isActive: false });

// ── Public: active hero in one language — GET /api/content/hero/active?lang=en|km ──
const getActiveHeroContent = handle("fetch hero content", async (req, res) => {
  const hero = await HeroContent.findActiveWithLang(req.query.lang);
  if (!hero) return res.status(404).json({ success: false, message: "No active hero content found" });
  res.json({ success: true, data: withUrls(req, hero) });
});

// ── Admin: all heroes, both languages ──
const getAllHeroContent = handle("fetch hero content", async (req, res) => {
  const heroes = await HeroContent.find().sort({ updatedAt: -1 }).lean();
  res.json({ success: true, data: heroes.map((h) => withUrls(req, h)), count: heroes.length });
});

// ── Admin: create ──
const createHeroContent = handle("create hero content", async (req, res) => {
  const content = readContent(req);
  const { background, person } = uploadedFiles(req);
  if (!content) return invalid(req, res, "Invalid form data");
  if (!content.data.title.en || !content.data.subtitle.en) return invalid(req, res, "English title and subtitle are required");
  if (!background) return invalid(req, res, "Background image is required");

  if (content.data.isActive) await deactivateOthers();
  const hero = await HeroContent.create({
    ...content.data,
    backgroundImage: uploadedPath(background),
    personImage: uploadedPath(person) || "",
  });

  res.status(201).json({ success: true, message: "Hero section created", data: withUrls(req, hero.toObject()) });
});

// ── Admin: update (images optional; old files are removed when replaced) ──
const updateHeroContent = handle("update hero content", async (req, res) => {
  const hero = await HeroContent.findById(req.params.id);
  if (!hero) return notFound(req, res);

  const content = readContent(req);
  const { background, person } = uploadedFiles(req);
  if (!content) return invalid(req, res, "Invalid form data");
  if (!content.data.title.en || !content.data.subtitle.en) return invalid(req, res, "English title and subtitle are required");

  if (content.data.isActive) await deactivateOthers(hero._id);

  if (background) {
    removeFile(hero.backgroundImage);
    hero.backgroundImage = uploadedPath(background);
  }
  if (person || content.removePersonImage) {
    removeFile(hero.personImage);
    hero.personImage = uploadedPath(person) || "";
  }
  hero.set(content.data);
  await hero.save();

  res.json({ success: true, message: "Hero section updated", data: withUrls(req, hero.toObject()) });
});

// ── Admin: delete (and its images) ──
const deleteHeroContent = handle("delete hero content", async (req, res) => {
  const hero = await HeroContent.findByIdAndDelete(req.params.id);
  if (!hero) return notFound(req, res);
  removeFile(hero.backgroundImage);
  removeFile(hero.personImage);
  res.json({ success: true, message: "Hero section deleted" });
});

// ── Admin: show / hide on the site ──
const toggleHeroActive = handle("update hero status", async (req, res) => {
  const hero = await HeroContent.findById(req.params.id);
  if (!hero) return notFound(req, res);
  if (!hero.isActive) await deactivateOthers(hero._id);
  hero.isActive = !hero.isActive;
  await hero.save();
  res.json({
    success: true,
    message: `Hero section ${hero.isActive ? "activated" : "deactivated"}`,
    data: withUrls(req, hero.toObject()),
  });
});

module.exports = {
  getActiveHeroContent,
  getAllHeroContent,
  createHeroContent,
  updateHeroContent,
  deleteHeroContent,
  toggleHeroActive,
};