import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { getActiveHeroContent } from "../../services/heroApi";
import fallbackHero from "../Images/hero.webp";

/* ── Word-slice text ── */
const SliceText = ({ text, inView, baseDelay = 0 }) => (
  <>
    {text.split(" ").map((word, i) => (
      <span key={i} className="hero-word-wrap">
        <span
          className="hero-word"
          style={{ transitionDelay: `${baseDelay + i * 0.055}s` }}
        >
          {word}
          {i < text.split(" ").length - 1 ? "\u00A0" : ""}
        </span>
      </span>
    ))}
  </>
);

const DEFAULT_CONTENT = {
  en: {
    title: "WV Support\nServices Cambodia",
    subtitle:
      "Cutting-edge IT solutions in Cambodia. We deliver premium support, network infrastructure, and software expertise to keep your business at the digital forefront from our Siem Reap headquarters.",
    primaryCtaText: "Learn More",
    primaryCtaLink: "/services",
    secondaryCtaText: "Get Started",
    secondaryCtaLink: "/contact",
    backgroundImage: fallbackHero,
  },
  km: {
    title: "សេវាកម្មគាំទ្រ WV\nកម្ពុជា",
    subtitle:
      "ដំណោះស្រាយព័ត៌មានវិទ្យាទំនើបនៅកម្ពុជា។ យើងផ្តល់សេវាគាំទ្រពិសេស រចនាសម្ព័ន្ធបណ្តាញ និងជំនាញកម្មវិធីដើម្បីរក្សាអាជីវកម្មរបស់អ្នកនៅចំណុចខាងមុខនៃបច្ចេកវិទ្យាឌីជីថលពីទីស្នាក់ការកណ្តាលរបស់យើងនៅសៀមរាប។",
    primaryCtaText: "ស្វែងយល់បន្ថែម",
    primaryCtaLink: "/services",
    secondaryCtaText: "ចាប់ផ្តើម",
    secondaryCtaLink: "/contact",
    backgroundImage: fallbackHero,
  },
};

const HeroSection = () => {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(true);
  const [personImageLoaded, setPersonImageLoaded] = useState(false);
  const [heroData, setHeroData] = useState(DEFAULT_CONTENT.en);
  const [loading, setLoading] = useState(false);
  const [entered, setEntered] = useState(false);
  const mainLayerRef = useRef(null);
  const rafRef = useRef(null);

  /* ── Parallax scroll ── */
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        rafRef.current = requestAnimationFrame(() => {
          const y = window.scrollY;
          if (mainLayerRef.current) {
            mainLayerRef.current.style.transform = `translate3d(0, ${y * 0.5}px, 0)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ── Fetch hero content ── */
  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        setLoading(true);
        const result = await getActiveHeroContent();
        if (result.success && result.data) {
          setHeroData(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch hero content");
        }
      } catch (err) {
        console.error("Error fetching hero content:", err);
        const currentLang = i18n.language === "km" ? "km" : "en";
        setHeroData(DEFAULT_CONTENT[currentLang]);
      } finally {
        setLoading(false);
      }
    };
    fetchHeroContent();
  }, [i18n.language]);

  /* ── Trigger entrance after data loads ── */
  useEffect(() => {
    if (!loading && heroData) {
      const timer = setTimeout(() => setEntered(true), 80);
      return () => clearTimeout(timer);
    }
  }, [loading, heroData]);

  const handleNavigation = (link) => {
    if (link?.startsWith("http") || link?.startsWith("https")) {
      window.open(link, "_blank");
    } else {
      navigate(link || "/");
    }
  };

  const isKm = i18n.language === "km";
  const titleLines = (heroData.title || "").split("\n");

  const stats = [
    { value: "100K+", label: isKm ? "អ្នកប្រើប្រាស់ទូទាំងពិភពលោក" : "Worldwide Users" },
    { value: "20K+",  label: isKm ? "ឱកាសការងារ" : "Job Opportunities" },
    { value: "6.7K+", label: isKm ? "ក្រុមហ៊ុនចូលរួម" : "Joined Companies" },
  ];

  return (
    <section
      className={`relative w-full overflow-hidden bg-white${entered ? " hero-entered" : ""}`}
    >
      {/* ── LEFT — content ── */}
      <div className="relative z-10 flex flex-col justify-center w-full lg:w-[50%] lg:min-h-screen px-6 sm:px-10 lg:pl-[11%] lg:pr-10 pt-16 pb-10 sm:pt-20 sm:pb-14 lg:py-0">

        {/* Title */}
        <h2
          className="font-extrabold leading-[1.1] tracking-tight text-gray-900 mb-4 lg:mb-5"
          style={{ fontSize: "clamp(28px, 4vw, 56px)" }}
        >
          {titleLines.map((line, li) => (
            <div key={li} className="overflow-hidden" style={{ marginBottom: li < titleLines.length - 1 ? "0.05em" : 0 }}>
              <SliceText text={line} inView={entered} baseDelay={0.1 + li * 0.18} />
            </div>
          ))}
        </h2>

        {/* Subtitle */}
        <p
          className="text-sm sm:text-[15px] text-gray-500 leading-relaxed max-w-sm mb-6 lg:mb-8"
          style={{ display: "flex", flexWrap: "wrap" }}
        >
          <SliceText text={heroData.subtitle || ""} inView={entered} baseDelay={0.42} />
        </p>

        {/* CTA buttons */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-8 lg:mb-16 hero-slide-up"
          style={{ transitionDelay: "0.85s" }}
        >
          <button
            onClick={() => handleNavigation(heroData.primaryCtaLink)}
            className="cta-primary px-6 py-3 sm:py-3.5 text-sm sm:text-base"
          >
            {heroData.primaryCtaText}
          </button>

          <button
            onClick={() => handleNavigation(heroData.secondaryCtaLink)}
            className="cta-ghost group"
          >
            <span className="cta-ghost__ring group-hover:bg-gray-900 group-hover:border-gray-900 transition-colors duration-200">
              <svg width="11" height="13" viewBox="0 0 11 13" fill="none" className="group-hover:fill-white transition-colors duration-200">
                <path
                  d="M1.5 1.5L9.5 6.5L1.5 11.5V1.5Z"
                  fill="#374151"
                  stroke="#374151"
                  strokeWidth="0.5"
                  strokeLinejoin="round"
                  className="group-hover:fill-white group-hover:stroke-white"
                />
              </svg>
            </span>
            {heroData.secondaryCtaText}
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-start border-t border-gray-200 pt-5 lg:pt-6">
          {stats.map((s, i, arr) => (
            <div
              key={s.value}
              className={`hero-stat-drop flex flex-col gap-1 flex-1 ${i !== 0 ? "pl-4 sm:pl-7" : ""} ${
                i !== arr.length - 1 ? "pr-4 sm:pr-7 border-r border-gray-200" : ""
              }`}
              style={{ transitionDelay: `${1.0 + i * 0.12}s` }}
            >
              <span className="text-lg sm:text-2xl font-extrabold text-gray-900 leading-none">
                {s.value}
              </span>
              <span className="text-[9px] sm:text-[11px] text-gray-400 leading-tight">
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT — image panel (desktop only) ── */}
      <div className="hidden lg:block absolute top-0 right-0 w-[50%] h-full z-0 overflow-hidden">

        <div
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(ellipse 80% 90% at 70% 60%, #c2e6f5 0%, #d9f0f8 30%, #eef8fd 55%, #ffffff 80%)",
          }}
        />

        {heroData.backgroundImage && (
          <div
            ref={mainLayerRef}
            className="absolute inset-0 w-full h-full z-1"
            style={{ willChange: "transform", backfaceVisibility: "hidden" }}
          >
            <img
              src={heroData.backgroundImage || fallbackHero}
              alt=""
              aria-hidden="true"
              className={`w-full h-[120%] object-cover transition-opacity duration-1000 ${
                imageLoaded ? (heroData.personImage ? "opacity-[0.07]" : "opacity-100") : "opacity-0"
              }`}
              style={{ objectPosition: "center center" }}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = fallbackHero; setImageLoaded(true); }}
              loading="eager"
            />
          </div>
        )}

        {heroData.personImage && (
          <motion.img
            src={heroData.personImage}
            alt=""
            draggable={false}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 h-[92vh] max-h-[700px] w-auto object-contain object-bottom select-none pointer-events-none"
            initial={{ opacity: 0, scale: 1.07, y: 24 }}
            animate={personImageLoaded && entered ? { opacity: 1, scale: 1, y: 0 } : {}}
            transition={{ duration: 1.1, delay: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            onLoad={() => setPersonImageLoaded(true)}
            onError={() => setPersonImageLoaded(false)}
            loading="eager"
          />
        )}

        <motion.div
          className="absolute bottom-12 z-20 rounded-2xl p-5 w-60"
          style={{
            left: "58%",
            transform: "translateX(-50%)",
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.9)",
          }}
          initial={{ opacity: 0, scale: 0.82, y: 16 }}
          animate={entered ? { opacity: 1, scale: 1, y: [0, -9, 0] } : {}}
          transition={
            entered
              ? {
                  opacity: { duration: 0.5, delay: 0.9 },
                  scale: { type: "spring", stiffness: 80, damping: 18, delay: 0.9 },
                  y: { duration: 3.6, repeat: Infinity, repeatType: "loop", ease: "easeInOut", delay: 2.2 },
                }
              : {}
          }
        >
          <div className="absolute -top-2 right-0 w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M2 8L8 2M8 2H3.5M8 2V6.5" stroke="#374151" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-[12px] font-semibold text-gray-700 leading-[1.7]">
            {isKm
              ? "WV Support គឺជាការប្រែប្រួលយ៉ាងខ្លាំង ដែលផ្តល់ឱ្យខ្ញុំនូវឱកាសសំខាន់ ខ្ញុំមិនអាចដឹងគុណបានគ្រប់គ្រាន់ជាងនេះទេ។"
              : "WV Support is a game changer in my life that offered me an incredible opportunity to get this position. I can't be more thankful than today."}
          </p>
        </motion.div>
      </div>

      <style>{`
        .hero-word-wrap {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
        }
        .hero-word {
          display: inline-block;
          transform: translateY(110%);
          opacity: 0;
          transition: transform 0.55s cubic-bezier(0.77, 0, 0.175, 1),
                      opacity 0.15s ease;
        }
        .hero-entered .hero-word {
          transform: translateY(0);
          opacity: 1;
        }
        .hero-slide-up {
          display: flex;
          transform: translateY(24px);
          opacity: 0;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      opacity 0.6s ease;
        }
        .hero-entered .hero-slide-up {
          transform: translateY(0);
          opacity: 1;
        }
        .hero-stat-drop {
          transform: translateY(-18px);
          opacity: 0;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
                      opacity 0.4s ease;
        }
        .hero-entered .hero-stat-drop {
          transform: translateY(0);
          opacity: 1;
        }
        .cta-primary {
          background: #1a1a2e;
          color: white;
          border-radius: 9999px;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.25s ease;
          box-shadow: 0 2px 8px rgba(0,0,0,0.12);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          cursor: pointer;
          border: none;
        }
        .cta-primary:hover {
          background: #2d2d44;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(0,0,0,0.18);
        }
        .cta-ghost {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #374151;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: color 0.2s ease;
          padding: 0;
          white-space: nowrap;
        }
        .cta-ghost:hover { color: #111827; }
        .cta-ghost__ring {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: white;
          border: 1.5px solid #d1d5db;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #374151;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }
        @media (max-width: 640px) {
          .cta-primary { width: 100%; }
          .cta-ghost    { width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default HeroSection;