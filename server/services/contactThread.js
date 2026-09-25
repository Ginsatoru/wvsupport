// Shared helpers for contact-form conversations (used by the controller and the email inbox poller)

const SENDER = () => process.env.EMAIL_USERNAME || "";
const TEAM_NAME = () => process.env.EMAIL_SENDER_NAME || "WV Support Team";

// Replies go to e.g. support+c_<threadId>@gmail.com — Gmail delivers it to the same inbox,
// and the tag tells the poller which thread the customer is answering
const THREAD_TAG = /\+c_([a-f0-9]{24})@/i;
const replyAddress = (id) => SENDER().replace("@", `+c_${id}@`);
const threadIdFromAddress = (address = "") => address.match(THREAD_TAG)?.[1] || null;

const escapeHtml = (value = "") =>
  String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const toHtml = (value) => escapeHtml(value).replace(/\n/g, "<br>");

// Threads created before the conversation list existed: build it from the old single-reply fields
const legacyLines = (doc) => [
  { sender: "user", content: doc.message, attachments: [], timestamp: doc.createdAt },
  ...(doc.replyMessage
    ? [
        {
          sender: "admin",
          content: doc.replyMessage,
          attachments: (doc.replyAttachments || []).map((a) => ({
            url: a.url,
            name: a.originalName || a.name,
            type: a.mimetype || a.type,
            size: a.size,
          })),
          timestamp: doc.lastReplyAt || doc.createdAt,
        },
      ]
    : []),
];

// Mongoose doc: fill `messages` once so new lines can be appended
const seedThread = (doc) => {
  if (!doc.messages?.length) doc.messages = legacyLines(doc);
};

// Plain object for the admin UI, always with a `messages` list and stable ids
const toThread = (doc) => {
  const plain = doc.toObject ? doc.toObject() : doc;
  const lines = plain.messages?.length ? plain.messages : legacyLines(plain);
  const { replyMessage, replyAttachments, ...rest } = plain;
  return {
    ...rest,
    messages: lines.map((line, i) => ({ ...line, _id: line._id || `${plain._id}-${i}` })),
  };
};

// Cuts the quoted history out of an email reply ("On … wrote:", "> …", Outlook headers)
const QUOTE_MARKERS = [
  /^On [\s\S]{0,300}?wrote:\s*$/m,
  /^-{2,}\s*Original Message\s*-{2,}/im,
  /^_{5,}\s*$/m,
  /^From: .+$/m,
  /^>/m,
];

const stripQuoted = (text = "") => {
  const cut = QUOTE_MARKERS.reduce((min, re) => {
    const match = text.match(re);
    return match && match.index < min ? match.index : min;
  }, text.length);
  return text.slice(0, cut).trim() || text.trim();
};

module.exports = {
  SENDER,
  TEAM_NAME,
  replyAddress,
  threadIdFromAddress,
  escapeHtml,
  toHtml,
  seedThread,
  toThread,
  stripQuoted,
};