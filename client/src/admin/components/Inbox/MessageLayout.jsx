import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiInbox,
  FiAlertCircle,
  FiArchive,
  FiCheck,
  FiRotateCcw,
} from "react-icons/fi";
import ConfirmationModal from "../Modals/ConfirmationModal";
import MessageField from "./MessageField";
import MessageList from "./MessageList";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

const MessagesLayout = ({ status = "open", children }) => {
  const [threads, setThreads] = useState([]);
  const [filteredThreads, setFilteredThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [threadToDelete, setThreadToDelete] = useState(null);
  const navigate = useNavigate();
  const [darkMode] = useState(false);

  const statusConfig = {
    open: {
      icon: <FiInbox className="h-5 w-5 text-white" />,
      title: "Open Conversations",
      actionIcon: <FiCheck className="h-4 w-4" />,
      actionText: "Close",
      nextStatus: "closed",
      emptyState: {
        icon: <FiInbox className="h-12 w-12 text-gray-400" />,
        title: "No open conversations",
        description: "All caught up! New messages will appear here.",
      },
      bgColor: "bg-sky-500 dark:bg-sky-600",
    },
    closed: {
      icon: <FiArchive className="h-5 w-5 text-white" />,
      title: "Closed Conversations",
      actionIcon: <FiRotateCcw className="h-4 w-4" />,
      actionText: "Reopen",
      nextStatus: "open",
      emptyState: {
        icon: <FiArchive className="h-12 w-12 text-gray-400" />,
        title: "No closed conversations",
        description: "Close conversations from the Open view to see them here.",
      },
      bgColor: "bg-gray-500 dark:bg-gray-600",
    },
  };

  const currentConfig = statusConfig[status];

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("adminToken");
        if (!token) {
          navigate("/admin/login");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/api/messages?status=${status}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || "Failed to fetch messages");
        }

        const data = await response.json();
        setThreads(data);
        setFilteredThreads(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message);
        setLoading(false);

        if (err.message.toLowerCase().includes("token") || 
            err.message.toLowerCase().includes("unauthorized")) {
          localStorage.removeItem("adminToken");
          navigate("/admin/login");
        }
      }
    };

    fetchThreads();

    // Socket.io listeners
    const handleNewThread = (newThread) => {
      setThreads(prev => {
        const existingIndex = prev.findIndex(t => t.sessionId === newThread.sessionId);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = newThread;
          return updated;
        }
        return [newThread, ...prev];
      });
    };

    const handleThreadUpdate = (updatedThread) => {
      setThreads(prev => prev.map(t => 
        t.sessionId === updatedThread.sessionId ? updatedThread : t
      ));
      if (selectedThread?.sessionId === updatedThread.sessionId) {
        setSelectedThread(updatedThread);
      }
    };

    socket.on('new_message', handleNewThread);
    socket.on('message_updated', handleThreadUpdate);

    return () => {
      socket.off('new_message', handleNewThread);
      socket.off('message_updated', handleThreadUpdate);
    };
  }, [status, navigate]);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredThreads(threads);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = threads.filter(thread => 
        (thread.user?.name?.toLowerCase().includes(lowerQuery)) ||
        (thread.user?.email?.toLowerCase().includes(lowerQuery)) ||
        thread.messages.some(msg => 
          msg.content.toLowerCase().includes(lowerQuery)
        )
      );
      setFilteredThreads(filtered);
    }
  }, [searchQuery, threads]);

  const updateThreadStatus = async (sessionId, newStatus) => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://localhost:5000/api/messages/${sessionId}/status`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update thread status");

      // Optimistic update
      setThreads(prev => 
        prev.filter(thread => thread.sessionId !== sessionId)
      );
      setFilteredThreads(prev => 
        prev.filter(thread => thread.sessionId !== sessionId)
      );
      
      if (selectedThread?.sessionId === sessionId) {
        setSelectedThread(null);
      }
    } catch (err) {
      setError("Failed to update thread status");
      console.error(err);
    }
  };

  const handleStatusAction = (sessionId) => {
    updateThreadStatus(sessionId, currentConfig.nextStatus);
  };

  const handleDeleteThread = (thread) => {
    setThreadToDelete(thread);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://localhost:5000/api/messages/${threadToDelete.sessionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) throw new Error("Failed to delete thread");

      setThreads(prev => 
        prev.filter(t => t.sessionId !== threadToDelete.sessionId)
      );
      setFilteredThreads(prev => 
        prev.filter(t => t.sessionId !== threadToDelete.sessionId)
      );

      if (selectedThread?.sessionId === threadToDelete.sessionId) {
        setSelectedThread(null);
      }

      setShowDeleteConfirm(false);
      setThreadToDelete(null);
    } catch (err) {
      console.error(err);
      setError("Failed to delete thread");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirm(false);
    setThreadToDelete(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays < 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const getLastMessagePreview = (thread) => {
    if (!thread.messages?.length) return "";
    const lastMsg = thread.messages[thread.messages.length - 1];
    const content = lastMsg.content || "";
    return content.length > 100 
      ? `${content.substring(0, 100)}...` 
      : content;
  };

  const refreshThreads = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(
        `http://localhost:5000/api/messages?status=${status}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setThreads(data);
        setFilteredThreads(data);

        if (selectedThread) {
          const updatedThread = data.find(
            t => t.sessionId === selectedThread.sessionId
          );
          setSelectedThread(updatedThread || null);
        }
      }
    } catch (err) {
      console.error("Error refreshing threads:", err);
    }
  };

  const handleReplySuccess = (reply) => {
    // Optimistic update for the reply
    const updatedThread = {
      ...selectedThread,
      messages: [...selectedThread.messages, reply],
      status: 'replied',
      updatedAt: new Date()
    };

    setThreads(prev => prev.map(thread => 
      thread.sessionId === selectedThread.sessionId ? updatedThread : thread
    ));
    setSelectedThread(updatedThread);
  };

  if (loading) {
    return (
      <div className="pt-0 pb-2 bg-gray-200 dark:bg-gray-900 min-h-screen rounded-xl flex justify-center items-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin h-12 w-12 border-4 border-gray-200 dark:border-gray-700 border-t-blue-500 dark:border-t-blue-400 rounded-full mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-3 w-3 bg-blue-500 dark:bg-blue-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Loading conversations...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-0 pb-2 bg-gray-200 dark:bg-gray-900 min-h-screen rounded-xl flex justify-center items-center">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 shadow-sm max-w-md w-full">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <FiAlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-semibold text-red-800 dark:text-red-300">
                Error
              </h3>
              <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                {error}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-0 bg-gray-200 dark:bg-gray-900 min-h-[90vh] rounded-xl">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm overflow-hidden h-full">
        {/* Top Header */}
        <div className="bg-gray-200 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 ${currentConfig.bgColor} rounded-xl flex items-center justify-center`}
              >
                {currentConfig.icon}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {currentConfig.title}
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredThreads.length}{" "}
                  {filteredThreads.length === 1 ? "conversation" : "conversations"}
                </p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="relative w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-4 w-4 text-gray-400 dark:text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-3xl text-sm placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-sky-400 dark:focus:ring-sky-300 focus:border-transparent"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex overflow-hidden h-[80vh] bg-gray-200 dark:bg-gray-900">
          {filteredThreads.length === 0 && !loading ? (
            <div className="w-full flex flex-col items-center justify-center py-12">
              <div className="mb-4 text-gray-400">
                {currentConfig.emptyState.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {currentConfig.emptyState.title}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-center max-w-md px-4">
                {currentConfig.emptyState.description}
              </p>
              {status === "closed" && (
                <button
                  onClick={() => navigate("/messages/open")}
                  className="mt-6 px-5 py-2 text-base bg-sky-200 dark:bg-blue-900/30 text-sky-900 dark:text-blue-300 rounded-3xl hover:bg-sky-300 dark:hover:bg-blue-800/50 transition-colors"
                >
                  View Open Conversations
                </button>
              )}
            </div>
          ) : (
            <>
              <MessageList
                threads={filteredThreads}
                selectedThread={selectedThread}
                setSelectedThread={setSelectedThread}
                formatDate={formatDate}
                getLastMessagePreview={getLastMessagePreview}
                emptyIcon={currentConfig.emptyState.icon}
                emptyTitle={currentConfig.emptyState.title}
                searchQuery={searchQuery}
                onStatusAction={handleStatusAction}
                actionText={currentConfig.actionText}
                actionIcon={currentConfig.actionIcon}
                onDelete={handleDeleteThread}
              />

              <MessageField
                selectedThread={selectedThread}
                actionText={currentConfig.actionText}
                actionIcon={currentConfig.actionIcon}
                onStatusAction={() =>
                  selectedThread && handleStatusAction(selectedThread.sessionId)
                }
                handleDeleteThread={handleDeleteThread}
                onReplySuccess={handleReplySuccess}
              />
            </>
          )}
        </div>

        {/* Pass props to children */}
        {children && (
          <div style={{ display: "none" }}>
            {React.cloneElement(children, {
              threads: filteredThreads,
              searchQuery,
              updateThreadStatus: handleStatusAction,
              handleDeleteThread,
              status,
              setSearchQuery,
            })}
          </div>
        )}

        <ConfirmationModal
          darkMode={darkMode}
          isOpen={showDeleteConfirm}
          title="Delete Confirmation"
          message="Are you sure you want to delete this conversation? All messages will be permanently removed."
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
          confirmText="Delete"
        />
      </div>
    </div>
  );
};

export default MessagesLayout;