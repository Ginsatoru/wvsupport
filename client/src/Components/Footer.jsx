import emailjs from "@emailjs/browser";
import React, { useState } from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import {
  FaPhone,
  FaEnvelope,
  FaPaperPlane,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import { db } from "./firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import ReCAPTCHA from "react-google-recaptcha";
import { useSettings } from '../context/SettingsContext';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);
  const recaptchaRef = useRef(null);
  const [showRecaptcha, setShowRecaptcha] = useState(false);
  const [email, setEmail] = useState("");
  const [statusMessage, setStatusMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  // Get settings from context
  const { settings, loading: settingsLoading } = useSettings();

  const handleRecaptchaChange = (value) => {
    if (value) {
      setRecaptchaVerified(true);
      setStatusMessage(
        <span>
          <span className="highlight">✅ {t('footer.recaptchaVerified')}</span>
        </span>
      );
    } else {
      setRecaptchaVerified(false);
      setStatusMessage(
        <span style={{ color: "red" }}>❌ {t('footer.recaptchaFailed')}</span>
      );
    }
  };

  const handleEmailSubmit = async () => {
    if (!email || !email.includes("@")) {
      setStatusMessage(`❌ ${t('footer.invalidEmail')}`);
      return;
    }

    if (!recaptchaVerified) {
      setStatusMessage(`❌ ${t('footer.verifyHuman')}`);
      return;
    }

    try {
      setLoading(true);
      // Add email to Firestore
      await addDoc(collection(db, "newsletter_emails"), {
        email: email,
        timestamp: serverTimestamp(),
      });

      // Send welcome email via EmailJS
      await emailjs.send(
        "service_2x5g8p6", // replace this
        "template_5faiov9", // replace this
        { to_email: email },
        "n9i79GtKbqRVdHvNV" // replace this
      );

      setShowModal(true); // Show modal
      setStatusMessage(null); // Clear any previous inline message
      setEmailSent(true);
      setEmail("");
      setRecaptchaVerified(false);
    } catch (error) {
      console.error("Error saving email or sending message:", error);
      setStatusMessage(
        `❌ ${error.message || t('footer.somethingWrong')}`
      );
      setEmailSent(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSendClick = () => {
    if (!email || !email.includes("@")) {
      setStatusMessage(`❌ ${t('footer.invalidEmail')}`);
      return;
    }

    if (!recaptchaVerified) {
      setShowRecaptcha(true); // Show reCAPTCHA only if not yet verified
      setStatusMessage(""); // Clear old messages
      return;
    }

    // If already verified, proceed to submit email
    handleEmailSubmit();
    recaptchaRef.current?.reset(); // optional: reset reCAPTCHA
    setShowRecaptcha(false);
  };

  // Loading state for settings
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
                alt={`${settings.companyName || t('footer.company')} ${t('footer.logo')}`}
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
            {settings?.companyDescription || t('footer.defaultDescription')}
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
            <h3 className="footer-heading">{t('footer.aboutUs')}</h3>
            <ul className="footer-links">
              <li>
                <a onClick={() => window.location.href = '/Aboutus'}>{t('footer.about')}</a>
              </li>
              <li>
                <a onClick={() => window.location.href = '/Legal'}>{t('footer.legal')}</a>
              </li>
              <li>
                <a onClick={() => window.location.href = '/contact'}>{t('footer.contact')}</a>
              </li>
              <li>
                <a onClick={() => window.location.href = '/Project'}>{t('footer.project')}</a>
              </li>
              <li>
                <a onClick={() => window.location.href = '/Careers'}>{t('footer.careers')}</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">{t('footer.usefulLinks')}</h3>
            <ul className="footer-links">
              <li>
                <a href="https://www.aaapos.com/">{t('footer.browseToAAAPOS')}</a>
              </li>
              <li>
                <a onClick={() => window.location.href = '/Partner'}>{t('footer.partners')}</a>
              </li>
              <li>
                <a onClick={() => window.location.href = '/FAQ'}>{t('footer.faqs')}</a>
              </li>
              <li>
                <a onClick={() => window.location.href = '/Support'}>{t('footer.support')}</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-section">
          <h3 className="footer-heading">{t('footer.newsletter')}</h3>
          <p className="footer-text">
            {t('footer.newsletterText', { companyName: settings?.companyName || t('footer.company') })}
          </p>

          <div className="newsletter-form">
            <input
              type="email"
              placeholder={t('footer.emailPlaceholder')}
              className="email-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          {/* Show status message if exists */}
          {statusMessage && <p className="status-message">{statusMessage}</p>}

          {/* Show reCAPTCHA after user clicks Send */}
          {showRecaptcha && !recaptchaVerified && (
            <div className="recaptcha-container">
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LdT4g0rAAAAAH7WF1kDQuZqqEg6zpqJjv73jVOt"
                onChange={handleRecaptchaChange}
              />
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="popup-overlay">
          <div className="popup-box">
            <h2>✅ {t('footer.thanksForSubscribing')}</h2>
            <p>{t('footer.subscriptionConfirmation')}</p>
            <button
              className="popup-close-btn"
              onClick={() => setShowModal(false)}
            >
              {t('footer.close')}
            </button>
          </div>
        </div>
      )}

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <div className="copyright">
          {t('footer.copyright', { year: new Date().getFullYear() })}
        </div>
        <div className="social-links">
          <span>{t('footer.followUs')}</span>
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