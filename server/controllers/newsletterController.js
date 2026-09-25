const NewsletterEmail = require("../models/newsletterModel");
const { sendWelcomeEmail } = require("../config/nodemailer");

const SOURCES = ["landing_page", "footer_signup", "popup", "contact_form"];
const devError = (error) => (process.env.NODE_ENV === "development" ? error.message : undefined);
const alreadySubscribed = (res) =>
  res.status(409).json({ success: false, message: "Email is already subscribed to our newsletter" });

// ── Public: subscribe ──
exports.subscribeEmail = async (req, res) => {
  try {
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : "";
    if (!email) return res.status(400).json({ success: false, message: "Email is required" });
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ success: false, message: "Invalid email format" });
    }

    if (await NewsletterEmail.exists({ email })) return alreadySubscribed(res);

    const source = SOURCES.includes(req.body.source) ? req.body.source : "unknown";
    const subscriber = await NewsletterEmail.create({ email, source });
    req.app.get("socket").broadcastToAdmins("subscriber_added", subscriber);

    try {
      await sendWelcomeEmail(email);
      res.status(201).json({ success: true, message: "Subscription successful! Welcome email sent.", data: subscriber });
    } catch (emailError) {
      console.error("Welcome email failed (subscription saved):", emailError.message);
      res.status(201).json({
        success: true,
        message: "Subscription recorded successfully, but welcome email failed to send.",
        warning: "Email delivery failed",
        data: subscriber,
      });
    }
  } catch (error) {
    if (error.code === 11000) return alreadySubscribed(res);
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: "Invalid email format", error: devError(error) });
    }
    console.error("Subscribe error:", error);
    res.status(500).json({ success: false, message: "Internal server error", error: devError(error) });
  }
};

// ── Admin: list subscribers (newest first) ──
exports.getAllEmails = async (req, res) => {
  try {
    const emails = await NewsletterEmail.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, count: emails.length, data: emails });
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).json({ success: false, message: "Server error", error: devError(error) });
  }
};

// ── Admin: mark subscribers as seen — body { ids: [...] }, or no ids for all ──
exports.markSeen = async (req, res) => {
  try {
    const ids = Array.isArray(req.body.ids) ? req.body.ids : null;
    await NewsletterEmail.updateMany(ids ? { _id: { $in: ids } } : { seen: false }, { $set: { seen: true } });
    req.app.get("socket").broadcastToAdmins("subscribers_seen", { ids });
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error marking subscribers seen:", error);
    res.status(500).json({ success: false, message: "Server error", error: devError(error) });
  }
};