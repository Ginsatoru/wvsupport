import ReCAPTCHA from "react-google-recaptcha";
import {
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineEnvelope,
} from "react-icons/hi2";
import "./Contact.css";
import { useSettings } from "../context/SettingsContext";
import { Loader2, AlertTriangle, X } from "lucide-react";
import { motion } from "framer-motion";
import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from 'react-i18next';

const Contact = () => {
  const { t } = useTranslation();
  const { settings, loading } = useSettings();
  const [timeoutReached, setTimeoutReached] = useState(false);
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
  const recaptchaRef = useRef();
  const submitButtonRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeoutReached(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInitialSubmit = (e) => {
    e.preventDefault();
    
    // Validate form fields
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert("Please fill in all required fields");
      return;
    }
    
    // Show reCAPTCHA modal
    setShowRecaptchaModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // If reCAPTCHA is not verified, show modal instead of submitting
    if (!recaptchaValue) {
      setShowRecaptchaModal(true);
      return;
    }

    // If reCAPTCHA is verified, proceed with original submission logic
    setIsLoading(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmissionStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
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

  const handleRecaptchaChange = (value) => {
    setRecaptchaValue(value);
    if (value) {
      // Small delay to show verification success before triggering submit
      setTimeout(() => {
        setShowRecaptchaModal(false);
        // Trigger the existing form submission by clicking the submit button
        if (submitButtonRef.current) {
          submitButtonRef.current.click();
        }
      }, 1000);
    }
  };

  const submitForm = async () => {
    if (!recaptchaValue) {
      return;
    }

    setIsLoading(true);
    setShowRecaptchaModal(false);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          recaptchaToken: recaptchaValue
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmissionStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
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
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  };

  if (loading || !settings) {
    return (
      <div className="bg-white">
        <div className="w-full mx-auto py-12 md:py-16 max-w-full lg:max-w-[1250px] 2xl:max-w-[1350px] [@media(min-width:1700px)]:max-w-[1585px]">
          {/* Header skeleton */}
          <div className="text-center mb-8 md:mb-10 px-4">
            <div className="h-10 sm:h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg mx-auto max-w-md mb-4"></div>
            <div className="h-5 sm:h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg mx-auto max-w-2xl"></div>
          </div>

          <div className="px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-8">
              {/* Contact form skeleton */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                {/* Form title */}
                <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg mb-6 max-w-xs"></div>
                
                {/* Form fields */}
                <div className="space-y-6">
                  {[...Array(4)].map((_, index) => (
                    <div key={index}>
                      <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded mb-2 max-w-24"></div>
                      <div className={`${index === 3 ? 'h-24' : 'h-12'} bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg w-full`}></div>
                    </div>
                  ))}
                  {/* Submit button */}
                  <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg max-w-36"></div>
                </div>
              </div>

              {/* Contact info skeleton */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-8">
                {/* Contact info title */}
                <div className="h-7 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg mb-6 max-w-48"></div>
                
                {/* Contact methods */}
                <div className="space-y-6 mb-8">
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="h-5 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded mb-2 max-w-32"></div>
                        <div className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded max-w-48"></div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Business hours */}
                <div>
                  <div className="h-6 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg mb-3 max-w-36"></div>
                  <div className="space-y-2">
                    {[...Array(3)].map((_, index) => (
                      <div key={index} className="h-4 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded max-w-44"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Map skeleton */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-96 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 bg-[length:200%_100%] animate-shimmer"></div>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes shimmer {
            0% {
              background-position: -200% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }

          .animate-shimmer {
            animation: shimmer 2s ease-in-out infinite;
          }
        `}</style>
      </div>
    );
  }

  const contactMethods = [
    {
      icon: <HiOutlineMapPin className="contact-icon" />,
      title: t('contactPage.contactMethods.address.title'),
      description: settings.address || t('contactPage.contactMethods.address.fallback'),
    },
    {
      icon: <HiOutlinePhone className="contact-icon" />,
      title: t('contactPage.contactMethods.phone.title'),
      description: settings.phoneNumber || t('contactPage.contactMethods.phone.fallback'),
    },
    {
      icon: <HiOutlineEnvelope className="contact-icon" />,
      title: t('contactPage.contactMethods.email.title'),
      description: settings.email || t('contactPage.contactMethods.email.fallback'),
    },
  ];

  return (
    <div className="whole-page">
      <header className="contact-header">
        <h1>{t('contactPage.header.title')}</h1>
        <p>{t('contactPage.header.subtitle')}</p>
      </header>

      <div className="contact-container">
        <div className="contact-content">
          <div className="contact-form-container">
            <h2>{t('contactPage.form.title')}</h2>

            {submissionStatus === "success" && (
              <div className="alert success">
                {t('contactPage.form.successMessage')}
              </div>
            )}

            {submissionStatus === "error" && (
              <div className="alert error">
                {t('contactPage.form.errorMessage')}
              </div>
            )}

            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">{t('contactPage.form.name.label')}</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder={t('contactPage.form.name.placeholder')}
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">{t('contactPage.form.email.label')}</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder={t('contactPage.form.email.placeholder')}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject">{t('contactPage.form.subject.label')}</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  placeholder={t('contactPage.form.subject.placeholder')}
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">{t('contactPage.form.message.label')}</label>
                <textarea
                  id="message"
                  name="message"
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={t('contactPage.form.message.placeholder')}
                  required
                ></textarea>
              </div>

              <button
                ref={submitButtonRef}
                type="submit"
                className={`submit-btn ${isLoading ? "loading" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="loading-spinner"></span>
                    {t('contactPage.form.submit.sending')}
                  </>
                ) : (
                  t('contactPage.form.submit.button')
                )}
              </button>
            </form>
          </div>

          <div className="contact-info">
            <h2>{t('contactPage.contactInfo.title')}</h2>

            <div className="contact-methods">
              {contactMethods.map((method, index) => (
                <div key={index} className="contact-method">
                  <div className="method-icon">{method.icon}</div>
                  <h3>{method.title}</h3>
                  <p>{method.description}</p>
                </div>
              ))}
            </div>

            <div className="business-hours">
              <h3>{t('contactPage.businessHours.title')}</h3>
              <p>{t('contactPage.businessHours.weekdays')}</p>
              <p>{t('contactPage.businessHours.saturday')}</p>
              <p>{t('contactPage.businessHours.sunday')}</p>
            </div>
          </div>
        </div>

        <div className="contact-map">
          {settings.mapEmbedCode ? (
            <div dangerouslySetInnerHTML={{ __html: settings.mapEmbedCode }} />
          ) : (
            <iframe
              title={t('contactPage.map.title')}
              src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d970.5500260653366!2d103.83897579630282!3d13.337825192552444!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sau!4v1743737141343!5m2!1sen!2sau"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
            ></iframe>
          )}
        </div>
      </div>

      {/* reCAPTCHA Modal */}
      {showRecaptchaModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-gradient-to-br from-black/40 to-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: {
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.6
              }
            }}
            exit={{ 
              opacity: 0, 
              scale: 0.8, 
              y: 50,
              transition: { duration: 0.3 }
            }}
            className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-3xl shadow-2xl border-2 p-8 max-w-md w-full relative overflow-hidden"
            style={{borderColor: '#0f8abe30'}}
          >
            {/* Decorative gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/30 to-blue-50/30 dark:from-cyan-900/10 dark:to-blue-900/10 -z-10" style={{background: 'linear-gradient(135deg, rgba(15, 138, 190, 0.05) 0%, rgba(15, 138, 190, 0.02) 100%)'}}></div>
            
            {/* Close button */}
            <motion.button
              onClick={closeModal}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-100/80 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-all duration-200 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50"
            >
              <X size={18} />
            </motion.button>

            {/* Header with icon */}
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ 
                  scale: 1, 
                  rotate: 0,
                  transition: { delay: 0.2, type: "spring", damping: 20, stiffness: 300 }
                }}
                className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-base"
              >
                <motion.div
                  animate={{ 
                    y: [0, -2, 0],
                    transition: { 
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }
                  }}
                >
                  <svg 
                    className="w-8 h-8 text-[#0f8abe]" 
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
                </motion.div>
              </motion.div>
              
              <motion.h3 
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.3, duration: 0.5 }
                }}
                className="text-2xl font-bold text-transparent bg-clip-text"
                style={{background: 'linear-gradient(135deg, #0f8abe 0%, #0a6b8f 100%)', WebkitBackgroundClip: 'text'}}
              >
                Security Verification
              </motion.h3>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.4, duration: 0.5 }
                }}
                className="text-gray-600 dark:text-gray-400 mt-2 leading-relaxed"
              >
                Help us keep our platform secure by completing the verification below
              </motion.p>
            </div>

            {/* reCAPTCHA container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: { delay: 0.5, duration: 0.4 }
              }}
              className="flex justify-center"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-inner border-2" style={{borderColor: '#0f8abe20'}}>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6LdT4g0rAAAAAH7WF1kDQuZqqEg6zpqJjv73jVOt"
                  onChange={handleRecaptchaChange}
                  theme="light"
                />
              </div>
            </motion.div>

            {/* Loading state indicator */}
            {recaptchaValue && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center justify-center space-x-2"
                style={{color: '#0f8abe'}}
              >
                <motion.div className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin">
                </motion.div>
                <span className="text-sm font-medium">Verification successful! Sending message...</span>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Contact;