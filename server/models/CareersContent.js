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
const opening = new mongoose.Schema({ title: bilingual, type: bilingual, description: bilingual }, { _id: false });

// Careers page — a single document (contact details come from Settings)
const careersContentSchema = new mongoose.Schema(
  {
    eyebrow: bilingual,
    title: bilingual,
    body: bilingual,
    image: { type: String, default: "" }, // "uploads/<file>" or "" = built-in
    values: { type: [valueCard], default: [] }, // 3 value cards
    boxTitle: bilingual, // e.g. "No Openings Right Now"
    boxText: bilingual,
    buttonText: bilingual, // "Send Your Resume"
    buttonLink: { type: String, default: "" }, // "" = mailto the email in Settings
    openings: { type: [opening], default: [] }, // open roles (none = just the box text)
  },
  { timestamps: true }
);

const TEXT_FIELDS = ["eyebrow", "title", "body", "boxTitle", "boxText", "buttonText"];

// One language, falling back to English
careersContentSchema.methods.getLocalizedContent = function (language = "en") {
  const lang = ["en", "km"].includes(language) ? language : "en";
  const pick = (t) => t?.[lang] || t?.en || "";
  return {
    ...Object.fromEntries(TEXT_FIELDS.map((field) => [field, pick(this[field])])),
    image: this.image,
    buttonLink: this.buttonLink,
    values: this.values.map((v) => ({ title: pick(v.title), description: pick(v.description) })),
    openings: this.openings.map((o) => ({ title: pick(o.title), type: pick(o.type), description: pick(o.description) })),
    updatedAt: this.updatedAt,
  };
};

careersContentSchema.statics.TEXT_FIELDS = TEXT_FIELDS;

module.exports = mongoose.model("CareersContent", careersContentSchema);