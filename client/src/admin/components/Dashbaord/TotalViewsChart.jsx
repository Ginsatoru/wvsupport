import React, { useEffect, useState } from "react";
import { LineChart, Line, ResponsiveContainer, Tooltip, YAxis, CartesianGrid } from "recharts";
import { Loader2 } from "lucide-react";

const TABS = ["Day", "Week", "Month", "Year"];

/**
 * TotalViewsChart — "Saved This Month" style card; fills the height of its container.
 * Headline = all-time views (passed in). The line shows real page views per period:
 * Day = today in 4-hour blocks, Week = last 7 days, Month = last 7 months, Year = last 7 years.
 */
const TotalViewsChart = ({ value, darkMode = false }) => {
  const [activeTab, setActiveTab] = useState("Month");
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`/api/analytics/trends?range=${activeTab}&tzOffset=${new Date().getTimezoneOffset()}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
    })
      .then((res) => (res.ok ? res.json() : { points: [] }))
      .then((data) => !cancelled && setPoints(data.points || []))
      .catch(() => !cancelled && setPoints([]))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

  // The newest point is the current period
  const activeLabel = points[points.length - 1]?.label;
  const muted = darkMode ? "text-gray-500" : "text-gray-400";

  return (
    <div className={`rounded-3xl p-6 flex-1 flex flex-col ${darkMode ? "bg-gray-800" : "bg-gray-50"}`}>
      {/* Header */}
      <p className={`text-sm mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Total Views</p>
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
              activeTab === tab ? `font-bold ${darkMode ? "text-white" : "text-black"}` : muted
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Chart */}
      {/* Absolute inner box gives the chart a real pixel height inside the flex layout */}
      <div className="relative flex-1 min-h-[320px]">
        <div className="absolute inset-0">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className={`w-5 h-5 animate-spin ${muted}`} />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart key={activeTab} data={points} margin={{ top: 10, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={darkMode ? "#374151" : "#e5e7eb"} strokeDasharray="3 3" />
              <YAxis
                allowDecimals={false}
                width={32}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: darkMode ? "#6b7280" : "#9ca3af" }}
              />
              <Tooltip
                cursor={false}
                formatter={(v) => [`${v.toLocaleString()} views`, ""]}
                labelFormatter={(_, payload) => payload?.[0]?.payload?.label || ""}
                contentStyle={{
                  background: darkMode ? "#111827" : "#ffffff",
                  border: "none",
                  borderRadius: 8,
                  fontSize: 12,
                  color: darkMode ? "#ffffff" : "#000000",
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke={darkMode ? "#ffffff" : "#111827"}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive
              />
            </LineChart>
          </ResponsiveContainer>
        )}
        </div>
      </div>

      {/* Period labels — current one highlighted */}
      <div className="flex items-center justify-between mt-2 pl-8">
        {points.map((point) => (
          <span
            key={point.label}
            className={`text-[11px] ${
              point.label === activeLabel
                ? `rounded-full px-2 py-1 font-semibold ${darkMode ? "bg-white text-black" : "bg-black text-white"}`
                : muted
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