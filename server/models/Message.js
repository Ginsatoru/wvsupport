const mongoose = require("mongoose");

// A file attached to a chat line ("type" needs the object form — a bare `type: String` means something else to Mongoose)
const AttachmentSchema = new mongoose.Schema(
  {
    url: String,
    name: String,
    type: { type: String },
    size: Number,
  },
  { _id: false }
);

// A single chat line inside a thread (text, attachments, or both)
const ChatLineSchema = new mongoose.Schema({
  sender: { type: String, enum: ["user", "admin"], required: true },
  content: { type: String, trim: true, default: "" },
  attachments: [AttachmentSchema],
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" },
});

// One thread per visitor session
const MessageSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    status: { type: String, enum: ["open", "closed"], default: "open" },
    // Legacy: older threads stored name/email from the old chat form
    user: { name: String, email: String },
    messages: [ChatLineSchema],
  },
  { timestamps: true }
);

// One thread per session (partial so very old docs without a sessionId don't clash)
MessageSchema.index(
  { sessionId: 1 },
  { unique: true, partialFilterExpression: { sessionId: { $type: "string" } } }
);
MessageSchema.index({ status: 1, updatedAt: -1 });

module.exports = mongoose.model("Message", MessageSchema);