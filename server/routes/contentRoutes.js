const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const verifyAdmin = require("../middleware/verifyAdmin");
const {
  getActiveHeroContent,
  getAllHeroContent,
  createHeroContent,
  updateHeroContent,
  deleteHeroContent,
  toggleHeroActive,
} = require("../controllers/contentController");
const newsPopupController = require("../controllers/newsPopupController");
const partnerController = require("../controllers/partnerController");
const {
  getActiveServices,
  getServicesAdmin,
  saveServices,
  MAX_SERVICES,
} = require("../controllers/servicesController");
const { getActiveAbout, getAboutAdmin, saveAbout, CARD_COUNT } = require("../controllers/aboutController");
const { getActiveTech, getTechAdmin, saveTech, AVATAR_COUNT } = require("../controllers/techController");
const { getActiveWork, getWorkAdmin, saveWork, TOOL_COUNT } = require("../controllers/workController");
const { getActiveGallery, getGalleryAdmin, saveGallery, MAX_PER_ROW } = require("../controllers/galleryController");
const {
  getActiveNewsletterContent,
  getNewsletterContentAdmin,
  saveNewsletterContent,
} = require("../controllers/newsletterContentController");
const { getActiveFooter, getFooterAdmin, saveFooter } = require("../controllers/footerController");
const { getActiveNav, getNavAdmin, saveNav, flagFields } = require("../controllers/navController");

const router = express.Router();

// ── Image uploads (hero + news popup), 10MB each ──
const uploadsDir = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) =>
      cb(null, `upload-${Date.now()}-${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`),
  }),
  fileFilter: (req, file, cb) =>
    file.mimetype.startsWith("image/") ? cb(null, true) : cb(new Error("Only image files are allowed!"), false),
  limits: { fileSize: 10 * 1024 * 1024 },
});

const heroImages = upload.fields([
  { name: "backgroundImage", maxCount: 1 },
  { name: "personImage", maxCount: 1 },
]);

router.get("/test", (req, res) => res.json({ success: true, message: "Content routes working!" }));

// ── Hero ──
router.get("/hero/active", getActiveHeroContent);
router.get("/hero/admin/all", verifyAdmin, getAllHeroContent);
router.post("/hero/admin", verifyAdmin, heroImages, createHeroContent);
router.put("/hero/admin/:id", verifyAdmin, heroImages, updateHeroContent);
router.delete("/hero/admin/:id", verifyAdmin, deleteHeroContent);
router.patch("/hero/admin/:id/toggle-active", verifyAdmin, toggleHeroActive);

// ── Partner logos ──
router.get("/partners", partnerController.list);
router.post("/partners/admin", verifyAdmin, upload.single("image"), partnerController.create);
router.patch("/partners/admin/reorder", verifyAdmin, partnerController.reorder);
router.put("/partners/admin/:id", verifyAdmin, upload.single("image"), partnerController.update);
router.delete("/partners/admin/:id", verifyAdmin, partnerController.remove);

// ── Home services ──
const serviceImages = upload.fields([...Array(MAX_SERVICES)].map((_, i) => ({ name: `image${i}`, maxCount: 1 })));
router.get("/services/active", getActiveServices);
router.get("/services/admin", verifyAdmin, getServicesAdmin);
router.put("/services/admin", verifyAdmin, serviceImages, saveServices);

// ── Home about ──
const aboutImages = upload.fields([...Array(CARD_COUNT)].map((_, i) => ({ name: `image${i}`, maxCount: 1 })));
router.get("/about/active", getActiveAbout);
router.get("/about/admin", verifyAdmin, getAboutAdmin);
router.put("/about/admin", verifyAdmin, aboutImages, saveAbout);

// ── Home tech ──
const techImages = upload.fields([
  { name: "image", maxCount: 1 },
  ...[...Array(AVATAR_COUNT)].map((_, i) => ({ name: `avatar${i}`, maxCount: 1 })),
]);
router.get("/tech/active", getActiveTech);
router.get("/tech/admin", verifyAdmin, getTechAdmin);
router.put("/tech/admin", verifyAdmin, techImages, saveTech);

// ── Home work ──
const workImages = upload.fields([
  { name: "image", maxCount: 1 },
  ...[...Array(TOOL_COUNT)].map((_, i) => ({ name: `tool${i}`, maxCount: 1 })),
]);
router.get("/work/active", getActiveWork);
router.get("/work/admin", verifyAdmin, getWorkAdmin);
router.put("/work/admin", verifyAdmin, workImages, saveWork);

// ── Home gallery ──
router.get("/gallery/active", getActiveGallery);
router.get("/gallery/admin", verifyAdmin, getGalleryAdmin);
router.put("/gallery/admin", verifyAdmin, upload.array("photos", MAX_PER_ROW * 2), saveGallery);

// ── Home newsletter block (subscribers themselves live under /api/newsletter) ──
router.get("/newsletter-section/active", getActiveNewsletterContent);
router.get("/newsletter-section/admin", verifyAdmin, getNewsletterContentAdmin);
router.put("/newsletter-section/admin", verifyAdmin, upload.single("image"), saveNewsletterContent);

// ── Site footer (JSON, no images) ──
router.get("/footer/active", getActiveFooter);
router.get("/footer/admin", verifyAdmin, getFooterAdmin);
router.put("/footer/admin", verifyAdmin, saveFooter);

// ── Site navbar (menu, buttons, language flags) ──
const navImages = upload.fields(flagFields.map((name) => ({ name, maxCount: 1 })));
router.get("/nav/active", getActiveNav);
router.get("/nav/admin", verifyAdmin, getNavAdmin);
router.put("/nav/admin", verifyAdmin, navImages, saveNav);

// ── News popup ──
router.get("/news-popup/active", newsPopupController.getActive);
router.get("/news-popup/admin/all", verifyAdmin, newsPopupController.getAll);
router.post("/news-popup/admin", verifyAdmin, upload.single("image"), newsPopupController.create);
router.put("/news-popup/admin/:id", verifyAdmin, upload.single("image"), newsPopupController.update);
router.delete("/news-popup/admin/:id", verifyAdmin, newsPopupController.remove);
router.patch("/news-popup/admin/:id/toggle", verifyAdmin, newsPopupController.toggle);

// ── Upload errors ──
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({ success: false, message: "File too large. Maximum size is 10MB." });
  }
  res.status(400).json({ success: false, message: error.message || "Upload error" });
});

module.exports = router;