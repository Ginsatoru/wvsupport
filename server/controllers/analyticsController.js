// controllers/analyticsController.js
const Visit = require("../models/Visit");
const { parseUserAgent } = require("../utils/userAgentParser");
const { getCountryFromIP } = require("../utils/geoIP");

// Track a new visit - POST /api/analytics/track
exports.trackVisit = async (req, res) => {
  try {
    const { path, visitorId } = req.body;

    // Validate required fields
    if (!path || !visitorId) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: path and visitorId are required",
      });
    }

    // Get IP address
    const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || 
              req.connection.remoteAddress || 
              req.socket.remoteAddress || 
              "unknown";

    // Get user agent
    const userAgent = req.headers["user-agent"] || "";

    // Parse user agent for browser, OS, device info
    let browser = "unknown", deviceType = "unknown", os = "unknown";
    try {
      const parsed = parseUserAgent(userAgent);
      browser = parsed.browser || "unknown";
      deviceType = parsed.deviceType || "unknown";
      os = parsed.os || "unknown";
    } catch (error) {
      console.warn("Error parsing user agent:", error);
    }

    // Get country from IP
    let country = "Unknown";
    try {
      country = await getCountryFromIP(ip) || "Unknown";
    } catch (error) {
      console.warn("Error getting country from IP:", error);
    }

    // Create visit record
    const visit = new Visit({
      path,
      ip,
      visitorId,
      userAgent,
      country,
      browser,
      deviceType,
      os,
      engagement: {
        clicks: 0,
        scrollDepth: 0,
        timeSpent: 0,
      },
    });

    await visit.save();
    
    res.status(201).json({ 
      success: true,
      message: "Visit tracked successfully"
    });
  } catch (error) {
    console.error("Error tracking visit:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
      message: error.message,
    });
  }
};

// Get overview stats - GET /api/analytics/overview
exports.getOverviewStats = async (req, res) => {
  try {
    // Get today's date range
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // Get today's stats
    const todayStats = await Visit.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfToday, $lte: endOfToday }
        }
      },
      {
        $group: {
          _id: null,
          todayViews: { $sum: 1 },
          todayVisitors: { $addToSet: "$visitorId" }
        }
      },
      {
        $project: {
          _id: 0,
          todayViews: 1,
          todayVisitors: { $size: "$todayVisitors" }
        }
      }
    ]);

    // Get total views (all time)
    const totalViews = await Visit.countDocuments();

    // Prepare response
    const result = {
      todayViews: todayStats[0]?.todayViews || 0,
      todayVisitors: todayStats[0]?.todayVisitors || 0,
      totalViews: totalViews
    };

    // Cache control - 5 minutes for dashboard
    res.set('Cache-Control', 'public, max-age=300');
    res.json(result);
  } catch (error) {
    console.error('Error fetching overview stats:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
};

// Get today's stats only - GET /api/analytics/today
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
          createdAt: { $gte: startOfToday, $lte: endOfToday }
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

// Get analytics summary for dashboard - GET /api/analytics/summary
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
    
    const uniqueVisitors = await Visit.distinct("visitorId", {
      createdAt: { $gte: startDate },
    }).then((ids) => ids.length);

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