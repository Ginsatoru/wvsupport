import React from "react";
import { useNavigate } from "react-router-dom";
import { Mail, ArrowRight } from "lucide-react";

// "Sarah Johnson" → "SJ"
const initials = (name = "") =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("") || "?";

// Today → "12:24 PM", otherwise → "29 Sep"
const formatTime = (time) => {
  const date = new Date(time);
  return date.toDateString() === new Date().toDateString()
    ? date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : date.toLocaleDateString([], { day: "numeric", month: "short" });
};

// 3 newest unread chats / emails; each opens its own conversation (the inbox marks it read)
const InboxPreview = ({ messages = [] }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-3">
        <h2 className="flex items-center gap-2 text-base font-semibold text-black dark:text-white">
          <Mail className="w-5 h-5 text-[#0f8abe]" />
          Inbox Preview
        </h2>
        <button
          type="button"
          onClick={() => navigate("/admin-panel/inbox")}
          className="inline-flex items-center gap-1 text-sm font-medium text-[#0f8abe] hover:opacity-70"
        >
          View all
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {messages.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 py-6 text-center">No unread messages</p>
      ) : (
        <ul className="divide-y divide-gray-100 dark:divide-gray-700">
          {messages.map((m) => (
            <li key={`${m.type}-${m.id}`}>
              <button
                type="button"
                onClick={() => navigate("/admin-panel/inbox", { state: { openUid: `${m.type}-${m.id}` } })}
                className="w-full flex items-start gap-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700/40 rounded-xl px-2 -mx-2 transition-colors"
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm bg-gray-100 dark:bg-gray-700 text-black dark:text-white font-semibold flex-shrink-0">
                  {initials(m.name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-black dark:text-white truncate">{m.name}</p>
                  <p className="text-sm text-black dark:text-gray-200 truncate">{m.subject}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{m.snippet}</p>
                </div>
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(m.time)}</span>
                  <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#0f8abe] text-white text-[11px] font-semibold flex items-center justify-center">
                    {m.unread}
                  </span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InboxPreview;