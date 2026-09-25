import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import StatsCard from "./StatsCard";
import TotalViewsChart from "./TotalViewsChart";
import { RefreshCw } from "lucide-react";

// Skeleton Components
const StatsCardSkeleton = ({ darkMode }) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse`}
  >
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

const Dashboard = ({ darkMode }) => {
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAllData = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const overviewResponse = await fetch("/api/analytics/overview", {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      if (!overviewResponse.ok) {
        throw new Error(`Failed to fetch overview data (${overviewResponse.status})`);
      }

      const overviewResult = await overviewResponse.json();

      setOverviewData(overviewResult);
      setLastUpdated(new Date());
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    // Fetch data immediately on component mount
    fetchAllData();

    // Set up auto-refresh every 5 minutes (300000 ms)
    const refreshInterval = setInterval(() => fetchAllData(true), 300000);

    // Cleanup interval on component unmount
    return () => clearInterval(refreshInterval);
  }, []); // Empty dependency array ensures this runs on every component mount

  const handleManualRefresh = () => {
    fetchAllData(true);
  };

  if (loading) {
    return (
      <div
        className={`p-5 bg-gray-200 dark:bg-gray-900 min-h-[80vh] rounded-xl ${
          darkMode ? "dark" : ""
        }`}
      >
        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-gray-200 dark:bg-gray-900 rounded-xl p-6">
        <div className="flex flex-col items-center space-y-6 max-w-md p-8 text-center">
          {/* Error icon with animation */}
          <div className="relative">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-red-500 dark:text-red-400"
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
          </div>

          {/* Error text */}
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
              Dashboard Error
            </h2>
            <p className="text-red-500 dark:text-red-400 font-medium text-sm">
              {error}
            </p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Unable to load analytics data. Please try refreshing.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-6 py-2 bg-[#0f8abe] hover:bg-[#0d7aaa] disabled:opacity-50 text-white font-medium rounded-xl transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#0f8abe] focus:ring-offset-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Retry'}
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-medium rounded-xl transition-colors duration-200"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!overviewData) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-gray-200 dark:bg-gray-900 rounded-xl p-6">
        <div className="flex flex-col items-center space-y-6 max-w-md p-8 text-center">
          {/* Empty state icon */}
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-400 dark:text-gray-500"
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

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">
              No Analytics Data
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              No visitor data available yet. Analytics will appear once your site receives traffic.
            </p>
          </div>

          <button
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-6 py-2 bg-[#0f8abe] hover:bg-[#0d7aaa] disabled:opacity-50 text-white font-medium rounded-xl transition-colors duration-200"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Checking...' : 'Check for Data'}
          </button>
        </div>
      </div>
    );
  }

  // Calculate trend percentages (you can implement actual trend calculation based on historical data)
  const calculateTrend = (current, previous = 0) => {
    if (previous === 0) return { direction: 'up', percentage: '0.0' };
    const change = ((current - previous) / previous) * 100;
    return {
      direction: change >= 0 ? 'up' : 'down',
      percentage: Math.abs(change).toFixed(1)
    };
  };

  // Prepare stats cards data using overview data for main metrics
  const todayVisitorsTrend = calculateTrend(overviewData.todayVisitors);
  const todayViewsTrend = calculateTrend(overviewData.todayViews);

  const stats = [
    {
      title: "Today's Visitors",
      value: overviewData.todayVisitors || 0,
      iconType: "users",
      trend: todayVisitorsTrend.direction,
      change: `${todayVisitorsTrend.direction === 'up' ? '+' : '-'}${todayVisitorsTrend.percentage}%`,
    },
    {
      title: "Today's Views",
      value: overviewData.todayViews || 0,
      iconType: "eye",
      trend: todayViewsTrend.direction,
      change: `${todayViewsTrend.direction === 'up' ? '+' : '-'}${todayViewsTrend.percentage}%`,
    },
  ];

  return (
    <div
      className={`p-5 bg-gray-200 dark:bg-gray-900 min-h-[80vh] rounded-xl ${
        darkMode ? "dark" : ""
      }`}
    >
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              trend={stat.trend}
              change={stat.change}
              isLoading={false}
              error={null}
              darkMode={darkMode}
            />
          </motion.div>
        ))}

        {/* Total Views — mockup trend chart (real headline number, placeholder trend line for now) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <TotalViewsChart value={overviewData.totalViews || 0} darkMode={darkMode} />
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;