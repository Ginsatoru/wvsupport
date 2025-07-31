import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
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
        <p className="font-semibold text-sm mb-1">{label}</p>
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

const VisitorChart = ({ data = [], darkMode = false }) => {
  // Format data for the chart
  const chartData = data.map((item) => ({
    name: item.date,
    visits: item.count,
  }));

  // Calculate stats
  const totalVisitors = chartData.reduce((sum, day) => sum + day.visits, 0);
  const avgVisitors = Math.round(totalVisitors / chartData.length) || 0;
  const maxDay =
    chartData.length > 0
      ? chartData.reduce(
          (max, day) => (day.visits > max.visits ? day : max),
          chartData[0]
        )
      : { name: "N/A", visits: 0 };

  // If no data, show a placeholder
  if (chartData.length === 0) {
    return (
      <div
        className={`
        relative p-6 rounded-2xl transition-all duration-300 border
        ${
          darkMode
            ? "bg-gradient-to-br from-gray-900 to-gray-900 border-gray-700"
            : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
        }
      `}
        style={{
          boxShadow: darkMode
            ? "0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
            : "0 10px 30px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
        }}
      >
        <div className="flex flex-col items-center justify-center h-80">
          <p
            className={`text-lg ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            No visitor data available
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`
    relative p-11 rounded-2xl transition-all duration-300 border
    ${
      darkMode
        ? "bg-gradient-to-br from-gray-900 to-gray-900 border-gray-700"
        : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
    }
  `}
      style={{
        boxShadow: darkMode
          ? "0 10px 30px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.05)"
          : "0 10px 30px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
        ...(window.innerWidth >= 1480 &&
          window.innerWidth < 1520 && {
            height: "640px",
          }),
      }}
    >
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
        <div>
          <h2
            className={`text-xl sm:text-2xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Visit Trends
          </h2>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Tracking your site's visit patterns
          </p>
        </div>

        {/* Stats Cards */}
        <div className="flex flex-wrap gap-3 sm:gap-4">
          <div
            className={`px-3 py-2 rounded-lg backdrop-blur-sm border ${
              darkMode
                ? "bg-blue-900/30 border-blue-700/50 text-blue-300"
                : "bg-blue-50 border-blue-200 text-blue-700"
            }`}
          >
            <p className="text-xs font-medium opacity-80">Total</p>
            <p className="text-sm font-bold">
              {totalVisitors.toLocaleString()}
            </p>
          </div>

          <div
            className={`px-3 py-2 rounded-lg backdrop-blur-sm border ${
              darkMode
                ? "bg-green-900/30 border-green-700/50 text-green-300"
                : "bg-green-50 border-green-200 text-green-700"
            }`}
          >
            <p className="text-xs font-medium opacity-80">Average</p>
            <p className="text-sm font-bold">{avgVisitors.toLocaleString()}</p>
          </div>

          <div
            className={`px-3 py-2 rounded-lg backdrop-blur-sm border ${
              darkMode
                ? "bg-purple-900/30 border-purple-700/50 text-purple-300"
                : "bg-purple-50 border-purple-200 text-purple-700"
            }`}
          >
            <p className="text-xs font-medium opacity-80">Peak</p>
            <p className="text-sm font-bold">{maxDay.name}</p>
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

        {/* Grid overlay for better visual separation */}
        <div
          className={`absolute inset-0 pointer-events-none ${
            darkMode ? "opacity-5" : "opacity-10"
          }`}
          style={{
            backgroundImage: `linear-gradient(${
              darkMode ? "#fff" : "#000"
            } 1px, transparent 1px),
                           linear-gradient(90deg, ${
                             darkMode ? "#fff" : "#000"
                           } 1px, transparent 1px)`,
            backgroundSize: "50px 30px",
          }}
        />
      </div>

      {/* Bottom info */}
      <div
        className={`mt-4 pt-4 border-t text-center ${
          darkMode
            ? "border-gray-700 text-gray-400"
            : "border-gray-200 text-gray-500"
        }`}
      >
        <p className="text-xs sm:text-sm">
          Data refreshed every hour • Last update:{" "}
          {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default VisitorChart;
