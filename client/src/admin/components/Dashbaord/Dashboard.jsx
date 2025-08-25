import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StatsCard from "./StatsCard";
import VisitorChart from "./VisitorChart";
import ContentEngagement from "./ContentEngagement";
import TopCountries from "./TopCountries";
import { AlertCircle, TrendingUp, Loader2 } from "lucide-react";

// Skeleton Components
const StatsCardSkeleton = ({ darkMode }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse`}>
    <div className="flex items-center justify-between mb-4">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/3"></div>
      <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
    </div>
    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-4"></div>
    <div className="flex items-center">
      <div className="w-4 h-4 bg-gray-300 dark:bg-gray-600 rounded mr-2"></div>
      <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/4"></div>
    </div>
  </div>
);

const ChartSkeleton = ({ darkMode }) => (
  <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse`}>
    <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-6"></div>
    <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
    <div className="flex justify-between">
      {[...Array(7)].map((_, i) => (
        <div key={i} className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/12"></div>
      ))}
    </div>
  </div>
);

const Dashboard = ({ darkMode }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const response = await fetch("/api/analytics/summary");
        if (!response.ok) throw new Error("Failed to fetch analytics");
        const data = await response.json();
        setAnalyticsData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className={`p-5 bg-gray-200 dark:bg-gray-900 min-h-[80vh] rounded-xl ${darkMode ? "dark" : ""}`}>
        <div className="mb-4">
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 animate-pulse"></div>
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {[...Array(3)].map((_, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <StatsCardSkeleton darkMode={darkMode} />
            </motion.div>
          ))}
        </div>

        {/* Charts Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-1">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <ChartSkeleton darkMode={darkMode} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <ChartSkeleton darkMode={darkMode} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.5 }}
          >
            <ChartSkeleton darkMode={darkMode} />
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[90vh] bg-gray-50 dark:bg-gray-900 rounded-xl p-6">
        <div className="flex flex-col items-center space-y-6 max-w-md p-8">
          {/* Error icon with animation */}
          <div className="relative">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-500 dark:text-red-400 animate-pulse"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="absolute -inset-2 border-2 border-red-200 dark:border-red-800 rounded-full animate-ping opacity-75"></div>
          </div>

          {/* Error text */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Something went wrong
            </h2>
            <p className="text-red-500 dark:text-red-400 font-medium">
              {error}
            </p>
            <p className="text-gray-600 dark:text-gray-400">
              We couldn't load your dashboard data.
            </p>
          </div>

          {/* Retry button */}
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-lg dark:bg-red-600 dark:hover:bg-red-700 text-white font-medium rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
          >
            Try Again
          </button>

          {/* Support link */}
          <a
            href="https://t.me/Gin_Satoru"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-500 dark:text-blue-400 hover:underline mt-2"
          >
            Need help? Contact developer on Telegram
          </a>
        </div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center space-y-6 max-w-md p-8">
          {/* Empty state icon with subtle animation */}
          <div className="relative">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-gray-400 dark:text-gray-500 animate-float"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-gray-200 dark:border-gray-700 animate-pulse opacity-75"></div>
          </div>

          {/* Empty state text */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
              No Analytics Data
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              We couldn't find any data to display.
              <br />
              Try adjusting your filters or check back later.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 pt-2">
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
            >
              Refresh Data
            </button>
            <button
              onClick={() => setFiltersOpen(true)}
              className="px-5 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg transition-colors duration-200"
            >
              Adjust Filters
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Prepare stats cards data from analytics
  const stats = [
    {
      title: "Visitors",
      value: analyticsData.totalVisits.toLocaleString(),
      iconType: "users",
      color: {
        from: "from-blue-500",
        to: "to-blue-700",
        bg: "bg-blue-50",
        text: "text-blue-700",
      },
      trend: "up", // You would calculate this from historical data
      change: "+3.2%", // You would calculate this from historical data
    },
    {
      title: "Engagement",
      value: `${Math.round(analyticsData.engagement.avgTimeSpent / 60)}m`,
      iconType: "clock",
      color: {
        from: "from-purple-500",
        to: "to-purple-700",
        bg: "bg-purple-100",
        text: "text-purple-700",
      },
      trend: "up",
      change: "+7.2%",
    },
    {
      title: "World Reach",
      value: `${analyticsData.topCountries.length} Countries`,
      iconType: "world",
      color: {
        from: "from-green-500",
        to: "to-green-700",
        bg: "bg-green-100",
        text: "text-green-700",
      },
      trend: "up",
      change: "+0.5%",
    },
  ];

  // Format visitor trends data for the chart
  const visitorTrends = analyticsData.visitTrends.map((item) => ({
    date: item.date,
    visits: item.count,
  }));

  // Format engagement data
  const engagementData = {
    clicks: Math.round(analyticsData.engagement.avgClicks),
    scrollDepth: Math.round(analyticsData.engagement.avgScrollDepth * 100),
    timeSpent: Math.round(analyticsData.engagement.avgTimeSpent),
  };

  return (
    <div
      className={`p-5 bg-gray-200 dark:bg-gray-900 min-h-[80vh] rounded-xl ${
        darkMode ? "dark" : ""
      }`}
    >
      <div className="mb-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <StatsCard
              title={stat.title}
              value={stat.value}
              iconType={stat.iconType}
              color={stat.color}
              trend={stat.trend}
              change={stat.change}
              darkMode={darkMode}
            />
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-1">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <VisitorChart data={visitorTrends} darkMode={darkMode} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <ContentEngagement data={engagementData} darkMode={darkMode} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <TopCountries data={analyticsData.topCountries} darkMode={darkMode} />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;