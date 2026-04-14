const mongoose = require('mongoose');

const newsPopupSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  message: { type: String, default: '', trim: true },
  image: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  expiresAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('NewsPopup', newsPopupSchema);