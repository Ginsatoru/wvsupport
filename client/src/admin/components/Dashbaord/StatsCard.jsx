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
 * StatsCard Component — "Upcoming payments" tile style
 *
 * @param {Object} props
 * @param {string} props.title - Card title (e.g., "Today's Visitors")
 * @param {string|number} props.value - The main metric value
 * @param {'users'|'clock'|'world'|'activity'|'eye'} props.iconType - Icon to display
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
  trend,
  change,
  isLoading = false,
  error = null,
  darkMode = false,
}) => {
  const IconComponent = iconComponents[iconType] || Activity;

  const caption =
    (iconType === "users" && "Unique visitors today") ||
    (iconType === "eye" && "Total page views") ||
    (iconType === "activity" && "Site activity") ||
    (iconType === "clock" && "Recent activity") ||
    (iconType === "world" && "Global reach") ||
    "";

  // Error state
  if (error) {
    return (
      <div className={`rounded-2xl p-5 ${darkMode ? "bg-gray-900" : "bg-red-50"}`}>
        <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mb-4">
          <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className={`font-bold text-sm ${darkMode ? "text-red-400" : "text-red-600"}`}>{title}</p>
        <p className={`text-xs mt-1 ${darkMode ? "text-red-300" : "text-red-500"}`}>Failed to load data</p>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl p-5 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
      {/* Icon badge */}
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${
          darkMode ? "bg-white text-gray-900" : "bg-gray-900 text-white"
        }`}
      >
        {isLoading ? (
          <div className="animate-spin w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full" />
        ) : (
          <IconComponent size={19} strokeWidth={2} />
        )}
      </div>

      {/* Title */}
      <p className={`font-bold text-sm ${darkMode ? "text-white" : "text-black"}`}>
        {title}
      </p>

      {/* Caption */}
      <p className={`text-xs mt-0.5 mb-2 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        {caption}
      </p>

      {/* Value + trend */}
      {isLoading ? (
        <div className={`h-5 w-16 rounded animate-pulse ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
      ) : (
        <div className="flex items-baseline gap-2 flex-wrap">
          <p className={`font-bold text-base ${darkMode ? "text-white" : "text-black"}`}>
            {typeof value === "number" ? value.toLocaleString() : value || "0"}
          </p>
          {change && (
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-semibold ${
                trend === "up" ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {trend === "up" ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
              {change}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default StatsCard;