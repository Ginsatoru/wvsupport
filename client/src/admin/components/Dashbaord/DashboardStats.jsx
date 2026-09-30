import React from "react";
import { Eye, Users, Mail, UserPlus, FileText, UserCheck, TrendingUp, TrendingDown } from "lucide-react";

const ICONS = { views: Eye, visitors: Users, messages: Mail, subscribers: UserPlus, content: FileText, users: UserCheck };

// Small trend line from 7 daily values
const Sparkline = ({ values = [] }) => {
  const width = 70;
  const height = 22;
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const range = max - min || 1;
  const points = values
    .map((v, i) => `${(i / Math.max(values.length - 1, 1)) * width},${height - 2 - ((v - min) / range) * (height - 4)}`)
    .join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="flex-shrink-0">
      <polyline points={points} fill="none" stroke="#0f8abe" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const StatCard = ({ stat }) => {
  const Icon = ICONS[stat.key] || Eye;
  const up = stat.change >= 0;
  const Trend = up ? TrendingUp : TrendingDown;
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl px-4 py-3 flex flex-col gap-1.5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-[#0f8abe] text-white flex-shrink-0">
          <Icon className="w-3.5 h-3.5" />
        </div>
        <span className="text-[13px] font-medium text-black dark:text-white truncate">{stat.label}</span>
      </div>
      <div className="text-2xl font-bold leading-tight text-black dark:text-white">{stat.value.toLocaleString()}</div>
      <div className="flex items-end justify-between gap-2">
        <span className={`inline-flex items-center gap-1 text-xs font-semibold ${up ? "text-green-500" : "text-red-500"}`}>
          <Trend className="w-3.5 h-3.5" />
          {up ? "+" : ""}
          {stat.change}%
        </span>
        <Sparkline values={stat.series} />
      </div>
    </div>
  );
};

// 6 cards: this week vs last week, with a 7-day trend line
const DashboardStats = ({ stats = [] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6 gap-4">
    {stats.map((stat) => (
      <StatCard key={stat.key} stat={stat} />
    ))}
  </div>
);

export default DashboardStats;