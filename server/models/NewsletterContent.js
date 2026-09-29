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

// Home newsletter signup block — a single document
const newsletterContentSchema = new mongoose.Schema(
  {
    title: bilingual,
    description: bilingual,
    placeholder: bilingual, // email box
    buttonText: bilingual, // "Subscribe"
    successTitle: bilingual, // pop-up after subscribing
    successText: bilingual,
    image: { type: String, default: "" }, // mockup — "uploads/<file>" or "" = built-in
  },
  { timestamps: true }
);

const TEXT_FIELDS = ["title", "description", "placeholder", "buttonText", "successTitle", "successText"];

// One language, falling back to English
newsletterContentSchema.methods.getLocalizedContent = function (language = "en") {
  const lang = ["en", "km"].includes(language) ? language : "en";
  const pick = (t) => t?.[lang] || t?.en || "";
  return {
    ...Object.fromEntries(TEXT_FIELDS.map((field) => [field, pick(this[field])])),
    image: this.image,
    updatedAt: this.updatedAt,
  };
};

newsletterContentSchema.statics.TEXT_FIELDS = TEXT_FIELDS;

module.exports = mongoose.model("NewsletterContent", newsletterContentSchema);