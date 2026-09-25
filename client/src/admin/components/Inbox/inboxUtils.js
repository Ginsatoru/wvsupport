// Preview text for the newest line in a conversation
const lastLinePreview = (lines = []) => {
  const last = lines[lines.length - 1];
  return last?.content || (last?.attachments?.length ? "📎 Attachment" : "");
};

// ── Build the email detail-panel object from a contact conversation ──
export const toEmailThread = (m) => ({
  type: "email",
  _id: m._id,
  user: { name: m.name, email: m.email },
  status: m.status,
  subject: m.subject,
  createdAt: m.createdAt,
  messages: m.messages || [],
});

// ── Normalize an email (contact-form) message into the shared row shape ──
export const normalizeEmail = (m) => ({
  uid: `email-${m._id}`,
  type: "email",
  id: m._id,
  name: m.name || "Anonymous",
  email: m.email || "No email",
  subject: m.subject || "(no subject)",
  preview: lastLinePreview(m.messages) || m.message || "",
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
    preview: last?.content || (last?.attachments?.length ? "📎 Attachment" : ""),
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

// ── Compact relative time for list rows, HubSpot style: "Just now", "5m", "3h", "2d", "4mo", "1y" ──
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";

  const minutes = Math.floor((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo`;

  return `${Math.floor(days / 365)}y`;
};