// controllers/analyticsController.js
const Visit = require("../models/Visit");
const { parseUserAgent } = require("../utils/userAgentParser");
const { getCountryFromIP } = require("../utils/geoIP");

// Get today's stats
exports.getTodayStats = async (req, res) => {
  try {
    // Get start of today and now
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // MongoDB aggregation to get today's stats
    const stats = await Visit.aggregate([
      {
        $match: {
          timestamp: { $gte: startOfToday, $lte: endOfToday }
        }
      },
      {
        $group: {
          _id: null,
          totalViews: { $sum: 1 },
          uniqueVisitors: { $addToSet: "$visitorId" }
        }
      },
      {
        $project: {
          _id: 0,
          totalViews: 1,
          uniqueVisitors: { $size: "$uniqueVisitors" }
        }
      }
    ]);

    // If no data found today, return zeros
    const result = stats[0] || { totalViews: 0, uniqueVisitors: 0 };

    // Cache control - 5 minutes
    res.set('Cache-Control', 'public, max-age=300');
    res.json(result);
  } catch (error) {
    console.error('Error fetching today stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Track a new visit
exports.trackVisit = async (req, res) => {
  try {
    // Validate request body
    if (!req.body || typeof req.body !== "object") {
      return res.status(400).json({
        success: false,
        error: "Invalid request body",
      });
    }

    const { path, sessionId, engagement = {} } = req.body;

    // Validate required fields
    if (!path || !sessionId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: path and sessionId are required",
      });
    }

    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

    // Parse user agent
    const userAgent = req.headers["user-agent"] || "";
    const {
      browser = "unknown",
      deviceType = "unknown",
      os = "unknown",
    } = parseUserAgent(userAgent);

    // Get country from IP
    const country = await getCountryFromIP(ip);

    const visit = new Visit({
      path,
      ip,
      country,
      browser,
      deviceType,
      os,
      sessionId,
      engagement: {
        clicks: engagement.clicks || 0,
        scrollDepth: engagement.scrollDepth || 0,
        timeSpent: engagement.timeSpent || 0,
      },
    });

    await visit.save();
    res.status(201).json({ success: true });
  } catch (error) {
    console.error("Error tracking visit:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
      message: error.message,
    });
  }
};

// Get analytics summary for dashboard
exports.getAnalyticsSummary = async (req, res) => {
  try {
    // Time frame (default: last 30 days)
    const days = parseInt(req.query.days) || 30;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Total visits and unique visitors
    const totalVisits = await Visit.countDocuments({
      createdAt: { $gte: startDate },
    });
    const uniqueVisitors = await Visit.distinct("ip", {
      createdAt: { $gte: startDate },
    }).then((ips) => ips.length);

    // Top countries
    const topCountries = await Visit.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $group: { _id: "$country", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

    // Engagement metrics (averages)
    const engagement = await Visit.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      {
        $group: {
          _id: null,
          avgClicks: { $avg: "$engagement.clicks" },
          avgScrollDepth: { $avg: "$engagement.scrollDepth" },
          avgTimeSpent: { $avg: "$engagement.timeSpent" },
        },
      },
    ]);

    // Visit trends (last 7 days by default)
    const trendDays = parseInt(req.query.trendDays) || 7;
    const trendStartDate = new Date();
    trendStartDate.setDate(trendStartDate.getDate() - trendDays);

    const visitTrends = await Visit.aggregate([
      { $match: { createdAt: { $gte: trendStartDate } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalVisits,
      uniqueVisitors,
      topCountries: topCountries.map((c) => ({
        country: c._id,
        count: c.count,
      })),
      engagement: engagement[0] || {
        avgClicks: 0,
        avgScrollDepth: 0,
        avgTimeSpent: 0,
      },
      visitTrends: visitTrends.map((t) => ({ date: t._id, count: t.count })),
    });
  } catch (error) {
    console.error("Error getting analytics summary:", error);
    res.status(500).json({ success: false, error: "Server error" });
  }
};
