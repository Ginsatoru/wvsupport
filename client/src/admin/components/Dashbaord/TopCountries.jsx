import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Modern gradient colors
const COLORS = [
  "#6366F1", // Indigo
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#3B82F6", // Blue
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#84CC16", // Lime
];

// Country flag emojis - expanded list
const COUNTRY_FLAGS = {
  "United States": "🇺🇸",
  "USA": "🇺🇸",
  "US": "🇺🇸",
  "United Kingdom": "🇬🇧",
  "UK": "🇬🇧",
  "India": "🇮🇳",
  "Canada": "🇨🇦",
  "Germany": "🇩🇪",
  "France": "🇫🇷",
  "Japan": "🇯🇵",
  "Australia": "🇦🇺",
  "Brazil": "🇧🇷",
  "China": "🇨🇳",
  "Russia": "🇷🇺",
  "Italy": "🇮🇹",
  "Spain": "🇪🇸",
  "Netherlands": "🇳🇱",
  "South Korea": "🇰🇷",
  "Mexico": "🇲🇽",
  "Sweden": "🇸🇪",
  "Norway": "🇳🇴",
  "Denmark": "🇩🇰",
  "Finland": "🇫🇮",
  "Switzerland": "🇨🇭",
  "Belgium": "🇧🇪",
  "Austria": "🇦🇹",
  "Poland": "🇵🇱",
  "Portugal": "🇵🇹",
  "Greece": "🇬🇷",
  "Turkey": "🇹🇷",
  "Israel": "🇮🇱",
  "South Africa": "🇿🇦",
  "Argentina": "🇦🇷",
  "Chile": "🇨🇱",
  "Colombia": "🇨🇴",
  "Peru": "🇵🇪",
  "Thailand": "🇹🇭",
  "Vietnam": "🇻🇳",
  "Malaysia": "🇲🇾",
  "Singapore": "🇸🇬",
  "Philippines": "🇵🇭",
  "Indonesia": "🇮🇩",
  "Cambodia": "🇰🇭",
  "Unknown": "🌐",
  "N/A": "🌐",
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, darkMode }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = payload[0].payload.total || 100; // Fallback for percentage calculation
    const percentage = ((data.value / total) * 100).toFixed(1);

    return (
      <div
        className={`px-4 py-3 rounded-xl shadow-lg border backdrop-blur-sm transition-all duration-200 ${
          darkMode
            ? "bg-gray-900/95 border-gray-600 text-white"
            : "bg-white/95 border-gray-200 text-gray-900"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-lg">{data.flag}</span>
          <p className="font-semibold text-sm truncate max-w-32">
            {data.name}
          </p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Visitors: <span className="font-bold text-blue-600 dark:text-blue-400">
            {data.value.toLocaleString()}
          </span>
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Share: <span className="font-bold text-emerald-600 dark:text-emerald-400">
            {percentage}%
          </span>
        </p>
      </div>
    );
  }
  return null;
};

// Custom legend component
const CustomLegend = ({ payload, darkMode }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4 px-2">
      {payload.slice(0, 6).map((entry, index) => ( // Limit to 6 items
        <div
          key={`legend-${index}`}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all duration-200 cursor-pointer hover:scale-105 ${
            darkMode
              ? "bg-gray-700/50 hover:bg-gray-700"
              : "bg-gray-100/50 hover:bg-gray-100"
          }`}
        >
          <div
            className="w-3 h-3 rounded-full shadow-sm flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs font-medium flex items-center gap-1">
            <span>{entry.payload.flag}</span>
            <span
              className={`truncate max-w-20 sm:max-w-none ${
                darkMode ? "text-gray-300" : "text-gray-700"
              }`}
            >
              {entry.value}
            </span>
          </span>
        </div>
      ))}
    </div>
  );
};

/**
 * TopCountries Component - Updated for Analytics Integration
 * 
 * @param {Object} props
 * @param {Array} props.data - Countries data from API: [{country: "USA", count: 45}, ...]
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.error - Error message
 * @param {Array} props.colors - Color palette for the chart
 * @param {boolean} props.darkMode - Dark mode toggle
 */
const TopCountries = ({ 
  data = [], 
  isLoading = false, 
  error = null, 
  colors = COLORS, 
  darkMode = false 
}) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  // Format data from API response
  const formattedData = data.map((country) => ({
    name: country.country || "Unknown",
    value: country.count || 0,
    flag: COUNTRY_FLAGS[country.country] || COUNTRY_FLAGS["Unknown"],
  }));

  const total = formattedData.reduce((sum, item) => sum + item.value, 0);
  
  // Add total to each item for tooltip calculations
  const chartData = formattedData.map(item => ({
    ...item,
    total
  }));

  const topCountry = formattedData.length > 0
    ? formattedData.reduce((prev, current) => prev.value > current.value ? prev : current)
    : { name: "No data", value: 0, flag: "🌐" };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  // Error state
  if (error) {
    return (
      <div className={`relative p-6 sm:p-8 rounded-xl transition-all duration-300 border ${
        darkMode
          ? "bg-red-900/10 border-red-800"
          : "bg-red-50 border-red-200"
      }`}>
        <div className="flex flex-col items-center justify-center h-80 text-center">
          <svg className={`w-12 h-12 mb-4 ${darkMode ? "text-red-400" : "text-red-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-red-400" : "text-red-600"}`}>
            Failed to Load Countries Data
          </h3>
          <p className={`text-sm ${darkMode ? "text-red-300" : "text-red-500"}`}>
            {error || "Unable to fetch country statistics"}
          </p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={`relative p-6 sm:p-8 rounded-xl transition-all duration-300 border ${
        darkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}>
        <div className="animate-pulse">
          {/* Header skeleton */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex-1">
              <div className={`h-6 w-32 mb-2 rounded ${darkMode ? "bg-gray-600" : "bg-gray-200"}`} />
              <div className={`h-4 w-48 rounded ${darkMode ? "bg-gray-600" : "bg-gray-200"}`} />
            </div>
            <div className="mt-4 lg:mt-0">
              <div className={`h-4 w-24 mb-1 rounded ${darkMode ? "bg-gray-600" : "bg-gray-200"}`} />
              <div className={`h-6 w-20 rounded ${darkMode ? "bg-gray-600" : "bg-gray-200"}`} />
            </div>
          </div>
          {/* Chart skeleton */}
          <div className={`h-80 rounded-xl ${darkMode ? "bg-gray-700" : "bg-gray-100"} flex items-center justify-center`}>
            <div className={`w-40 h-40 rounded-full ${darkMode ? "bg-gray-600" : "bg-gray-200"}`} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative p-6 sm:p-8 rounded-xl transition-all duration-300 hover:shadow-lg border ${
        darkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
      }`}
    >
      {/* Header section */}
      <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
        <div className="min-w-0 flex-1">
          <h2 className={`text-lg sm:text-xl lg:text-2xl font-bold mb-2 leading-tight ${
            darkMode ? "text-white" : "text-gray-900"
          }`}>
            Top Countries
          </h2>
          <p className={`text-sm leading-relaxed ${
            darkMode ? "text-gray-400" : "text-gray-600"
          }`}>
            Visitor distribution by country
          </p>
        </div>

        {/* Summary stats */}
        <div className="flex flex-col sm:items-start lg:items-end flex-shrink-0">
          <span className={`text-xs uppercase tracking-wide font-medium mb-1 ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}>
            Leading Country
          </span>
          <div className="flex items-center gap-2">
            <span className="text-lg">{topCountry.flag}</span>
            <span className="text-lg font-bold text-indigo-500 truncate max-w-32 sm:max-w-none">
              {topCountry.name}
            </span>
          </div>
        </div>
      </div>

      {/* Chart container */}
      <div className="relative w-full">
        {formattedData.length === 0 ? (
          /* Empty state */
          <div className="flex items-center justify-center h-80">
            <div className="text-center">
              <svg className={`w-16 h-16 mx-auto mb-4 ${darkMode ? "text-gray-500" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                No Country Data Available
              </h3>
              <p className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                Country statistics will appear once visitors access your site
              </p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height={320}
            className="min-h-[300px]"
          >
            <PieChart>
              <defs>
                {colors.map((color, index) => (
                  <linearGradient
                    key={index}
                    id={`gradient${index}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={color} stopOpacity={0.9} />
                    <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                  </linearGradient>
                ))}
              </defs>

              <Pie
                data={chartData}
                cx="50%"
                cy="45%"
                innerRadius={50}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                onMouseEnter={onPieEnter}
                onMouseLeave={onPieLeave}
                className="drop-shadow-lg"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#gradient${index % colors.length})`}
                    stroke={darkMode ? "#374151" : "#F3F4F6"}
                    strokeWidth={2}
                    className={`transition-all duration-300 cursor-pointer ${
                      activeIndex === index ? "drop-shadow-2xl" : "drop-shadow-sm"
                    }`}
                    style={{
                      filter: activeIndex === index ? "brightness(1.1)" : "brightness(1)",
                      transform: activeIndex === index ? "scale(1.05)" : "scale(1)",
                      transformOrigin: "center",
                    }}
                  />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
              <Legend
                content={
                  <CustomLegend
                    darkMode={darkMode}
                    payload={chartData.map((item, index) => ({
                      value: item.name,
                      color: colors[index % colors.length],
                      payload: item,
                    }))}
                  />
                }
              />
            </PieChart>
          </ResponsiveContainer>
        )}

        {/* Center total display */}
        {formattedData.length > 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center" style={{ marginTop: '-40px' }}>
              <div className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
                {total.toLocaleString()}
              </div>
              <div className={`text-xs uppercase tracking-wide font-medium ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}>
                Total Visitors
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stats grid - only show if we have data */}
      {formattedData.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          {formattedData.slice(0, 4).map((country, index) => {
            const percentage = total > 0 ? ((country.value / total) * 100).toFixed(1) : '0.0';
            return (
              <div
                key={country.name}
                className={`text-center p-3 rounded-xl transition-all duration-200 hover:scale-105 ${
                  darkMode
                    ? "bg-gray-700/30 hover:bg-gray-700/50"
                    : "bg-gray-50/50 hover:bg-gray-100/50"
                }`}
              >
                <div className="text-lg mb-1">{country.flag}</div>
                <div
                  className={`text-xs font-medium mb-1 truncate ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                  title={country.name}
                >
                  {country.name}
                </div>
                <div
                  className="text-sm font-bold"
                  style={{ color: colors[index % colors.length] }}
                >
                  {percentage}%
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TopCountries;