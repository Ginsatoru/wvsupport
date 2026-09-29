import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Home, Mail } from "lucide-react";

const TEXT = {
  en: {
    title: "Page not found",
    body: "The page you're looking for doesn't exist or has been moved.",
    home: "Back to home",
    contact: "Contact us",
  },
  km: {
    title: "រកមិនឃើញទំព័រ",
    body: "ទំព័រដែលអ្នកកំពុងស្វែងរកមិនមាន ឬត្រូវបានផ្លាស់ទីហើយ។",
    home: "ត្រឡប់ទៅទំព័រដើម",
    contact: "ទំនាក់ទំនងយើង",
  },
};

/* ── Word-slice text — same mechanic as the hero ── */
const SliceText = ({ text, baseDelay = 0 }) => {
  const words = text.split(" ");
  return words.map((word, i) => (
    <span key={i} className="nf-word-wrap">
      <span className="nf-word" style={{ transitionDelay: `${baseDelay + i * 0.055}s` }}>
        {word}
        {i < words.length - 1 ? "\u00A0" : ""}
      </span>
    </span>
  ));
};

const NotFound = () => {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();
  const t = TEXT[i18n.language === "km" ? "km" : "en"];
  const [entered, setEntered] = useState(false);

  // Start the entrance just after mount (like the hero), and set the tab title
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `404 · ${TEXT.en.title}`;
    const timer = setTimeout(() => setEntered(true), 80);
    return () => {
      clearTimeout(timer);
      document.title = previousTitle;
    };
  }, []);

  return (
    <section
      className={`min-h-[70vh] flex items-center justify-center px-6 py-24 bg-white${entered ? " nf-entered" : ""}`}
    >
      <div className="max-w-lg text-center">
        <p className="overflow-hidden text-[96px] sm:text-[128px] font-extrabold leading-none tracking-tight text-black">
          <SliceText text="404" baseDelay={0.05} />
        </p>

        <h1 className="mt-4 overflow-hidden text-2xl sm:text-3xl font-bold text-black">
          <SliceText text={t.title} baseDelay={0.25} />
        </h1>
        <p className="mt-3 text-sm sm:text-base text-gray-600">
          <SliceText text={t.body} baseDelay={0.42} />
        </p>

        <p
          className="nf-drop mt-4 inline-block max-w-full truncate px-3 py-1 rounded-full bg-gray-100 text-xs text-gray-500"
          style={{ transitionDelay: "0.8s" }}
        >
          {pathname}
        </p>

        <div
          className="nf-slide-up mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          style={{ transitionDelay: "0.9s" }}
        >
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            <Home size={16} />
            {t.home}
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-gray-200 text-black text-sm font-semibold hover:bg-[#f1f5f9] transition-colors"
          >
            <Mail size={16} />
            {t.contact}
          </Link>
        </div>
      </div>

      {/* Same timings/easing as the hero's hero-word / hero-slide-up / hero-stat-drop */}
      <style>{`
        .nf-word-wrap { display: inline-block; overflow: hidden; vertical-align: bottom; }
        .nf-word {
          display: inline-block;
          transform: translateY(110%);
          opacity: 0;
          transition: transform 0.55s cubic-bezier(0.77, 0, 0.175, 1), opacity 0.15s ease;
        }
        .nf-entered .nf-word { transform: translateY(0); opacity: 1; }

        .nf-slide-up {
          transform: translateY(24px);
          opacity: 0;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.6s ease;
        }
        .nf-entered .nf-slide-up { transform: translateY(0); opacity: 1; }

        .nf-drop {
          transform: translateY(-18px);
          opacity: 0;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease;
        }
        .nf-entered .nf-drop { transform: translateY(0); opacity: 1; }
      `}</style>
    </section>
  );
};

export default NotFound;