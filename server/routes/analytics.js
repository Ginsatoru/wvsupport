// routes/analytics.js
const express = require("express");
const verifyAdmin = require("../middleware/verifyAdmin");
const rateLimit = require("../middleware/rateLimit");
const {
  trackVisit,
  trackEngagement,
  getOverviewStats,
  getAnalyticsSummary,
  getViewTrends,
  getDashboard,
} = require("../controllers/analyticsController");

const router = express.Router();

// Public: called by the site's tracker
// Public: called by the site's tracker (generous limits; real visitors never reach them)
const trackLimit = rateLimit({ windowMs: 60 * 1000, max: 60 });
router.post("/track", trackLimit, trackVisit);
router.post("/engagement", trackLimit, trackEngagement);

// Admin only
router.get("/overview", verifyAdmin, getOverviewStats);
router.get("/summary", verifyAdmin, getAnalyticsSummary);
router.get("/trends", verifyAdmin, getViewTrends);
router.get("/dashboard", verifyAdmin, getDashboard);

module.exports = router;