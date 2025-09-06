// routes/analytics.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

// Track a visit - POST /api/analytics/track
router.post('/track', analyticsController.trackVisit);

// Get overview stats for dashboard - GET /api/analytics/overview  
router.get('/overview', analyticsController.getOverviewStats);

// Get today's stats only - GET /api/analytics/today
router.get('/today', analyticsController.getTodayStats);

// Get analytics summary (for detailed dashboard) - GET /api/analytics/summary
router.get('/summary', analyticsController.getAnalyticsSummary);

module.exports = router;