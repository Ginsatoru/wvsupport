import React from "react";
import { FiCheck, FiMessageSquare, FiMail, FiBellOff, FiUserPlus } from "react-icons/fi";
import { formatDate } from "../Inbox/inboxUtils";

const TYPE_ICON = {
  chat: { Icon: FiMessageSquare, color: "text-black dark:text-white", label: "Live chat" },
  email: { Icon: FiMail, color: "text-black dark:text-white", label: "Email" },
  subscriber: { Icon: FiUserPlus, color: "text-black dark:text-white", label: "New subscriber" },
};

// Unread live chats, contact emails and new subscribers. Click opens the related page.
const NotificationsDropdown = ({
  darkMode,
  notifications = [],
  showNotifications,
  onOpen = () => {},
  onMarkRead = () => {},
  onMarkAllRead = () => {},
}) => {
  if (!showNotifications) return null;

  return (
    <div
      className={`absolute right-0 mt-2 w-[calc(100vw-2rem)] max-w-[22rem] sm:w-[22rem] rounded-xl shadow-2xl border ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
      } z-50 animate-in slide-in-from-top-2 duration-200`}
    >
      {/* Header */}
      <div
        className={`px-4 py-3 border-b flex items-center justify-between gap-3 ${
          darkMode ? "border-gray-700" : "border-gray-100"
        }`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <h3 className={`text-base font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
            Notifications
          </h3>
          {notifications.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-black text-white text-xs font-semibold">
              {notifications.length}
            </span>
          )}
        </div>
        {notifications.length > 0 && (
          <button
            onClick={onMarkAllRead}
            className={`flex-shrink-0 whitespace-nowrap text-xs font-medium px-2.5 py-1 rounded-full ${
              darkMode ? "text-sky-400 hover:bg-gray-700" : "text-sky-500 hover:bg-gray-100"
            } transition-colors`}
          >
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div
        className={`max-h-96 overflow-y-auto rounded-b-xl ${
          darkMode
            ? "scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
            : "scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        }`}
      >
        {notifications.length === 0 ? (
          <div className="py-10 flex flex-col items-center text-center">
            <FiBellOff className={`h-8 w-8 mb-2 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>You're all caught up</p>
          </div>
        ) : (
          notifications.map((item) => (
            <div
              key={item.uid}
              onClick={() => onOpen(item)}
              className={`group px-4 py-2.5 border-b ${
                darkMode ? "border-gray-700 hover:bg-gray-700" : "border-gray-100 hover:bg-gray-50"
              } transition-colors duration-150 cursor-pointer`}
            >
              <div className="flex items-start gap-2.5">
                {/* Type icon */}
                {(() => {
                  const { Icon, color, label } = TYPE_ICON[item.type] || TYPE_ICON.chat;
                  return (
                    <div className="flex-shrink-0 mt-0.5" title={label}>
                      <Icon className={`h-4 w-4 ${color}`} />
                    </div>
                  );
                })()}

                {/* Name + time, then subject / preview */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-sm font-semibold truncate ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {item.name}
                    </h4>
                    <span className={`text-[11px] flex-shrink-0 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                      {formatDate(item.updatedAt)}
                    </span>
                  </div>
                  {item.type === "email" && (
                    <p className={`text-[13px] font-medium truncate ${darkMode ? "text-gray-200" : "text-gray-800"}`}>
                      {item.subject}
                    </p>
                  )}
                  <p className={`text-[13px] truncate ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                    {item.preview || "New message"}
                  </p>
                </div>

                {/* Unread dot; mark-read check shows on hover */}
                <div className="flex-shrink-0 flex flex-col items-center gap-1 pt-1.5">
                  <span className="h-2 w-2 rounded-full bg-sky-500" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkRead(item);
                    }}
                    title="Mark as read"
                    className={`p-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                      darkMode ? "hover:bg-gray-600 text-gray-300" : "hover:bg-gray-200 text-gray-600"
                    }`}
                  >
                    <FiCheck size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default NotificationsDropdown;