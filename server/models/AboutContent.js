const mongoose = require("mongoose");

// Bilingual text — both optional (empty = the site keeps its built-in wording)
const text = new mongoose.Schema(
  {
    en: { type: String, default: "", trim: true },
    km: { type: String, default: "", trim: true },
  },
  { _id: false }
);

// One card in the bento grid
const aboutCard = new mongoose.Schema(
  {
    title: { type: text, default: () => ({}) },
    description: { type: text, default: () => ({}) },
    image: { type: String, default: "" }, // "uploads/<file>", or "" = built-in image/icon
    buttonText: { type: text, default: () => ({}) }, // card 2 only
    buttonLink: { type: String, default: "" }, // card 2 only
  },
  { _id: false }
);

// Home "About / RetailManager" section — a single document
const aboutContentSchema = new mongoose.Schema(
  {
    title: { type: text, default: () => ({}) },
    cards: { type: [aboutCard], default: [] }, // 4 cards, in grid order
  },
  { timestamps: true }
);

// One language, falling back to English
aboutContentSchema.methods.getLocalizedContent = function (language = "en") {
  const lang = ["en", "km"].includes(language) ? language : "en";
  const pick = (t) => t?.[lang] || t?.en || "";
  return {
    title: pick(this.title),
    cards: this.cards.map((card) => ({
      title: pick(card.title),
      description: pick(card.description),
      image: card.image,
      buttonText: pick(card.buttonText),
      buttonLink: card.buttonLink,
    })),
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("AboutContent", aboutContentSchema);