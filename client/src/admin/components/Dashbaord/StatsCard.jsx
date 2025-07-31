import { motion } from "framer-motion";
import { Activity, Clock, Globe, Users } from "lucide-react";
import { useState } from "react";

const cardVariants = {
  offscreen: { opacity: 0, y: 20 },
  onscreen: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 },
  },
};

const iconComponents = {
  users: Users,
  clock: Clock,
  world: Globe,
  activity: Activity,
};

/**
 * StatsCard Component
 * 
 * @param {Object} props
 * @param {string} props.title - Card title (e.g., "Visitors")
 * @param {string|number} props.value - The main metric value
 * @param {'users'|'clock'|'world'|'activity'} props.iconType - Icon to display
 * @param {Object} props.color - Color configuration
 * @param {string} props.color.from - Tailwind gradient from color
 * @param {string} props.color.to - Tailwind gradient to color
 * @param {string} props.color.bg - Tailwind background color
 * @param {string} props.color.text - Tailwind text color
 * @param {'up'|'down'} [props.trend] - Trend direction
 * @param {string} [props.change] - Percentage change (e.g., "+3.2%")
 * @param {boolean} [props.darkMode] - Dark mode toggle
 * @param {boolean} [props.showFilter] - Show time range filter
 */
const StatsCard = ({
  title,
  value,
  iconType,
  color,
  trend,
  change,
  darkMode,
  showFilter = false,
}) => {
  const [timeRange, setTimeRange] = useState("today");
  const IconComponent = iconComponents[iconType] || Activity;

  return (
    <motion.div
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.2 }}
      variants={cardVariants}
      className={`
        relative overflow-hidden rounded-xl group transition-all duration-200
        ${darkMode
          ? "bg-gray-800 hover:shadow-lg hover:-translate-y-1"
          : "bg-white hover:shadow-lg hover:-translate-y-1"}
      `}
    >
      <div className="p-6">
        {/* Header with icon */}
        <div className="flex items-start justify-between mb-6">
          <div
            className={`
              w-14 h-14 rounded-full flex items-center justify-center
              ${darkMode ? "bg-gray-700" : color.bg || "bg-gray-100"}
              transition-colors duration-200
            `}
          >
            <IconComponent
              size={24}
              className={darkMode ? "text-gray-300" : color.text || "text-gray-700"}
              strokeWidth={1.5}
            />
          </div>

          {/* Trend indicator */}
          {change && (
            <div
              className={`
                px-3 py-1 rounded-lg text-xs font-medium
                ${
                  trend === "up"
                    ? darkMode
                      ? "bg-emerald-900 text-emerald-200"
                      : "bg-emerald-100 text-emerald-800"
                    : darkMode
                    ? "bg-red-900 text-red-200"
                    : "bg-red-100 text-red-800"
                }
              `}
            >
              {change}
            </div>
          )}
        </div>

        {/* Content area */}
        <div className="space-y-2">
          <h3
            className={`text-sm font-medium ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {title}
          </h3>

          <h2
            className={`text-3xl font-bold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {value}
          </h2>
        </div>

        {/* Time range filter */}
        {showFilter && (
          <div
            className={`mt-4 flex rounded-lg p-1 ${
              darkMode ? "bg-gray-700" : "bg-gray-100"
            }`}
          >
            {["today", "weekly", "monthly"].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`flex-1 py-1 px-2 text-xs rounded-md transition-colors ${
                  timeRange === range
                    ? darkMode
                      ? "bg-gray-600 text-white"
                      : "bg-white text-gray-900 shadow-sm"
                    : darkMode
                    ? "text-gray-300 hover:bg-gray-600"
                    : "text-gray-600 hover:bg-gray-200"
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default StatsCard;