// routes/analytics.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
router.get('/today', analyticsController.getTodayStats);

// Track a visit
router.post('/track', analyticsController.trackVisit);

// Get analytics summary
router.get('/summary', analyticsController.getAnalyticsSummary);

module.exports = router;