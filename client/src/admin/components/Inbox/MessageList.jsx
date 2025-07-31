import React from "react";
import { FiInbox, FiMail, FiUser, FiTrash2 } from "react-icons/fi";

const MessageList = ({
  threads = [],
  selectedThread,
  setSelectedThread,
  formatDate,
  getLastMessagePreview,
  onStatusAction,
  onDelete,
  actionText,
  actionIcon,
}) => {
  // Safe access to threads array
  const safeThreads = Array.isArray(threads) ? threads : [];

  return (
    <div className="w-96 bg-gray-200 dark:bg-gray-900 border-r-2 border-gray-300 dark:border-gray-800 flex flex-col">
      {/* Messages List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-gray-200 dark:scrollbar-track-gray-800">
        {safeThreads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500 dark:text-gray-400">
            <FiInbox className="h-12 w-12 mb-4 text-gray-300 dark:text-gray-400" />
            <p className="text-lg font-medium dark:text-gray-300">
              No conversations found
            </p>
            <p className="text-sm dark:text-gray-400">
              Try adjusting your search criteria
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-300 dark:divide-gray-700">
            {safeThreads.map((thread) => {
              // Safe access to thread properties
              const threadMessages = Array.isArray(thread.messages) ? thread.messages : [];
              const isSelected = selectedThread?.sessionId === thread.sessionId;
              const lastMessage = threadMessages[threadMessages.length - 1];
              const unreadCount = threadMessages.filter(
                msg => msg?.sender === 'user' && msg?.status !== 'read'
              ).length;

              return (
                <div
                  key={thread.sessionId || Math.random().toString(36).substr(2, 9)}
                  className={`p-5 cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-sky-50 dark:bg-blue-900/20 dark:border-sky-400"
                      : "border-transparent hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  }`}
                  onClick={() => setSelectedThread(thread)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiUser className="h-4 w-4 text-sky-500 dark:text-sky-300" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-semibold text-sky-600 dark:text-sky-300 truncate">
                            {thread.user?.name || "Anonymous"}
                          </p>
                          {thread.status === "open" && (
                            <FiMail className="h-3 w-3 text-sky-500 dark:text-sky-400 flex-shrink-0" />
                          )}
                          {unreadCount > 0 && (
                            <span className="inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {thread.user?.email || "No email"}
                        </p>
                        <p className="text-sm text-gray-950 dark:text-gray-300 mt-1 line-clamp-2">
                          {lastMessage ? getLastMessagePreview(thread) : "No messages"}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0 ml-2">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {thread.updatedAt ? formatDate(thread.updatedAt) : "No date"}
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onStatusAction(thread.sessionId);
                          }}
                          className="text-xs p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                          title={actionText}
                        >
                          {actionIcon}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDelete(thread);
                          }}
                          className="text-xs p-1 rounded text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                          title="Delete"
                        >
                          <FiTrash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageList;