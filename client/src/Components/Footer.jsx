import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import {
  FaPhone,
  FaEnvelope,
  FaPaperPlane,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaCheckCircle,
  FaTimes,
} from "react-icons/fa";
import { FiInfo } from "react-icons/fi"; 
import ReCAPTCHA from "react-google-recaptcha";
import { useSettings } from "../context/SettingsContext";
import { useTranslation } from "react-i18next";
import { subscribeToNewsletter } from "../services/newsletterApi";

const Footer = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const recaptchaRef = useRef(null);
  const [showRecaptcha, setShowRecaptcha] = useState(false);
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [pendingEmail, setPendingEmail] = useState(""); // Store email while waiting for reCAPTCHA

  const { settings, loading: settingsLoading } = useSettings();

  const handleRecaptchaChange = (token) => {
    console.log("reCAPTCHA token received:", token); // Debug log
    if (token && token.length > 0) {
      console.log("Setting recaptchaVerified to true"); // Debug log
      setRecaptchaVerified(true);
      setStatusMessage();
      // Auto-submit after reCAPTCHA verification with a small delay
      // Pass true directly to avoid state update delay
      setTimeout(() => {
        console.log("Timeout triggered, pendingEmail:", pendingEmail); // Debug log
        if (pendingEmail) {
          handleEmailSubmit(pendingEmail, true); // Pass verification status directly
        }
      }, 1000);
    } else {
      console.log("No token received or token is empty"); // Debug log
      setRecaptchaVerified(false);
      setStatusMessage(
        <span className="text-red-600">
          ❌ {t("footer.recaptchaFailed") || "Verification failed"}
        </span>
      );
    }
  };

  const handleEmailSubmit = async (emailToSubmit = null, isVerified = null) => {
    const emailAddress = emailToSubmit || email;
    const verified = isVerified !== null ? isVerified : recaptchaVerified;

    console.log(
      "handleEmailSubmit called with:",
      emailAddress,
      "verified:",
      verified
    ); // Debug log

    if (!emailAddress || !emailAddress.includes("@")) {
      setStatusMessage(`❌ ${t("footer.invalidEmail")}`);
      return;
    }

    if (!verified) {
      console.log("reCAPTCHA not verified, stopping submission"); // Debug log
      setStatusMessage(`❌ ${t("footer.verifyHuman")}`);
      return;
    }

    try {
      setLoading(true);
      setShowRecaptcha(false); // Hide reCAPTCHA after verification

      console.log("Calling subscribeToNewsletter with:", emailAddress); // Debug log

      // Call our MERN backend API
      const result = await subscribeToNewsletter(emailAddress);

      console.log("Newsletter API result:", result); // Debug log

      // Handle duplicate email case
      if (result.isDuplicate) {
        setStatusMessage(
          <span className="flex items-center gap-2 text-orange-500 font-medium">
            <FiInfo className="w-5 h-5" />
            {t("footer.alreadySubscribed") ||
              "You're already subscribed to our newsletter!"}
          </span>
        );
        setEmail(""); // Clear the input
        setPendingEmail("");
        return;
      }

      // Check if we got a warning about email sending
      if (result.warning) {
        console.warn(result.warning);
        setStatusMessage(
          <span className="highlight">
            ✅{" "}
            {t("footer.subscribedButEmailFailed") ||
              "Subscribed successfully, but welcome email failed to send."}
          </span>
        );
      } else {
        setStatusMessage(null); // Clear any previous message
      }

      setShowModal(true);
      setEmail("");
      setPendingEmail("");
      setRecaptchaVerified(false);

      // Reset reCAPTCHA for next use
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    } catch (error) {
      console.error("Error subscribing email:", error); // Debug log
      console.log("Error details:", error.response?.data); // More debug info

      // Handle 409 specifically
      if (error.response?.status === 409) {
        setStatusMessage(
          <span style={{ color: "orange" }}>
            ℹ️{" "}
            {t("footer.alreadySubscribed") ||
              "You're already subscribed to our newsletter!"}
          </span>
        );
      } else {
        setStatusMessage(`❌ ${error.message || t("footer.somethingWrong")}`);
      }

      setEmail(""); // Clear the input
      setPendingEmail("");
      setShowRecaptcha(false); // Hide reCAPTCHA on error
    } finally {
      setLoading(false);
    }
  };

  const handleSendClick = () => {
    if (!email || !email.includes("@")) {
      setStatusMessage(`❌ ${t("footer.invalidEmail")}`);
      return;
    }

    // Always show reCAPTCHA first, then verify
    setPendingEmail(email); // Store email for auto-submission after reCAPTCHA
    setShowRecaptcha(true);
    setStatusMessage("");
    setRecaptchaVerified(false); // Reset verification status
  };

  // Handle Enter key press in email input
  const handleEmailKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendClick();
    }
  };

  // Close reCAPTCHA modal
  const closeRecaptcha = () => {
    setShowRecaptcha(false);
    setPendingEmail("");
    setRecaptchaVerified(false);
    setStatusMessage(""); // Clear status message
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  };

  // Handle reCAPTCHA expiration
  const handleRecaptchaExpired = () => {
    console.log("reCAPTCHA expired"); // Debug log
    setRecaptchaVerified(false);
    setStatusMessage(
      <span style={{ color: "red" }}>
        ❌{" "}
        {t("footer.recaptchaExpired") || "reCAPTCHA expired, please try again"}
      </span>
    );
  };

  // Handle reCAPTCHA error
  const handleRecaptchaError = () => {
    console.log("reCAPTCHA error"); // Debug log
    setRecaptchaVerified(false);
    setStatusMessage(
      <span style={{ color: "red" }}>
        ❌ {t("footer.recaptchaError") || "reCAPTCHA error, please try again"}
      </span>
    );
  };

  if (settingsLoading) {
    return (
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-section">
            <div className="animate-pulse">
              <div className="w-32 h-8 bg-gray-300 rounded mb-4"></div>
              <div className="w-full h-16 bg-gray-300 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="w-48 h-4 bg-gray-300 rounded"></div>
                <div className="w-56 h-4 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <Link to="/">
            {settings?.logo ? (
              <img
                src={settings.logo}
                className="footer-logo"
                alt={`${settings.companyName || t("footer.company")} ${t(
                  "footer.logo"
                )}`}
              />
            ) : (
              <div className="footer-logo-placeholder">
                <span className="footer-logo-text">
                  {settings?.companyName?.charAt(0) || ""}
                </span>
              </div>
            )}
          </Link>
          <p className="footer-text">
            {settings?.companyDescription || t("footer.defaultDescription")}
          </p>
          <div className="contact-info">
            {settings?.phoneNumber && (
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>{settings.phoneNumber}</span>
              </div>
            )}
            {settings?.email && (
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>{settings.email}</span>
              </div>
            )}
          </div>
        </div>

        <div className="footer-row-sections">
          <div className="footer-section">
            <h3 className="footer-heading">{t("footer.aboutUs")}</h3>
            <ul className="footer-links">
              <li>
                <a onClick={() => (window.location.href = "/Aboutus")}>
                  {t("footer.about")}
                </a>
              </li>
              <li>
                <a onClick={() => (window.location.href = "/Legal")}>
                  {t("footer.legal")}
                </a>
              </li>
              <li>
                <a onClick={() => (window.location.href = "/contact")}>
                  {t("footer.contact")}
                </a>
              </li>
              <li>
                <a onClick={() => (window.location.href = "/Project")}>
                  {t("footer.project")}
                </a>
              </li>
              <li>
                <a onClick={() => (window.location.href = "/Careers")}>
                  {t("footer.careers")}
                </a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">{t("footer.usefulLinks")}</h3>
            <ul className="footer-links">
              <li>
                <a href="https://www.aaapos.com/">
                  {t("footer.browseToAAAPOS")}
                </a>
              </li>
              <li>
                <a onClick={() => (window.location.href = "/Partner")}>
                  {t("footer.partners")}
                </a>
              </li>
              <li>
                <a onClick={() => (window.location.href = "/FAQ")}>
                  {t("footer.faqs")}
                </a>
              </li>
              <li>
                <a onClick={() => (window.location.href = "/Support")}>
                  {t("footer.support")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">{t("footer.newsletter")}</h3>
          <p className="footer-text">
            {t("footer.newsletterText", {
              companyName: settings?.companyName || t("footer.company"),
            })}
          </p>

          <div className="newsletter-form">
            <input
              type="email"
              placeholder={t("footer.emailPlaceholder")}
              className="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleEmailKeyPress}
              disabled={loading}
            />
            <button
              className="send-button"
              onClick={handleSendClick}
              disabled={loading}
            >
              {loading ? (
                <div className="spinner"></div>
              ) : (
                <FaPaperPlane className="send-icon" />
              )}
            </button>
          </div>

          {statusMessage && <p className="status-message">{statusMessage}</p>}

          {/* reCAPTCHA Modal */}
          {showRecaptcha && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
              {/* Backdrop */}
              <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={closeRecaptcha}
              />

              {/* reCAPTCHA Modal */}
              <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
                {/* Close button */}
                <button
                  className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 group"
                  onClick={closeRecaptcha}
                  aria-label="Close reCAPTCHA"
                >
                  <FaTimes className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
                </button>

                {/* Content */}
                <div className="p-8 text-center">
                  {/* Security Icon */}
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <svg
                      className="w-8 h-8 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {t("footer.verifyHuman") || "Please verify you're human"}
                  </h2>

                  {/* Description */}
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    Your email will be automatically sent after verification.
                  </p>

                  {/* reCAPTCHA */}
                  <div className="flex justify-center mb-6">
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey="6LdT4g0rAAAAAH7WF1kDQuZqqEg6zpqJjv73jVOt"
                      onChange={handleRecaptchaChange}
                      onExpired={handleRecaptchaExpired}
                      onError={handleRecaptchaError}
                    />
                  </div>

                  {/* Status Message for reCAPTCHA */}
                  {statusMessage && <div className="mb-4">{statusMessage}</div>}

                  {/* Loading indicator when processing */}
                  {loading && (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-600">
                        {t("footer.subscribing") || "Subscribing..."}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Success Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowModal(false)}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-in zoom-in-95 slide-in-from-bottom-4 duration-300">
              {/* Close button */}
              <button
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200 group"
                onClick={() => setShowModal(false)}
                aria-label="Close modal"
              >
                <FaTimes className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200" />
              </button>

              {/* Content */}
              <div className="p-8 text-center">
                {/* Success Icon */}
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in-50 duration-500 delay-150">
                  <FaCheckCircle className="w-8 h-8 text-green-600 animate-in zoom-in-50 duration-300 delay-300" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-4 animate-in slide-in-from-bottom-2 duration-300 delay-200">
                  {t("footer.thanksForSubscribing")}
                </h2>

                {/* Description */}
                <p className="text-gray-600 mb-8 leading-relaxed animate-in slide-in-from-bottom-2 duration-300 delay-300">
                  {t("footer.subscriptionConfirmation")}
                </p>

                {/* Close Button */}
                <button
                  className="w-full bg-[#0f8abe] hover:bg-[#0d7ba8] text-white font-medium py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl animate-in slide-in-from-bottom-2 duration-300 delay-400"
                  onClick={() => setShowModal(false)}
                >
                  {t("footer.close")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <div className="copyright">
          {t("footer.copyright", { year: new Date().getFullYear() })}
        </div>
        <div className="social-links">
          <span>{t("footer.followUs")}</span>
          <a href="https://facebook.com" aria-label="Facebook">
            <FaFacebookF className="social-icon" />
          </a>
          <a href="https://twitter.com" aria-label="Twitter">
            <FaTwitter className="social-icon" />
          </a>
          <a href="https://linkedin.com" aria-label="LinkedIn">
            <FaLinkedinIn className="social-icon" />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
