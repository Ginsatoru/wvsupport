const nodemailer = require("nodemailer");
const { escapeHtml } = require("../services/contactThread");

// Warn (don't crash) when email isn't configured
const missing = ["EMAIL_USERNAME", "EMAIL_PASSWORD"].filter((name) => !process.env[name]);
if (missing.length) console.error("Missing email settings in .env:", missing.join(", "));

// Gmail by default; the server's certificate is always verified
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

transporter.verify((error) => {
  if (!error) return console.log("✅ Mail transporter is ready");
  console.error("❌ Error with mail transporter:", error.message);
  if (error.code === "EAUTH") console.error("Authentication failed. Check EMAIL_USERNAME and EMAIL_PASSWORD");
});

const assertConfigured = () => {
  if (!process.env.EMAIL_USERNAME || !process.env.EMAIL_PASSWORD) {
    throw new Error("Email configuration missing. Please set EMAIL_USERNAME and EMAIL_PASSWORD in your .env file");
  }
};

// Friendlier messages for common mail errors
const explainMailError = (error) => {
  if (error.code === "EAUTH") error.message = "Email authentication failed. Please check your EMAIL_USERNAME and EMAIL_PASSWORD";
  else if (error.code === "ENOTFOUND") error.message = "Email service not found. Please check your EMAIL_HOST configuration";
  else if (error.code === "ECONNECTION") error.message = "Failed to connect to email service. Please check your email configuration";
  return error;
};

// Welcome email for new newsletter subscribers
const welcomeHtml = (email) => `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to WV Support Services</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f7fa; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 0; padding: 0; background-color: #f5f7fa;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="margin: 0 auto; background-color: white; border-radius: 12px; box-shadow: 0 8px 32px rgba(15, 138, 190, 0.1); overflow: hidden;">

                  <!-- Header with Logo -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #0f8abe 0%, #0d7aa8 100%); padding: 40px 30px; text-align: center; position: relative;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="text-align: center;">
                            <div style="background-color: rgba(255,255,255,0.15); width: 80px; height: 80px; border-radius: 20px; display: inline-block; line-height: 80px; margin-bottom: 25px; backdrop-filter: blur(10px); border: 2px solid rgba(255,255,255,0.2);">
                              <img src="https://wvsupportservices.com/logo-blue.png?v=2" alt="WV Support Services" style="width: 50px; height: 35px; vertical-align: middle;" onerror="this.style.display='none'; this.nextElementSibling.style.display='inline-block';">
                              <span style="font-size: 32px; color: white; display: none;">🛠️</span>
                            </div>
                            <h1 style="color: white; margin: 0 0 10px 0; font-size: 32px; font-weight: 700; letter-spacing: -0.5px;">
                              Welcome to Our Newsletter! 🎉
                            </h1>
                            <p style="color: rgba(255,255,255,0.95); margin: 0; font-size: 18px; font-weight: 400;">
                              Expert IT Support for Australian Clients
                            </p>
                            <div style="margin-top: 15px;">
                              <span style="background-color: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; font-size: 14px; color: white; font-weight: 500;">
                                Based in Siem Reap, Cambodia
                              </span>
                            </div>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Main Content -->
                  <tr>
                    <td style="padding: 50px 40px;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="text-align: center; padding-bottom: 35px;">
                            <h2 style="color: #2d3748; font-size: 26px; font-weight: 700; margin: 0 0 20px 0; line-height: 1.3;">
                              Thank you for subscribing!
                            </h2>
                            <p style="color: #4a5568; font-size: 17px; line-height: 1.7; margin: 0; max-width: 480px; margin-left: auto; margin-right: auto;">
                              You're now part of our professional community. Stay updated with the latest IT solutions, technical insights, and expert support services.
                            </p>
                          </td>
                        </tr>
                      </table>

                      <!-- Services Grid -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 40px 0;">
                        <tr>
                          <td style="padding: 25px; background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 12px; border-left: 5px solid #0f8abe; margin-bottom: 20px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                <td width="30" style="vertical-align: top; padding-top: 3px;">
                                  <div style="width: 16px; height: 16px; background: linear-gradient(135deg, #0f8abe 0%, #0d7aa8 100%); border-radius: 8px;"></div>
                                </td>
                                <td style="vertical-align: top;">
                                  <h3 style="margin: 0 0 8px 0; color: #2d3748; font-size: 18px; font-weight: 600;">Software Error Resolution</h3>
                                  <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.5;">Professional diagnosis and resolution of software issues</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr><td style="height: 15px;"></td></tr>
                        <tr>
                          <td style="padding: 25px; background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 12px; border-left: 5px solid #0f8abe; margin-bottom: 20px;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                <td width="30" style="vertical-align: top; padding-top: 3px;">
                                  <div style="width: 16px; height: 16px; background: linear-gradient(135deg, #38b2ac 0%, #319795 100%); border-radius: 8px;"></div>
                                </td>
                                <td style="vertical-align: top;">
                                  <h3 style="margin: 0 0 8px 0; color: #2d3748; font-size: 18px; font-weight: 600;">Connectivity Solutions</h3>
                                  <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.5;">Network troubleshooting and connectivity optimization</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr><td style="height: 15px;"></td></tr>
                        <tr>
                          <td style="padding: 25px; background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); border-radius: 12px; border-left: 5px solid #0f8abe;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tr>
                                <td width="30" style="vertical-align: top; padding-top: 3px;">
                                  <div style="width: 16px; height: 16px; background: linear-gradient(135deg, #805ad5 0%, #6b46c1 100%); border-radius: 8px;"></div>
                                </td>
                                <td style="vertical-align: top;">
                                  <h3 style="margin: 0 0 8px 0; color: #2d3748; font-size: 18px; font-weight: 600;">Database Management</h3>
                                  <p style="margin: 0; color: #4a5568; font-size: 15px; line-height: 1.5;">Expert database administration and issue resolution</p>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- Call to Action Buttons -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 45px 0;">
                        <tr>
                          <td style="text-align: center;">
                            <h3 style="color: #2d3748; margin: 0 0 25px 0; font-size: 20px; font-weight: 600;">Explore Our Services</h3>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto 20px auto;">
                              <tr>
                                <td style="background: linear-gradient(135deg, #0f8abe 0%, #0d7aa8 100%); padding: 16px 32px; border-radius: 8px; box-shadow: 0 4px 12px rgba(15, 138, 190, 0.3);">
                                  <a href="https://www.wvsupportservices.com" style="color: white; text-decoration: none; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; display: inline-block;">
                                    🔧 Visit WV Support Services
                                  </a>
                                </td>
                              </tr>
                            </table>
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                              <tr>
                                <td style="background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%); padding: 16px 32px; border-radius: 8px; box-shadow: 0 4px 12px rgba(74, 85, 104, 0.3);">
                                  <a href="https://www.aaapos.com" style="color: white; text-decoration: none; font-weight: 600; font-size: 16px; letter-spacing: 0.5px; display: inline-block;">
                                    🏢 Explore Our Main Platform
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>

                      <!-- What's Next Section -->
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin: 40px 0;">
                        <tr>
                          <td style="background: linear-gradient(135deg, #0f8abe 0%, #0d7aa8 100%); padding: 30px; text-align: center; border-radius: 12px; box-shadow: 0 4px 20px rgba(15, 138, 190, 0.2);">
                            <h3 style="color: white; margin: 0 0 12px 0; font-size: 20px; font-weight: 600;">What's Next?</h3>
                            <p style="color: rgba(255,255,255,0.95); margin: 0; font-size: 16px; line-height: 1.6;">
                              Keep an eye on your inbox for technical insights, industry updates, and exclusive support tips from our expert team.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%); padding: 40px 30px; text-align: center; border-top: 2px solid #e2e8f0;">
                      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                        <tr>
                          <td style="text-align: center; padding-bottom: 25px;">
                            <h4 style="margin: 0 0 8px 0; color: #2d3748; font-size: 18px; font-weight: 600;">
                              WV Support Services Cambodia
                            </h4>
                            <p style="margin: 0 0 5px 0; color: #4a5568; font-size: 16px;">
                              Expert IT Support for Australian Clients
                            </p>
                            <p style="margin: 0; color: #0f8abe; font-size: 15px; font-weight: 500;">
                              Based in Siem Reap, Cambodia
                            </p>
                          </td>
                        </tr>
                        <tr>
                          <td style="text-align: center; padding: 20px 0; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0;">
                            <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin: 0 auto;">
                              <tr>
                                <td style="padding: 0 15px;">
                                  <a href="https://www.wvsupportservices.com" style="color: #0f8abe; text-decoration: none; font-size: 14px; font-weight: 500;">🌐 Website</a>
                                </td>
                                <td style="padding: 0 15px; border-left: 1px solid #e2e8f0;">
                                  <a href="https://www.aaapos.com" style="color: #0f8abe; text-decoration: none; font-size: 14px; font-weight: 500;">🏢 Main Platform</a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style="text-align: center; padding-top: 25px;">
                            <p style="margin: 0; font-size: 13px; color: #718096; line-height: 1.5;">
                              If you didn't request this subscription, please ignore this email.<br>
                              This email was sent to <strong>${escapeHtml(email)}</strong>
                            </p>
                            <p style="margin: 15px 0 0 0; font-size: 12px; color: #a0aec0;">
                              © ${new Date().getFullYear()} WV Support Services Cambodia. All rights reserved.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

const sendWelcomeEmail = async (email) => {
  assertConfigured();
  try {
    return await transporter.sendMail({
      from: `"WV Support Services" <${process.env.EMAIL_USERNAME}>`,
      to: email,
      subject: "Welcome to WV Support Services Newsletter",
      html: welcomeHtml(email),
    });
  } catch (error) {
    throw explainMailError(error);
  }
};

// Sends the same email to each address, one at a time (short pause between sends)
const sendBulkEmail = async (emails, subject, content) => {
  assertConfigured();
  const results = [];
  for (const email of emails) {
    try {
      const info = await transporter.sendMail({
        from: `"WV Support Services" <${process.env.EMAIL_USERNAME}>`,
        to: email,
        subject,
        html: content,
      });
      results.push({ email, success: true, messageId: info.messageId });
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      results.push({ email, success: false, error: error.message });
    }
  }
  return results;
};

module.exports = { sendWelcomeEmail, sendBulkEmail, transporter };