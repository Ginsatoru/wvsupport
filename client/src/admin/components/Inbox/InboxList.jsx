import React, { useState, useEffect } from "react";
import {
  Mail,
  Search,
  Trash2,
  RefreshCw,
  Archive,
  RotateCcw,
  Loader2,
} from "lucide-react";
import { ModernAlert } from "../Modals/Alert";
import InboxListItem from "./InboxListItem";

// ── Left column: header, view toggle, search, bulk actions, and rows ──
const InboxList = ({
  alert,
  setAlert,
  view,
  setView,
  filtered,
  fetchAll,
  searchTerm,
  setSearchTerm,
  selectedRows,
  handleBulkToggleStatus,
  handleBulkDelete,
  loading,
  error,
  selectedThread,
  handleRowClick,
  handleSelectRow,
  handleMarkAsRead,
  toggleStatus,
  requestDelete,
}) => {
  const [hoveredIconUid, setHoveredIconUid] = useState(null);
  const [, setTick] = useState(0);

  // Re-render every minute so the "5m ago" labels stay current
  useEffect(() => {
    const timer = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="w-[420px] flex-shrink-0 flex flex-col bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {alert.show && (
        <div className="p-3">
          <ModernAlert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
          />
        </div>
      )}

      {/* Header: title + view toggle + search */}
      <div className="border-b border-gray-200 dark:border-gray-700 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="inbox-title text-lg font-bold">
              {view === "open" ? "All Open" : "Closed"}
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {filtered.length} {filtered.length === 1 ? "conversation" : "conversations"}
            </p>
          </div>
          <button
            onClick={fetchAll}
            className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("open")}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors flex-shrink-0 ${
              view === "open"
                ? "bg-[#0f8abe] text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            All Open
          </button>
          <button
            onClick={() => setView("closed")}
            className={`px-3 py-1.5 text-sm font-medium rounded-full transition-colors flex-shrink-0 ${
              view === "closed"
                ? "bg-[#0f8abe] text-white"
                : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
          >
            Closed
          </button>

          <div className="flex-1" />

          <div className="relative flex-shrink-0" style={{ width: "160px" }}>
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="inbox-search-input w-full pl-8 pr-2.5 py-1.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-full text-xs placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0f8abe] focus:border-transparent"
            />
          </div>
        </div>

        {selectedRows.size > 0 && (
          <div className="flex items-center gap-2 bg-sky-50 dark:bg-sky-900/20 rounded-xl px-3 py-2 border border-sky-200 dark:border-sky-800">
            <span className="text-sm text-sky-700 dark:text-sky-300 font-medium flex-1">
              {selectedRows.size} selected
            </span>
            <button
              onClick={handleBulkToggleStatus}
              className="p-1.5 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/30 rounded-xl transition-colors"
              title={view === "open" ? "Close selected" : "Reopen selected"}
            >
              {view === "open" ? (
                <Archive className="w-4 h-4" />
              ) : (
                <RotateCcw className="w-4 h-4" />
              )}
            </button>
            <button
              onClick={handleBulkDelete}
              className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-colors"
              title="Delete selected"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-[#0f8abe]" />
          </div>
        ) : error ? (
          <div className="h-full flex items-center justify-center text-center p-6">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <Mail className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {searchTerm ? "No matching conversations" : `No ${view} conversations`}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-gray-700">
            {filtered.map((item) => (
              <InboxListItem
                key={item.uid}
                item={item}
                selectedThread={selectedThread}
                selectedRows={selectedRows}
                hoveredIconUid={hoveredIconUid}
                setHoveredIconUid={setHoveredIconUid}
                handleRowClick={handleRowClick}
                handleSelectRow={handleSelectRow}
                handleMarkAsRead={handleMarkAsRead}
                toggleStatus={toggleStatus}
                requestDelete={requestDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InboxList;