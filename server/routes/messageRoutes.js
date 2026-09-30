const express = require("express");
const fs = require("fs");
const path = require("path");
const Message = require("../models/Message");
const verifyAdmin = require("../middleware/verifyAdmin");
const rateLimit = require("../middleware/rateLimit");
const { setupChatUpload } = require("../config/multer");

const router = express.Router();
const chatUpload = setupChatUpload();

// ── Helpers ──

// Accepts up to 5 files in the "attachments" field (JSON requests pass straight through)
const withAttachments = (req, res, next) =>
  chatUpload.array("attachments", 5)(req, res, (err) =>
    err ? res.status(400).json({ message: err.message }) : next()
  );

const toAttachments = (files = []) =>
  files.map((f) => ({
    url: `/uploads/chat/${f.filename}`,
    name: f.originalname,
    type: f.mimetype,
    size: f.size,
  }));

const removeUploadedFiles = (files = []) => files.forEach((f) => fs.unlink(f.path, () => {}));

const removeAttachmentFiles = (threads = []) =>
  threads
    .flatMap((t) => t.messages || [])
    .flatMap((m) => m.attachments || [])
    .filter((a) => a.url?.startsWith("/uploads/chat/"))
    .forEach((a) => fs.unlink(path.join(__dirname, "..", a.url), () => {}));

const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error(err);
    removeUploadedFiles(req.files);
    res.status(500).json({ message: "Server error" });
  }
};

const cleanText = (value) => (typeof value === "string" ? value.trim() : "");
const MAX_MESSAGE = 2000;
const SESSION_FORMAT = /^[\w-]{10,100}$/; // matches the widget's "user_<time>_<random>"

// Public chat limits, per IP
const sendLimit = rateLimit({ windowMs: 60 * 1000, max: 20, message: "You're sending messages too fast. Please wait a moment." });
const readLimit = rateLimit({ windowMs: 60 * 1000, max: 60 });
const nameLimit = rateLimit({ windowMs: 10 * 60 * 1000, max: 10 });

// Rejects visitor requests with a malformed session id
const validSession = (req, res, next) =>
  SESSION_FORMAT.test(req.params.sessionId) ? next() : res.status(400).json({ message: "Invalid session" });
const lastLine = (thread) => thread.messages[thread.messages.length - 1];
const socket = (req) => req.app.get("socket");
const STATUSES = ["open", "closed"];

// ── Visitor: send a message (creates the thread on first message, reopens if closed) ──
router.post(
  "/",
  sendLimit,
  withAttachments,
  handle(async (req, res) => {
    const sessionId = cleanText(req.body.sessionId);
    const content = cleanText(req.body.content);
    const attachments = toAttachments(req.files);
    if (!SESSION_FORMAT.test(sessionId) || (!content && !attachments.length) || content.length > MAX_MESSAGE) {
      removeUploadedFiles(req.files);
      return res.status(400).json({ message: `Messages can be up to ${MAX_MESSAGE} characters` });
    }

    const thread = await Message.findOneAndUpdate(
      { sessionId },
      {
        $push: { messages: { sender: "user", content, attachments } },
        $set: { status: "open" },
      },
      { upsert: true, new: true }
    );

    socket(req).broadcastToAdmins("new_message", thread);

    const line = lastLine(thread);
    res.status(201).json({
      success: true,
      message: { content: line.content, attachments: line.attachments, timestamp: line.timestamp },
    });
  })
);

// ── Visitor: load chat history for the widget ──
router.get(
  "/:sessionId",
  readLimit,
  validSession,
  handle(async (req, res) => {
    const thread = await Message.findOne({ sessionId: req.params.sessionId }).lean();
    res.json({
      name: thread?.user?.name || "",
      messages: (thread?.messages || []).map((m) => ({
        content: m.content,
        attachments: m.attachments || [],
        timestamp: m.timestamp,
        isAdmin: m.sender === "admin",
      })),
    });
  })
);

// ── Visitor: set their name (shown on the thread in the admin inbox straight away) ──
router.patch(
  "/:sessionId/name",
  nameLimit,
  validSession,
  handle(async (req, res) => {
    const name = cleanText(req.body.name).slice(0, 60);
    if (!name) return res.status(400).json({ message: "Name is required" });

    const thread = await Message.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { $set: { "user.name": name } },
      { new: true, timestamps: false }
    );
    if (!thread) return res.status(404).json({ message: "Thread not found" });

    socket(req).broadcastToAdmins("message_updated", thread);
    res.json({ success: true, name });
  })
);

// ── Admin: list threads (optional ?status=open|closed) ──
router.get(
  "/",
  verifyAdmin,
  handle(async (req, res) => {
    const { status } = req.query;
    const filter = STATUSES.includes(status) ? { status } : {};
    const threads = await Message.find(filter).sort({ updatedAt: -1 }).lean();
    res.json(threads);
  })
);

// ── Admin: reply to a thread (text, attachments, or both) ──
router.post(
  "/:sessionId/reply",
  verifyAdmin,
  withAttachments,
  handle(async (req, res) => {
    const content = cleanText(req.body.content);
    const attachments = toAttachments(req.files);
    if (!content && !attachments.length) {
      return res.status(400).json({ message: "A reply or attachment is required" });
    }

    const thread = await Message.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { $push: { messages: { sender: "admin", content, attachments, status: "delivered" } } },
      { new: true }
    );
    if (!thread) {
      removeUploadedFiles(req.files);
      return res.status(404).json({ message: "Thread not found" });
    }

    const reply = lastLine(thread);
    socket(req).sendToSession(req.params.sessionId, "admin_reply", {
      content: reply.content,
      attachments: reply.attachments,
      timestamp: reply.timestamp,
    });
    socket(req).broadcastToAdmins("message_updated", thread);

    res.json(thread);
  })
);

// ── Admin: mark all visitor lines in a thread as read (doesn't bump updatedAt / list order) ──
router.patch(
  "/:sessionId/read",
  verifyAdmin,
  handle(async (req, res) => {
    const thread = await Message.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { $set: { "messages.$[line].status": "read" } },
      {
        new: true,
        timestamps: false,
        arrayFilters: [{ "line.sender": "user", "line.status": { $ne: "read" } }],
      }
    );
    if (!thread) return res.status(404).json({ message: "Thread not found" });

    socket(req).broadcastToAdmins("message_updated", thread);
    res.json(thread);
  })
);

// ── Admin: open / close a thread ──
router.patch(
  "/:sessionId/status",
  verifyAdmin,
  handle(async (req, res) => {
    const { status } = req.body;
    if (!STATUSES.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const thread = await Message.findOneAndUpdate(
      { sessionId: req.params.sessionId },
      { $set: { status } },
      { new: true }
    );
    if (!thread) return res.status(404).json({ message: "Thread not found" });

    res.json(thread);
  })
);

// ── Admin: delete a thread (and its attachment files) ──
router.delete(
  "/:sessionId",
  verifyAdmin,
  handle(async (req, res) => {
    const deleted = await Message.findOneAndDelete({ sessionId: req.params.sessionId });
    if (!deleted) return res.status(404).json({ message: "Thread not found" });

    removeAttachmentFiles([deleted]);
    res.json({ message: "Thread deleted" });
  })
);

module.exports = router;