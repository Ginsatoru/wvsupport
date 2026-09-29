import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { getActiveServices } from "../../services/servicesApi";

import posImage from "../Images/pos1.webp";
import webstoreImage from "../Images/webstore1.webp";
import multistoreImage from "../Images/ms.webp";
import emailImage from "../Images/email.webp";
import supportImage from "../Images/tech.webp";

const services = [
  { key: "pos",        image: posImage },
  { key: "webstore",   image: webstoreImage },
  { key: "multistore", image: multistoreImage },
  { key: "hosting",    image: emailImage },
  { key: "support",    image: supportImage },
];

const supportContent = {
  en: {
    title: "Technical Support",
    description: "Reliable technical assistance and troubleshooting for all our products, with fast response times and expert guidance.",
  },
  km: {
    title: "ជំនួយបច្ចេកទេស",
    description: "ជំនួយបច្ចេកទេស និងដោះស្រាយបញ្ហាដ៏អាចទុកចិត្តបានសម្រាប់ផលិតផលទាំងអស់របស់យើង ជាមួយពេលឆ្លើយតបលឿន និងការណែនាំពីអ្នកជំនាញ។",
  },
};

const DEFAULT_SUBTITLE = {
  en: "End-to-end solutions for retail businesses, from point of sale to online store and everything in between.",
  km: "ដំណោះស្រាយគ្រប់ជ្រុងជ្រោយសម្រាប់អាជីវកម្មលក់រាយ ពីចំណុចលក់រហូតដល់ហាងអនឡាញ",
};

const DEFAULT_STATS = {
  en: ["All-in-One POS System", "Cloud-Synced Multi-Store", "Local AU/NZ Support Team"],
  km: ["ប្រព័ន្ធលក់ពេញលេញ", "ធ្វើសមកាលកម្មច្រើនហាងលើពពក", "ក្រុមគាំទ្រក្នុងតំបន់ AU/NZ"],
};


const icons = [
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>,
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>,
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="8" rx="2"/><rect x="2" y="14" width="20" height="8" rx="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>,
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
];

/* ── Word-slice (entrance animation) ── */
const SliceText = ({ text, baseDelay = 0, className = "" }) => (
  <span className={`inline flex-wrap ${className}`}>
    {text.split(" ").map((word, i) => (
      <span key={i} className="srv-word-wrap inline-block overflow-hidden align-bottom">
        <span className="srv-word inline-block" style={{ transitionDelay: `${baseDelay + i * 0.045}s` }}>
          {word}{i < text.split(" ").length - 1 ? "\u00A0" : ""}
        </span>
      </span>
    ))}
  </span>
);

/* ── Desc word-slice (activates per-row) ── */
const DescSlice = ({ text }) => (
  <>
    {text.split(" ").map((word, i) => (
      <span key={i} className="srv-desc-word-wrap inline-block overflow-hidden align-bottom">
        <span className="srv-desc-word inline-block" style={{ transitionDelay: `${i * 0.04}s` }}>
          {word}{i < text.split(" ").length - 1 ? "\u00A0" : ""}
        </span>
      </span>
    ))}
  </>
);

/* ── Mobile layout: header, stat tiles, then a swipeable card carousel ── */
const MobileServices = ({ items, icons, stats, title, subtitle }) => {
  const mobRef = useRef(null);
  const railRef = useRef(null);
  const hasAnimated = useRef(false);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          mobRef.current?.classList.add("srv-mob-entered");
        }
      },
      { threshold: 0.08 }
    );
    if (mobRef.current) observer.observe(mobRef.current);
    return () => observer.disconnect();
  }, []);

  // Scroll position that puts a card at the rail's left padding (rail is position:relative)
  const cardScrollLeft = (rail, card) => card.offsetLeft - parseFloat(getComputedStyle(rail).paddingLeft);

  // Which card is currently lined up at the left
  const handleScroll = () => {
    const rail = railRef.current;
    if (!rail) return;
    const cards = Array.from(rail.children);
    const nearest = cards.reduce(
      (best, card, i) =>
        Math.abs(cardScrollLeft(rail, card) - rail.scrollLeft) <
        Math.abs(cardScrollLeft(rail, cards[best]) - rail.scrollLeft)
          ? i
          : best,
      0
    );
    setActive(nearest);
  };

  const goTo = (i) => {
    const rail = railRef.current;
    const card = rail?.children[i];
    if (card) rail.scrollTo({ left: cardScrollLeft(rail, card), behavior: "smooth" });
  };

  return (
    <div className="block md:hidden bg-white py-12" ref={mobRef}>
      {/* Header + stats */}
      <div className="srv-container">
        <h2 className="srv-mob-fade text-[1.75rem] font-extrabold leading-tight mb-2" style={{ color: "#000000" }}>
          {title}
        </h2>
        <p className="srv-mob-fade text-sm leading-relaxed mb-6" style={{ color: "#000000", transitionDelay: "0.08s" }}>
          {subtitle}
        </p>

        <div className="grid grid-cols-3 gap-2 mb-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className="srv-mob-fade flex flex-col items-center text-center gap-2 rounded-2xl px-2 py-3"
              style={{ background: "#f1f5f9", transitionDelay: `${0.14 + i * 0.06}s` }}
            >
              {s.icon}
              <span className="text-[11px] font-semibold leading-tight" style={{ color: "#000000" }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Card carousel — swipe sideways, next card peeks in */}
      <div
        ref={railRef}
        onScroll={handleScroll}
        className="srv-mob-rail srv-mob-fade relative flex gap-3 overflow-x-auto snap-x snap-mandatory"
        style={{ transitionDelay: "0.3s" }}
      >
        {items.map((svc, i) => (
          <article
            key={i}
            className="snap-start shrink-0 w-[82%] rounded-[20px] overflow-hidden flex flex-col"
            style={{ background: "#f1f5f9" }}
          >
            <div className="h-44 overflow-hidden bg-white">
              <img
                src={svc.image}
                alt={svc.title}
                loading={i === 0 ? "eager" : "lazy"}
                draggable={false}
                className="w-full h-full object-cover select-none"
              />
            </div>
            <div className="flex-1 flex items-start gap-3 p-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: "#000000", color: "#ffffff" }}
              >
                {icons[i % icons.length]}
              </div>
              <div className="min-w-0">
                <h3 className="text-[15px] font-bold leading-snug mb-1" style={{ color: "#000000" }}>
                  {svc.title}
                </h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "#000000" }}>
                  {svc.description}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Dots */}
      <div className="srv-mob-fade flex justify-center gap-1.5 mt-5" style={{ transitionDelay: "0.4s" }}>
        {items.map((svc, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Show ${svc.title}`}
            className={`h-2 rounded-full transition-all duration-300 ${active === i ? "w-6 bg-black" : "w-2 bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  );
};

const Services = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "km" ? "km" : "en";

  // Content from the admin (Content › Home › Services); empty fields keep the built-in wording/images
  const [saved, setSaved] = useState(null);
  useEffect(() => {
    getActiveServices(lang)
      .then((res) => setSaved(res.data))
      .catch(() => setSaved(null));
  }, [lang]);

  const content = useMemo(() => {
    // Built-in cards, by key
    const defaults = Object.fromEntries(
      services.map((svc) => [
        svc.key,
        {
          title: svc.key === "support" ? supportContent[lang].title : t(`services.${svc.key}.title`),
          description: svc.key === "support" ? supportContent[lang].description : t(`services.${svc.key}.description`),
          image: svc.image,
        },
      ])
    );
    // Saved list (cards added/removed in the admin) or the built-in 5; empty fields fall back by key
    const list = saved?.items?.length ? saved.items : services.map((svc) => ({ key: svc.key }));
    return {
      title: saved?.title || t("services.header.title"),
      subtitle: saved?.subtitle || DEFAULT_SUBTITLE[lang],
      stats: DEFAULT_STATS[lang].map((label, i) => saved?.stats?.[i] || label),
      items: list.map((item) => {
        const d = defaults[item.key] || {};
        return {
          title: item.title || d.title || "",
          description: item.description || d.description || "",
          image: item.image || d.image || "",
        };
      }),
    };
  }, [saved, lang, t]);
  const items = content.items;
  const itemCountRef = useRef(items.length);
  itemCountRef.current = items.length;
  const sectionRef   = useRef(null);
  const activeIdxRef = useRef(0);
  const hasAnimated  = useRef(false);

  const statIcons = [
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 flex-shrink-0" style={{ color: "#000000" }}>
          <rect x="3" y="4" width="18" height="12" rx="2" />
          <path d="M8 20h8M12 16v4" />
          <path d="M7 8h2M7 11h5" />
        </svg>
      ),
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 flex-shrink-0" style={{ color: "#000000" }}>
          <path d="M7 18a4 4 0 01-.5-7.97A5.5 5.5 0 0117.5 9a4.5 4.5 0 01-.7 8.93" />
          <path d="M12 12v6m0 0l-2-2m2 2l2-2" />
        </svg>
      ),
    },
    {
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 flex-shrink-0" style={{ color: "#000000" }}>
          <path d="M4 13a8 8 0 0116 0" />
          <path d="M3 13v3a2 2 0 002 2h1v-6H5a2 2 0 00-2 2z" />
          <path d="M21 13v3a2 2 0 01-2 2h-1v-6h1a2 2 0 012 2z" />
          <path d="M15 19a3 3 0 01-3 2" />
        </svg>
      ),
    },
  ];
  const stats = statIcons.map((s, i) => ({ icon: s.icon, label: content.stats[i] }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          sectionRef.current?.classList.add("srv-entered");
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(sectionRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const activate = (idx) => {
    const panels = sectionRef.current.querySelectorAll(".srv-panel");
    const imgs   = sectionRef.current.querySelectorAll(".srv-img");
    const rows   = sectionRef.current.querySelectorAll(".srv-row");
    if (idx === activeIdxRef.current) return;
    panels[activeIdxRef.current]?.classList.remove("is-active");
    imgs[activeIdxRef.current]?.classList.remove("is-active");
    rows[activeIdxRef.current]?.classList.remove("is-active");
    activeIdxRef.current = idx;
    panels[idx]?.classList.add("is-active");
    imgs[idx]?.classList.add("is-active");
    rows[idx]?.classList.add("is-active");
  };

  useEffect(() => {
    const onScroll = () => {
      const totalSteps = itemCountRef.current;
      const el = sectionRef.current;
      if (!el) return;
      const rect     = el.getBoundingClientRect();
      const scrolled = -rect.top;
      const total    = rect.height - window.innerHeight;
      const progress = Math.max(0, Math.min(1, scrolled / total));
      const idx      = Math.min(Math.floor(progress * totalSteps), totalSteps - 1);
      if (idx > activeIdxRef.current) activate(activeIdxRef.current + 1);
      else if (idx < activeIdxRef.current) activate(activeIdxRef.current - 1);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <>
      <style>{`
        /* ── Container — same breakpoints as .fs-container (Work) / navbar ── */
        .srv-container {
          width: 100%;
          padding: 0 16px;
          margin: 0 auto;
        }
        @media (min-width: 640px)  { .srv-container { padding: 0 24px; } }
        @media (min-width: 1024px) { .srv-container { width: 88%; padding: 0; } }
        @media (min-width: 1280px) { .srv-container { width: 83%; } }
        @media (min-width: 1536px) { .srv-container { max-width: 1400px; } }
        @media (min-width: 1700px) { .srv-container { max-width: 1500px; } }

        /* ── Word-slice entrance ── */
        .srv-word {
          transform: translateY(110%);
          opacity: 0;
          transition: transform 0.55s cubic-bezier(0.77, 0, 0.175, 1),
                      opacity 0.15s ease;
        }
        .srv-entered .srv-word {
          transform: translateY(0);
          opacity: 1;
        }

        /* ── Subtitle fade-up ── */
        .srv-subtitle {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94);
          transition-delay: 0.38s;
        }
        .srv-entered .srv-subtitle {
          opacity: 1;
          transform: translateY(0);
        }

        /* ── Stat drop-in ── */
        .srv-stat {
          opacity: 0;
          transform: translateY(-16px);
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
                      opacity 0.4s ease;
        }
        .srv-entered .srv-stat { opacity: 1; transform: translateY(0); }

        /* ── Row stagger drop-in ── */
        .srv-row {
          opacity: 0;
          transform: translateY(-14px);
          transition: opacity 0.45s cubic-bezier(0.34,1.56,0.64,1),
                      transform 0.45s cubic-bezier(0.34,1.56,0.64,1),
                      background 0.6s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .srv-entered .srv-row { opacity:1; transform:translateY(0); }

        /* ── Right panel fade-in ── */
        .srv-right {
          opacity: 0;
          transition: opacity 0.9s cubic-bezier(0.25,0.46,0.45,0.94) 0.2s;
        }
        .srv-entered .srv-right { opacity: 1; }

        /* ── Row active states ── */
        .srv-row.is-active .srv-row-title { color: #000000; }
        .srv-row:hover .srv-row-title { color: #000000; }
        .srv-row.is-active .srv-row-desc  { max-height: 80px; }
        .srv-row.is-active .srv-desc-word {
          transform: translate3d(0,0%,0);
          opacity: 1;
          transition: transform 0.5s cubic-bezier(0.77,0,0.175,1), opacity 0.1s ease;
        }

        /* ── Desc word-slice ── */
        .srv-desc-word {
          transform: translate3d(0,140%,0);
          opacity: 0;
          transition: transform 0.4s ease, opacity 0.4s ease;
        }
        .srv-row-desc {
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.6s cubic-bezier(0.25,0.46,0.45,0.94);
        }

        /* ── Image transitions (succession / rolling-carousel style) ── */
        .srv-img {
          position: absolute;
          inset: 0;
          opacity: 0;
          transform: scale(1.06);
          transition: opacity 0.8s ease, transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .srv-img.is-active { opacity: 1; transform: scale(1); }

        /* ── Mobile card rail: same side padding as the container, no scrollbar ── */
        .srv-mob-rail {
          padding: 0 16px;
          scroll-padding: 0 16px;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .srv-mob-rail::-webkit-scrollbar { display: none; }
        @media (min-width: 640px) {
          .srv-mob-rail { padding: 0 24px; scroll-padding: 0 24px; }
        }

        /* ── Mobile entrance ── */
        .srv-mob-fade {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .srv-mob-entered .srv-mob-fade {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      {/* ── DESKTOP ── */}
      <div
        className="relative hidden md:block bg-white"
        style={{ height: `${items.length * 60}vh` }}
        ref={sectionRef}
      >
        <div className="sticky top-0 h-screen overflow-hidden">
        {/* Both columns sit inside the global container, so edges match the other sections */}
        <div className="srv-container h-full grid grid-cols-2 gap-x-10">

          {/* LEFT */}
          <div className="relative flex flex-col justify-center items-start bg-white gap-0">

            {/* Header */}
            <div className="w-full mb-2">
              <h2 className="text-[clamp(1.8rem,3vw,2.6rem)] font-extrabold leading-tight m-0 flex flex-wrap" style={{ color: "#000000" }}>
                <SliceText key={content.title} text={content.title} baseDelay={0.1} />
              </h2>
            </div>

            {/* Subtitle */}
            <p className="srv-subtitle text-[0.82rem] leading-relaxed max-w-[480px] mb-5" style={{ color: "#000000" }}>
              {content.subtitle}
            </p>

            {/* Stats */}
            <div className="flex items-stretch w-full pt-3 mb-3">
              {stats.map((s, i) => (
                <div
                  key={i}
                  className={`srv-stat flex items-center gap-2 flex-1 pr-4 ${i > 0 ? "pl-4 border-l border-slate-100" : ""}`}
                  style={{ transitionDelay: `${0.5 + i * 0.1}s` }}
                >
                  {s.icon}
                  <span className="text-[13px] font-medium leading-tight" style={{ color: "#000000" }}>{s.label}</span>
                </div>
              ))}
            </div>

            {/* Hidden panels */}
            {items.map((svc, i) => (
              <div key={i} className={`srv-panel hidden${i === 0 ? " is-active" : ""}`} />
            ))}

            {/* Service list */}
            <div className="w-full flex flex-col">
              {items.map((svc, i) => {
                const { title, description: desc } = svc;
                return (
                  <div
                    key={i}
                    onClick={() => activate(i)}
                    style={{ transitionDelay: `${0.55 + i * 0.12}s, ${0.55 + i * 0.12}s, 0s` }}
                    className={`srv-row flex items-start gap-4 py-4 px-2 -mx-2 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors duration-300 ${i === 0 ? "is-active" : ""}`}
                  >
                    <div className="srv-row-icon w-[38px] h-[38px] rounded-[10px] flex items-center justify-center shrink-0" style={{ backgroundColor: "#000000", color: "#ffffff" }}>
                      {icons[i % icons.length]}
                    </div>
                    <div className="flex-1">
                      <div className="srv-row-title text-[0.92rem] font-bold text-slate-400 mb-0.5 transition-colors duration-[0.6s]">
                        {title}
                      </div>
                      <div className="srv-row-desc text-[0.78rem] leading-relaxed flex flex-wrap">
                        <DescSlice text={desc} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT */}
          <div className="srv-right relative overflow-hidden bg-white py-[6vh] flex items-center justify-center">
            <div className="relative w-full h-[70%] rounded-[1.5rem] overflow-hidden">
              {items.map((svc, i) => (
                <div key={i} className={`srv-img${i === 0 ? " is-active" : ""}`}>
                  <img src={svc.image} alt={svc.title} loading={i === 0 ? "eager" : "lazy"} draggable={false} className="w-full h-full object-cover select-none" />
                </div>
              ))}
            </div>
          </div>

        </div>
        </div>
      </div>

      {/* ── MOBILE ── */}
      <MobileServices items={items} icons={icons} stats={stats} title={content.title} subtitle={content.subtitle} />
    </>
  );
};

export default Services;