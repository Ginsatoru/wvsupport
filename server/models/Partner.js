const mongoose = require("mongoose");

// One logo in the partner strip under the hero
const PartnerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true }, // "uploads/<file>" or an external URL
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// The logos the site shipped with — copied in on first use so nothing disappears
PartnerSchema.statics.DEFAULTS = [
  { name: "Tyro", image: "https://upload.wikimedia.org/wikipedia/en/1/15/Tyro_Payments_Logo.png" },
  { name: "Linkly", image: "https://www.medianara.com.au/wp-content/uploads/2018/09/linkly_cloud.png" },
  { name: "Microsoft", image: "https://www.alfalak.com/wp-content/uploads/Products-Distribution/Logos/MSFT_logo_rgb_C-Gray1.png" },
  { name: "Stripe", image: "https://vikwp.com/images/plugins/stripe.png" },
  { name: "MYOB", image: "https://phoenixconsultancy.com.au/wp-content/uploads/myob-logo.png" },
  { name: "Epson", image: "https://logolook.net/wp-content/uploads/2023/12/Epson-Logo.png" },
  { name: "Xero", image: "https://images.icon-icons.com/2699/PNG/512/xero_logo_icon_167949.png" },
  { name: "cPanel", image: "https://www.hostcoding.com/wp-content/uploads/2020/10/cpanel-final.png" },
];

module.exports = mongoose.model("Partner", PartnerSchema);