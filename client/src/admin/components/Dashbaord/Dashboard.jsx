import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { RefreshCw } from "lucide-react";
import TotalViewsChart from "./TotalViewsChart";

const REFRESH_MS = 5 * 60 * 1000;

const ChartSkeleton = () => (
  <div className="h-full min-h-[70vh] bg-white dark:bg-gray-800 rounded-3xl p-6 animate-pulse">
    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24 mb-3"></div>
    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-6"></div>
    <div className="h-[55vh] bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
  </div>
);

const RefreshButton = ({ onClick, busy, label, busyLabel }) => (
  <button
    onClick={onClick}
    disabled={busy}
    className="flex items-center gap-2 px-6 py-2 bg-[#0f8abe] hover:bg-[#0d7aaa] disabled:opacity-50 text-white font-medium rounded-xl transition-colors duration-200"
  >
    <RefreshCw className={`w-4 h-4 ${busy ? "animate-spin" : ""}`} />
    {busy ? busyLabel : label}
  </button>
);

const Dashboard = ({ darkMode }) => {
  const [overviewData, setOverviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchAllData = async (background = false) => {
    background ? setIsRefreshing(true) : setLoading(true);
    setError(null);
    try {
      // tzOffset lets the server count "today" in the admin's own timezone
      const res = await fetch(`/api/analytics/overview?tzOffset=${new Date().getTimezoneOffset()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      if (!res.ok) throw new Error(`Failed to fetch overview data (${res.status})`);
      setOverviewData(await res.json());
    } catch (err) {
      console.error("Error fetching analytics data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllData();
    const refreshInterval = setInterval(() => fetchAllData(true), REFRESH_MS);
    return () => clearInterval(refreshInterval);
  }, []);

  const handleManualRefresh = () => fetchAllData(true);

  if (loading) {
    return (
      <div className={`p-5 bg-gray-200 dark:bg-gray-900 min-h-[80vh] rounded-xl ${darkMode ? "dark" : ""}`}>
        <ChartSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] bg-gray-200 dark:bg-gray-900 rounded-xl p-6">
        <div className="flex flex-col items-center space-y-6 max-w-md p-8 text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-red-500 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Dashboard Error</h2>
            <p className="text-red-500 dark:text-red-400 font-medium text-sm">{error}</p>
            <p className="text-gray-600 dark:text-gray-400 text-sm">Unable to load analytics data. Please try refreshing.</p>
          </div>

          <div className="flex gap-3">
            <RefreshButton onClick={handleManualRefresh} busy={isRefreshing} label="Retry" busyLabel="Refreshing..." />
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
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300">No Analytics Data</h2>
            <p className="text-gray-500 dark:text-gray-400">
              No visitor data available yet. Analytics will appear once your site receives traffic.
            </p>
          </div>

          <RefreshButton onClick={handleManualRefresh} busy={isRefreshing} label="Check for Data" busyLabel="Checking..." />
        </div>
      </div>
    );
  }

  return (
    <div className={`p-5 bg-gray-200 dark:bg-gray-900 min-h-[80vh] rounded-xl flex flex-col ${darkMode ? "dark" : ""}`}>
      {/* Views trend — full width and height (today's numbers live in the sidebar) */}
      <motion.div
        className="flex-1 flex flex-col"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <TotalViewsChart value={overviewData.totalViews || 0} darkMode={darkMode} />
      </motion.div>
    </div>
  );
};

export default Dashboard;