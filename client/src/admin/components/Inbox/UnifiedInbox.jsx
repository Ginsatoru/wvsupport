import React, { useState, useEffect, useMemo } from "react";
import { Mail } from "lucide-react";
import { FiCheck, FiRotateCcw } from "react-icons/fi";
import io from "socket.io-client";
import {
  getContactMessages,
  markMessageAsRead,
  deleteContactMessage,
  closeMessage,
  reopenMessage,
} from "../../../services/api";
import ConfirmationModal from "../Modals/ConfirmationModal";
import MessageField from "./MessageField";
import EmailReplyPanel from "./EmailReplyPanel";
import InboxList from "./InboxList";
import { normalizeEmail, normalizeThread } from "./inboxUtils";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const socket = io(API_BASE_URL, {
  transports: ["websocket"],
  withCredentials: true,
});

const UnifiedInbox = () => {
  const [emailMessages, setEmailMessages] = useState([]);
  const [chatThreads, setChatThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [view, setView] = useState("open"); // "open" | "closed" — replaces the old sidebar nav
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState(new Set());

  const [selectedThread, setSelectedThread] = useState(null); // opens MessageField (chat) or EmailReplyPanel (email)

  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
  const [confirmModal, setConfirmModal] = useState({ show: false, item: null });

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 4000);
  };

  const getToken = () => localStorage.getItem("adminToken");

  const fetchThreadsByStatus = async (status) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/messages?status=${status}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
        credentials: "include",
      });
      if (!res.ok) return [];
      return await res.json();
    } catch {
      return [];
    }
  };

  const fetchAll = async () => {
    setLoading(true);
    setError("");
    try {
      const [emailRes, openThreads, closedThreads] = await Promise.all([
        getContactMessages(),
        fetchThreadsByStatus("open"),
        fetchThreadsByStatus("closed"),
      ]);
      const emailData = emailRes.data?.messages || emailRes.data || emailRes;
      setEmailMessages(Array.isArray(emailData) ? emailData : []);
      setChatThreads([...(openThreads || []), ...(closedThreads || [])]);
    } catch (err) {
      console.error("Error loading inbox:", err);
      setError(err.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();

    const handleNewThread = (newThread) => {
      setChatThreads((prev) => {
        const idx = prev.findIndex((t) => t.sessionId === newThread.sessionId);
        if (idx >= 0) {
          const updated = [...prev];
          updated[idx] = newThread;
          return updated;
        }
        return [newThread, ...prev];
      });
    };

    const handleThreadUpdate = (updatedThread) => {
      setChatThreads((prev) =>
        prev.map((t) => (t.sessionId === updatedThread.sessionId ? updatedThread : t))
      );
      setSelectedThread((prev) =>
        prev?.sessionId === updatedThread.sessionId ? updatedThread : prev
      );
    };

    socket.on("new_message", handleNewThread);
    socket.on("message_updated", handleThreadUpdate);
    return () => {
      socket.off("new_message", handleNewThread);
      socket.off("message_updated", handleThreadUpdate);
    };
  }, []);

  // ── Combine + filter + search ──
  const combined = useMemo(() => {
    const emails = emailMessages.map(normalizeEmail);
    const chats = chatThreads.map(normalizeThread);
    return [...emails, ...chats].sort(
      (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
    );
  }, [emailMessages, chatThreads]);

  const filtered = useMemo(() => {
    let list = combined.filter((item) => item.status === view);
    const q = searchTerm.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.email.toLowerCase().includes(q) ||
          item.subject.toLowerCase().includes(q) ||
          item.preview.toLowerCase().includes(q)
      );
    }
    return list;
  }, [combined, view, searchTerm]);

  // ── Row actions ──
  const handleRowClick = (item) => {
    if (item.type === "email") {
      const raw = item.raw;
      const messages = [
        { _id: `${raw._id}-orig`, sender: "user", content: raw.message, timestamp: raw.createdAt },
      ];
      if (raw.replied && raw.replyMessage) {
        messages.push({
          _id: `${raw._id}-reply`,
          sender: "admin",
          content: raw.replyMessage,
          timestamp: raw.lastReplyAt || raw.createdAt,
        });
      }
      setSelectedThread({
        type: "email",
        _id: raw._id,
        user: { name: raw.name, email: raw.email },
        status: raw.status,
        subject: raw.subject,
        createdAt: raw.createdAt,
        messages,
      });
      if (!item.read) handleMarkAsRead(item);
    } else {
      setSelectedThread({ type: "chat", ...item.raw });
    }
  };

  const handleMarkAsRead = async (item) => {
    if (item.type !== "email") return;
    try {
      await markMessageAsRead(item.id);
      setEmailMessages((prev) =>
        prev.map((m) => (m._id === item.id ? { ...m, read: true } : m))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (item) => {
    const nextStatus = item.status === "open" ? "closed" : "open";
    try {
      if (item.type === "email") {
        if (nextStatus === "closed") await closeMessage(item.id);
        else await reopenMessage(item.id);
        setEmailMessages((prev) =>
          prev.map((m) => (m._id === item.id ? { ...m, status: nextStatus } : m))
        );
        if (selectedThread?.type === "email" && selectedThread._id === item.id) {
          setSelectedThread(null);
        }
      } else {
        await fetch(`${API_BASE_URL}/api/messages/${item.id}/status`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: nextStatus }),
          credentials: "include",
        });
        setChatThreads((prev) =>
          prev.map((t) =>
            t.sessionId === item.id ? { ...t, status: nextStatus } : t
          )
        );
        if (selectedThread?.sessionId === item.id) setSelectedThread(null);
      }
      showAlert(nextStatus === "closed" ? "Marked as closed" : "Reopened");
    } catch (err) {
      console.error(err);
      showAlert("Failed to update status", "error");
    }
  };

  const requestDelete = (item) => setConfirmModal({ show: true, item });

  const confirmDelete = async () => {
    const item = confirmModal.item;
    if (!item) return;
    try {
      if (item.type === "email") {
        await deleteContactMessage(item.id);
        setEmailMessages((prev) => prev.filter((m) => m._id !== item.id));
        if (selectedThread?.type === "email" && selectedThread._id === item.id) {
          setSelectedThread(null);
        }
      } else {
        await fetch(`${API_BASE_URL}/api/messages/${item.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
          credentials: "include",
        });
        setChatThreads((prev) => prev.filter((t) => t.sessionId !== item.id));
        if (selectedThread?.sessionId === item.id) setSelectedThread(null);
      }
      setSelectedRows((prev) => {
        const next = new Set(prev);
        next.delete(item.uid);
        return next;
      });
      showAlert("Deleted successfully");
    } catch (err) {
      console.error(err);
      showAlert("Failed to delete", "error");
    } finally {
      setConfirmModal({ show: false, item: null });
    }
  };

  const handleSelectRow = (uid, checked) => {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (checked) next.add(uid);
      else next.delete(uid);
      return next;
    });
  };

  const handleBulkDelete = async () => {
    const items = filtered.filter((i) => selectedRows.has(i.uid));
    for (const item of items) {
      if (item.type === "email") {
        await deleteContactMessage(item.id).catch(() => {});
      } else {
        await fetch(`${API_BASE_URL}/api/messages/${item.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getToken()}` },
          credentials: "include",
        }).catch(() => {});
      }
    }
    setEmailMessages((prev) => prev.filter((m) => !selectedRows.has(`email-${m._id}`)));
    setChatThreads((prev) => prev.filter((t) => !selectedRows.has(`chat-${t.sessionId}`)));
    setSelectedRows(new Set());
    showAlert(`${items.length} item${items.length !== 1 ? "s" : ""} deleted`);
  };

  const handleBulkToggleStatus = async () => {
    const nextStatus = view === "open" ? "closed" : "open";
    const items = filtered.filter((i) => selectedRows.has(i.uid));
    for (const item of items) {
      if (item.type === "email") {
        const req = nextStatus === "closed" ? closeMessage(item.id) : reopenMessage(item.id);
        await req.catch(() => {});
      } else {
        await fetch(`${API_BASE_URL}/api/messages/${item.id}/status`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getToken()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: nextStatus }),
          credentials: "include",
        }).catch(() => {});
      }
    }
    setEmailMessages((prev) =>
      prev.map((m) =>
        selectedRows.has(`email-${m._id}`) ? { ...m, status: nextStatus } : m
      )
    );
    setChatThreads((prev) =>
      prev.map((t) =>
        selectedRows.has(`chat-${t.sessionId}`) ? { ...t, status: nextStatus } : t
      )
    );
    if (
      selectedThread &&
      selectedRows.has(
        selectedThread.type === "email"
          ? `email-${selectedThread._id}`
          : `chat-${selectedThread.sessionId}`
      )
    ) {
      setSelectedThread(null);
    }
    setSelectedRows(new Set());
    showAlert(
      `${items.length} item${items.length !== 1 ? "s" : ""} ${
        nextStatus === "closed" ? "closed" : "reopened"
      }`
    );
  };

  // ── Reply handling ──
  const handleEmailReplySent = (updatedMessage) => {
    const emailId = selectedThread?._id;
    if (!emailId) return;
    setEmailMessages((prev) =>
      prev.map((m) =>
        m._id === emailId
          ? {
              ...m,
              replied: true,
              replyMessage: updatedMessage.replyMessage,
              replyAttachments: updatedMessage.replyAttachments || [],
              read: true,
              lastReplyAt: updatedMessage.lastReplyAt || new Date().toISOString(),
            }
          : m
      )
    );
    setSelectedThread((prev) =>
      prev && prev.type === "email"
        ? {
            ...prev,
            messages: [
              ...prev.messages,
              {
                _id: `${emailId}-reply-${Date.now()}`,
                sender: "admin",
                content: updatedMessage.replyMessage,
                timestamp: updatedMessage.lastReplyAt || new Date(),
              },
            ],
          }
        : prev
    );
    showAlert("Reply sent successfully");
  };

  const handleThreadReplySuccess = (reply) => {
    setChatThreads((prev) =>
      prev.map((t) =>
        t.sessionId === selectedThread.sessionId
          ? { ...t, messages: [...t.messages, reply], updatedAt: new Date() }
          : t
      )
    );
    setSelectedThread((prev) =>
      prev ? { ...prev, messages: [...prev.messages, reply], updatedAt: new Date() } : prev
    );
  };

  return (
    <>
      <style>{`
        .inbox-title { color: #000000; }
        .dark .inbox-title { color: #ffffff; }

        .inbox-name { color: #000000; }
        .dark .inbox-name { color: #ffffff; }

        .inbox-subject { color: #000000; font-weight: 450; }
        .dark .inbox-subject { color: #ffffff; }

        .inbox-preview { color: #000000; font-weight: 400; }
        .dark .inbox-preview { color: #d1d5db; }

        .inbox-search-input { color: #000000; }
        .dark .inbox-search-input { color: #ffffff; }

        .inbox-date { color: #000000; }
        .dark .inbox-date { color: #ffffff; }

        .mf-title { color: #000000; }
        .dark .mf-title { color: #ffffff; }
        .mf-name { color: #000000; }
        .dark .mf-name { color: #ffffff; }
        .mf-meta { color: #000000; }
        .dark .mf-meta { color: #ffffff; }
        .mf-content { color: #000000; }
        .dark .mf-content { color: #ffffff; }
      `}</style>
      <div className="flex h-[89vh] bg-gray-200 dark:bg-gray-900 rounded-xl gap-4 p-4">
      {/* ── List column ── */}
      <InboxList
        alert={alert}
        setAlert={setAlert}
        view={view}
        setView={setView}
        filtered={filtered}
        fetchAll={fetchAll}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedRows={selectedRows}
        handleBulkToggleStatus={handleBulkToggleStatus}
        handleBulkDelete={handleBulkDelete}
        loading={loading}
        error={error}
        selectedThread={selectedThread}
        handleRowClick={handleRowClick}
        handleSelectRow={handleSelectRow}
        handleMarkAsRead={handleMarkAsRead}
        toggleStatus={toggleStatus}
        requestDelete={requestDelete}
      />

      {/* ── Detail panel — always present; shows chat, email, or an empty placeholder ── */}
      <div className="flex-1 flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {selectedThread && selectedThread.type === "chat" && (
          <MessageField
            selectedThread={selectedThread}
            actionText={selectedThread.status === "open" ? "Close" : "Reopen"}
            actionIcon={
              selectedThread.status === "open" ? (
                <FiCheck className="h-4 w-4" />
              ) : (
                <FiRotateCcw className="h-4 w-4" />
              )
            }
            onStatusAction={() => toggleStatus(normalizeThread(selectedThread))}
            handleDeleteThread={(thread) => requestDelete(normalizeThread(thread))}
            onReplySuccess={handleThreadReplySuccess}
          />
        )}

        {selectedThread && selectedThread.type === "email" && (
          <EmailReplyPanel
            item={selectedThread}
            onStatusAction={() =>
              toggleStatus({ type: "email", id: selectedThread._id, status: selectedThread.status })
            }
            onDelete={() =>
              requestDelete({ uid: `email-${selectedThread._id}`, type: "email", id: selectedThread._id })
            }
            onReplySuccess={handleEmailReplySent}
          />
        )}

        {!selectedThread && (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <Mail className="w-10 h-10 text-gray-300 dark:text-gray-600 mb-3" />
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Select a conversation to view messages
            </p>
          </div>
        )}
      </div>

      {/* ── Delete confirmation (shared by both types) ── */}
      <ConfirmationModal
        isOpen={confirmModal.show}
        title="Delete Conversation"
        message="Are you sure you want to delete this conversation? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmModal({ show: false, item: null })}
      />
      </div>
    </>
  );
};

export default UnifiedInbox;