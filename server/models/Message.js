const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  // Session tracking
  sessionId: {
    type: String,
  },
  
  // Message thread status
  status: {
    type: String,
    enum: ['open', 'replied', 'closed'],
    default: 'open'
  },
  
  // Participant information
  user: {
    id: String,
    name: String,
    email: String,
    ipAddress: String // Optional for analytics
  },
  
  // All messages in the conversation thread
  messages: [{
    sender: {
      type: String,
      enum: ['user', 'admin'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    // For rich messages
    attachments: [{
      url: String,
      type: String, // 'image', 'file', etc.
      name: String
    }],
    // For message status tracking
    status: {
      type: String,
      enum: ['sent', 'delivered', 'read'],
      default: 'sent'
    }
  }],
  
  // Metadata
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  // For admin assignment
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Additional metadata
  tags: [String],
  priority: {
    type: Number,
    min: 1,
    max: 5,
    default: 3
  }
});

// Update the updatedAt field on save
MessageSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add indexing for better performance
MessageSchema.index({ sessionId: 1 });
MessageSchema.index({ 'user.email': 1 });
MessageSchema.index({ status: 1 });
MessageSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Message', MessageSchema);