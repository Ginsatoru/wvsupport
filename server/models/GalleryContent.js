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

// Home "Our Gallery" section — a single document.
// Photos are "uploads/<file>" or "default:<n>" (one of the site's built-in photos).
const galleryContentSchema = new mongoose.Schema(
  {
    eyebrow: bilingual,
    title: bilingual,
    topRow: { type: [String], default: [] }, // scrolls left → right
    bottomRow: { type: [String], default: [] }, // scrolls right → left
  },
  { timestamps: true }
);

// One language, falling back to English
galleryContentSchema.methods.getLocalizedContent = function (language = "en") {
  const lang = ["en", "km"].includes(language) ? language : "en";
  const pick = (t) => t?.[lang] || t?.en || "";
  return {
    eyebrow: pick(this.eyebrow),
    title: pick(this.title),
    topRow: this.topRow,
    bottomRow: this.bottomRow,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("GalleryContent", galleryContentSchema);