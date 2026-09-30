import React from "react";
import { useNavigate } from "react-router-dom";
import { Zap, FileText, Mail, UserPlus, Settings, ChevronRight } from "lucide-react";

const ACTIONS = [
  { label: "Create Content", icon: FileText, route: "/admin-panel/frontend", primary: true },
  { label: "View Inbox", icon: Mail, route: "/admin-panel/inbox" },
  { label: "Add User", icon: UserPlus, route: "/admin-panel/users" },
  { label: "Site Settings", icon: Settings, route: "/admin-panel/settings" },
];

// Shortcuts to the most-used admin pages
const QuickActions = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex flex-col">
      <h2 className="flex items-center gap-2 text-base font-semibold text-black dark:text-white mb-3">
        <Zap className="w-5 h-5 text-[#0f8abe]" />
        Quick Actions
      </h2>
      <div className="grid grid-cols-2 gap-3 flex-1">
        {ACTIONS.map(({ label, icon: Icon, route, primary }) => (
          <button
            key={label}
            type="button"
            onClick={() => navigate(route)}
            className={`group flex flex-col justify-between gap-3 p-3 rounded-xl text-left transition-colors min-h-[76px] ${
              primary
                ? "bg-[#0f8abe] hover:bg-[#0d7aaa] text-white"
                : "border border-gray-200 dark:border-gray-700 text-black dark:text-white hover:border-[#0f8abe]"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="flex items-center justify-between gap-2 text-sm font-semibold">
              {label}
              <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;