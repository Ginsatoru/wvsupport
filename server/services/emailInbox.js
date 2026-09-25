// Polls the Gmail inbox over IMAP and adds customer replies to their contact thread.
// Only emails sent to a tagged address (support+c_<threadId>@gmail.com) are touched,
// and nothing is marked read or moved in Gmail.
const fs = require("fs");
const path = require("path");
const { ImapFlow } = require("imapflow");
const { simpleParser } = require("mailparser");
const ContactMessage = require("../models/ContactMessage");
const { CONTACT_FILE_TYPES, MAX_FILE_SIZE, uploadDir, uniqueName } = require("../config/multer");
const { SENDER, threadIdFromAddress, seedThread, toThread, stripQuoted } = require("./contactThread");

const POLL_MS = Number(process.env.EMAIL_INBOX_POLL_MS) || 60 * 1000;
const LOOKBACK_MS = 3 * 24 * 60 * 60 * 1000; // first scan after a restart looks back 3 days

let lastUid = 0;
let running = false;

const threadIdFromEnvelope = (envelope = {}) =>
  [...(envelope.to || []), ...(envelope.cc || [])].map((a) => threadIdFromAddress(a.address)).find(Boolean) || null;

// Saves supported attachments (same types/size as admin uploads) under uploads/attachments
const saveAttachments = (attachments = []) =>
  attachments
    .filter((a) => CONTACT_FILE_TYPES[a.contentType] && a.size <= MAX_FILE_SIZE && a.contentDisposition !== "inline")
    .map((a) => {
      const filename = uniqueName("contact", CONTACT_FILE_TYPES[a.contentType]);
      fs.mkdirSync(uploadDir("attachments"), { recursive: true });
      fs.writeFileSync(path.join(uploadDir("attachments"), filename), a.content);
      return { url: `/uploads/attachments/${filename}`, name: a.filename || filename, type: a.contentType, size: a.size };
    });

const saveReply = async (threadId, email, socketServer) => {
  const doc = await ContactMessage.findById(threadId);
  if (!doc) return;

  // Only the original customer can add to the thread, and never the same email twice
  const from = email.from?.value?.[0]?.address?.toLowerCase();
  if (from !== doc.email) return;
  if (email.messageId && doc.messages.some((l) => l.emailMessageId === email.messageId)) return;

  const attachments = saveAttachments(email.attachments);
  const content = stripQuoted(email.text || "");
  if (!content && !attachments.length) return;

  seedThread(doc);
  doc.messages.push({
    sender: "user",
    content,
    attachments,
    timestamp: email.date || new Date(),
    emailMessageId: email.messageId,
  });
  doc.read = false;
  doc.status = "open";
  doc.lastReplyAt = new Date();
  await doc.save();

  socketServer.broadcastToAdmins("contact_updated", toThread(doc));
  console.log(`📧 Customer reply added to contact thread ${threadId}`);
};

const checkInbox = async (socketServer) => {
  if (running) return;
  running = true;

  const client = new ImapFlow({
    host: "imap.gmail.com",
    port: 993,
    secure: true,
    auth: { user: SENDER(), pass: process.env.EMAIL_PASSWORD },
    logger: false,
  });

  try {
    await client.connect();
    const lock = await client.getMailboxLock("INBOX");
    try {
      // First run: recent mail by date. After that: only mail newer than the last UID seen.
      const range = lastUid
        ? `${lastUid + 1}:*`
        : await client.search({ since: new Date(Date.now() - LOOKBACK_MS) }, { uid: true });
      if (Array.isArray(range) && !range.length) return;

      const replies = [];
      for await (const msg of client.fetch(range, { uid: true, envelope: true }, { uid: true })) {
        if (msg.uid <= lastUid) continue; // "N:*" still returns the newest mail when nothing is new
        lastUid = Math.max(lastUid, msg.uid);
        const threadId = threadIdFromEnvelope(msg.envelope);
        if (threadId) replies.push({ uid: msg.uid, threadId });
      }

      for (const { uid, threadId } of replies) {
        const { content } = await client.download(String(uid), undefined, { uid: true });
        await saveReply(threadId, await simpleParser(content), socketServer);
      }
    } finally {
      lock.release();
    }
  } catch (err) {
    console.error("📧 Email inbox check failed:", err.message);
  } finally {
    running = false;
    await client.logout().catch(() => {});
  }
};

const startEmailInbox = (socketServer) => {
  if (!SENDER() || !process.env.EMAIL_PASSWORD) {
    console.warn("⚠️  Email inbox polling off — EMAIL_USERNAME / EMAIL_PASSWORD missing");
    return;
  }
  checkInbox(socketServer);
  setInterval(() => checkInbox(socketServer), POLL_MS);
  console.log(`📧 Checking inbox for customer replies every ${POLL_MS / 1000}s`);
};

module.exports = { startEmailInbox };