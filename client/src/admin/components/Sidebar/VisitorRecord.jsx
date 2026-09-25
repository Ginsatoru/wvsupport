import React, { useState, useEffect, useCallback } from "react";
import { FiStar } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const REFRESH_MS = 5 * 60 * 1000;

const VisitorRecord = ({ darkMode = false, isOpen = true }) => {
  const [todayStats, setTodayStats] = useState({ viewers: 0, visitors: 0, loading: true, error: null });

  // Same data as the dashboard: admin token + timezone so "today" is local midnight
  const fetchTodayStats = useCallback(async () => {
    setTodayStats((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const response = await fetch(`/api/analytics/overview?tzOffset=${new Date().getTimezoneOffset()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

      const data = await response.json();
      setTodayStats({ viewers: data.todayViews || 0, visitors: data.todayVisitors || 0, loading: false, error: null });
    } catch (error) {
      console.error("Error fetching today stats:", error);
      setTodayStats((prev) => ({ ...prev, loading: false, error: error.message }));
    }
  }, []);

  useEffect(() => {
    fetchTodayStats();
    const interval = setInterval(fetchTodayStats, REFRESH_MS);
    return () => clearInterval(interval);
  }, [fetchTodayStats]);

  const labelClass = `text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`;

  const Stat = ({ value, label }) => (
    <div className="text-center">
      {todayStats.loading ? (
        <div className="h-8 w-12 mx-auto bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse"></div>
      ) : (
        <p className="text-2xl font-bold text-sky-400">{value}</p>
      )}
      <p className={labelClass}>{label}</p>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className={`p-4 -mt-4 ${darkMode ? "border-gray-700" : "border-gray-100"}`}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`rounded-xl p-4 ${darkMode ? "bg-gray-700" : "bg-sky-100"}`}>
            <div className="flex items-center justify-around mb-5">
              <span className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
                Today's Overview
              </span>
              <FiStar className="h-5 w-5 text-sky-400" />
            </div>

            {todayStats.error ? (
              <div className="text-center py-2">
                <p className="text-red-400 text-xs mb-2">Failed to load</p>
                <button onClick={fetchTodayStats} className="text-xs text-sky-400 hover:text-sky-300 underline">
                  Retry
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <Stat value={todayStats.viewers} label="Views" />
                <Stat value={todayStats.visitors} label="Visitors" />
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VisitorRecord;