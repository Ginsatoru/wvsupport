// routes/analytics.js
const express = require("express");
const verifyAdmin = require("../middleware/verifyAdmin");
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
router.post("/track", trackVisit);
router.post("/engagement", trackEngagement);

// Admin only
router.get("/overview", verifyAdmin, getOverviewStats);
router.get("/summary", verifyAdmin, getAnalyticsSummary);
router.get("/trends", verifyAdmin, getViewTrends);
router.get("/dashboard", verifyAdmin, getDashboard);

module.exports = router;