import React, { useState } from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { MoreVertical } from "lucide-react";

// Placeholder trend datasets per range — swap for real historical data later.
const MOCK_TRENDS = {
  Day: {
    points: [
      { label: "12am", value: 20 }, { label: "4am", value: 12 }, { label: "8am", value: 45 },
      { label: "12pm", value: 68 }, { label: "4pm", value: 90 }, { label: "8pm", value: 55 },
      { label: "11pm", value: 30 },
    ],
    activeLabel: "4pm",
  },
  Week: {
    points: [
      { label: "Mon", value: 40 }, { label: "Tue", value: 65 }, { label: "Wed", value: 50 },
      { label: "Thu", value: 72 }, { label: "Fri", value: 58 }, { label: "Sat", value: 88 },
      { label: "Sun", value: 62 },
    ],
    activeLabel: "Sat",
  },
  Month: {
    points: [
      { label: "May", value: 62 }, { label: "June", value: 88 }, { label: "July", value: 70 },
      { label: "Aug", value: 76 }, { label: "Sep", value: 60 }, { label: "Oct", value: 96 },
      { label: "Nov", value: 68 },
    ],
    activeLabel: "Oct",
  },
  Year: {
    points: [
      { label: "2020", value: 30 }, { label: "2021", value: 48 }, { label: "2022", value: 62 },
      { label: "2023", value: 55 }, { label: "2024", value: 80 }, { label: "2025", value: 96 },
      { label: "2026", value: 70 },
    ],
    activeLabel: "2025",
  },
};

const TABS = ["Day", "Week", "Month", "Year"];

/**
 * TotalViewsChart — mockup card styled after the "Saved This Month" reference.
 * The headline number is real (passed in as `value`); switching Day/Week/Month/Year
 * swaps in a different placeholder trend line until a real historical-views
 * endpoint is wired up.
 *
 * @param {Object} props
 * @param {string|number} props.value - Total views figure (real)
 * @param {boolean} [props.darkMode]
 */
const TotalViewsChart = ({ value, darkMode = false }) => {
  const [activeTab, setActiveTab] = useState("Month");
  const { points, activeLabel } = MOCK_TRENDS[activeTab];

  return (
    <div className={`rounded-3xl p-6 ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-1">
        <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Total Views
        </p>
        <MoreVertical size={16} className={darkMode ? "text-gray-500" : "text-gray-400"} />
      </div>
      <p className={`text-2xl font-extrabold mb-4 ${darkMode ? "text-white" : "text-black"}`}>
        {typeof value === "number" ? value.toLocaleString() : value || "0"}
      </p>

      {/* Tabs */}
      <div className="flex items-center gap-4 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-xs transition-colors ${
              activeTab === tab
                ? `font-bold ${darkMode ? "text-white" : "text-black"}`
                : `${darkMode ? "text-gray-500" : "text-gray-400"}`
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ height: 130 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart key={activeTab} data={points} margin={{ top: 10, right: 4, left: 4, bottom: 0 }}>
            <Line
              type="monotone"
              dataKey="value"
              stroke={darkMode ? "#ffffff" : "#111827"}
              strokeWidth={2.5}
              dot={false}
              activeDot={false}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Point labels with the active one highlighted */}
      <div className="flex items-center justify-between mt-2">
        {points.map((point) => (
          <span
            key={point.label}
            className={`text-[11px] ${
              point.label === activeLabel
                ? `rounded-full px-2 py-1 font-semibold ${
                    darkMode ? "bg-white text-black" : "bg-black text-white"
                  }`
                : darkMode
                ? "text-gray-500"
                : "text-gray-400"
            }`}
          >
            {point.label}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TotalViewsChart;