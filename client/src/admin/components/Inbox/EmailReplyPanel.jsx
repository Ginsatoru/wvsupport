import React, { useState, useEffect, useRef } from "react";
import {
  FiCheck,
  FiRotateCcw,
  FiUser,
  FiClock,
  FiTrash2,
  FiSend,
  FiAlertCircle,
  FiChevronDown,
  FiChevronUp,
  FiFileText,
  FiPaperclip,
  FiX,
} from "react-icons/fi";
import bluelogo from "../../../Components/Images/bluelogo.png";
import { getInitials } from "./inboxUtils";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Same types the server accepts for contact replies (images, PDF, Word, Excel, text/CSV)
const ACCEPTED_FILES =
  "image/jpeg,image/png,image/gif,image/webp,application/pdf,application/msword," +
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel," +
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/plain,text/csv";
const MAX_FILES = 5;

// Old replies stored full URLs; new ones store "/uploads/..." paths on the API server
const fileUrl = (url = "") => (url.startsWith("http") ? url : `${API_BASE_URL}${url}`);

// Images show as thumbnails, other files as a link — both open in a new tab
const EmailAttachments = ({ items }) => (
  <div className="flex flex-wrap gap-2 mt-2">
    {items.map((a, i) =>
      a.type?.startsWith("image/") ? (
        <a key={i} href={fileUrl(a.url)} target="_blank" rel="noopener noreferrer">
          <img
            src={fileUrl(a.url)}
            alt={a.name}
            className="max-w-[220px] max-h-[160px] rounded-lg border border-gray-200 dark:border-gray-600 object-cover"
          />
        </a>
      ) : (
        <a
          key={i}
          href={fileUrl(a.url)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-sm text-sky-600 dark:text-sky-400 max-w-[240px]"
        >
          <FiFileText className="flex-shrink-0" />
          <span className="truncate">{a.name}</span>
        </a>
      )
    )}
  </div>
);

// ── Inline reply panel for emails — mirrors MessageField's layout/style ──
const EmailReplyPanel = ({ item, onStatusAction, onDelete, onReplySuccess }) => {
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isResizing, setIsResizing] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startHeight, setStartHeight] = useState(0);
  const [expandedMessages, setExpandedMessages] = useState({});
  const [attachments, setAttachments] = useState([]);
  const textareaRef = useRef(null);
  const contentRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files].slice(0, MAX_FILES));
    e.target.value = "";
  };

  const removeAttachment = (index) => setAttachments((prev) => prev.filter((_, i) => i !== index));

  const toggleMessageExpand = (messageId) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }));
  };

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [item.messages, expandedMessages]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "100px";
      textareaRef.current.focus();
    }
  }, [item._id]);

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

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim() && attachments.length === 0) {
      setError("Reply content is required");
      return;
    }
    setIsSubmitting(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("replyMessage", replyContent.trim());
      attachments.forEach((file) => formData.append("attachments", file));
      const response = await fetch(`${API_BASE_URL}/api/contact/admin/messages/${item._id}/reply`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
        body: formData,
      });
      const result = await response.json();
      if (!result.success) throw new Error(result.message || "Failed to send reply");
      onReplySuccess(result.data);
      setReplyContent("");
      setAttachments([]);
    } catch (err) {
      setError(err.message || "Failed to send reply");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex-1 min-h-0 flex flex-col bg-gray-200 dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex-shrink-0 rounded-xl bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 px-6 py-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <h2 className="mf-title text-xl font-semibold">{item.subject}</h2>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={onStatusAction}
                  className={`inline-flex items-center px-4 py-2 rounded-3xl text-sm font-medium transition-colors ${
                    item.status === "open"
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                      : "bg-gray-100 text-gray-700 hover:bg-sky-100 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  }`}
                >
                  {item.status === "open" ? (
                    <FiCheck className="h-4 w-4" />
                  ) : (
                    <FiRotateCcw className="h-4 w-4" />
                  )}
                  <span className="ml-1">{item.status === "open" ? "Close" : "Reopen"}</span>
                </button>

                <button
                  onClick={onDelete}
                  className="inline-flex items-center px-4 py-2 rounded-3xl text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  <FiTrash2 className="h-4 w-4 mr-1 text-red-400" />
                  Delete
                </button>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-4">
              <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center">
                <FiUser className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="mf-name font-medium">{item.user.name}</span>
                    <div className="mf-meta text-xs">{item.user.email}</div>
                  </div>
                  <div className="mf-meta text-xs mt-7 flex items-center gap-1">
                    <FiClock className="h-3 w-3" />
                    <span>{new Date(item.createdAt).toLocaleString([], {
                          year: "numeric",
                          month: "numeric",
                          day: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })}</span>
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
        className="flex-1 min-h-0 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800"
      >
        <div className="max-w-4xl mx-auto">
          {item.messages.map((message, index) => {
            const isExpanded = expandedMessages[message._id] ?? true;
            const isAdmin = message.sender === "admin";
            const prevMessage = item.messages[index - 1];
            const senderChanged =
              index > 0 && prevMessage?.sender !== message.sender;
            const senderName = isAdmin ? "You" : item.user.name || "User";

            return (
              <div
                key={message._id || index}
                className={`flex ${
                  isAdmin ? "justify-end" : "justify-start"
                } ${index === 0 ? "" : senderChanged ? "mt-6" : "mt-2"}`}
              >
                <div
                  className={`group w-full max-w-[85%] flex items-start gap-3 px-4 py-3 rounded-xl shadow-sm ${
                    isAdmin
                      ? "bg-gray-100 dark:bg-gray-700"
                      : "bg-white dark:bg-gray-800"
                  }`}
                >
                  {isAdmin ? (
                    <img
                      src={bluelogo}
                      alt="Support"
                      className="w-9 h-9 flex-shrink-0 rounded-full bg-white border border-gray-200 dark:border-gray-600 object-contain p-1"
                    />
                  ) : (
                    <div className="w-9 h-9 flex-shrink-0 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 flex items-center justify-center text-sm text-gray-600 dark:text-gray-300">
                      {getInitials(senderName)}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="mf-name text-sm font-semibold">
                        {senderName}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Email
                      </span>
                      <button
                        onClick={() =>
                          toggleMessageExpand(message._id || index)
                        }
                        className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        {isExpanded ? (
                          <FiChevronUp size={14} />
                        ) : (
                          <FiChevronDown size={14} />
                        )}
                      </button>
                    </div>

                    {isExpanded && message.content && (
                      <div className="mf-content whitespace-pre-wrap text-sm text-left mt-1">
                        {message.content}
                      </div>
                    )}
                    {isExpanded && message.attachments?.length > 0 && (
                      <EmailAttachments items={message.attachments} />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reply form */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-800 rounded-t-xl">
        <form onSubmit={handleReplySubmit}>
          {error && (
            <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-2">
              <FiAlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mt-0.5" />
              <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
            </div>
          )}

          {attachments.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2 px-2 pt-2">
              {attachments.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 rounded-xl px-3 py-2 text-sm"
                >
                  <FiPaperclip className="text-gray-500 dark:text-gray-400" />
                  <span className="text-gray-700 dark:text-gray-300 truncate max-w-xs">{file.name}</span>
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
              className="block w-full px-4 py-2 text-sm placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none dark:bg-gray-800 bg-white-100 dark:text-white resize-none rounded-xl"
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
              accept={ACCEPTED_FILES}
              className="hidden"
              multiple
            />

            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={attachments.length >= MAX_FILES || isSubmitting}
                className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                title="Attach files"
              >
                <FiPaperclip className="h-5 w-5" />
              </button>

              <button
                type="submit"
                disabled={(!replyContent.trim() && attachments.length === 0) || isSubmitting}
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

export default EmailReplyPanel;