import ReCAPTCHA from "react-google-recaptcha";
import { HiPhone, HiEnvelope, HiMapPin, HiClock } from "react-icons/hi2";
import { useSettings } from "../context/SettingsContext";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";

/* ── Word-slice (kept for section titles) ── */
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
    // Form
    formTitle: isKm ? "ត្រៀមខ្លួនចាប់ផ្តើមហើយឬ?" : "Ready To Get Started?",
    formSubtitle: isKm
      ? "អាសយដ្ឋានអ៊ីមែលរបស់អ្នកនឹងមិនត្រូវបានផ្សព្វផ្សាយទេ។ វាលដែលត្រូវការត្រូវបានសម្គាល់។"
      : "Your email address will not be published. Required fields are marked.",
    labelName: isKm ? "ឈ្មោះពេញ" : "Full Name",
    labelEmail: isKm ? "អាសយដ្ឋានអ៊ីមែល" : "Email Address",
    labelPhone: isKm ? "លេខទូរស័ព្ទ" : "Phone Number",
    labelSubject: isKm ? "ប្រធានបទ" : "Subject",
    labelMessage: isKm ? "សាររបស់អ្នក" : "Your Message",
    placeholderName: isKm ? "ឈ្មោះរបស់អ្នក" : "Your Name",
    placeholderEmail: isKm ? "អាសយដ្ឋានអ៊ីមែលរបស់អ្នក" : "Your Email Address",
    placeholderPhone: isKm ? "លេខទូរស័ព្ទរបស់អ្នក" : "Your Phone Number",
    placeholderSubject: isKm ? "តើយើងអាចជួយអ្វីបាន?" : "How can we help?",
    placeholderMsg: isKm ? "សរសេរអ្វីដែលនៅក្នុងចិត្តរបស់អ្នក..." : "Tell us what's on your mind...",
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
    securityDesc: isKm ? "សូមបញ្ជាក់ថាអ្នកជាមនុស្ស។" : "Please verify you are human.",

    // Sidebar
    location: isKm ? "ទីតាំង" : "Address",
    contact: isKm ? "ទូរស័ព្ទ" : "Phone",
    email: isKm ? "អ៊ីមែល" : "Email",
    infoTitle: isKm ? "ព័ត៌មានទំនាក់ទំនង" : "Contact Information",
    infoText: isKm
      ? "ទាក់ទងមកតាមរយៈបណ្តាញណាមួយទាំងនេះ យើងនៅទីនេះដើម្បីជួយ!"
      : "Reach out through any of these channels, we're here to help!",
    hoursTitle: isKm ? "ម៉ោងធ្វើការ" : "Business Hours",
    hoursWeekday: isKm ? "ច័ន្ទ - សុក្រ" : "Monday - Friday",
    hoursSaturday: isKm ? "សៅរ៍" : "Saturday",
    hoursSunday: isKm ? "អាទិត្យ" : "Sunday",
    hoursWeekdayTime: isKm ? "០៩.០០ - ២០.០០" : "09:00 - 20:00",
    hoursWeekendTime: isKm ? "១០.៣០ - ២២.៣០" : "10:30 - 22:30",
    // Map
    mapTitle: isKm ? "ស្វែងរកយើងនៅទីនេះ" : "Find Us Here",
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
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
        setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
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

  // ── Contact info links (mirrors .contact-info-link cards) ──
  const contactLinks = [
    {
      icon: <HiPhone className="w-5 h-5" />,
      label: text.contact,
      value: settings?.phoneNumber || "(405) 555-0128",
      href: `tel:${(settings?.phoneNumber || "").replace(/[^0-9+]/g, "")}`,
    },
    {
      icon: <HiEnvelope className="w-5 h-5" />,
      label: text.email,
      value: settings?.email || "support@thetork.com",
      href: `mailto:${settings?.email || "support@thetork.com"}`,
    },
    {
      icon: <HiMapPin className="w-5 h-5" />,
      label: text.location,
      value: settings?.address || "4517 Washington Ave. Manchester, Kentucky 39495",
      href: settings?.addressUrl || null,
    },
  ];

  // ── Business hours rows (mirrors .hours-item rows) ──
  const hoursRows = [
    { day: text.hoursWeekday, time: text.hoursWeekdayTime },
    { day: text.hoursSaturday, time: text.hoursWeekendTime },
    { day: text.hoursSunday, time: text.hoursWeekendTime },
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
        .ct-info-link {
          transition: border-color 0.15s ease;
        }
        .ct-info-link:hover {
          border-color: #0f8abe;
        }
      `}</style>

      <div
        ref={ref}
        className={`min-h-screen bg-white font-sans antialiased${inView ? " ct-entered" : ""}`}
      >
        {/* ── Main Content: Form + Sidebar ── */}
        <div className="w-full px-4 sm:px-6 lg:px-0 py-16 md:py-20">
          <div className="mx-auto w-full lg:w-[88%] xl:w-[83%] 2xl:max-w-[1400px] [@media(min-width:1700px)]:max-w-[1500px]">
            <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16 items-start">

              {/* ── Left: Contact Form ── */}
              <div className="w-full ct-form-pop" style={{ transitionDelay: "0.2s" }}>
                <h2 className="text-3xl font-bold text-black mb-2">
                  {text.formTitle}
                </h2>
                <p className="text-gray-500 text-sm mb-8">
                  {text.formSubtitle}
                </p>

                <form onSubmit={handleInitialSubmit} className="flex flex-col gap-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label className="flex items-center gap-1 text-sm font-semibold text-black mb-2">
                        {text.labelName} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder={text.placeholderName}
                        className="w-full px-4 py-3.5 rounded-xl bg-white border-[0.5px] border-gray-300 focus:outline-none focus:border-[#0f8abe] transition-all"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="flex items-center gap-1 text-sm font-semibold text-black mb-2">
                        {text.labelEmail} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder={text.placeholderEmail}
                        className="w-full px-4 py-3.5 rounded-xl bg-white border-[0.5px] border-gray-300 focus:outline-none focus:border-[#0f8abe] transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col">
                      <label className="flex items-center gap-1 text-sm font-semibold text-black mb-2">
                        {text.labelPhone}
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder={text.placeholderPhone}
                        className="w-full px-4 py-3.5 rounded-xl bg-white border-[0.5px] border-gray-300 focus:outline-none focus:border-[#0f8abe] transition-all"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="flex items-center gap-1 text-sm font-semibold text-black mb-2">
                        {text.labelSubject} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder={text.placeholderSubject}
                        className="w-full px-4 py-3.5 rounded-xl bg-white border-[0.5px] border-gray-300 focus:outline-none focus:border-[#0f8abe] transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col">
                    <label className="flex items-center gap-1 text-sm font-semibold text-black mb-2">
                      {text.labelMessage} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={text.placeholderMsg}
                      className="w-full px-4 py-3.5 rounded-xl bg-white border-[0.5px] border-gray-300 focus:outline-none focus:border-[#0f8abe] transition-all resize-y"
                    />
                  </div>

                  <div className="flex items-center gap-3 py-1">
                    <input
                      type="checkbox"
                      id="terms"
                      checked={acceptedTerms}
                      onChange={(e) => setAcceptedTerms(e.target.checked)}
                      className="w-5 h-5 rounded border-gray-300 text-[#0f8abe] focus:ring-[#0f8abe]"
                    />
                    <label htmlFor="terms" className="text-gray-600 text-sm">
                      Accept{" "}
                      <span className="underline cursor-pointer">{text.terms}</span>{" "}
                      and{" "}
                      <span className="underline cursor-pointer">{text.privacy}</span>.
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-3 w-full sm:w-auto sm:self-start px-8 py-4 rounded-xl bg-black text-white font-semibold hover:bg-gray-800 transition-all disabled:opacity-70"
                  >
                    {!isLoading && (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    )}
                    <span>{isLoading ? text.sending : text.sendBtn}</span>
                  </button>

                  {submissionStatus === "success" && (
                    <p className="text-green-600 font-medium text-sm">
                      {isKm ? "សារត្រូវបានផ្ញើដោយជោគជ័យ!" : "Message sent successfully!"}
                    </p>
                  )}
                  {submissionStatus === "error" && (
                    <p className="text-red-500 font-medium text-sm">
                      {isKm ? "ការផ្ញើបានបរាជ័យ។ សូមព្យាយាមម្តងទៀត។" : "Failed to send. Please try again."}
                    </p>
                  )}
                </form>
              </div>

              {/* ── Right: Sidebar ── */}
              <div className="w-full flex flex-col gap-6">

                {/* Contact Info Card */}
                <div
                  className="ct-info-pop bg-[#f8fafc] p-8 rounded-2xl border border-gray-100"
                  style={{ transitionDelay: "0.3s" }}
                >
                  <h3 className="text-2xl font-bold text-black mb-2">{text.infoTitle}</h3>
                  <p className="text-gray-500 mb-6 leading-relaxed">{text.infoText}</p>

                  <div className="flex flex-col gap-3">
                    {contactLinks.map((item, i) => {
                      const Tag = item.href ? "a" : "div";
                      return (
                        <Tag
                          key={i}
                          {...(item.href
                            ? { href: item.href, target: item.href.startsWith("http") ? "_blank" : undefined, rel: "noopener noreferrer" }
                            : {})}
                          className="ct-info-link flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-100"
                        >
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                            {item.icon}
                          </div>
                          <div className="flex flex-col gap-0.5">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
                              {item.label}
                            </span>
                            <span className="text-black font-medium leading-snug break-words">
                              {item.value}
                            </span>
                          </div>
                        </Tag>
                      );
                    })}
                  </div>
                </div>

                {/* Business Hours Card */}
                <div
                  className="ct-info-pop bg-white p-8 rounded-2xl border border-gray-200"
                  style={{ transitionDelay: "0.4s" }}
                >
                  <h3 className="flex items-center gap-2 text-xl font-bold text-black mb-6">
                    <HiClock className="w-5 h-5 text-[#0f8abe]" />
                    {text.hoursTitle}
                  </h3>
                  <div className="flex flex-col gap-3">
                    {hoursRows.map((row, i) => (
                      <div
                        key={i}
                        className={`flex justify-between items-center py-3 ${i !== hoursRows.length - 1 ? "border-b border-gray-100" : ""}`}
                      >
                        <span className="text-black font-medium">{row.day}</span>
                        <span className="text-sm text-gray-500">{row.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ── Map Section ── */}
        <div className="w-full px-4 sm:px-6 lg:px-0 pb-16">
          <div className="mx-auto w-full lg:w-[88%] xl:w-[83%] 2xl:max-w-[1400px] [@media(min-width:1700px)]:max-w-[1500px]">
            <div className="text-center mb-4">
              <h2 className="text-3xl md:text-4xl font-extrabold text-black">
                {text.mapTitle}
              </h2>
            </div>

            {settings?.mapEmbedCode ? (
              <div
                className="rounded-3xl overflow-hidden h-[450px] border-[8px] border-white ct-map-pop"
                style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.1)", transitionDelay: "0.6s" }}
                dangerouslySetInnerHTML={{ __html: settings.mapEmbedCode }}
              />
            ) : (
              <div
                className="rounded-3xl overflow-hidden h-[450px] border-[8px] border-white ct-map-pop"
                style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.1)", transitionDelay: "0.6s" }}
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
                  <h3 className="text-xl font-bold mb-2 text-black">
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