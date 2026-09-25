const mongoose = require("mongoose");

const newsletterEmailSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    match: [/\S+@\S+\.\S+/, "is invalid"],
  },
  // Where they signed up (keys match the Subscribers page labels). Older subscribers have none → "Unknown".
  source: {
    type: String,
    enum: ["landing_page", "footer_signup", "popup", "contact_form", "unknown"],
    default: "unknown",
  },
  // New sign-ups start unseen (bell notification). Older subscribers have no flag and count as seen.
  seen: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("NewsletterEmail", newsletterEmailSchema);