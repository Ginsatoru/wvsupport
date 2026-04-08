import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { FaCheckCircle, FaTimes } from "react-icons/fa";
import ReCAPTCHA from "react-google-recaptcha";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { subscribeToNewsletter } from "../../services/newsletterApi";
import mockup from "../Images/mockup.webp";

/* ── Word-slice — same mechanic as Tech & Work ── */
const SliceText = ({ text, inView, baseDelay = 0 }) => (
  <>
    {text.split(" ").map((word, i) => (
      <span key={i} className="nl-word-wrap">
        <span
          className="nl-word"
          style={{ transitionDelay: `${baseDelay + i * 0.055}s` }}
        >
          {word}
          {i < text.split(" ").length - 1 ? "\u00A0" : ""}
        </span>
      </span>
    ))}
  </>
);

// ── Inline translations ──────────────────────────────────────────────────────
const translations = {
  en: {
    title: "Subscribe to our newsletter to receive our daily news",
    description:
      "Get the latest updates, news and product offers delivered directly to your inbox. Stay informed and never miss what matters most to your business.",
    emailPlaceholder: "Enter your email",
    subscribe: "Subscribe",
    verifyHuman: "Please verify you're human",
    verifyDesc: "Your email will be automatically sent after verification.",
    subscribing: "Subscribing…",
    recaptchaFailed: "Verification failed. Please try again.",
    recaptchaExpired: "reCAPTCHA expired, please try again.",
    recaptchaError: "reCAPTCHA error, please try again.",
    invalidEmail: "Please enter a valid email.",
    alreadySubscribed: "You're already subscribed!",
    somethingWrong: "Something went wrong. Please try again.",
    subscribed: "You're subscribed!",
    subscriptionConfirmation:
      "Thanks for subscribing. You'll receive our latest news and updates.",
    close: "Close",
  },
  km: {
    title: "ចុះឈ្មោះទទួលព្រឹត្តិបត្រព័ត៌មានរបស់យើង",
    description:
      "ទទួលបានព័ត៌មានថ្មីៗ ការអាប់ដេត និងការផ្តល់ជូនផ្នែកផលិតផលផ្ញើដោយផ្ទាល់មកកាន់ប្រអប់សំបុត្ររបស់អ្នក។ នៅជាប់ជាមួយព័ត៌មានដ៏សំខាន់សម្រាប់អាជីវកម្មរបស់អ្នក។",
    emailPlaceholder: "បញ្ចូលអ៊ីមែលរបស់អ្នក",
    subscribe: "ចុះឈ្មោះ",
    verifyHuman: "សូមបញ្ជាក់ថាអ្នកជាមនុស្ស",
    verifyDesc: "អ៊ីមែលរបស់អ្នកនឹងត្រូវបានផ្ញើដោយស្វ័យប្រវត្តិបន្ទាប់ពីការផ្ទៀងផ្ទាត់។",
    subscribing: "កំពុងចុះឈ្មោះ…",
    recaptchaFailed: "ការផ្ទៀងផ្ទាត់បានបរាជ័យ។ សូមព្យាយាមម្តងទៀត។",
    recaptchaExpired: "reCAPTCHA បានផុតកំណត់ សូមព្យាយាមម្តងទៀត។",
    recaptchaError: "កំហុស reCAPTCHA សូមព្យាយាមម្តងទៀត។",
    invalidEmail: "សូមបញ្ចូលអ៊ីមែលត្រឹមត្រូវ។",
    alreadySubscribed: "អ្នកបានចុះឈ្មោះរួចហើយ!",
    somethingWrong: "មានបញ្ហាកើតឡើង។ សូមព្យាយាមម្តងទៀត។",
    subscribed: "អ្នកបានចុះឈ្មោះហើយ!",
    subscriptionConfirmation:
      "សូមអរគុណចំពោះការចុះឈ្មោះ។ អ្នកនឹងទទួលបានព័ត៌មានថ្មីៗរបស់យើង។",
    close: "បិទ",
  },
};

const t = (key, lang = "en") => translations[lang]?.[key] || translations.en[key] || key;
// ────────────────────────────────────────────────────────────────────────────

const NewsletterSection = () => {
  const { i18n } = useTranslation();
  const lang = i18n.language === "km" ? "km" : "en";
  const recaptchaRef = useRef(null);
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const [showRecaptcha, setShowRecaptcha] = useState(false);
  const [recaptchaVerified, setRecaptchaVerified] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [showModal, setShowModal] = useState(false);

  const handleRecaptchaChange = (token) => {
    if (token && token.length > 0) {
      setRecaptchaVerified(true);
      setStatusMessage(null);
      setTimeout(() => {
        if (pendingEmail) handleEmailSubmit(pendingEmail, true);
      }, 1000);
    } else {
      setRecaptchaVerified(false);
      setStatusMessage({ type: "error", text: t("recaptchaFailed") });
    }
  };

  const handleEmailSubmit = async (emailToSubmit = null, isVerified = null) => {
    const emailAddress = emailToSubmit || email;
    const verified = isVerified !== null ? isVerified : recaptchaVerified;

    if (!emailAddress || !emailAddress.includes("@")) {
      setStatusMessage({ type: "error", text: t("invalidEmail") });
      return;
    }
    if (!verified) {
      setStatusMessage({ type: "error", text: t("verifyHuman") });
      return;
    }

    try {
      setLoading(true);
      setShowRecaptcha(false);
      const result = await subscribeToNewsletter(emailAddress);

      if (result.isDuplicate) {
        setStatusMessage({ type: "warning", text: t("alreadySubscribed") });
        setEmail("");
        setPendingEmail("");
        return;
      }

      setShowModal(true);
      setEmail("");
      setPendingEmail("");
      setRecaptchaVerified(false);
      setStatusMessage(null);
      if (recaptchaRef.current) recaptchaRef.current.reset();
    } catch (error) {
      if (error.response?.status === 409) {
        setStatusMessage({ type: "warning", text: t("alreadySubscribed") });
      } else {
        setStatusMessage({
          type: "error",
          text: error.message || t("somethingWrong"),
        });
      }
      setEmail("");
      setPendingEmail("");
      setShowRecaptcha(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSendClick = () => {
    if (!email || !email.includes("@")) {
      setStatusMessage({ type: "error", text: t("invalidEmail") });
      return;
    }
    setPendingEmail(email);
    setShowRecaptcha(true);
    setStatusMessage(null);
    setRecaptchaVerified(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendClick();
  };

  const closeRecaptcha = () => {
    setShowRecaptcha(false);
    setPendingEmail("");
    setRecaptchaVerified(false);
    setStatusMessage(null);
    if (recaptchaRef.current) recaptchaRef.current.reset();
  };

  const handleRecaptchaExpired = () => {
    setRecaptchaVerified(false);
    setStatusMessage({ type: "error", text: t("recaptchaExpired") });
  };

  const handleRecaptchaError = () => {
    setRecaptchaVerified(false);
    setStatusMessage({ type: "error", text: t("recaptchaError") });
  };

  return (
    <>
      <style>{`
        /* ── Word-slice ── */
        .nl-word-wrap {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
        }
        .nl-word {
          display: inline-block;
          transform: translateY(110%);
          opacity: 0;
          transition: transform 0.8s cubic-bezier(0.77, 0, 0.175, 1),
                      opacity 0.2s ease;
        }
        .nl-entered .nl-word {
          transform: translateY(0);
          opacity: 1;
        }

        /* ── Slide up ── */
        .nl-slide-up {
          display: inline-block;
          transform: translateY(24px);
          opacity: 0;
          transition: transform 0.85s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      opacity 0.85s ease;
        }
        .nl-entered .nl-slide-up {
          transform: translateY(0);
          opacity: 1;
        }

        /* ── Email input wrapper ── */
        .nl-input-wrap {
          display: flex;
          align-items: center;
          background: #ffffff;
          border-radius: 9999px;
          padding: 5px 5px 5px 20px;
          max-width: 440px;
          gap: 8px;
        }

        /* ── Email input ── */
        .nl-input {
          flex: 1;
          background: transparent;
          border: none;
          color: #111;
          font-size: 14px;
          outline: none;
          min-width: 0;
          font-family: inherit;
        }
        .nl-input::placeholder { color: rgba(0,0,0,0.35); }

        /* ── Subscribe button ── */
        .nl-btn {
          flex-shrink: 0;
          background: #111;
          color: #fff;
          border: none;
          border-radius: 9999px;
          padding: 10px 22px;
          font-size: 13.5px;
          font-weight: 700;
          cursor: pointer;
          transition: background 0.18s, transform 0.13s;
          white-space: nowrap;
          font-family: inherit;
          letter-spacing: -0.01em;
        }
        .nl-btn:hover  { background: #2a2a2a; }
        .nl-btn:active { background: #333; }
        .nl-btn:disabled { opacity: 0.55; cursor: not-allowed; }

        /* ── Spinner ── */
        .nl-spinner {
          width: 15px; height: 15px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: nl-spin 0.7s linear infinite;
          display: inline-block;
          vertical-align: middle;
        }
        @keyframes nl-spin { to { transform: rotate(360deg); } }

        /* ── Status ── */
        .nl-status { font-size: 13px; margin-top: 9px; padding-left: 2px; }
        .nl-status--error   { color: #f87171; }
        .nl-status--warning { color: #fbbf24; }
        .nl-status--success { color: #34d399; }

        /* ── Modal backdrop ── */
        .nl-modal-backdrop {
          position: fixed; inset: 0; z-index: 9999;
          display: flex; align-items: center; justify-content: center; padding: 16px;
          background: rgba(0,0,0,0.48);
          backdrop-filter: blur(5px);
          animation: nl-fade 0.2s ease;
        }
        @keyframes nl-fade { from { opacity: 0; } to { opacity: 1; } }

        .nl-modal {
          position: relative;
          background: #fff;
          border-radius: 20px;
          box-shadow: 0 28px 64px rgba(0,0,0,0.22);
          max-width: 420px; width: 100%;
          padding: 40px 36px;
          text-align: center;
          animation: nl-zoom 0.26s cubic-bezier(0.34,1.56,0.64,1);
        }
        @keyframes nl-zoom {
          from { opacity: 0; transform: scale(0.91) translateY(14px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }

        .nl-modal-close {
          position: absolute; top: 14px; right: 14px;
          background: none; border: none; cursor: pointer;
          padding: 8px; border-radius: 50%;
          color: #9ca3af;
          transition: background 0.15s, color 0.15s;
        }
        .nl-modal-close:hover { background: #f3f4f6; color: #374151; }

        /* ── Container — mirrors .fs-container breakpoints exactly ── */
        .nl-container {
          width: 100%;
          padding: 0 16px;
          margin: 0 auto;
        }
        @media (min-width: 640px)  { .nl-container { padding: 0 24px; } }
        @media (min-width: 1024px) { .nl-container { width: 88%; padding: 0; } }
        @media (min-width: 1280px) { .nl-container { width: 83%; } }
        @media (min-width: 1536px) { .nl-container { max-width: 1400px; } }
        @media (min-width: 1700px) { .nl-container { max-width: 1500px; } }

        /* ── Responsive ── */
        @media (max-width: 820px) {
          .nl-inner       { flex-direction: column !important; }
          .nl-mockup-wrap { display: none !important; }
          .nl-content     { padding: 32px 28px !important; }
        }
      `}</style>

      {/* ── Main Section ── */}
      <section
        style={{ padding: "100px 0", background: "#ffffff" }}
      >
        <div
          ref={ref}
          className={`nl-container${inView ? " nl-entered" : ""}`}
        >
          <div
            className="nl-inner"
            style={{
              display: "flex",
              alignItems: "stretch",
              borderRadius: 20,
              overflow: "visible",
              background: "#0d1117",
              boxShadow: "0 24px 72px rgba(0,0,0,0.16)",
              minHeight: 460,
              position: "relative",
              clipPath: "inset(-200px 0 0 0 round 20px)",
            }}
          >
            {/* ── Left: content ── */}
            <div
              className="nl-content"
              style={{
                flex: "1 1 0",
                padding: "64px 56px 64px 150px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {/* Headline */}
              <h2
                style={{
                  fontSize: "clamp(18px, 2.1vw, 28px)",
                  fontWeight: 800,
                  lineHeight: 1.2,
                  color: "#ffffff",
                  marginBottom: 16,
                  letterSpacing: "-0.02em",
                  maxWidth: 480,
                }}
              >
                <div style={{ overflow: "hidden" }}>
                  <SliceText text={t("title", lang)} inView={inView} baseDelay={0.1} />
                </div>
              </h2>

              {/* Body */}
              <p
                className="nl-slide-up"
                style={{
                  fontSize: 13.5,
                  color: "#ffffff",
                  lineHeight: 1.65,
                  marginBottom: 28,
                  maxWidth: 440,
                  transitionDelay: "0.5s",
                }}
              >
                {t("description", lang)}
              </p>

              {/* Input row */}
              <div
                className="nl-slide-up"
                style={{ transitionDelay: "0.65s" }}
              >
                <div className="nl-input-wrap">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="M2 7l10 7 10-7" />
                  </svg>
                  <input
                    type="email"
                    className="nl-input"
                    placeholder={t("emailPlaceholder", lang)}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                  />
                  <button
                    className="nl-btn"
                    onClick={handleSendClick}
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="nl-spinner" />
                    ) : (
                      t("subscribe", lang)
                    )}
                  </button>
                </div>

                {statusMessage && (
                  <p className={`nl-status nl-status--${statusMessage.type}`}>
                    {statusMessage.text}
                  </p>
                )}
              </div>
            </div>

            {/* ── Right: mockup ── */}
            <div
              className="nl-mockup-wrap"
              style={{
                flex: "0 0 40%",
                position: "relative",
                overflow: "visible",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
              }}
            >
              <motion.img
                src={mockup}
                alt="App mockup"
                initial={{ opacity: 0, x: 160 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.3 }}
                style={{
                  position: "absolute",
                  bottom: "-80px",
                  left: "-25%",
                  width: "110%",
                  maxWidth: "none",
                  display: "block",
                  objectFit: "contain",
                  objectPosition: "bottom center",
                  filter: "drop-shadow(0 -6px 28px rgba(0,0,0,0.45))",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── reCAPTCHA Modal ── */}
      {showRecaptcha && (
        <div className="nl-modal-backdrop">
          <div className="nl-modal">
            <button
              className="nl-modal-close"
              onClick={closeRecaptcha}
              aria-label="Close"
            >
              <FaTimes style={{ width: 16, height: 16 }} />
            </button>

            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#dbeafe",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
              }}
            >
              <svg
                width="26"
                height="26"
                fill="none"
                stroke="#2563eb"
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

            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#111",
                marginBottom: 8,
              }}
            >
              {t("verifyHuman", lang)}
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "#6b7280",
                marginBottom: 22,
                lineHeight: 1.6,
              }}
            >
              {t("verifyDesc", lang)}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginBottom: 18,
              }}
            >
              <ReCAPTCHA
                ref={recaptchaRef}
                sitekey="6LdT4g0rAAAAAH7WF1kDQuZqqEg6zpqJjv73jVOt"
                onChange={handleRecaptchaChange}
                onExpired={handleRecaptchaExpired}
                onError={handleRecaptchaError}
              />
            </div>

            {statusMessage && (
              <p
                style={{
                  fontSize: 13,
                  color:
                    statusMessage.type === "error" ? "#ef4444" : "#f59e0b",
                }}
              >
                {statusMessage.text}
              </p>
            )}

            {loading && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  marginTop: 12,
                }}
              >
                <div className="nl-spinner" />
                <span style={{ fontSize: 14, color: "#6b7280" }}>
                  {t("subscribing", lang)}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Success Modal ── */}
      {showModal && (
        <div className="nl-modal-backdrop">
          <div className="nl-modal">
            <button
              className="nl-modal-close"
              onClick={() => setShowModal(false)}
              aria-label="Close"
            >
              <FaTimes style={{ width: 16, height: 16 }} />
            </button>

            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: "50%",
                background: "#d1fae5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 18px",
              }}
            >
              <FaCheckCircle
                style={{ width: 26, height: 26, color: "#059669" }}
              />
            </div>

            <h2
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: "#111",
                marginBottom: 8,
              }}
            >
              {t("subscribed", lang)}
            </h2>
            <p
              style={{
                fontSize: 14,
                color: "#6b7280",
                marginBottom: 26,
                lineHeight: 1.6,
              }}
            >
              {t("subscriptionConfirmation", lang)}
            </p>

            <button
              onClick={() => setShowModal(false)}
              style={{
                width: "100%",
                background: "#0f8abe",
                color: "#fff",
                border: "none",
                borderRadius: 12,
                padding: "13px 0",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                transition: "background 0.2s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#0d7ba8")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#0f8abe")
              }
            >
              {t("close", lang)}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default NewsletterSection;