import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import {
  FiUser,
  FiClock,
  FiArchive,
  FiTrash2,
  FiSend,
  FiInbox,
  FiPaperclip,
  FiX,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

const MessageField = ({
  selectedThread,
  onStatusAction,
  handleDeleteThread,
  onReplySuccess,
  actionText,
  actionIcon,
}) => {
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [isResizing, setIsResizing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [expandedMessages, setExpandedMessages] = useState({});
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const contentRef = useRef(null);

  const toggleMessageExpand = (messageId) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  const handleReplySubmit = async (e) => {
    e.preventDefault();

    // Check if content exists and is not just whitespace
    if (!replyContent || !replyContent.trim()) {
      setError("Reply content is required");
      return;
    }

    if (!selectedThread) {
      setError("No thread selected");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setError("Admin token not found. Please login again.");
        return;
      }

      const now = new Date();

      // Create the reply object for optimistic update
      const reply = {
        sender: "admin",
        content: replyContent.trim(),
        timestamp: now,
        status: "sent",
      };

      // Optimistic update
      if (onReplySuccess) {
        onReplySuccess(reply);
      }

      // Save to database
      const response = await fetch(
        `http://localhost:5000/api/messages/${selectedThread.sessionId}/reply`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: replyContent.trim(),
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        let errorMessage;

        try {
          const errorJson = JSON.parse(errorText);
          errorMessage = errorJson.message || "Failed to send reply";
        } catch {
          errorMessage = errorText || "Failed to send reply";
        }

        throw new Error(errorMessage);
      }

      // Clear form on success
      setReplyContent("");
      setAttachments([]);
    } catch (err) {
      setError(err.message || "Failed to send reply");
      console.error("Reply error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAttachClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments([...attachments, ...files]);
    e.target.value = "";
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const startResize = (e) => {
    e.preventDefault();
    setIsResizing(true);
    setStartY(e.clientY);
    setStartHeight(textareaRef.current.offsetHeight);
    document.body.style.cursor = "ns-resize";
    document.body.style.userSelect = "none";
  };

  const handleResize = (e) => {
    if (!isResizing) return;
    const newHeight = startHeight + (startY - e.clientY);
    textareaRef.current.style.height = `${Math.max(
      80,
      Math.min(400, newHeight)
    )}px`;
  };

  const stopResize = () => {
    setIsResizing(false);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleResize);
      document.addEventListener("mouseup", stopResize);
    } else {
      document.removeEventListener("mousemove", handleResize);
      document.removeEventListener("mouseup", stopResize);
    }

    return () => {
      document.removeEventListener("mousemove", handleResize);
      document.removeEventListener("mouseup", stopResize);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing]);

  useEffect(() => {
    if (selectedThread && textareaRef.current) {
      textareaRef.current.style.height = "100px";
      textareaRef.current.focus();
    }
  }, [selectedThread]);

  useEffect(() => {
    if (contentRef.current && selectedThread) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [selectedThread, expandedMessages]);

  if (!selectedThread) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-200 dark:bg-gray-900">
        <div className="text-center p-6">
          <FiInbox className="h-16 w-16 mx-auto mb-4 text-gray-500 dark:text-gray-400" />
          <h2 className="text-xl font-medium text-gray-800 dark:text-gray-300 mb-2">
            Select a conversation
          </h2>
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Choose a conversation from the list to view messages
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-200 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="border-b border-gray-300 dark:border-gray-700 px-6 py-4 dark:bg-gray-900">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Conversation with {selectedThread.user?.name || "Anonymous"}
                </h2>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedThread.status === "open"
                      ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                  }`}
                >
                  {selectedThread.status}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onStatusAction(selectedThread.sessionId)}
                  className={`inline-flex items-center px-4 py-2 rounded-3xl text-sm font-medium transition-colors ${
                    selectedThread.status === "open"
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-300 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-sky-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  }`}
                >
                  {actionIcon}
                  <span className="ml-1">{actionText}</span>
                </button>

                <button
                  onClick={() => handleDeleteThread(selectedThread)}
                  className="inline-flex items-center px-4 py-2 rounded-3xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-red-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                >
                  <FiTrash2 className="h-4 w-4 mr-1 text-red-400" />
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-4">
              <div className="w-10 h-10 bg-sky-200 dark:bg-sky-900/30 rounded-full flex items-center justify-center">
                <FiUser className="h-5 w-5 text-sky-600 dark:text-sky-400" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-gray-100">
                      {selectedThread.user?.name || "Anonymous"}
                    </span>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedThread.user?.email}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-7 flex items-center gap-1">
                    <FiClock className="h-3 w-3" />
                    <span>
                      {new Date(selectedThread.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message content */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
      >
        <div className="max-w-4xl mx-auto space-y-6">
          {selectedThread.messages.map((message, index) => {
            const isExpanded = expandedMessages[message._id] ?? true;
            const isAdmin = message.sender === "admin";

            return (
              <div
                key={message._id || index}
                className={`mb-6 ${isAdmin ? "ml-8" : "mr-8"}`}
              >
                <div
                  className={`flex ${
                    isAdmin ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-3xl w-full ${
                      isAdmin
                        ? "bg-sky-100 dark:bg-sky-900/30"
                        : "bg-white dark:bg-gray-800"
                    } rounded-xl p-4 shadow-sm`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isAdmin
                              ? "bg-sky-200 dark:bg-sky-800"
                              : "bg-gray-200 dark:bg-gray-700"
                          }`}
                        >
                          <FiUser
                            className={`h-3 w-3 ${
                              isAdmin
                                ? "text-sky-600 dark:text-sky-400"
                                : "text-gray-600 dark:text-gray-400"
                            }`}
                          />
                        </div>
                        <span className="text-sm font-medium">
                          {isAdmin
                            ? "You"
                            : selectedThread.user?.name || "User"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        <button
                          onClick={() =>
                            toggleMessageExpand(message._id || index)
                          }
                          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          {isExpanded ? (
                            <FiChevronUp size={14} />
                          ) : (
                            <FiChevronDown size={14} />
                          )}
                        </button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div
                        className={`text-gray-800 dark:text-gray-200 whitespace-pre-wrap text-base ${
                          isAdmin ? "text-left" : "text-left"
                        }`}
                      >
                        {message.content}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reply form */}
      <div className="dark:bg-gray-900 p-2">
        <form onSubmit={handleReplySubmit}>
          {error && (
            <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-2">
              <FiAlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5" />
              <span className="text-sm text-red-700 dark:text-red-300">
                {error}
              </span>
            </div>
          )}

          {attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2 text-sm"
                >
                  <FiPaperclip className="text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300 truncate max-w-xs">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeAttachment(index)}
                    className="text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="relative">
            <div
              className="flex justify-center items-center mb-1 cursor-ns-resize h-1"
              onMouseDown={startResize}
            >
              <div className="w-10 h-1 bg-gray-400 dark:bg-gray-500 rounded-full" />
            </div>

            <textarea
              ref={textareaRef}
              className="block w-full px-4 py-2 text-sm placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none dark:bg-gray-800 bg-gray-100 dark:text-white resize-none rounded-xl"
              placeholder="Type your reply here..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              disabled={isSubmitting}
              style={{ minHeight: "80px", maxHeight: "400px" }}
            />

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              multiple
            />

            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleAttachClick}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Attach files"
              >
                <FiPaperclip className="h-5 w-5" />
              </button>

              <button
                type="submit"
                disabled={!replyContent || !replyContent.trim() || isSubmitting}
                className="px-4 py-2 text-sm font-medium rounded-xl text-white bg-sky-600 hover:bg-sky-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Sending...
                  </span>
                ) : (
                  <>
                    <FiSend className="h-4 w-4 mr-1 inline" />
                    Send
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

MessageField.propTypes = {
  selectedThread: PropTypes.object,
  onStatusAction: PropTypes.func,
  handleDeleteThread: PropTypes.func,
  onReplySuccess: PropTypes.func,
  actionText: PropTypes.string,
  actionIcon: PropTypes.node,
};

export default MessageField;
