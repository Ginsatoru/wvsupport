const mongoose = require('mongoose');

const heroContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  subtitle: {
    type: String,
    required: true,
    trim: true
  },
  primaryCtaText: {
    type: String,
    required: true,
    default: "Learn More"
  },
  primaryCtaLink: {
    type: String,
    required: true,
    default: "/services"
  },
  secondaryCtaText: {
    type: String,
    required: true,
    default: "Get Started"
  },
  secondaryCtaLink: {
    type: String,
    required: true,
    default: "/contact"
  },
  backgroundImage: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
heroContentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update the updatedAt field before updating
heroContentSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('HeroContent', heroContentSchema);