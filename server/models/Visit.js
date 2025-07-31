// models/Visit.js
const mongoose = require('mongoose');

const VisitSchema = new mongoose.Schema({
  path: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ip: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  browser: {
    type: String,
    required: true
  },
  deviceType: {
    type: String,
    enum: ['desktop', 'tablet', 'mobile', 'bot', 'other'],
    required: true
  },
  os: {
    type: String,
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  engagement: {
    clicks: {
      type: Number,
      default: 0
    },
    scrollDepth: {
      type: Number,
      default: 0
    },
    timeSpent: {
      type: Number, // in seconds
      default: 0
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Visit', VisitSchema);