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

const valueCard = new mongoose.Schema({ title: bilingual, description: bilingual }, { _id: false });

// About Us page — a single document (separate from the home "About" section)
const aboutPageContentSchema = new mongoose.Schema(
  {
    eyebrow: bilingual,
    headingLine1: bilingual,
    headingLine2: bilingual,
    body: bilingual,
    facts: { type: [text], default: [] }, // 3 quick facts under the intro
    values: { type: [valueCard], default: [] }, // 3 value cards
    image: { type: String, default: "" }, // "uploads/<file>" or "" = built-in
  },
  { timestamps: true }
);

const TEXT_FIELDS = ["eyebrow", "headingLine1", "headingLine2", "body"];

// One language, falling back to English
aboutPageContentSchema.methods.getLocalizedContent = function (language = "en") {
  const lang = ["en", "km"].includes(language) ? language : "en";
  const pick = (t) => t?.[lang] || t?.en || "";
  return {
    ...Object.fromEntries(TEXT_FIELDS.map((field) => [field, pick(this[field])])),
    facts: this.facts.map(pick),
    values: this.values.map((v) => ({ title: pick(v.title), description: pick(v.description) })),
    image: this.image,
    updatedAt: this.updatedAt,
  };
};

aboutPageContentSchema.statics.TEXT_FIELDS = TEXT_FIELDS;

module.exports = mongoose.model("AboutPageContent", aboutPageContentSchema);