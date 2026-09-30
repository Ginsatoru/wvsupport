import React from "react";
import { FileText, Home, Info, LayoutGrid, Mail, HelpCircle, Briefcase, Scale, File, TrendingUp, TrendingDown } from "lucide-react";

const ICONS = { home: Home, about: Info, services: LayoutGrid, contact: Mail, faq: HelpCircle, careers: Briefcase, legal: Scale, other: File };

// Top pages by views (last 30 days), with a bar relative to the busiest page
const PopularContent = ({ pages = [] }) => {
  const max = Math.max(...pages.map((p) => p.views), 1);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex flex-col">
      <h2 className="flex items-center gap-2 text-base font-semibold text-black dark:text-white mb-3">
        <FileText className="w-5 h-5 text-[#0f8abe]" />
        Popular Content
      </h2>

      {pages.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">No page views in the last 30 days</p>
      ) : (
        <table className="w-full">
          <thead>
            <tr className="text-xs text-gray-500 dark:text-gray-400">
              <th className="text-left font-medium pb-2">Title</th>
              <th className="text-left font-medium pb-2">Views</th>
              <th className="text-right font-medium pb-2">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {pages.map((page) => {
              const Icon = ICONS[page.type] || File;
              const up = page.change >= 0;
              const Trend = up ? TrendingUp : TrendingDown;
              return (
                <tr key={page.path}>
                  <td className="py-1.5 pr-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-black dark:text-white flex-shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm text-black dark:text-white truncate">{page.name}</span>
                    </div>
                  </td>
                  <td className="py-1.5 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-black dark:text-white w-10">{page.views.toLocaleString()}</span>
                      <div className="flex-1 h-1.5 rounded-full bg-gray-100 dark:bg-gray-700 min-w-[40px]">
                        <div className="h-full rounded-full bg-[#0f8abe]" style={{ width: `${(page.views / max) * 100}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-1.5 text-right">
                    <span className={`inline-flex items-center gap-1 text-xs font-semibold ${up ? "text-green-500" : "text-red-500"}`}>
                      <Trend className="w-3.5 h-3.5" />
                      {up ? "+" : ""}
                      {page.change}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PopularContent;