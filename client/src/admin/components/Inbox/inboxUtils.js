// ── Normalize an email (contact-form) message into the shared row shape ──
export const normalizeEmail = (m) => ({
  uid: `email-${m._id}`,
  type: "email",
  id: m._id,
  name: m.name || "Anonymous",
  email: m.email || "No email",
  subject: m.subject || "(no subject)",
  preview: m.message || "",
  status: m.status || "open",
  read: !!m.read,
  replied: !!m.replied,
  createdAt: m.createdAt,
  updatedAt: m.lastReplyAt || m.createdAt,
  raw: m,
});

// ── Normalize a live-chat thread into the shared row shape ──
export const normalizeThread = (t) => {
  const msgs = Array.isArray(t.messages) ? t.messages : [];
  const last = msgs[msgs.length - 1];
  const unread = msgs.filter(
    (msg) => msg?.sender === "user" && msg?.status !== "read"
  ).length;
  return {
    uid: `chat-${t.sessionId}`,
    type: "chat",
    id: t.sessionId,
    name: t.user?.name || "Anonymous",
    email: t.user?.email || "No email",
    subject: "Live Chat",
    preview: last?.content || "",
    status: t.status || "open",
    read: unread === 0,
    replied: msgs.some((msg) => msg.sender === "admin"),
    createdAt: t.createdAt,
    updatedAt: t.updatedAt || t.createdAt,
    raw: t,
  };
};

export const getInitials = (name) =>
  (name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("") || "U";

// ── Relative date label for list rows ──
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.ceil(Math.abs(now - date) / (1000 * 60 * 60 * 24));
  if (diffDays === 1) return "Today";
  if (diffDays === 2) return "Yesterday";
  if (diffDays <= 7) return `${diffDays - 1}d ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};