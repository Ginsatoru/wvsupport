import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Lightbulb, Handshake, TrendingUp, Phone, Mail, MapPin } from "lucide-react";
import careersImg from "../Components/Images/careers.webp";
import { useSettings } from "../context/SettingsContext";
import { getActiveCareers } from "../services/careersApi";

const Careers = () => {
  const { i18n } = useTranslation();
  const isKm = i18n.language === "km";
  const { settings } = useSettings();

  // Saved content from Content › Careers (empty keeps the built-in wording/image)
  const [saved, setSaved] = useState(null);
  useEffect(() => {
    getActiveCareers(isKm ? "km" : "en")
      .then((res) => setSaved(res.data))
      .catch(() => setSaved(null));
  }, [isKm]);
  const pick = (field, fallback) => saved?.[field] || fallback;

  const defaultValues = [
    {
      icon: <Lightbulb size={20} strokeWidth={1.8} />,
      title: isKm ? "ការងារពីចម្ងាយ" : "Remote-First",
      desc: isKm
        ? "ក្រុមការងាររបស់យើងធ្វើការពីចម្ងាយ ដោយផ្តោតលើលទ្ធផលការងារ។"
        : "Our team works remotely from Siem Reap, with a focus on real outcomes, not desk time.",
    },
    {
      icon: <Handshake size={20} strokeWidth={1.8} />,
      title: isKm ? "ការងារជាក្រុម" : "Real Collaboration",
      desc: isKm
        ? "ធ្វើការជិតស្និទ្ធជាមួយអតិថិជន និងសហការីរាល់ថ្ងៃ។"
        : "You'll work closely with clients and teammates every day, not in isolation.",
    },
    {
      icon: <TrendingUp size={20} strokeWidth={1.8} />,
      title: isKm ? "ការរីកចម្រើន" : "Room to Grow",
      desc: isKm
        ? "រៀនប្រព័ន្ធ RetailManager ពិតប្រាកដ ហើយអភិវឌ្ឍជំនាញជាមួយក្រុមការងារ។"
        : "Learn a real product inside and out, and grow your skills alongside the team.",
    },
  ];
  const values = defaultValues.map((v, i) => ({
    ...v,
    title: saved?.values?.[i]?.title || v.title,
    desc: saved?.values?.[i]?.description || v.desc,
  }));

  // Contact details come from Settings (admin panel)
  const phone = settings?.phoneNumber || "+855 974 839 135";
  const email = settings?.email || "wvservicescambodia@gmail.com";
  const contactItems = [
    {
      icon: <Phone size={18} />,
      label: isKm ? "ទូរស័ព្ទ" : "Phone",
      value: phone,
      href: `tel:${phone.replace(/[^0-9+]/g, "")}`,
    },
    {
      icon: <Mail size={18} />,
      label: isKm ? "អ៊ីមែល" : "Email",
      value: email,
      href: `mailto:${email}`,
    },
    {
      icon: <MapPin size={18} />,
      label: isKm ? "ទីតាំង" : "Location",
      value: settings?.address || "Phum Thmey, Sangkat Svay Dankum, Siem Reap, Cambodia",
      href: null,
    },
  ];

  const buttonLink = pick("buttonLink", `mailto:${email}`);
  const openings = saved?.openings || [];

  return (
    <div className="bg-white">
      <div className="w-full px-4 sm:px-6 lg:px-0 py-10 md:py-12">
        <div className="mx-auto w-full lg:w-[88%] xl:w-[83%] 2xl:max-w-[1400px] [@media(min-width:1700px)]:max-w-[1500px]">

          {/* ── Intro ── */}
          <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-12 mb-6 md:mb-8">
            <div className="flex-1 max-w-2xl">
              <span
                className="inline-block text-[11px] font-bold uppercase tracking-[0.13em] mb-3"
                style={{ color: "#0f8abe" }}
              >
                {pick("eyebrow", isKm ? "ការងារ" : "Careers")}
              </span>
              <h1
                className="font-extrabold leading-[1.15] mb-4"
                style={{ fontSize: "clamp(26px, 3.5vw, 42px)", color: "#000000" }}
              >
                {pick("title", isKm ? "ចូលរួមជាមួយក្រុមការងារ WV Support" : "Join the WV Support team")}
              </h1>
              <p className="text-[15px] md:text-base leading-[1.8]" style={{ color: "#000000" }}>
                {pick(
                  "body",
                  isKm
                    ? "យើងជាក្រុមការងារនៅសៀមរាប ដែលផ្តល់ការគាំទ្របច្ចេកទេសពីចម្ងាយសម្រាប់ RetailManager ជូនអតិថិជនអូស្ត្រាលី និយសេឡង់ និងតំបន់អាស៊ី-ប៉ាស៊ីហ្វិក។"
                    : "We're a Siem Reap-based team delivering remote technical support for RetailManager, helping retailers across Australia, New Zealand, and the Asia-Pacific region."
                )}
              </p>
            </div>

            <div className="flex-1 w-full mx-auto lg:mx-0">
              <img
                src={pick("image", careersImg)}
                alt=""
                draggable={false}
                className="w-full h-auto max-h-[320px] object-contain select-none mx-auto"
              />
            </div>
          </div>

          {/* ── Values ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-10 md:mb-12 text-center">
            {values.map((v, i) => (
              <div key={i} className="flex flex-col items-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-5 bg-white"
                  style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.10)", color: "#000000" }}
                >
                  {v.icon}
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: "#000000" }}>
                  {v.title}
                </h3>
                <p className="text-sm leading-relaxed max-w-[240px]" style={{ color: "#000000" }}>
                  {v.desc}
                </p>
              </div>
            ))}
          </div>

          {/* ── Openings box ── */}
          <div
            className="rounded-3xl p-6 md:p-8 text-center"
            style={{ background: "#f8fafc" }}
          >
            <h2 className="text-xl md:text-2xl font-bold mb-3" style={{ color: "#000000" }}>
              {pick("boxTitle", isKm ? "មិនមានតំណែងបើកទេនាពេលនេះ" : "No Openings Right Now")}
            </h2>
            <p className="text-[15px] leading-[1.8] mb-8 max-w-xl mx-auto whitespace-pre-line" style={{ color: "#000000" }}>
              {pick(
                "boxText",
                isKm
                  ? "យើងគ្មានតំណែងទំនេរនាពេលបច្ចុប្បន្នទេ ប៉ុន្តែយើងតែងតែចង់ស្គាល់មនុស្សល្អ។ ផ្ញើប្រវត្តិរូបសង្ខេបរបស់អ្នកមកយើងខ្ញុំ ហើយយើងនឹងទាក់ទងទៅវិញនៅពេលមានឱកាសសមស្រប។"
                  : "We don't have any open roles at the moment, but we're always happy to hear from good people. Send us your resume and we'll reach out when a suitable opportunity comes up."
              )}
            </p>

            {/* Open roles (only when some are added in the admin) */}
            {openings.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
                {openings.map((job, i) => (
                  <div key={i} className="rounded-2xl bg-white p-5 border border-gray-100 flex flex-col">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-base font-bold" style={{ color: "#000000" }}>
                        {job.title}
                      </h3>
                      {job.type && (
                        <span className="flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100" style={{ color: "#000000" }}>
                          {job.type}
                        </span>
                      )}
                    </div>
                    {job.description && (
                      <p className="text-sm leading-relaxed mb-4 whitespace-pre-line" style={{ color: "#000000" }}>
                        {job.description}
                      </p>
                    )}
                    <a
                      href={`mailto:${email}?subject=${encodeURIComponent(`Application: ${job.title}`)}`}
                      className="mt-auto self-start px-4 py-2 rounded-full text-sm font-semibold text-white"
                      style={{ background: "#0f8abe" }}
                    >
                      {isKm ? "ដាក់ពាក្យ" : "Apply"}
                    </a>
                  </div>
                ))}
              </div>
            )}

            <a
              href={buttonLink}
              className="inline-block px-8 py-3.5 rounded-full font-semibold text-white"
              style={{ background: "#000000" }}
            >
              {pick("buttonText", isKm ? "ផ្ញើប្រវត្តិរូបសង្ខេប" : "Send Your Resume")}
            </a>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6 pt-4 text-left">
              {contactItems.map((item, i) => {
                const Tag = item.href ? "a" : "div";
                return (
                  <Tag
                    key={i}
                    {...(item.href ? { href: item.href } : {})}
                    className="flex items-start gap-3"
                  >
                    <div
                      className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
                      style={{ background: "#000000", color: "#ffffff" }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                        {item.label}
                      </div>
                      <div className="text-sm font-medium" style={{ color: "#000000" }}>
                        {item.value}
                      </div>
                    </div>
                  </Tag>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Careers;