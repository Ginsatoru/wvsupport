import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Custom tooltip component for engagement metrics
const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div
        className={`px-4 py-3 rounded-xl shadow-lg border backdrop-blur-sm ${
          darkMode
            ? "bg-gray-800/95 border-gray-600 text-white"
            : "bg-white/95 border-gray-200 text-gray-900"
        }`}
      >
        <p className="font-semibold text-sm mb-2">{label}</p>
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: data.color }}
          />
          <span className="text-sm">
            <span className="font-bold">{data.value}</span>
            {label === "Scroll Depth" && "%"}
            {label === "Time Spent" && "s"}
          </span>
        </div>
      </div>
    );
  }
  return null;
};

/**
 * ContentEngagement Component - Updated for Analytics Integration
 *
 * @param {Object} props
 * @param {Object} props.data - Engagement data from API: {avgClicks: 12, avgScrollDepth: 0.75, avgTimeSpent: 180}
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message
 * @param {boolean} props.darkMode - Dark mode toggle
 */
const ContentEngagement = ({
  data = {},
  isLoading = false,
  error = null,
  darkMode = false,
}) => {
  // Format data for the chart from the analytics API response
  const chartData = [
    {
      name: "Average Clicks",
      value: Math.round(data.avgClicks || 0),
      color: "#8B5CF6", // Purple
      description: "Clicks per session",
    },
    {
      name: "Scroll Depth",
      value: Math.round((data.avgScrollDepth || 0) * 100), // Convert to percentage
      color: "#06B6D4", // Cyan
      description: "% of page scrolled",
    },
    {
      name: "Time Spent",
      value: Math.round(data.avgTimeSpent || 0), // Keep in seconds
      color: "#10B981", // Emerald
      description: "Seconds on page",
    },
  ];

  // Calculate peak value
  const peakValue = Math.max(...chartData.map((item) => item.value), 1);
  const peakMetric = chartData.find((item) => item.value === peakValue);

  // Error state
  if (error) {
    return (
      <div
        className={`relative p-6 sm:p-8 rounded-xl transition-all duration-300 border ${
          darkMode ? "bg-red-900/10 border-red-800" : "bg-red-50 border-red-200"
        }`}
      >
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <svg
            className={`w-12 h-12 mb-4 ${
              darkMode ? "text-red-400" : "text-red-500"
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3
            className={`text-lg font-semibold mb-2 ${
              darkMode ? "text-red-400" : "text-red-600"
            }`}
          >
            Failed to Load Engagement Data
          </h3>
          <p
            className={`text-sm ${darkMode ? "text-red-300" : "text-red-500"}`}
          >
            {error || "Unable to fetch engagement metrics"}
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div
        className={`relative p-6 sm:p-8 rounded-xl transition-all duration-300 border ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex-1">
              <div
                className={`h-6 w-40 mb-2 rounded ${
                  darkMode ? "bg-gray-600" : "bg-gray-200"
                }`}
              />
              <div
                className={`h-4 w-64 rounded ${
                  darkMode ? "bg-gray-600" : "bg-gray-200"
                }`}
              />
            </div>
            <div className="mt-4 lg:mt-0">
              <div
                className={`h-4 w-20 mb-1 rounded ${
                  darkMode ? "bg-gray-600" : "bg-gray-200"
                }`}
              />
              <div
                className={`h-6 w-16 rounded ${
                  darkMode ? "bg-gray-600" : "bg-gray-200"
                }`}
              />
            </div>
          </div>
          {/* Chart skeleton */}
          <div
            className={`h-64 rounded ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative p-6 sm:p-8 rounded-xl transition-all duration-300 hover:shadow-lg border 
    ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}
    min-h-[350px]   // 👈 makes the card a little higher
  `}
    >
      {/* Header section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 mb-24">
        <div className="min-w-0 flex-1">
          <h2
            className={`text-lg sm:text-xl lg:text-2xl font-bold mb-2 leading-tight ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Engagement Metrics
          </h2>
          <p
            className={`text-sm leading-relaxed ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Average user engagement per session
          </p>
        </div>

        {/* Peak metric display */}
        <div className="flex flex-col sm:items-start lg:items-end flex-shrink-0">
          <span
            className={`text-xs uppercase tracking-wide font-medium mb-1 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Highest Metric
          </span>
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl font-bold text-emerald-500">
              {peakValue.toLocaleString()}
            </span>
            <span
              className={`text-xs ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {peakMetric?.name}
            </span>
          </div>
        </div>
      </div>

      {/* Chart container */}
      <div className="relative w-full">
        <ResponsiveContainer
          width="100%"
          height={280}
          className="min-h-[250px]"
        >
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 10,
              right: 30,
              left: 80,
              bottom: 10,
            }}
            barCategoryGap="20%"
          >
            <defs>
              {/* Gradient definitions */}
              <linearGradient id="clicksGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="scrollGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#06B6D4" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#06B6D4" stopOpacity={0.4} />
              </linearGradient>
              <linearGradient id="timeGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10B981" stopOpacity={0.8} />
                <stop offset="100%" stopColor="#10B981" stopOpacity={0.4} />
              </linearGradient>
            </defs>

            <YAxis
              type="category"
              dataKey="name"
              stroke={darkMode ? "#9CA3AF" : "#6B7280"}
              fontSize={12}
              fontWeight={500}
              axisLine={false}
              tickLine={false}
              width={75}
            />

            <XAxis
              type="number"
              stroke={darkMode ? "#9CA3AF" : "#6B7280"}
              fontSize={12}
              fontWeight={500}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => {
                if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
                return value;
              }}
            />

            <Tooltip
              content={<CustomTooltip darkMode={darkMode} />}
              cursor={{
                fill: darkMode ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)",
                radius: 8,
              }}
            />

            <Bar
              dataKey="value"
              radius={[0, 8, 8, 0]}
              className="drop-shadow-sm hover:drop-shadow-md transition-all duration-200"
            >
              {chartData.map((entry, index) => {
                let gradientId = "clicksGradient";
                if (entry.name.includes("Scroll"))
                  gradientId = "scrollGradient";
                if (entry.name.includes("Time")) gradientId = "timeGradient";

                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#${gradientId})`}
                    stroke={entry.color}
                    strokeWidth={1}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom info bar */}
      <div
        className={`mt-4 pt-4 border-t flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs ${
          darkMode
            ? "border-gray-700 text-gray-400"
            : "border-gray-200 text-gray-500"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-3 h-3 rounded-full bg-purple-500 flex-shrink-0"></div>
          <span className="truncate">Average clicks per visit</span>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-3 h-3 rounded-full bg-cyan-500 flex-shrink-0"></div>
          <span className="truncate">Percentage of page scrolled</span>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-3 h-3 rounded-full bg-emerald-500 flex-shrink-0"></div>
          <span className="truncate">Average time spent (seconds)</span>
        </div>
      </div>

      {/* Empty state when no engagement data */}
      {peakValue === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900/10 backdrop-blur-sm rounded-xl">
          <div className="text-center">
            <svg
              className={`w-12 h-12 mx-auto mb-4 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <p
              className={`text-lg font-semibold ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              No Engagement Data Yet
            </p>
            <p
              className={`text-sm mt-1 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            >
              Engagement metrics will appear as users interact with your site
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentEngagement;
