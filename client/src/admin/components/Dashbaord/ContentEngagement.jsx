import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

// Modern gradient colors for bars
const barColors = [
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#3B82F6", // Blue
];

// Custom tooltip component for content metrics
const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (active && payload && payload.length) {
    return (
      <div
        className={`px-3 py-2 sm:px-4 sm:py-3 rounded-lg shadow-lg border backdrop-blur-sm max-w-xs ${
          darkMode
            ? "bg-gray-800/90 border-gray-700 text-white"
            : "bg-white/90 border-gray-200 text-gray-900"
        }`}
      >
        <p className="font-medium text-xs sm:text-sm mb-1 break-words">{label}</p>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} className="flex items-center mt-1">
            <div
              className="w-2 h-2 sm:w-3 sm:h-3 rounded-full mr-2 flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs sm:text-sm font-medium mr-2 truncate">{entry.name}:</span>
            <span className="text-xs sm:text-sm font-bold flex-shrink-0">
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

// Updated component for Content Engagement
const ContentEngagement = ({ data = {}, darkMode = false }) => {
  // Format data for the chart from the analytics API response
  const chartData = [
    {
      name: "Clicks",
      value: data.clicks || 0,
      color: "#8B5CF6" // Purple
    },
    {
      name: "Scroll Depth",
      value: data.scrollDepth || 0,
      color: "#06B6D4" // Cyan
    },
    {
      name: "Time Spent",
      value: data.timeSpent || 0,
      color: "#10B981" // Emerald
    }
  ];

  // Calculate peak value
  const peakValue = Math.max(...chartData.map(item => item.value));

  return (
    <div
      className={`relative p-4 sm:p-6 lg:p-8 xl:p-11 rounded-xl sm:rounded-2xl transition-all duration-300 hover:shadow-xl w-full max-w-full overflow-hidden ${
        darkMode
          ? "bg-gradient-to-br from-gray-850 to-gray-900 shadow-2xl border border-gray-700"
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
            Engagement Metrics
          </h2>
          <p
            className={`text-xs sm:text-sm leading-relaxed ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Average user engagement per session
          </p>
        </div>
        
        {/* Summary */}
        <div className="flex flex-col sm:items-start lg:items-end flex-shrink-0">
          <span
            className={`text-xs uppercase tracking-wide font-medium mb-1 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Peak Metric
          </span>
          <span className="text-xl sm:text-2xl font-bold text-emerald-500">
            {peakValue.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Chart container */}
      <div className="relative w-full">
        <ResponsiveContainer 
          width="100%" 
          height={250} 
          className="min-h-[200px] sm:min-h-[250px] lg:min-h-[300px]"
        >
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 10,
            }}
            barCategoryGap="10%"
            barGap={2}
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
              fontSize={10}
              fontWeight={500}
              axisLine={false}
              tickLine={false}
              width={60}
              tick={{ fontSize: 10 }}
            />
            
            <XAxis
              type="number"
              stroke={darkMode ? "#9CA3AF" : "#6B7280"}
              fontSize={10}
              fontWeight={500}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 10 }}
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
              radius={[0, 6, 6, 0]}
              className="drop-shadow-sm hover:drop-shadow-md transition-all duration-200"
            >
              {chartData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={`url(#${entry.name.toLowerCase().replace(' ', '')}Gradient)`}
                  stroke={entry.color}
                  strokeWidth={1}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        
        {/* Subtle grid overlay effect */}
        <div
          className={`absolute inset-0 pointer-events-none rounded-lg sm:rounded-xl ${
            darkMode
              ? "bg-gradient-to-t from-gray-900/20 to-transparent"
              : "bg-gradient-to-t from-gray-50/30 to-transparent"
          }`}
        />
      </div>
      
      {/* Bottom info bar */}
      <div
        className={`mt-3 sm:mt-4 pt-3 sm:pt-4 border-t flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs ${
          darkMode
            ? "border-gray-700 text-gray-400"
            : "border-gray-200 text-gray-500"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-purple-500 flex-shrink-0"></div>
          <span className="truncate">Clicks - Average per session</span>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-cyan-500 flex-shrink-0"></div>
          <span className="truncate">Scroll Depth - Percentage of page scrolled</span>
        </div>
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-emerald-500 flex-shrink-0"></div>
          <span className="truncate">Time Spent - Seconds on page</span>
        </div>
      </div>
    </div>
  );
};

export default ContentEngagement;