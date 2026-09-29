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

const link = new mongoose.Schema({ label: bilingual, href: { type: String, default: "" } }, { _id: false });
const column = new mongoose.Schema({ heading: bilingual, links: { type: [link], default: [] } }, { _id: false });
const social = new mongoose.Schema({ platform: { type: String, default: "" }, url: { type: String, default: "" } }, { _id: false });

// Site footer — a single document (logo, name, phone and email come from Settings)
const footerContentSchema = new mongoose.Schema(
  {
    description: bilingual,
    followLabel: bilingual, // "Follow Us"
    columns: { type: [column], default: [] }, // link columns, in order
    socials: { type: [social], default: [] },
  },
  { timestamps: true }
);

// One language, falling back to English
footerContentSchema.methods.getLocalizedContent = function (language = "en") {
  const lang = ["en", "km"].includes(language) ? language : "en";
  const pick = (t) => t?.[lang] || t?.en || "";
  return {
    description: pick(this.description),
    followLabel: pick(this.followLabel),
    columns: this.columns.map((c) => ({
      heading: pick(c.heading),
      links: c.links.map((l) => ({ label: pick(l.label), href: l.href })),
    })),
    socials: this.socials.map((s) => ({ platform: s.platform, url: s.url })),
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("FooterContent", footerContentSchema);