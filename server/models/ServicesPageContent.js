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

const servicePanel = new mongoose.Schema(
  {
    key: { type: String, default: "" }, // built-in panel ("pos", ...) — lets the site use its original image; "" = added panel
    title: bilingual,
    description: bilingual,
    image: { type: String, default: "" }, // "uploads/<file>", or "" = built-in image
  },
  { _id: false }
);

const product = new mongoose.Schema(
  { title: bilingual, description: bilingual, href: { type: String, default: "" } },
  { _id: false }
);

// Services page — a single document (separate from the home "Services" section)
const servicesPageContentSchema = new mongoose.Schema(
  {
    eyebrow: bilingual,
    headingLine1: bilingual,
    headingLine2: bilingual,
    body: bilingual,
    image: { type: String, default: "" }, // intro image — "uploads/<file>" or "" = built-in
    services: { type: [servicePanel], default: [] }, // alternating image/text panels, in order
    productsTitle: bilingual, // "Other AAAPOS products you may like"
    productsButton: bilingual, // "Learn More"
    products: { type: [product], default: [] },
  },
  { timestamps: true }
);

const TEXT_FIELDS = ["eyebrow", "headingLine1", "headingLine2", "body", "productsTitle", "productsButton"];

// One language, falling back to English
servicesPageContentSchema.methods.getLocalizedContent = function (language = "en") {
  const lang = ["en", "km"].includes(language) ? language : "en";
  const pick = (t) => t?.[lang] || t?.en || "";
  return {
    ...Object.fromEntries(TEXT_FIELDS.map((field) => [field, pick(this[field])])),
    image: this.image,
    services: this.services.map((s) => ({ key: s.key, title: pick(s.title), description: pick(s.description), image: s.image })),
    products: this.products.map((p) => ({ title: pick(p.title), description: pick(p.description), href: p.href })),
    updatedAt: this.updatedAt,
  };
};

servicesPageContentSchema.statics.TEXT_FIELDS = TEXT_FIELDS;

module.exports = mongoose.model("ServicesPageContent", servicesPageContentSchema);