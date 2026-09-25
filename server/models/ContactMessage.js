const mongoose = require("mongoose");

// A file on a conversation line ("type" needs the object form — a bare `type: String` means something else to Mongoose)
const attachmentSchema = new mongoose.Schema(
  { url: String, name: String, type: { type: String }, size: Number },
  { _id: false }
);

// One email in the conversation — from the customer ("user") or from us ("admin")
const lineSchema = new mongoose.Schema({
  sender: { type: String, enum: ["user", "admin"], required: true },
  content: { type: String, default: "" },
  attachments: [attachmentSchema],
  timestamp: { type: Date, default: Date.now },
  emailMessageId: String, // Message-ID header, used for email threading + skipping duplicates
});

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true }, // original contact-form message
    messages: [lineSchema], // full conversation, starting with the original message
    read: { type: Boolean, default: false },
    starred: { type: Boolean, default: false },
    replied: { type: Boolean, default: false },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    lastReplyAt: { type: Date, default: null }, // last activity from either side
    closedAt: { type: Date, default: null },
    reopenedAt: { type: Date, default: null },

    // Legacy: single-reply fields from before threads — read once, then folded into `messages`
    replyMessage: { type: String, default: null },
    replyAttachments: [mongoose.Schema.Types.Mixed],
  },
  { timestamps: true }
);

contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ status: 1 });
contactMessageSchema.index({ read: 1 });

contactMessageSchema.statics.getUnreadCount = function () {
  return this.countDocuments({ read: false });
};

contactMessageSchema.statics.getOpenCount = function () {
  return this.countDocuments({ status: "open" });
};

contactMessageSchema.statics.getNeedsAttentionCount = function () {
  return this.countDocuments({ $or: [{ read: false }, { status: "open", replied: false }] });
};

module.exports = mongoose.model("ContactMessage", contactMessageSchema);