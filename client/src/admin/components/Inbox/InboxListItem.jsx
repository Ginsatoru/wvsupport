import React from "react";
import {
  Mail,
  MessageCircle,
  Trash2,
  CheckCircle,
  Archive,
  RotateCcw,
} from "lucide-react";
import { formatDate } from "./inboxUtils";

// ── Single row in the inbox list ──
const InboxListItem = ({
  item,
  selectedThread,
  selectedRows,
  hoveredIconUid,
  setHoveredIconUid,
  handleRowClick,
  handleSelectRow,
  handleMarkAsRead,
  toggleStatus,
  requestDelete,
}) => {
  const isSelected =
    (item.type === "chat" &&
      selectedThread?.type === "chat" &&
      selectedThread?.sessionId === item.id) ||
    (item.type === "email" &&
      selectedThread?.type === "email" &&
      selectedThread?._id === item.id);
  return (
    <div
      onClick={() => handleRowClick(item)}
      className={`group px-4 py-3 cursor-pointer transition-colors ${
        isSelected
          ? "bg-white dark:bg-gray-800"
          : !item.read
          ? "bg-sky-50/40 dark:bg-sky-900/10 hover:bg-sky-50 dark:hover:bg-sky-900/20"
          : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
      }`}
    >
      <div className="flex items-start gap-2.5">
        <div
          className="flex-shrink-0 mt-0.5"
          onMouseEnter={() => setHoveredIconUid(item.uid)}
          onMouseLeave={() => setHoveredIconUid(null)}
          onClick={(e) => {
            if (
              hoveredIconUid === item.uid ||
              selectedRows.size > 0
            ) {
              e.stopPropagation();
            }
          }}
        >
          {hoveredIconUid === item.uid ||
          selectedRows.size > 0 ? (
            <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-700">
              <input
                type="checkbox"
                checked={selectedRows.has(item.uid)}
                onClick={(e) => e.stopPropagation()}
                onChange={(e) => handleSelectRow(item.uid, e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 dark:border-gray-600 text-sky-600 focus:ring-sky-500 cursor-pointer"
              />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#000000" }}>
              {item.type === "chat" ? (
                <MessageCircle className="w-4 h-4 text-white" />
              ) : (
                <Mail className="w-4 h-4 text-white" />
              )}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 min-w-0">
            <span
              className="inbox-name text-[15px] font-medium truncate"
            >
              {item.name}
            </span>
          </div>
          <p className="inbox-subject text-sm truncate">
            {item.type === "email" ? item.subject : item.preview || "No messages yet"}
          </p>
          {item.type === "email" && (
            <p className="inbox-preview text-sm truncate mt-0.5">
              {item.preview}
            </p>
          )}
        </div>

        {/* Age sits at the far right; swapped for the actions on hover */}
        <span className="inbox-date text-xs flex-shrink-0 group-hover:hidden">
          {formatDate(item.updatedAt)}
        </span>

        <div className="hidden group-hover:flex items-center gap-0.5 flex-shrink-0">
          {item.type === "email" && !item.read && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMarkAsRead(item);
              }}
              className="p-1 text-gray-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg"
              title="Mark as read"
            >
              <CheckCircle className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleStatus(item);
            }}
            className="p-1 text-gray-400 hover:text-sky-600 hover:bg-sky-50 dark:hover:bg-sky-900/20 rounded-lg"
            title={item.status === "open" ? "Close" : "Reopen"}
          >
            {item.status === "open" ? (
              <Archive className="w-3.5 h-3.5" />
            ) : (
              <RotateCcw className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              requestDelete(item);
            }}
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InboxListItem;