// models/ContactMessage.js
const mongoose = require("mongoose");

// Schema for attachment files
const attachmentSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  mimetype: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  path: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  }
});

const contactMessageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  read: {
    type: Boolean,
    default: false,
  },
  starred: {
    type: Boolean,
    default: false,
  },
  replied: {
    type: Boolean,
    default: false,
  },
  replyMessage: {
    type: String,
    default: null,
  },
  // NEW: Store reply attachments
  replyAttachments: [attachmentSchema],
  status: {
    type: String,
    enum: ['open', 'closed'],
    default: 'open',
  },
  // Enhanced tracking fields
  closedAt: {
    type: Date,
    default: null,
  },
  reopenedAt: {
    type: Date,
    default: null,
  },
  lastReplyAt: {
    type: Date,
    default: null,
  },
  // Optional: Track who performed actions (if you have admin user system)
  closedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null,
  },
  reopenedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null,
  },
  repliedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null,
  },
}, {
  timestamps: true,
});

// Add indexes for better query performance
contactMessageSchema.index({ createdAt: -1 });
contactMessageSchema.index({ read: 1 });
contactMessageSchema.index({ status: 1 });
contactMessageSchema.index({ starred: 1 });
contactMessageSchema.index({ closedAt: 1 });
contactMessageSchema.index({ lastReplyAt: -1 });

// Virtual field to calculate if message was recently replied to
contactMessageSchema.virtual('isRecentlyReplied').get(function() {
  if (!this.lastReplyAt) return false;
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  return this.lastReplyAt > oneDayAgo;
});

// Virtual field to calculate how long message has been open
contactMessageSchema.virtual('openDuration').get(function() {
  const startDate = this.reopenedAt || this.createdAt;
  const endDate = this.closedAt || new Date();
  return Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to automatically set timestamps
contactMessageSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'closed' && !this.closedAt) {
    this.closedAt = new Date();
  }
  
  if (this.isModified('status') && this.status === 'open' && this.closedAt) {
    this.reopenedAt = new Date();
    this.closedAt = null;
  }
  
  next();
});

// Instance method to close message
contactMessageSchema.methods.close = function(closedBy = null) {
  this.status = 'closed';
  this.closedAt = new Date();
  if (closedBy) this.closedBy = closedBy;
  return this.save();
};

// Instance method to reopen message
contactMessageSchema.methods.reopen = function(reopenedBy = null) {
  this.status = 'open';
  this.reopenedAt = new Date();
  this.closedAt = null;
  if (reopenedBy) this.reopenedBy = reopenedBy;
  return this.save();
};

// Instance method to add reply with attachments
contactMessageSchema.methods.addReply = function(replyText, attachments = [], repliedBy = null) {
  this.replied = true;
  this.replyMessage = replyText;
  this.replyAttachments = attachments;
  this.lastReplyAt = new Date();
  this.read = true;
  if (repliedBy) this.repliedBy = repliedBy;
  return this.save();
};

// Static methods
contactMessageSchema.statics.getUnreadCount = function() {
  return this.countDocuments({ read: false });
};

contactMessageSchema.statics.getOpenCount = function() {
  return this.countDocuments({ status: 'open' });
};

contactMessageSchema.statics.getNeedsAttentionCount = function() {
  return this.countDocuments({ 
    $or: [
      { read: false },
      { status: 'open', replied: false }
    ]
  });
};

module.exports = mongoose.model("ContactMessage", contactMessageSchema);