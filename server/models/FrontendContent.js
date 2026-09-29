const mongoose = require("mongoose");

// Bilingual text — English required
const requiredText = {
  en: { type: String, required: true, trim: true },
  km: { type: String, default: "", trim: true },
};

// Bilingual text — both optional
const optionalText = new mongoose.Schema(
  {
    en: { type: String, default: "", trim: true },
    km: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const DEFAULT_FEATURES = [
  { en: "25+ Years\nTrusted", km: "ទុកចិត្តជាង 25 ឆ្នាំ" },
  { en: "AU, NZ & Asia-\nPacific Reach", km: "អាស៊ី-ប៉ាស៊ីហ្វិក" },
  { en: "7 Days a Week\nSupport", km: "គាំទ្រ 7 ថ្ងៃក្នុងសប្តាហ៍" },
];

const heroContentSchema = new mongoose.Schema(
  {
    title: requiredText, // "\n" = line break on the site
    subtitle: requiredText,
    primaryCtaText: requiredText,
    secondaryCtaText: requiredText,
    primaryCtaLink: { type: String, default: "/services" },
    secondaryCtaLink: { type: String, default: "/contact" },
    features: { type: [optionalText], default: DEFAULT_FEATURES }, // the 3 highlights under the buttons
    testimonial: { type: optionalText, default: () => ({}) }, // floating quote card on the image
    backgroundImage: { type: String, required: true }, // stored as "uploads/<file>"
    personImage: { type: String, default: "" }, // optional cut-out person over the background
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// One language, falling back to English
heroContentSchema.methods.getLocalizedContent = function (language = "en") {
  const lang = ["en", "km"].includes(language) ? language : "en";
  const pick = (text, fallback = "") => text?.[lang] || text?.en || fallback;
  return {
    _id: this._id,
    title: pick(this.title),
    subtitle: pick(this.subtitle),
    primaryCtaText: pick(this.primaryCtaText, "Learn More"),
    secondaryCtaText: pick(this.secondaryCtaText, "Get Started"),
    primaryCtaLink: this.primaryCtaLink,
    secondaryCtaLink: this.secondaryCtaLink,
    features: (this.features || []).map((f) => pick(f)),
    testimonial: pick(this.testimonial),
    backgroundImage: this.backgroundImage,
    personImage: this.personImage,
    isActive: this.isActive,
    updatedAt: this.updatedAt,
  };
};

heroContentSchema.statics.findActiveWithLang = async function (language = "en") {
  const active = await this.findOne({ isActive: true }).sort({ updatedAt: -1 });
  return active ? active.getLocalizedContent(language) : null;
};

heroContentSchema.statics.DEFAULT_FEATURES = DEFAULT_FEATURES;

module.exports = mongoose.model("HeroContent", heroContentSchema);