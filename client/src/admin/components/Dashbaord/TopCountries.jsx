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
];

// Country flag emojis
const COUNTRY_FLAGS = {
  "United States": "🇺🇸",
  "United Kingdom": "🇬🇧",
  India: "🇮🇳",
  Canada: "🇨🇦",
  Germany: "🇩🇪",
  France: "🇫🇷",
  Japan: "🇯🇵",
  Australia: "🇦🇺",
  Cambodia: "🇰🇭",
  Unknown: "🌐",
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, darkMode }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const total = payload.reduce((sum, item) => sum + item.value, 0);
    const percentage = ((data.value / total) * 100).toFixed(1);

    return (
      <div
        className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg sm:rounded-xl shadow-xl border backdrop-blur-sm transition-all duration-200 max-w-xs ${
          darkMode
            ? "bg-gray-900/95 border-gray-600 text-white"
            : "bg-white/95 border-gray-200 text-gray-900"
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span className="text-base sm:text-lg">{data.flag}</span>
          <p className="font-semibold text-sm sm:text-base truncate">
            {data.name}
          </p>
        </div>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Visitors:{" "}
          <span className="font-bold text-blue-600 dark:text-blue-400">
            {data.value.toLocaleString()}
          </span>
        </p>
        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
          Share:{" "}
          <span className="font-bold text-emerald-600 dark:text-emerald-400">
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
    <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-3 sm:mt-4 px-2">
      {payload.map((entry, index) => (
        <div
          key={`legend-${index}`}
          className={`flex items-center gap-1 sm:gap-2 px-9 py-1 sm:px-3 sm:py-2 rounded-md sm:rounded-xl transition-all duration-200 cursor-pointer hover:scale-105 ${
            darkMode
              ? "bg-gray-700/50 hover:bg-gray-700"
              : "bg-gray-100/50 hover:bg-gray-100"
          }`}
        >
          <div
            className="w-2 h-2 sm:w-3 sm:h-3 rounded-full shadow-sm flex-shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs font-medium flex items-center gap-1">
            <span>{entry.payload.flag}</span>
            <span
              className={`truncate max-w-16 sm:max-w-none ${
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

const TopCountries = ({ data = [], colors = COLORS, darkMode = false }) => {
  const [activeIndex, setActiveIndex] = useState(-1);

  // Format data from API response
  const formattedData = data.map((country) => ({
    name: country.country,
    value: country.count,
    flag: COUNTRY_FLAGS[country.country] || COUNTRY_FLAGS["Unknown"],
  }));

  const total = formattedData.reduce((sum, item) => sum + item.value, 0);
  const topCountry =
    formattedData.length > 0
      ? formattedData.reduce((prev, current) =>
          prev.value > current.value ? prev : current
        )
      : { name: "No data", value: 0, flag: "🌐" };

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  return (
    <div
      className={`relative py-3 px-4 sm:py-4 sm:px-6 lg:py-6 lg:px-10 rounded-xl sm:rounded-2xl transition-all duration-300 hover:shadow-xl w-full max-w-full overflow-hidden ${
        darkMode
          ? "bg-gradient-to-br from-black-800 to-gray-900 shadow-2xl border border-gray-700"
          : "bg-gradient-to-br from-white to-gray-50 shadow-lg border border-gray-100"
      }`}
    >
      {/* Header section */}
      <div className="flex flex-col space-y-3 sm:space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0 mb-4 sm:mb-6">
        <div className="min-w-0 flex-1">
          <h2
            className={`text-lg sm:text-xl lg:text-2xl font-bold mb-1 sm:mb-2 leading-tight ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Top Countries
          </h2>
          <p
            className={`text-xs sm:text-sm leading-relaxed ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Visitor distribution by country
          </p>
        </div>

        {/* Summary stats */}
        <div className="flex flex-col sm:items-start lg:items-end flex-shrink-0">
          <span
            className={`text-xs uppercase tracking-wide font-medium mb-1 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Top Country
          </span>
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg">{topCountry.flag}</span>
            <span className="text-base sm:text-xl font-bold text-indigo-500 truncate max-w-32 sm:max-w-none">
              {topCountry.name}
            </span>
          </div>
        </div>
      </div>

      {/* Chart container */}
      <div className="relative w-full">
        <ResponsiveContainer
          width="100%"
          height={280}
          className="min-h-[240px] sm:min-h-[280px] lg:min-h-[320px]"
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
                  <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="100%" stopColor={color} stopOpacity={0.6} />
                </linearGradient>
              ))}
            </defs>

            <Pie
              data={formattedData}
              cx="50%"
              cy="45%"
              innerRadius={40}
              outerRadius={80}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              onMouseEnter={onPieEnter}
              onMouseLeave={onPieLeave}
              className="drop-shadow-lg"
            >
              {formattedData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={`url(#gradient${index})`}
                  stroke={darkMode ? "#374151" : "#F3F4F6"}
                  strokeWidth={2}
                  className={`transition-all duration-300 cursor-pointer ${
                    activeIndex === index ? "drop-shadow-2xl" : "drop-shadow-sm"
                  }`}
                  style={{
                    filter:
                      activeIndex === index
                        ? "brightness(1.1)"
                        : "brightness(1)",
                    transform:
                      activeIndex === index ? "scale(1.05)" : "scale(1)",
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
                  payload={formattedData.map((item, index) => ({
                    value: item.name,
                    color: colors[index % colors.length],
                    payload: item,
                  }))}
                />
              }
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center total display */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div
              className={`text-lg sm:text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              {total.toLocaleString()}
            </div>
            <div
              className={`text-xs uppercase tracking-wide font-medium ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Total Visitors
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid - only show if we have data */}
      {formattedData.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200 dark:border-gray-700">
          {formattedData.slice(0, 4).map((country, index) => {
            const percentage = ((country.value / total) * 100).toFixed(1);
            return (
              <div
                key={country.name}
                className={`text-center p-2 sm:p-3 rounded-md sm:rounded-xl transition-all duration-200 hover:scale-105 ${
                  darkMode
                    ? "bg-gray-700/30 hover:bg-gray-700/50"
                    : "bg-gray-50/50 hover:bg-gray-100/50"
                }`}
              >
                <div className="text-base sm:text-lg mb-1">{country.flag}</div>
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
                  style={{ color: colors[index] }}
                >
                  {percentage}%
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty state */}
      {formattedData.length === 0 && (
        <div className="flex items-center justify-center h-32 sm:h-40">
          <p
            className={`text-sm sm:text-base text-gray-500 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No country data available
          </p>
        </div>
      )}

      {/* Subtle overlay effect */}
      <div
        className={`absolute inset-0 pointer-events-none rounded-xl sm:rounded-2xl ${
          darkMode
            ? "bg-gradient-to-br from-transparent via-transparent to-gray-900/10"
            : "bg-gradient-to-br from-transparent via-transparent to-gray-900/5"
        }`}
      />
    </div>
  );
};

export default TopCountries;
