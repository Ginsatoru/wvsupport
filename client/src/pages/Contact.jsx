import ReCAPTCHA from "react-google-recaptcha";
import { HiPhone, HiEnvelope, HiMapPin, HiClock } from "react-icons/hi2";
import { useSettings } from "../context/SettingsContext";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import Newsletter from "../Components/home/Newsletter";

/* ── Word-slice (same mechanic as Tech) ── */
const SliceText = ({ text, inView, baseDelay = 0 }) => (
  <>
    {text.split(" ").map((word, i) => (
      <span key={i} className="ct-word-wrap">
        <span
          className="ct-word"
          style={{ transitionDelay: `${baseDelay + i * 0.055}s` }}
        >
          {word}
          {i < text.split(" ").length - 1 ? "\u00A0" : ""}
        </span>
      </span>
    ))}
  </>
);

const Contact = () => {
  const { i18n } = useTranslation();
  const { settings } = useSettings();
  const isKm = i18n.language === "km";

  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.12 });

  const text = {
    heroTitle: isKm
      ? "យើងនៅទីនេះជានិច្ច ដើម្បីជួយអ្នក"
      : "Always Here to Help you",
    heroSubtitle: isKm
      ? "មានសំណួរ ឬត្រូវការជំនួយ? យើងនៅទីនេះដើម្បីជួយអ្នក។ ទំនាក់ទំនងមកយើងខ្ញុំ ហើយក្រុមការងាររបស់យើងនឹងឆ្លើយតបភ្លាមៗ។"
      : "Have a question or need support? Reach out and our team will get back to you as soon as possible. We are always happy to help.",
    location: isKm ? "ទីតាំង" : "Location",
    contact: isKm ? "ទំនាក់ទំនង" : "Contact",
    email: isKm ? "អ៊ីមែល" : "Email",
    hours: isKm ? "ម៉ោងធ្វើការ" : "Hours of operation",
    hoursWeekday: isKm
      ? "ច័ន្ទ - សុក្រ: ០៩.០០ - ២០.០០"
      : "Monday - Friday: 09.00 - 20.00",
    hoursWeekend: isKm
      ? "អាទិត្យ និង សៅរ៍: ១០.៣០ - ២២.៣០"
      : "Sunday & Saturday: 10.30 - 22.30",
    formTitle: isKm ? "ត្រៀមខ្លួនចាប់ផ្តើមហើយឬ?" : "Ready To Get Started?",
    formSubtitle: isKm
      ? "អាសយដ្ឋានអ៊ីមែលរបស់អ្នកនឹងមិនត្រូវបានផ្សព្វផ្សាយទេ។ វាលដែលត្រូវការត្រូវបានសម្គាល់។"
      : "Your email address will not be published. Required fields are marked.",
    placeholderName: isKm ? "ឈ្មោះ" : "Name",
    placeholderEmail: isKm ? "អ៊ីមែល" : "Email",
    placeholderSubject: isKm ? "ប្រធានបទ" : "Subject",
    placeholderMsg: isKm ? "សរសេរសារ..." : "Write a message...",
    terms: isKm ? "លក្ខខណ្ឌ" : "terms",
    privacy: isKm ? "គោលការណ៍ឯកជនភាព" : "privacy policy",
    sending: isKm ? "កំពុងផ្ញើ..." : "Sending...",
    sendBtn: isKm ? "ផ្ញើសារ" : "Send Message",
    validationErr: isKm
      ? "សូមបំពេញវាលទាំងអស់"
      : "Please fill in all required fields",
    termsErr: isKm
      ? "សូមទទួលយកលក្ខខណ្ឌ និងគោលការណ៍ឯកជនភាព"
      : "Please accept the terms and privacy policy",
    securityTitle: isKm ? "ការពិនិត្យសុវត្ថិភាព" : "Security Check",
    securityDesc: isKm
      ? "សូមបញ្ជាក់ថាអ្នកជាមនុស្ស។"
      : "Please verify you are human.",
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [recaptchaValue, setRecaptchaValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRecaptchaModal, setShowRecaptchaModal] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const recaptchaRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      alert(text.validationErr);
      return;
    }
    if (!acceptedTerms) {
      alert(text.termsErr);
      return;
    }
    setShowRecaptchaModal(true);
  };

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
    if (value) {
      setTimeout(() => {
        setShowRecaptchaModal(false);
        submitForm(value);
      }, 1000);
    }
  };

  const submitForm = async (captchaToken) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, recaptchaToken: captchaToken }),
      });
      const data = await response.json();
      if (data.success) {
        setSubmissionStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setAcceptedTerms(false);
        setRecaptchaValue(null);
      } else {
        setSubmissionStatus("error");
      }
    } catch (error) {
      console.error("Contact form error:", error);
      setSubmissionStatus("error");
    } finally {
      setIsLoading(false);
    }
    setTimeout(() => setSubmissionStatus(null), 5000);
  };

  const closeModal = () => {
    setShowRecaptchaModal(false);
    setRecaptchaValue(null);
    if (recaptchaRef.current) recaptchaRef.current.reset();
  };

  const infoItems = [
    {
      icon: <HiMapPin className="w-6 h-6 text-gray-900" />,
      label: text.location,
      lines: [
        settings?.address || "4517 Washington Ave. Manchester, Kentucky 39495",
      ],
    },
    {
      icon: <HiPhone className="w-6 h-6 text-gray-900" />,
      label: text.contact,
      lines: [
        settings?.phoneNumber || "(405) 555-0128",
        settings?.phoneNumberAlt || "(603) 555-0123",
      ],
    },
    {
      icon: <HiEnvelope className="w-6 h-6 text-gray-900" />,
      label: text.email,
      lines: [settings?.email || "support@thetork.com"],
    },
    {
      icon: <HiClock className="w-6 h-6 text-gray-900" />,
      label: text.hours,
      lines: [text.hoursWeekday, text.hoursWeekend],
    },
  ];

  return (
    <>
      <style>{`
        .ct-word-wrap {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
        }
        .ct-word {
          display: inline-block;
          transform: translateY(110%);
          opacity: 0;
          transition: transform 0.55s cubic-bezier(0.77, 0, 0.175, 1),
                      opacity 0.15s ease;
        }
        .ct-entered .ct-word {
          transform: translateY(0);
          opacity: 1;
        }
        .ct-slide-up {
          transform: translateY(24px);
          opacity: 0;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      opacity 0.6s ease;
        }
        .ct-entered .ct-slide-up {
          transform: translateY(0);
          opacity: 1;
        }
        .ct-info-pop {
          transform: translateX(-18px);
          opacity: 0;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
                      opacity 0.4s ease;
        }
        .ct-entered .ct-info-pop {
          transform: translateX(0);
          opacity: 1;
        }
        .ct-form-pop {
          transform: translateX(18px);
          opacity: 0;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      opacity 0.5s ease;
        }
        .ct-entered .ct-form-pop {
          transform: translateX(0);
          opacity: 1;
        }
        .ct-map-pop {
          transform: translateY(24px);
          opacity: 0;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      opacity 0.6s ease;
        }
        .ct-entered .ct-map-pop {
          transform: translateY(0);
          opacity: 1;
        }
          .ct-map-pop iframe {
  width: 100% !important;
  height: 100% !important;
}
      `}</style>

      <div
        ref={ref}
        className={`min-h-screen bg-white font-sans antialiased${inView ? " ct-entered" : ""}`}
      >
        {/* ── Main Content ── */}
        <div className="w-full px-4 sm:px-6 lg:px-0 py-16 md:py-24">
          <div className="mx-auto w-full lg:w-[88%] xl:w-[83%] 2xl:max-w-[1400px] [@media(min-width:1700px)]:max-w-[1500px]">
            <div className="flex flex-col lg:flex-row gap-16 items-start">
              {/* ── Left Column: Info ── */}
              <div className="lg:w-1/2 space-y-8">
                <div>
                  <h1
                    className="text-4xl font-bold text-gray-900 mb-6"
                    style={{ lineHeight: 1.2 }}
                  >
                    <SliceText
                      text={text.heroTitle}
                      inView={inView}
                      baseDelay={0.05}
                    />
                  </h1>
                  <p
                    className="text-gray-600 text-lg leading-relaxed max-w-xl ct-slide-up"
                    style={{ transitionDelay: "0.45s" }}
                  >
                    {text.heroSubtitle}
                  </p>
                </div>

                <div className="space-y-10 pt-4">
                  {infoItems.map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-6 ct-info-pop"
                      style={{ transitionDelay: `${0.5 + i * 0.1}s` }}
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        {item.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {item.label}
                        </h3>
                        {item.lines.map((line, j) => (
                          <p key={j} className="text-gray-500">
                            {line}
                          </p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Right Column: Form Card ── */}
              <div
                className="lg:w-1/2 w-full bg-gray-50 rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 ct-form-pop"
                style={{ transitionDelay: "0.3s" }}
              >
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {text.formTitle}
                </h2>
                <p className="text-gray-500 text-sm mb-8">
                  {text.formSubtitle}
                </p>

                <form onSubmit={handleInitialSubmit} className="space-y-4">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder={text.placeholderName}
                    className="w-full px-6 py-4 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder={text.placeholderEmail}
                    className="w-full px-6 py-4 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder={text.placeholderSubject}
                    className="w-full px-6 py-4 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <textarea
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder={text.placeholderMsg}
                    className="w-full px-6 py-4 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-none"
                  />

                  <div className="flex items-center gap-3 py-2">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black"
                    />
                    <label htmlFor="terms" className="text-gray-600 text-sm">
                      Accept{" "}
                      <span className="underline cursor-pointer">
                        {text.terms}
                      </span>{" "}
                      and{" "}
                      <span className="underline cursor-pointer">
                        {text.privacy}
                      </span>
                      .
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-10 py-4 rounded-full bg-[#0a1118] text-white font-bold hover:bg-black transition-all active:scale-95 disabled:opacity-70"
                  >
                    {isLoading ? text.sending : text.sendBtn}
                  </button>
                  {submissionStatus === "success" && (
                    <p className="text-green-600 font-medium text-sm mt-2">
                      {isKm
                        ? "សារត្រូវបានផ្ញើដោយជោគជ័យ!"
                        : "Message sent successfully!"}
                    </p>
                  )}
                  {submissionStatus === "error" && (
                    <p className="text-red-500 font-medium text-sm mt-2">
                      {isKm
                        ? "ការផ្ញើបានបរាជ័យ។ សូមព្យាយាមម្តងទៀត។"
                        : "Failed to send. Please try again."}
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* ── Map Section ── */}
        <div className="w-full px-4 sm:px-6 lg:px-0 pb-24">
          <div className="mx-auto w-full lg:w-[88%] xl:w-[83%] 2xl:max-w-[1400px] [@media(min-width:1700px)]:max-w-[1500px]">
            {settings?.mapEmbedCode ? (
              <div
                className="rounded-3xl overflow-hidden h-[450px] shadow-lg border border-gray-100 ct-map-pop"
                style={{ transitionDelay: "0.7s" }}
                dangerouslySetInnerHTML={{ __html: settings.mapEmbedCode }}
              />
            ) : (
              <div
                className="rounded-3xl overflow-hidden h-[450px] shadow-lg border border-gray-100 ct-map-pop"
                style={{ transitionDelay: "0.7s" }}
              >
                <iframe
                  title="Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d204652.6172355523!2d-119.894334394015!3d36.78553471016834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80945de154971c33%3A0x6a69542018898952!2sFresno%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                />
              </div>
            )}
          </div>
        </div>

        <Newsletter />

        {/* ── reCAPTCHA Modal ── */}
        <AnimatePresence>
          {showRecaptchaModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-3xl p-8 max-w-sm w-full relative shadow-2xl"
              >
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-gray-400 hover:text-black"
                >
                  <X size={24} />
                </button>
                <div className="text-center mb-6 pt-4">
                  <h3 className="text-xl font-bold mb-2">
                    {text.securityTitle}
                  </h3>
                  <p className="text-gray-500 text-sm">{text.securityDesc}</p>
                </div>
                <div className="flex justify-center">
                  <ReCAPTCHA
                    ref={recaptchaRef}
                    sitekey="6LdT4g0rAAAAAH7WF1kDQuZqqEg6zpqJjv73jVOt"
                    onChange={handleRecaptchaChange}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Contact;
