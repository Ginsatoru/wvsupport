import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Clock, MessageSquare, Mail, UserPlus, FileText, User, Settings, ArrowRight, Loader2 } from "lucide-react";

const ICONS = { chat: MessageSquare, email: Mail, subscriber: UserPlus, content: FileText, user: User, settings: Settings };

// Today → "12:42 PM", otherwise → "29 Sep"
const formatTime = (time) => {
  const date = new Date(time);
  const isToday = date.toDateString() === new Date().toDateString();
  return isToday
    ? date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : date.toLocaleDateString([], { day: "numeric", month: "short" });
};

// Latest events (messages, subscribers, content saves, users, settings); "View all" loads a longer list
const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "";

const RecentActivity = ({ items = [], onLoadMore }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const [moreItems, setMoreItems] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [opened, setOpened] = useState(() => new Set()); // items clicked this visit (dot hidden straight away)

  const keyOf = (item) => `${item.type}-${item.id || item.time}`;

  // Open the item; messages open their own conversation (the inbox marks it read), subscribers get marked seen
  const openItem = (item) => {
    setOpened((prev) => new Set(prev).add(keyOf(item)));
    if (item.type === "chat" || item.type === "email") {
      return navigate(item.link, { state: { openUid: `${item.type}-${item.id}` } });
    }
    if (item.type === "subscriber" && item.unread) {
      fetch(`${API_BASE_URL}/api/newsletter/seen`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        body: JSON.stringify({ ids: [item.id] }),
      }).catch(() => {});
    }
    navigate(item.link);
  };

  const toggleAll = async () => {
    if (expanded) return setExpanded(false);
    setExpanded(true);
    if (!moreItems && onLoadMore) {
      setLoadingMore(true);
      setMoreItems(await onLoadMore());
      setLoadingMore(false);
    }
  };

  const list = expanded && moreItems ? moreItems : items;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-2 text-base font-semibold text-black dark:text-white">
          <Clock className="w-5 h-5 text-[#0f8abe]" />
          Recent Activity
        </h2>
        <button type="button" onClick={toggleAll} className="inline-flex items-center gap-1 text-sm font-medium text-[#0f8abe] hover:opacity-70">
          {expanded ? "Show less" : "View all"}
          <ArrowRight className={`w-3.5 h-3.5 transition-transform ${expanded ? "-rotate-90" : ""}`} />
        </button>
      </div>

      {loadingMore ? (
        <div className="flex-1 flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-[#0f8abe]" />
        </div>
      ) : list.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">No activity yet</p>
      ) : (
        <ul className={`divide-y divide-gray-100 dark:divide-gray-700 ${expanded ? "max-h-[28rem] overflow-y-auto pr-1" : ""}`}>
          {list.map((item, i) => {
            const Icon = ICONS[item.type] || Clock;
            return (
              <li key={`${item.type}-${item.time}-${i}`}>
                <button
                  type="button"
                  onClick={() => openItem(item)}
                  className="w-full flex items-start gap-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700/40 rounded-xl px-2 -mx-2 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-black dark:text-white flex-shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-black dark:text-white">{item.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.detail}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(item.time)}</span>
                    <span
                      className={`w-2 h-2 rounded-full ${
                        item.unread && !opened.has(keyOf(item)) ? "bg-[#0f8abe]" : "bg-transparent"
                      }`}
                    />
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default RecentActivity;