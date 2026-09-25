const fs = require("fs");
const path = require("path");
const ContactMessage = require("../models/ContactMessage");
const { transporter } = require("../config/nodemailer");
const { setupContactUpload } = require("../config/multer");
const {
  SENDER,
  TEAM_NAME,
  replyAddress,
  escapeHtml,
  toHtml,
  seedThread,
  toThread,
} = require("../services/contactThread");

// ── Helpers ──
const handle = (label, fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (error) {
    console.error(`Error ${label}:`, error);
    removeUploads(req.files);
    res.status(500).json({ success: false, message: `Failed to ${label}` });
  }
};

const cleanText = (value) => (typeof value === "string" ? value.trim() : "");
const notFound = (res) => res.status(404).json({ success: false, message: "Message not found" });
const pushToAdmins = (req, doc) => req.app.get("socket").broadcastToAdmins("contact_updated", toThread(doc));

const toAttachments = (files = []) =>
  files.map((f) => ({
    url: `/uploads/attachments/${f.filename}`,
    name: f.originalname,
    type: f.mimetype,
    size: f.size,
  }));

const removeUploads = (files = []) => files.forEach((f) => fs.unlink(f.path, () => {}));

// Deletes attachment files saved on this server (new relative urls + legacy saved paths)
const removeAttachmentFiles = (doc) => {
  const lines = toThread(doc).messages;
  lines
    .flatMap((line) => line.attachments || [])
    .forEach((a) => {
      if (a.url?.startsWith("/uploads/attachments/")) fs.unlink(path.join(__dirname, "..", a.url), () => {});
    });
  (doc.replyAttachments || []).forEach((a) => a.path && fs.unlink(a.path, () => {}));
};

const updateStatus = (label, buildUpdate) =>
  handle(label, async (req, res) => {
    const doc = await ContactMessage.findByIdAndUpdate(req.params.id, buildUpdate(req), { new: true });
    if (!doc) return notFound(res);
    pushToAdmins(req, doc);
    res.status(200).json({ success: true, data: toThread(doc) });
  });

// ── Public: contact form submission ──
const sendContactMessage = handle("send message", async (req, res) => {
  const [name, email, subject, message] = ["name", "email", "subject", "message"].map((k) => cleanText(req.body[k]));
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  const doc = await ContactMessage.create({
    name,
    email,
    subject,
    message,
    messages: [{ sender: "user", content: message }],
  });

  await transporter.sendMail({
    from: SENDER(),
    to: SENDER(),
    replyTo: email,
    subject: `New Contact Form Submission: ${subject}`,
    text: `New contact form submission:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage:\n${message}`,
    html: `
      <h1>New Contact Form Submission</h1>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
      <p><strong>Message:</strong></p>
      <div style="background:#f5f5f5;padding:15px;margin:10px 0;border-left:4px solid #007bff;">${toHtml(message)}</div>
      <hr><p><small>Reply from the admin dashboard to keep the conversation in one thread.</small></p>
    `,
  });

  pushToAdmins(req, doc);
  res.status(200).json({ success: true, message: "Message sent successfully" });
});

// ── Admin: list all conversations ──
const getAllMessages = handle("fetch messages", async (req, res) => {
  const docs = await ContactMessage.find().sort({ createdAt: -1 }).lean();
  res.status(200).json({ success: true, data: docs.map(toThread) });
});

// ── Admin: reply by email (text and/or attachments) ──
const replyToMessage = handle("send reply", async (req, res) => {
  const content = cleanText(req.body.replyMessage);
  const attachments = toAttachments(req.files);
  if (!content && !attachments.length) {
    return res.status(400).json({ success: false, message: "Reply message is required" });
  }

  const doc = await ContactMessage.findById(req.params.id);
  if (!doc) {
    removeUploads(req.files);
    return notFound(res);
  }
  seedThread(doc);

  // Thread the email under the customer's last email so it stays one conversation in their inbox
  const lastCustomerEmailId = [...doc.messages].reverse().find((l) => l.sender === "user" && l.emailMessageId)
    ?.emailMessageId;

  const info = await transporter.sendMail({
    from: `"${TEAM_NAME()}" <${SENDER()}>`,
    to: doc.email,
    replyTo: replyAddress(doc._id),
    subject: `Re: ${doc.subject}`,
    ...(lastCustomerEmailId && { inReplyTo: lastCustomerEmailId, references: [lastCustomerEmailId] }),
    text: `Dear ${doc.name},\n\n${content}\n\nBest regards,\n${TEAM_NAME()}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
        <p>Dear ${escapeHtml(doc.name)},</p>
        <div style="background:#f8f9fa;padding:20px;margin:15px 0;border-radius:5px;">${toHtml(content)}</div>
        ${
          attachments.length
            ? `<p><strong>Attachments:</strong></p><ul>${attachments
                .map((a) => `<li>${escapeHtml(a.name)} (${(a.size / 1024).toFixed(1)} KB)</li>`)
                .join("")}</ul>`
            : ""
        }
        <p>Best regards,<br><strong>${escapeHtml(TEAM_NAME())}</strong></p>
        <hr style="margin:20px 0;border:none;border-top:1px solid #eee;">
        <div style="background:#f5f5f5;padding:15px;border-radius:5px;">
          <p><strong>Your original message:</strong></p>
          <p><strong>Subject:</strong> ${escapeHtml(doc.subject)}</p>
          <p>${toHtml(doc.message)}</p>
        </div>
      </div>
    `,
    attachments: (req.files || []).map((f) => ({ filename: f.originalname, path: f.path, contentType: f.mimetype })),
  });

  doc.messages.push({ sender: "admin", content, attachments, emailMessageId: info.messageId });
  doc.replied = true;
  doc.read = true;
  doc.lastReplyAt = new Date();
  await doc.save();

  pushToAdmins(req, doc);
  res.status(200).json({ success: true, message: "Reply sent successfully", data: toThread(doc) });
});

// ── Admin: simple field updates ──
const markAsRead = updateStatus("mark message as read", () => ({ read: true }));
const toggleStar = updateStatus("toggle star", (req) => ({ starred: !!req.body.starred }));
const closeMessage = updateStatus("close message", () => ({ status: "closed", closedAt: new Date() }));
const reopenMessage = updateStatus("reopen message", () => ({
  status: "open",
  reopenedAt: new Date(),
  closedAt: null,
}));

// ── Admin: delete a conversation and its files ──
const deleteMessage = handle("delete message", async (req, res) => {
  const doc = await ContactMessage.findByIdAndDelete(req.params.id).lean();
  if (!doc) return notFound(res);
  removeAttachmentFiles(doc);
  res.status(200).json({ success: true, message: "Message deleted successfully" });
});

// Upload middleware: up to 5 files in "attachments"; returns 400 on bad type/size
const contactUpload = setupContactUpload();
const uploadAttachments = (req, res, next) =>
  contactUpload.array("attachments", 5)(req, res, (err) =>
    err ? res.status(400).json({ success: false, message: err.message }) : next()
  );

module.exports = {
  sendContactMessage,
  getAllMessages,
  replyToMessage,
  markAsRead,
  toggleStar,
  deleteMessage,
  closeMessage,
  reopenMessage,
  uploadAttachments,
};