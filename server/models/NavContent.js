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

const navLink = new mongoose.Schema(
  {
    label: bilingual,
    href: { type: String, default: "" },
    icon: { type: String, default: "" }, // mobile bottom-bar icon name
  },
  { _id: false }
);

// Site navbar — a single document (logo and company name come from Settings)
const navContentSchema = new mongoose.Schema(
  {
    links: { type: [navLink], default: [] }, // menu links, in order
    ctaText: bilingual, // "Get Started"
    ctaLink: { type: String, default: "" },
    loginText: bilingual, // "Log in"
    // Language switcher — flag "uploads/<file>" ("" = built-in), short label ("EN"), full name ("English")
    languages: {
      en: { flag: { type: String, default: "" }, short: { type: String, default: "" }, name: { type: String, default: "" } },
      km: { flag: { type: String, default: "" }, short: { type: String, default: "" }, name: { type: String, default: "" } },
    },
  },
  { timestamps: true }
);

// One language, falling back to English
navContentSchema.methods.getLocalizedContent = function (language = "en") {
  const lang = ["en", "km"].includes(language) ? language : "en";
  const pick = (t) => t?.[lang] || t?.en || "";
  return {
    links: this.links.map((l) => ({ label: pick(l.label), href: l.href, icon: l.icon })),
    ctaText: pick(this.ctaText),
    ctaLink: this.ctaLink,
    loginText: pick(this.loginText),
    languages: this.languages,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model("NavContent", navContentSchema);