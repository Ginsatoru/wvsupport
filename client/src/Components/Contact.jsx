import emailjs from "@emailjs/browser";
import ReCAPTCHA from "react-google-recaptcha";
import {
  HiOutlineMapPin,
  HiOutlinePhone,
  HiOutlineEnvelope,
} from "react-icons/hi2";
import "./Contact.css";
import { useSettings } from "../context/SettingsContext";
import { Loader2, AlertTriangle } from "lucide-react";
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
  const recaptchaRef = useRef();

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!recaptchaValue) {
      alert(t('contactPage.form.recaptchaAlert'));
      return;
    }

    setIsLoading(true);

    emailjs
      .send(
        "service_o96w1qd",
        "template_t3yham8",
        formData,
        "n9i79GtKbqRVdHvNV"
      )
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
        setSubmissionStatus("success");
        setFormData({
          name: "",
          email: "",
          subject: "",
          message: "",
        });
        recaptchaRef.current.reset();
        setRecaptchaValue(null);
      })
      .catch((err) => {
        console.error("FAILED...", err);
        setSubmissionStatus("error");
      })
      .finally(() => {
        setIsLoading(false);
      });

    setTimeout(() => setSubmissionStatus(null), 5000);
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center min-h-[92vh] bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-10 flex flex-col items-center space-y-4"
        >
          {timeoutReached ? (
            <>
              <AlertTriangle className="w-10 h-10 text-red-500" />
              <p className="text-gray-800 dark:text-gray-300 text-lg font-semibold">
                {t('contactPage.loading.errorTitle')}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm text-center max-w-sm">
                {t('contactPage.loading.errorDescription')}
              </p>
            </>
          ) : (
            <>
              <Loader2 className="w-10 h-10 text-sky-500 animate-spin" />
              <p className="text-gray-700 dark:text-gray-300 text-lg font-medium">
                {t('contactPage.loading.text')}
              </p>
            </>
          )}
        </motion.div>
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

              <div className="form-group">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey="6LdT4g0rAAAAAH7WF1kDQuZqqEg6zpqJjv73jVOt"
                  onChange={(value) => setRecaptchaValue(value)}
                />
              </div>

              <button
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
    </div>
  );
};

export default Contact;