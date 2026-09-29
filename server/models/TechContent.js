const mongoose = require("mongoose");

// Bilingual text — both optional (empty = the site keeps its built-in wording)
const text = new mongoose.Schema(
  {
    en: { type: String, default: "", trim: true },
    km: { type: String, default: "", trim: true },
  },
  { _id: false }
);
const bilingual = { type: text, default: () => ({}) };

// Home "Tech / RM Mobile" section — a single document
const techContentSchema = new mongoose.Schema(
  {
    eyebrow: bilingual,
    headingLine1: bilingual,
    headingLine2: bilingual,
    body: bilingual,
    statNumber: { type: String, default: "" }, // e.g. "60,000+"
    statLabel: bilingual, // e.g. "active businesses"
    devices: { type: [text], default: [] }, // 4 device badges
    badgeTitle: bilingual, // top-left floating card
    badgeText: bilingual,
    cardTitle: bilingual, // bottom floating card
    cardText: bilingual,
    buttonText: bilingual,
    buttonLink: { type: String, default: "" },
    image: { type: String, default: "" }, // person image — "uploads/<file>" or "" = built-in
    avatars: { type: [String], default: [] }, // 4 small photos — "uploads/<file>" or "" = built-in
  },
  { timestamps: true }
);

const TEXT_FIELDS = ["eyebrow", "headingLine1", "headingLine2", "body", "statLabel", "badgeTitle", "badgeText", "cardTitle", "cardText", "buttonText"];

// One language, falling back to English
techContentSchema.methods.getLocalizedContent = function (language = "en") {
  const lang = ["en", "km"].includes(language) ? language : "en";
  const pick = (t) => t?.[lang] || t?.en || "";
  return {
    ...Object.fromEntries(TEXT_FIELDS.map((field) => [field, pick(this[field])])),
    devices: this.devices.map(pick),
    statNumber: this.statNumber,
    buttonLink: this.buttonLink,
    image: this.image,
    avatars: this.avatars,
    updatedAt: this.updatedAt,
  };
};

techContentSchema.statics.TEXT_FIELDS = TEXT_FIELDS;

module.exports = mongoose.model("TechContent", techContentSchema);