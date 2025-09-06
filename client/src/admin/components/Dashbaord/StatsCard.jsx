import React from "react";
import { Activity, Clock, Globe, Users, Eye, TrendingUp, TrendingDown } from "lucide-react";

const iconComponents = {
  users: Users,
  clock: Clock,
  world: Globe,
  activity: Activity,
  eye: Eye,
};

/**
 * StatsCard Component - Updated for Analytics Integration
 * 
 * @param {Object} props
 * @param {string} props.title - Card title (e.g., "Today's Visitors")
 * @param {string|number} props.value - The main metric value
 * @param {'users'|'clock'|'world'|'activity'|'eye'} props.iconType - Icon to display
 * @param {Object} props.color - Color configuration
 * @param {string} props.color.from - Tailwind gradient from color
 * @param {string} props.color.to - Tailwind gradient to color
 * @param {string} props.color.bg - Tailwind background color
 * @param {string} props.color.text - Tailwind text color
 * @param {'up'|'down'} [props.trend] - Trend direction
 * @param {string} [props.change] - Percentage change (e.g., "+3.2%")
 * @param {boolean} [props.isLoading] - Loading state
 * @param {string} [props.error] - Error message
 * @param {boolean} [props.darkMode] - Dark mode toggle
 */
const StatsCard = ({
  title,
  value,
  iconType = "activity",
  color = {
    bg: "bg-blue-100",
    text: "text-blue-600",
    from: "from-blue-500",
    to: "to-blue-600"
  },
  trend,
  change,
  isLoading = false,
  error = null,
  darkMode = false,
}) => {
  const IconComponent = iconComponents[iconType] || Activity;

  // Error state
  if (error) {
    return (
      <div className={`relative overflow-hidden rounded-xl p-6 transition-all duration-200 border ${
        darkMode
          ? "bg-red-900/20 border-red-800 hover:bg-red-900/30"
          : "bg-red-50 border-red-200 hover:bg-red-100"
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className={`text-sm font-medium mb-1 ${
              darkMode ? "text-red-400" : "text-red-600"
            }`}>
              {title}
            </p>
            <p className={`text-xs ${
              darkMode ? "text-red-300" : "text-red-500"
            }`}>
              Failed to load data
            </p>
          </div>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            darkMode ? "bg-red-900" : "bg-red-200"
          }`}>
            <svg className={`w-5 h-5 ${darkMode ? "text-red-400" : "text-red-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden rounded-xl p-6 transition-all duration-200 group ${
      darkMode
        ? "bg-gray-800 hover:bg-gray-750 border border-gray-700 hover:shadow-lg hover:-translate-y-1"
        : "bg-white hover:bg-gray-50 border border-gray-200 hover:shadow-lg hover:-translate-y-1"
    }`}>
      {/* Background gradient effect */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-200 bg-gradient-to-br ${color.from} ${color.to}`} />
      
      <div className="relative z-10">
        {/* Header with icon and trend */}
        <div className="flex items-start justify-between mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 ${
            darkMode ? "bg-gray-700 group-hover:bg-gray-600" : color.bg || "bg-gray-100"
          }`}>
            {isLoading ? (
              <div className="animate-spin w-5 h-5 border-2 border-gray-300 border-t-transparent rounded-full" />
            ) : (
              <IconComponent
                size={20}
                className={darkMode ? "text-gray-300" : color.text || "text-gray-700"}
                strokeWidth={1.5}
              />
            )}
          </div>

          {/* Trend indicator */}
          {change && !isLoading && (
            <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
              trend === "up"
                ? darkMode
                  ? "bg-emerald-900/30 text-emerald-300"
                  : "bg-emerald-100 text-emerald-700"
                : darkMode
                ? "bg-red-900/30 text-red-300"
                : "bg-red-100 text-red-700"
            }`}>
              {trend === "up" ? (
                <TrendingUp size={12} />
              ) : (
                <TrendingDown size={12} />
              )}
              {change}
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="space-y-1">
          <h3 className={`text-sm font-medium ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}>
            {title}
          </h3>

          {isLoading ? (
            <div className="animate-pulse space-y-2">
              <div className={`h-8 rounded ${
                darkMode ? "bg-gray-600" : "bg-gray-200"
              } w-20`} />
            </div>
          ) : (
            <div className="flex items-baseline gap-2">
              <h2 className={`text-2xl sm:text-3xl font-bold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}>
                {typeof value === 'number' ? value.toLocaleString() : value || '0'}
              </h2>
            </div>
          )}
        </div>

        {/* Additional info */}
        {!isLoading && (
          <div className={`mt-3 pt-3 border-t ${
            darkMode ? "border-gray-700" : "border-gray-100"
          }`}>
            <p className={`text-xs ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}>
              {iconType === 'users' && 'Unique visitors today'}
              {iconType === 'eye' && 'Total page views'}
              {iconType === 'activity' && 'Site activity'}
              {iconType === 'clock' && 'Recent activity'}
              {iconType === 'world' && 'Global reach'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsCard;