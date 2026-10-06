const express = require("express");
const multer = require("multer");
const { setupImageUpload } = require("../config/multer");
const optimizeImages = require("../middleware/optimizeImages");
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
} = require("../controllers/newslettercontentController");
const { getActiveFooter, getFooterAdmin, saveFooter } = require("../controllers/footerController");
const { getActiveNav, getNavAdmin, saveNav, flagFields } = require("../controllers/navController");
const { getActiveAboutPage, getAboutPageAdmin, saveAboutPage } = require("../controllers/aboutPageController");
const {
  getActiveServicesPage,
  getServicesPageAdmin,
  saveServicesPage,
  MAX_SERVICES: MAX_PAGE_SERVICES,
} = require("../controllers/servicesPageController");
const { getActiveFaq, getFaqAdmin, saveFaq } = require("../controllers/faqController");
const { getActiveLegal, getLegalAdmin, saveLegal } = require("../controllers/legalController");
const { getActiveCareers, getCareersAdmin, saveCareers } = require("../controllers/careersController");

const router = express.Router();

// ── Image uploads (all CMS sections): JPG / PNG / GIF / WebP only, 10MB each ──
// Every upload is then resized and saved as WebP (see middleware/optimizeImages)
const imageUpload = setupImageUpload();
const upload = {
  single: (name) => [imageUpload.single(name), optimizeImages],
  fields: (list) => [imageUpload.fields(list), optimizeImages],
  array: (name, max) => [imageUpload.array(name, max), optimizeImages],
  logo: (name) => [imageUpload.single(name), optimizeImages.forLogos], // small (partner logos)
};

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
router.post("/partners/admin", verifyAdmin, upload.logo("image"), partnerController.create);
router.patch("/partners/admin/reorder", verifyAdmin, partnerController.reorder);
router.put("/partners/admin/:id", verifyAdmin, upload.logo("image"), partnerController.update);
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

// ── About Us page ──
router.get("/about-page/active", getActiveAboutPage);
router.get("/about-page/admin", verifyAdmin, getAboutPageAdmin);
router.put("/about-page/admin", verifyAdmin, upload.single("image"), saveAboutPage);

// ── Services page ──
const servicesPageImages = upload.fields([
  { name: "image", maxCount: 1 },
  ...[...Array(MAX_PAGE_SERVICES)].map((_, i) => ({ name: `service${i}`, maxCount: 1 })),
]);
router.get("/services-page/active", getActiveServicesPage);
router.get("/services-page/admin", verifyAdmin, getServicesPageAdmin);
router.put("/services-page/admin", verifyAdmin, servicesPageImages, saveServicesPage);

// ── FAQ page (JSON, no images) ──
router.get("/faq/active", getActiveFaq);
router.get("/faq/admin", verifyAdmin, getFaqAdmin);
router.put("/faq/admin", verifyAdmin, saveFaq);

// ── Legal page (JSON, no images) ──
router.get("/legal/active", getActiveLegal);
router.get("/legal/admin", verifyAdmin, getLegalAdmin);
router.put("/legal/admin", verifyAdmin, saveLegal);

// ── Careers page ──
router.get("/careers/active", getActiveCareers);
router.get("/careers/admin", verifyAdmin, getCareersAdmin);
router.put("/careers/admin", verifyAdmin, upload.single("image"), saveCareers);

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