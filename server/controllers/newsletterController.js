const NewsletterEmail = require("../models/newsletterModel");
const { sendWelcomeEmail } = require("../config/nodemailer");

// Add new email to newsletter
exports.subscribeEmail = async (req, res) => {
  console.log("Incoming request body:", req.body);

  try {
    const { email } = req.body;

    if (!email) {
      console.error("No email provided");
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Basic email format validation
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    console.log("Attempting to save email:", email);
    
    // Check if email already exists
    const existingEmail = await NewsletterEmail.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      console.log("Email already exists:", email);
      return res.status(409).json({
        success: false,
        message: "Email is already subscribed to our newsletter",
      });
    }

    // Create and save new subscription
    const newEmail = new NewsletterEmail({ email: email.toLowerCase() });
    await newEmail.save();
    console.log("Email saved successfully");

    // Try to send welcome email
    try {
      console.log("Attempting to send welcome email");
      await sendWelcomeEmail(email);
      console.log("Welcome email sent successfully");

      return res.status(201).json({
        success: true,
        message: "Subscription successful! Welcome email sent.",
        data: newEmail,
      });
    } catch (emailError) {
      console.error("Email sending failed but subscription recorded:", emailError);
      
      return res.status(201).json({
        success: true,
        message: "Subscription recorded successfully, but welcome email failed to send.",
        warning: "Email delivery failed",
        data: newEmail,
      });
    }
  } catch (error) {
    console.error("Full error:", error);
    console.error("Error stack:", error.stack);
    
    // Handle MongoDB duplicate key error specifically
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email is already subscribed to our newsletter",
      });
    }
    
    // Handle MongoDB validation errors
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }

    // Handle other errors
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

// Get all newsletter emails (for admin)
exports.getAllEmails = async (req, res) => {
  try {
    const emails = await NewsletterEmail.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: emails.length,
      data: emails,
    });
  } catch (error) {
    console.error("Error fetching emails:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};