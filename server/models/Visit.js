// models/Visit.js
const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true,
    index: true
  },
  ip: {
    type: String,
    required: true,
    index: true
  },
  visitorId: {
    type: String,
    required: true,
    index: true  // This is the persistent visitor ID from localStorage
  },
  userAgent: {
    type: String,
    required: true
  },
  country: {
    type: String,
    default: 'Unknown'
  },
  browser: {
    type: String,
    default: 'unknown'
  },
  deviceType: {
    type: String,
    enum: ['desktop', 'tablet', 'mobile', 'bot', 'unknown'],
    default: 'unknown'
  },
  os: {
    type: String,
    default: 'unknown'
  },
  // Optional engagement tracking
  engagement: {
    clicks: {
      type: Number,
      default: 0
    },
    scrollDepth: {
      type: Number,
      default: 0,
      min: 0,
      max: 1
    },
    timeSpent: {
      type: Number, // in seconds
      default: 0
    }
  }
}, {
  timestamps: true // This creates createdAt and updatedAt fields
});

// Indexes for better query performance
VisitSchema.index({ createdAt: 1 });
VisitSchema.index({ visitorId: 1, createdAt: 1 });
VisitSchema.index({ createdAt: 1, visitorId: 1 });

module.exports = mongoose.model('Visit', VisitSchema);