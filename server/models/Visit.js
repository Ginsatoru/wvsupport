// models/Visit.js — one document per page view
const mongoose = require("mongoose");

const VisitSchema = new mongoose.Schema(
  {
    viewId: { type: String, index: { unique: true, sparse: true } }, // set by the tracker; older docs have none
    path: { type: String, required: true, index: true },
    visitorId: { type: String, required: true, index: true }, // persistent id from the visitor's browser
    ip: { type: String, default: "unknown" },
    userAgent: { type: String, default: "" },
    country: { type: String, default: "Unknown" },
    browser: { type: String, default: "unknown" },
    deviceType: {
      type: String,
      enum: ["desktop", "tablet", "mobile", "bot", "unknown"],
      default: "unknown",
    },
    os: { type: String, default: "unknown" },
    engagement: {
      clicks: { type: Number, default: 0 },
      scrollDepth: { type: Number, default: 0, min: 0, max: 1 },
      timeSpent: { type: Number, default: 0 }, // seconds
    },
  },
  { timestamps: true }
);

VisitSchema.index({ createdAt: 1, visitorId: 1 });

module.exports = mongoose.model("Visit", VisitSchema);