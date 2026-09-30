import React, { useEffect, useState } from "react";
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { Loader2, BarChart3 } from "lucide-react";

const TABS = ["Day", "Week", "Month", "Year"];
const BRAND = "#0f8abe";

/**
 * Traffic Overview — real page views per period, as a filled area chart.
 * Day = today in 4-hour blocks, Week = last 7 days, Month = last 7 months, Year = last 7 years.
 */
const TotalViewsChart = ({ darkMode = false }) => {
  const [activeTab, setActiveTab] = useState("Day");
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

  const axisColor = darkMode ? "#9ca3af" : "#6b7280";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex-1 flex flex-col">
      {/* Header: title + period tabs */}
      <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
        <h2 className="flex items-center gap-2 text-base font-semibold text-black dark:text-white">
          <BarChart3 className="w-5 h-5" style={{ color: BRAND }} />
          Traffic Overview
        </h2>
        <div className="flex p-1 rounded-full bg-gray-100 dark:bg-gray-700/60">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeTab === tab ? "text-white" : "text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white"
              }`}
              style={activeTab === tab ? { background: BRAND } : undefined}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Chart — absolute inner box gives it a real pixel height inside the flex layout */}
      <div className="relative flex-1 min-h-[210px]">
        <div className="absolute inset-0">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart key={activeTab} data={points} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="trafficFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={BRAND} stopOpacity={0.45} />
                    <stop offset="100%" stopColor={BRAND} stopOpacity={0.03} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke={darkMode ? "#374151" : "#e5e7eb"} strokeDasharray="4 4" />
                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: axisColor }}
                  dy={8}
                  interval="preserveStartEnd"
                />
                <YAxis
                  allowDecimals={false}
                  width={34}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: axisColor }}
                />
                <Tooltip
                  cursor={{ stroke: BRAND, strokeOpacity: 0.3 }}
                  formatter={(v) => [`${v.toLocaleString()} views`, ""]}
                  labelFormatter={(label) => label}
                  contentStyle={{
                    background: darkMode ? "#111827" : "#ffffff",
                    border: "none",
                    borderRadius: 8,
                    fontSize: 12,
                    color: darkMode ? "#ffffff" : "#000000",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={BRAND}
                  strokeWidth={2.5}
                  fill="url(#trafficFill)"
                  dot={{ r: 3.5, fill: BRAND, stroke: BRAND }}
                  activeDot={{ r: 5, fill: BRAND, stroke: darkMode ? "#1f2937" : "#ffffff", strokeWidth: 2 }}
                  isAnimationActive
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default TotalViewsChart;