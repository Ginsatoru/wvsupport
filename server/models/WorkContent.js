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

const tool = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    logo: { type: String, default: "" }, // "uploads/<file>", or "" = built-in logo
  },
  { _id: false }
);

const card = new mongoose.Schema({ title: bilingual, description: bilingual }, { _id: false });

// Home "Work / Our Base" section — a single document
const workContentSchema = new mongoose.Schema(
  {
    eyebrow: bilingual,
    headingLine1: bilingual,
    headingLine2: bilingual,
    headingLine3: bilingual,
    body: bilingual,
    buttonText: bilingual,
    buttonLink: { type: String, default: "" },
    toolsLabel: bilingual,
    tools: { type: [tool], default: [] }, // 4 tools
    badgeLeftTitle: bilingual, // "100% Remote"
    badgeLeftText: bilingual,
    badgeRightTitle: bilingual, // "15 Min Response"
    badgeRightText: bilingual,
    cards: { type: [card], default: [] }, // 4 service cards
    image: { type: String, default: "" }, // person — "uploads/<file>" or "" = built-in
  },
  { timestamps: true }
);

const TEXT_FIELDS = [
  "eyebrow", "headingLine1", "headingLine2", "headingLine3", "body", "buttonText", "toolsLabel",
  "badgeLeftTitle", "badgeLeftText", "badgeRightTitle", "badgeRightText",
];

// One language, falling back to English
workContentSchema.methods.getLocalizedContent = function (language = "en") {
  const lang = ["en", "km"].includes(language) ? language : "en";
  const pick = (t) => t?.[lang] || t?.en || "";
  return {
    ...Object.fromEntries(TEXT_FIELDS.map((field) => [field, pick(this[field])])),
    buttonLink: this.buttonLink,
    tools: this.tools.map((t) => ({ name: t.name, logo: t.logo })),
    cards: this.cards.map((c) => ({ title: pick(c.title), description: pick(c.description) })),
    image: this.image,
    updatedAt: this.updatedAt,
  };
};

workContentSchema.statics.TEXT_FIELDS = TEXT_FIELDS;

module.exports = mongoose.model("WorkContent", workContentSchema);