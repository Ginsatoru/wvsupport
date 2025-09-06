import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`px-4 py-3 rounded-xl shadow-lg border backdrop-blur-sm ${
          darkMode
            ? "bg-gray-800/95 border-gray-600 text-white"
            : "bg-white/95 border-gray-200 text-gray-900"
        }`}
        style={{
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
        }}
      >
        <p className="font-semibold text-sm mb-1">
          {new Date(label).toLocaleDateString()}
        </p>
        <p className="text-lg font-bold" style={{ color: payload[0].color }}>
          {payload[0].value.toLocaleString()} visits
        </p>
      </div>
    );
  }
  return null;
};

// Custom dot component for line points
const CustomDot = ({ cx, cy, payload, darkMode }) => {
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="url(#dotGradient)"
      stroke="#fff"
      strokeWidth={2}
      className="drop-shadow-sm hover:r-6 transition-all duration-200"
    />
  );
};

/**
 * VisitorChart Component - Updated for Analytics Integration
 * 
 * @param {Object} props
 * @param {Array} props.data - Visit trends data from API: [{date: "2025-01-15", count: 25}, ...]
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message
 * @param {boolean} props.darkMode - Dark mode toggle
 */
const VisitorChart = ({ 
  data = [], 
  isLoading = false, 
  error = null, 
  darkMode = false 
}) => {
  // Format data for the chart
  const chartData = data.map((item) => ({
    name: item.date,
    date: item.date,
    visits: item.count || 0,
  }));

  // Calculate stats
  const totalVisitors = chartData.reduce((sum, day) => sum + day.visits, 0);
  const avgVisitors = chartData.length > 0 ? Math.round(totalVisitors / chartData.length) : 0;
  const maxDay = chartData.length > 0
    ? chartData.reduce((max, day) => (day.visits > max.visits ? day : max), chartData[0])
    : { name: "N/A", visits: 0 };

  // Error state
  if (error) {
    return (
      <div className={`relative p-6 sm:p-8 lg:p-11 rounded-2xl transition-all duration-300 border ${
        darkMode
          ? "bg-red-900/10 border-red-800"
          : "bg-red-50 border-red-200"
      }`}>
        <div className="flex flex-col items-center justify-center h-80 text-center">
          <svg className={`w-12 h-12 mb-4 ${darkMode ? "text-red-400" : "text-red-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-red-400" : "text-red-600"}`}>
            Failed to Load Chart Data
          </h3>
          <p className={`text-sm ${darkMode ? "text-red-300" : "text-red-500"}`}>
            {error || "Unable to fetch visitor trends"}
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={`relative p-6 sm:p-8 lg:p-11 rounded-2xl transition-all duration-300 border ${
        darkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}>
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <div className={`h-6 w-32 mb-2 rounded ${darkMode ? "bg-gray-600" : "bg-gray-200"}`} />
              <div className={`h-4 w-48 rounded ${darkMode ? "bg-gray-600" : "bg-gray-200"}`} />
            </div>
            <div className="flex gap-4 mt-4 sm:mt-0">
              <div className={`h-12 w-20 rounded-lg ${darkMode ? "bg-gray-600" : "bg-gray-200"}`} />
              <div className={`h-12 w-20 rounded-lg ${darkMode ? "bg-gray-600" : "bg-gray-200"}`} />
              <div className={`h-12 w-20 rounded-lg ${darkMode ? "bg-gray-600" : "bg-gray-200"}`} />
            </div>
          </div>
          {/* Chart skeleton */}
          <div className={`h-80 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-100"}`} />
        </div>
      </div>
    );
  }

  // Empty state
  if (chartData.length === 0) {
    return (
      <div className={`relative p-6 sm:p-8 lg:p-11 rounded-2xl transition-all duration-300 border ${
        darkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}>
        <div className="flex flex-col items-center justify-center h-80 text-center">
          <svg className={`w-16 h-16 mb-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            No Visitor Data Available
          </h3>
          <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            Visit data will appear here once your site starts receiving traffic
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative p-6 sm:p-8 lg:p-11 rounded-2xl transition-all duration-300 border hover:shadow-lg ${
        darkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}
      style={{
        boxShadow: darkMode
          ? "0 10px 30px rgba(0, 0, 0, 0.3)"
          : "0 10px 30px rgba(0, 0, 0, 0.08)",
      }}
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${
            darkMode ? "text-white" : "text-gray-900"
          }`}>
            Visitor Trends
          </h2>
          <p className={`text-sm ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            Daily visitor patterns over time
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <div className={`px-3 py-2 rounded-lg border ${
            darkMode
              ? "bg-blue-900/30 border-blue-700/50 text-blue-300"
              : "bg-blue-50 border-blue-200 text-blue-700"
          }`}>
            <p className="text-xs font-medium opacity-80">Total</p>
            <p className="text-sm font-bold">
              {totalVisitors.toLocaleString()}
            </p>
          </div>

          <div className={`px-3 py-2 rounded-lg border ${
            darkMode
              ? "bg-emerald-900/30 border-emerald-700/50 text-emerald-300"
              : "bg-emerald-50 border-emerald-200 text-emerald-700"
          }`}>
            <p className="text-xs font-medium opacity-80">Daily Avg</p>
            <p className="text-sm font-bold">{avgVisitors.toLocaleString()}</p>
          </div>

          <div className={`px-3 py-2 rounded-lg border ${
            darkMode
              ? "bg-purple-900/30 border-purple-700/50 text-purple-300"
              : "bg-purple-50 border-purple-200 text-purple-700"
          }`}>
            <p className="text-xs font-medium opacity-80">Peak Day</p>
            <p className="text-sm font-bold">{maxDay.visits}</p>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={300} className="sm:h-80">
          <AreaChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            {/* Gradient definitions */}
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="50%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
              <radialGradient id="dotGradient">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </radialGradient>
            </defs>

            <XAxis
              dataKey="name"
              stroke={darkMode ? "#9ca3af" : "#6b7280"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              className="text-xs sm:text-sm"
              tickFormatter={(value) => {
                try {
                  const date = new Date(value);
                  return date.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric' 
                  });
                } catch {
                  return value;
                }
              }}
            />
            <YAxis
              stroke={darkMode ? "#9ca3af" : "#6b7280"}
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
                return value;
              }}
              className="text-xs sm:text-sm"
            />
            <Tooltip
              content={<CustomTooltip darkMode={darkMode} />}
              cursor={{
                stroke: darkMode ? "#4b5563" : "#d1d5db",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />

            {/* Area fill */}
            <Area
              type="monotone"
              dataKey="visits"
              stroke="none"
              fill="url(#areaGradient)"
            />

            {/* Main line */}
            <Line
              type="monotone"
              dataKey="visits"
              stroke="url(#lineGradient)"
              strokeWidth={3}
              dot={<CustomDot darkMode={darkMode} />}
              activeDot={{
                r: 6,
                fill: "#6366f1",
                stroke: "#fff",
                strokeWidth: 2,
                filter: "drop-shadow(0 2px 4px rgba(99, 102, 241, 0.3))",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom info */}
      <div className={`mt-4 pt-4 border-t text-center text-xs ${
        darkMode
          ? "border-gray-700 text-gray-400"
          : "border-gray-200 text-gray-500"
      }`}>
        Data updated in real-time • Last refresh: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default VisitorChart;