import { useState, useEffect, useMemo, useCallback } from "react";
import socket, { connectAdminSocket } from "../services/adminSocket";
import { getContactMessages, markMessageAsRead } from "../../services/api";
import { getAllNewsletterEmails, markSubscribersSeen } from "../../services/newsletterApi";
import { normalizeEmail, normalizeThread } from "../components/Inbox/inboxUtils";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const authHeader = () => ({ Authorization: `Bearer ${localStorage.getItem("adminToken")}` });

// Insert or replace an item in a list by key
const upsert = (list, item, key) =>
  list.some((x) => x[key] === item[key])
    ? list.map((x) => (x[key] === item[key] ? item : x))
    : [item, ...list];

const markChatLinesRead = (thread) => ({
  ...thread,
  messages: thread.messages.map((m) => (m.sender === "user" ? { ...m, status: "read" } : m)),
});

// New newsletter sign-up as a notification row
const normalizeSubscriber = (s) => ({
  uid: `sub-${s._id}`,
  type: "subscriber",
  id: s._id,
  name: s.email,
  preview: "Subscribed to the newsletter",
  read: s.seen !== false, // older subscribers have no flag — treat as seen
  updatedAt: s.createdAt,
});

// Unread live chats, contact emails and new subscribers, kept live over the socket
const useInboxNotifications = () => {
  const [chats, setChats] = useState([]);
  const [emails, setEmails] = useState([]);
  const [subscribers, setSubscribers] = useState([]);

  useEffect(() => {
    connectAdminSocket();

    fetch(`${API_BASE_URL}/api/messages?status=open`, { headers: authHeader() })
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => setChats(Array.isArray(data) ? data : []))
      .catch(() => {});

    getContactMessages()
      .then((res) => {
        const data = res.data?.messages || res.data || res;
        setEmails(Array.isArray(data) ? data : []);
      })
      .catch(() => {});

    getAllNewsletterEmails()
      .then((res) => setSubscribers(Array.isArray(res.data) ? res.data : []))
      .catch(() => {});

    const onChat = (thread) => setChats((prev) => upsert(prev, thread, "sessionId"));
    const onEmail = (doc) => setEmails((prev) => upsert(prev, doc, "_id"));
    const onSubscriber = (sub) => setSubscribers((prev) => upsert(prev, sub, "_id"));
    const onSubscribersSeen = ({ ids }) =>
      setSubscribers((prev) => prev.map((s) => (!ids || ids.includes(s._id) ? { ...s, seen: true } : s)));

    socket.on("new_message", onChat);
    socket.on("message_updated", onChat);
    socket.on("contact_updated", onEmail);
    socket.on("subscriber_added", onSubscriber);
    socket.on("subscribers_seen", onSubscribersSeen);
    return () => {
      socket.off("new_message", onChat);
      socket.off("message_updated", onChat);
      socket.off("contact_updated", onEmail);
      socket.off("subscriber_added", onSubscriber);
      socket.off("subscribers_seen", onSubscribersSeen);
    };
  }, []);

  const notifications = useMemo(
    () =>
      [...emails.map(normalizeEmail), ...chats.map(normalizeThread), ...subscribers.map(normalizeSubscriber)]
        .filter((item) => !item.read)
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)),
    [emails, chats, subscribers]
  );

  const markRead = useCallback(async (item) => {
    if (item.type === "subscriber") {
      setSubscribers((prev) => prev.map((s) => (s._id === item.id ? { ...s, seen: true } : s)));
      await markSubscribersSeen([item.id]).catch(() => {});
    } else if (item.type === "chat") {
      setChats((prev) => prev.map((t) => (t.sessionId === item.id ? markChatLinesRead(t) : t)));
      await fetch(`${API_BASE_URL}/api/messages/${item.id}/read`, {
        method: "PATCH",
        headers: authHeader(),
      }).catch(() => {});
    } else {
      setEmails((prev) => prev.map((m) => (m._id === item.id ? { ...m, read: true } : m)));
      await markMessageAsRead(item.id).catch(() => {});
    }
  }, []);

  const markAllRead = useCallback(
    () => Promise.all(notifications.map(markRead)),
    [notifications, markRead]
  );

  // Sidebar inbox badge counts chats + emails only
  const inboxUnreadCount = notifications.filter((n) => n.type !== "subscriber").length;

  return { notifications, inboxUnreadCount, markRead, markAllRead };
};

export default useInboxNotifications;