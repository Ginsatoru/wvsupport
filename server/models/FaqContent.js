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

const faqItem = new mongoose.Schema({ question: bilingual, answer: bilingual }, { _id: false });

// FAQ page — a single document
const faqContentSchema = new mongoose.Schema(
  {
    eyebrow: bilingual,
    title: bilingual,
    intro: bilingual,
    items: { type: [faqItem], default: [] }, // questions, in order
  },
  { timestamps: true }
);

// One language, falling back to English
faqContentSchema.methods.getLocalizedContent = function (language = "en") {
  const lang = ["en", "km"].includes(language) ? language : "en";
  const pick = (t) => t?.[lang] || t?.en || "";
  return {
    eyebrow: pick(this.eyebrow),
    title: pick(this.title),
    intro: pick(this.intro),
    items: this.items.map((item) => ({ question: pick(item.question), answer: pick(item.answer) })),
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("FaqContent", faqContentSchema);