const mongoose = require("mongoose");

// Bilingual text — both optional (empty = the site keeps its built-in wording)
const text = new mongoose.Schema(
  {
    en: { type: String, default: "", trim: true },
    km: { type: String, default: "", trim: true },
  },
  { _id: false }
);

const serviceItem = new mongoose.Schema(
  {
    key: { type: String, default: "" }, // built-in card ("pos", "webstore", ...) — lets the site use its original image; "" = added card
    title: { type: text, default: () => ({}) },
    description: { type: text, default: () => ({}) },
    image: { type: String, default: "" }, // "uploads/<file>", or "" = built-in image
  },
  { _id: false }
);

// Home "Our Services" section — a single document
const servicesContentSchema = new mongoose.Schema(
  {
    title: { type: text, default: () => ({}) },
    subtitle: { type: text, default: () => ({}) },
    stats: { type: [text], default: [] }, // 3 highlights
    items: { type: [serviceItem], default: [] }, // service cards, in display order
  },
  { timestamps: true }
);

// One language, falling back to English
servicesContentSchema.methods.getLocalizedContent = function (language = "en") {
  const lang = ["en", "km"].includes(language) ? language : "en";
  const pick = (t) => t?.[lang] || t?.en || "";
  return {
    title: pick(this.title),
    subtitle: pick(this.subtitle),
    stats: this.stats.map(pick),
    items: this.items.map((item) => ({
      key: item.key,
      title: pick(item.title),
      description: pick(item.description),
      image: item.image,
    })),
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("ServicesContent", servicesContentSchema);