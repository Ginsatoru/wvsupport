import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Mail,
  Search,
  Trash2,
  Reply,
  Clock,
  CheckCircle,
  Circle,
  Loader2,
  Star,
  StarOff,
  X,
  ChevronDown,
  Check,
  Inbox,
  Send,
  Archive,
  Filter,
  RefreshCw,
  MoreHorizontal,
  ChevronRight,
  Settings,
  User,
  Calendar,
} from "lucide-react";
import {
  getContactMessages,
  replyToContactMessage,
  markMessageAsRead,
  deleteContactMessage,
  toggleMessageStar,
  closeMessage,
  reopenMessage,
} from "../../../../services/api";
import { ModernAlert } from "../../Modals/Alert";
import MessageItem from "./MessageItem";
import ReplyModal from "./ReplyModal";

// Skeleton Loading Components
const MessageSkeleton = () => (
  <div className="p-4 border-b border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
      </div>
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
        </div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
      </div>
    </div>
  </div>
);

const SidebarSkeleton = () => (
  <div className="p-3 space-y-2 animate-pulse">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center gap-3 px-3 py-2">
        <div className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded flex-1"></div>
        <div className="w-8 h-5 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
      </div>
    ))}
  </div>
);

// Custom Select Component
const CustomSelect = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white shadow-sm hover:border-gray-300 dark:hover:border-gray-600 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent cursor-pointer text-left flex items-center justify-between transition-all duration-200 min-w-[120px]"
      >
        <span className="truncate">{selectedOption?.label}</span>
        <ChevronDown
          className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg py-1 animate-in fade-in-0 zoom-in-95 duration-200">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                onChange({ target: { value: option.value } });
                setIsOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between transition-colors duration-150"
            >
              <span>{option.label}</span>
              {value === option.value && (
                <Check className="w-4 h-4 text-sky-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const CMSEmails = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success",
  });

  // Filters and search
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMessages, setSelectedMessages] = useState(new Set());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Status filter options
  const statusOptions = [
    { value: "all", label: "All Messages" },
    { value: "open", label: "Open" },
    { value: "closed", label: "Closed" },
  ];

  useEffect(() => {
    fetchMessages();
  }, []);

  const showAlert = (message, type = "success") => {
    setAlert({
      show: true,
      message,
      type,
    });

    setTimeout(() => {
      setAlert((prev) => ({ ...prev, show: false }));
    }, 4000);
  };

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await getContactMessages();
      const messageData = response.data?.messages || response.data || response;
      setMessages(Array.isArray(messageData) ? messageData : []);
    } catch (error) {
      console.error("Error fetching messages:", error);
      showAlert("Failed to fetch messages", "error");
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  // Get message ID consistently
  const getMessageId = (message) => message._id || message.id;

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1}d ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  // Filter messages
  const filteredMessages = useMemo(() => {
    let filtered = messages;

    if (searchTerm.trim()) {
      filtered = filtered.filter(
        (msg) =>
          msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((msg) => msg.status === statusFilter);
    }

    return filtered.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [messages, searchTerm, statusFilter]);

  // Message action handlers
  const handleMarkAsRead = async (messageId) => {
    try {
      await markMessageAsRead(messageId);
      setMessages((prev) =>
        prev.map((msg) =>
          getMessageId(msg) === messageId ? { ...msg, read: true } : msg
        )
      );
      showAlert("Message marked as read");
    } catch (error) {
      console.error("Error marking message as read:", error);
      showAlert("Failed to mark message as read", "error");
    }
  };

  const handleToggleStarred = async (messageId) => {
    try {
      const message = messages.find((msg) => getMessageId(msg) === messageId);
      const newStarred = !message.starred;

      await toggleMessageStar(messageId, newStarred);
      setMessages((prev) =>
        prev.map((msg) =>
          getMessageId(msg) === messageId
            ? { ...msg, starred: newStarred }
            : msg
        )
      );
      showAlert(newStarred ? "Message starred" : "Message unstarred");
    } catch (error) {
      console.error("Error toggling star:", error);
      showAlert("Failed to update message", "error");
    }
  };

  const handleCloseMessage = async (messageId) => {
    try {
      const response = await closeMessage(messageId);
      setMessages((prev) =>
        prev.map((msg) =>
          getMessageId(msg) === messageId
            ? {
                ...msg,
                status: "closed",
                closedAt: new Date().toISOString(),
              }
            : msg
        )
      );
      showAlert("Message closed");
    } catch (error) {
      console.error("Error closing message:", error);
      showAlert("Failed to close message", "error");
    }
  };

  const handleReopenMessage = async (messageId) => {
    try {
      const response = await reopenMessage(messageId);
      setMessages((prev) =>
        prev.map((msg) =>
          getMessageId(msg) === messageId
            ? {
                ...msg,
                status: "open",
                reopenedAt: new Date().toISOString(),
                closedAt: null,
              }
            : msg
        )
      );
      showAlert("Message reopened");
    } catch (error) {
      console.error("Error reopening message:", error);
      showAlert("Failed to reopen message", "error");
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteContactMessage(messageId);
      setMessages((prev) =>
        prev.filter((msg) => getMessageId(msg) !== messageId)
      );
      if (selectedMessage && getMessageId(selectedMessage) === messageId) {
        setSelectedMessage(null);
      }
      showAlert("Message deleted successfully");
    } catch (error) {
      console.error("Error deleting message:", error);
      showAlert("Failed to delete message", "error");
    }
  };

  const handleReply = (message) => {
    setSelectedMessage(message);
    setIsReplyModalOpen(true);
  };

  const handleSendReply = async (updatedMessage) => {
    try {
      const messageId = getMessageId(selectedMessage);

      setMessages((prev) =>
        prev.map((msg) =>
          getMessageId(msg) === messageId
            ? {
                ...msg,
                replied: true,
                replyMessage: updatedMessage.replyMessage,
                replyAttachments: updatedMessage.replyAttachments || [],
                read: true,
                lastReplyAt:
                  updatedMessage.lastReplyAt || new Date().toISOString(),
              }
            : msg
        )
      );

      setIsReplyModalOpen(false);
      setSelectedMessage(null);

      const attachmentCount = updatedMessage.replyAttachments?.length || 0;
      const attachmentText =
        attachmentCount > 0
          ? ` with ${attachmentCount} attachment${
              attachmentCount !== 1 ? "s" : ""
            }`
          : "";

      showAlert(`Reply sent successfully${attachmentText}`);
    } catch (error) {
      console.error("Error in handleSendReply:", error);
      showAlert("Failed to process reply response", "error");
    }
  };

  // Selection handlers
  const handleSelectMessage = (messageId, checked) => {
    const newSelected = new Set(selectedMessages);
    if (checked) {
      newSelected.add(messageId);
    } else {
      newSelected.delete(messageId);
    }
    setSelectedMessages(newSelected);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedMessages(
        new Set(filteredMessages.map((msg) => getMessageId(msg)))
      );
    } else {
      setSelectedMessages(new Set());
    }
  };

  const isAllSelected =
    filteredMessages.length > 0 &&
    filteredMessages.every((msg) => selectedMessages.has(getMessageId(msg)));

  const unreadCount = messages.filter((msg) => !msg.read).length;
  const starredCount = messages.filter((msg) => msg.starred).length;
  const openCount = messages.filter((msg) => msg.status === "open").length;

  return (
    <div className="flex h-[89vh] bg-gray-50 dark:bg-gray-900 rounded-xl p-6 gap-6">
      {/* Sidebar */}
      <div
        className={`${
          sidebarCollapsed ? "w-16" : "w-64"
        } bg-white dark:bg-gray-800 rounded-xl flex flex-col transition-all duration-300 shadow-lg border border-gray-200 dark:border-gray-700`}
      >
        {/* Sidebar Header */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center gap-3 ${
                sidebarCollapsed ? "justify-center" : ""
              }`}
            >
              <div className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-sky-400" />
              </div>
              {!sidebarCollapsed && (
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Email Admin
                </h1>
              )}
            </div>
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            >
              <ChevronRight
                className={`w-4 h-4 transition-transform ${
                  sidebarCollapsed ? "" : "rotate-180"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3">
          {loading ? (
            <SidebarSkeleton />
          ) : (
            <div className="space-y-1">
              <button
                onClick={() => setStatusFilter("all")}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-colors ${
                  statusFilter === "all"
                    ? "bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Inbox className="w-4 h-4 flex-shrink-0" />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">All Messages</span>
                    <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-xl">
                      {messages.length}
                    </span>
                  </>
                )}
              </button>

              <button
                onClick={() => setStatusFilter("open")}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-colors ${
                  statusFilter === "open"
                    ? "bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Circle className="w-4 h-4 flex-shrink-0 text-green-500" />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">Open</span>
                    <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-xl">
                      {openCount}
                    </span>
                  </>
                )}
              </button>

              <button
                onClick={() => setStatusFilter("closed")}
                className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-xl transition-colors ${
                  statusFilter === "closed"
                    ? "bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <Archive className="w-4 h-4 flex-shrink-0 text-gray-500" />
                {!sidebarCollapsed && (
                  <>
                    <span className="flex-1 text-left">Closed</span>
                    <span className="text-xs bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-xl">
                      {messages.length - openCount}
                    </span>
                  </>
                )}
              </button>

              {starredCount > 0 && (
                <div className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                  <Star className="w-4 h-4 flex-shrink-0 text-yellow-500" />
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left">Starred</span>
                      <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-xl">
                        {starredCount}
                      </span>
                    </>
                  )}
                </div>
              )}

              {unreadCount > 0 && (
                <div className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
                  <div className="w-2 h-2 bg-sky-500 rounded-full flex-shrink-0"></div>
                  {!sidebarCollapsed && (
                    <>
                      <span className="flex-1 text-left">Unread</span>
                      <span className="text-xs bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-xl">
                        {unreadCount}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
        {/* Alert */}
        {alert.show && (
          <div className="p-4">
            <ModernAlert
              message={alert.message}
              type={alert.type}
              onClose={() => setAlert((prev) => ({ ...prev, show: false }))}
            />
          </div>
        )}

        {/* Header */}
        <div className="bg-white dark:bg-gray-800 px-2 py-2.5 rounded-t-xl border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent transition-colors w-80"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={fetchMessages}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {/* Bulk Actions */}
              {selectedMessages.size > 0 && (
                <div className="flex items-center gap-2 bg-sky-50 dark:bg-sky-900/20 rounded-xl p-2 py-1 border border-sky-200 dark:border-sky-800">
                  <span className="text-sm text-sky-700 dark:text-sky-300 font-medium px-2">
                    {selectedMessages.size} selected
                  </span>
                  <div className="w-px h-4 bg-sky-300 dark:bg-sky-600"></div>
                  <button
                    onClick={() => {
                      selectedMessages.forEach((id) => handleMarkAsRead(id));
                      setSelectedMessages(new Set());
                    }}
                    className="p-1.5 text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-900/30 rounded-xl transition-all duration-200"
                    title="Mark as read"
                  >
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          `Are you sure you want to delete ${selectedMessages.size} messages?`
                        )
                      ) {
                        selectedMessages.forEach((id) =>
                          handleDeleteMessage(id)
                        );
                        setSelectedMessages(new Set());
                      }
                    }}
                    className="p-1.5 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-xl transition-all duration-200"
                    title="Delete selected"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Email List */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-gray-800">
          {loading ? (
            <div className="h-full overflow-y-auto">
              {[...Array(8)].map((_, i) => (
                <MessageSkeleton key={i} />
              ))}
            </div>
          ) : filteredMessages.length === 0 ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  {searchTerm ? "No matching messages" : "No messages found"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-sm">
                  {searchTerm
                    ? `No messages match "${searchTerm}". Try a different search term.`
                    : "Messages from your contact form will appear here"}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              {/* Select All Header */}
              <div className="sticky top-0 bg-gray-50 dark:bg-gray-800 px-3 py-3 z-10 border-b border-gray-200 dark:border-gray-600">
                <label className="flex items-center gap-3 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sky-600 focus:ring-sky-500 focus:ring-1"
                  />
                  <span className="font-medium">
                    Select All ({filteredMessages.length})
                  </span>
                </label>
              </div>

              {/* Message List */}
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredMessages.map((message) => (
                  <MessageItem
                    key={getMessageId(message)}
                    message={message}
                    isSelected={selectedMessages.has(getMessageId(message))}
                    onSelect={handleSelectMessage}
                    onMarkAsRead={handleMarkAsRead}
                    onToggleStarred={handleToggleStarred}
                    onClose={handleCloseMessage}
                    onReopen={handleReopenMessage}
                    onReply={handleReply}
                    onDelete={handleDeleteMessage}
                    formatDate={formatDate}
                    getMessageId={getMessageId}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reply Modal */}
        <ReplyModal
          isOpen={isReplyModalOpen}
          message={selectedMessage}
          onClose={() => setIsReplyModalOpen(false)}
          onSend={handleSendReply}
        />
      </div>
    </div>
  );
};

export default CMSEmails;