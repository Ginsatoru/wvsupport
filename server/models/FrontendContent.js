const mongoose = require('mongoose');

// Helper schema for bilingual text fields
const bilingualTextSchema = {
  en: {
    type: String,
    required: true,
    trim: true
  },
  km: {
    type: String,
    default: '',
    trim: true
  }
};

const heroContentSchema = new mongoose.Schema({
  // Bilingual text fields
  title: bilingualTextSchema,
  subtitle: bilingualTextSchema,
  primaryCtaText: bilingualTextSchema,
  secondaryCtaText: bilingualTextSchema,
  
  // URL fields (language-independent)
  primaryCtaLink: {
    type: String,
    required: true,
    default: "/services"
  },
  secondaryCtaLink: {
    type: String,
    required: true,
    default: "/contact"
  },
  
  // Image field (language-independent)
  backgroundImage: {
    type: String,
    required: true
  },
  
  // Status and metadata
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

// Method to get localized content
heroContentSchema.methods.getLocalizedContent = function(language = 'en') {
  const supportedLangs = ['en', 'km'];
  const lang = supportedLangs.includes(language) ? language : 'en';
  const fallbackLang = 'en';
  
  return {
    _id: this._id,
    title: this.title[lang] || this.title[fallbackLang] || '',
    subtitle: this.subtitle[lang] || this.subtitle[fallbackLang] || '',
    primaryCtaText: this.primaryCtaText[lang] || this.primaryCtaText[fallbackLang] || 'Learn More',
    secondaryCtaText: this.secondaryCtaText[lang] || this.secondaryCtaText[fallbackLang] || 'Get Started',
    primaryCtaLink: this.primaryCtaLink,
    secondaryCtaLink: this.secondaryCtaLink,
    backgroundImage: this.backgroundImage,
    isActive: this.isActive,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Static method to find active hero with language support
heroContentSchema.statics.findActiveWithLang = async function(language = 'en') {
  const activeHero = await this.findOne({ isActive: true }).sort({ updatedAt: -1 });
  return activeHero ? activeHero.getLocalizedContent(language) : null;
};

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

// Pre-save validation to ensure English content exists
heroContentSchema.pre('save', function(next) {
  const requiredFields = ['title', 'subtitle', 'primaryCtaText', 'secondaryCtaText'];
  
  for (const field of requiredFields) {
    if (this[field] && !this[field].en) {
      return next(new Error(`English content is required for ${field}`));
    }
  }
  
  next();
});

module.exports = mongoose.model('HeroContent', heroContentSchema);