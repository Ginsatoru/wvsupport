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

const legalSection = new mongoose.Schema({ title: bilingual, body: bilingual }, { _id: false });

// Legal (Terms & Conditions) page — a single document
const legalContentSchema = new mongoose.Schema(
  {
    eyebrow: bilingual,
    title: bilingual,
    sections: { type: [legalSection], default: [] }, // in order
  },
  { timestamps: true }
);

// One language, falling back to English
legalContentSchema.methods.getLocalizedContent = function (language = "en") {
  const lang = ["en", "km"].includes(language) ? language : "en";
  const pick = (t) => t?.[lang] || t?.en || "";
  return {
    eyebrow: pick(this.eyebrow),
    title: pick(this.title),
    sections: this.sections.map((s) => ({ title: pick(s.title), body: pick(s.body) })),
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("LegalContent", legalContentSchema);