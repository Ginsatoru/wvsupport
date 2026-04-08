import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

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

/* ── Mobile bento layout ── */
const MobileServices = ({ services, icons, stats, subtitle, t }) => {
  const mobRef = useRef(null);
  const hasAnimated = useRef(false);

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

  const [s0, s1, s2, s3, s4] = services;

  return (
    <div className="block md:hidden" ref={mobRef}>
      <div className="bg-[#f5f8ff] px-4 py-10">

        {/* Header */}
        <div className="mb-6 px-1 srv-mob-fade" style={{ transitionDelay: "0s" }}>
          <h2 className="text-[1.75rem] font-extrabold text-slate-900 leading-tight mb-2">
            {t("services.header.title")}
          </h2>
          <p className="text-[0.8rem] text-slate-400 leading-relaxed">{subtitle}</p>
        </div>

        {/* Stats */}
        <div className="flex border-t border-slate-200 pt-3 mb-6 srv-mob-fade" style={{ transitionDelay: "0.1s" }}>
          {stats.map((s, i) => (
            <div key={s.value} className={`flex-1 flex flex-col gap-0.5 ${i > 0 ? "pl-4 border-l border-slate-200" : ""}`}>
              <span className="text-[1.15rem] font-extrabold text-slate-900 leading-none">{s.value}</span>
              <span className="text-[9px] text-slate-400 uppercase tracking-widest">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Bento cards */}
        <div className="flex flex-col gap-3">

          {/* Card 0 — large image */}
          <div className="relative rounded-[1.25rem] overflow-hidden h-60 srv-mob-fade" style={{ transitionDelay: "0.18s" }}>
            <img src={s0.image} alt={t(`services.${s0.key}.title`)} loading="eager" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/15 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-[9px] bg-white/15 border border-white/25 text-white mb-2">
                {icons[0]}
              </div>
              <div className="text-base font-bold text-white leading-snug mb-1">{t(`services.${s0.key}.title`)}</div>
              <div className="text-[0.75rem] text-white/65 leading-relaxed">{t(`services.${s0.key}.description`)}</div>
            </div>
          </div>

          {/* Card 1 — horizontal light */}
          <div className="rounded-[1.25rem] overflow-hidden bg-white border border-slate-200 flex h-[110px] srv-mob-fade" style={{ transitionDelay: "0.28s" }}>
            <div className="w-[110px] shrink-0 overflow-hidden">
              <img src={s1.image} alt={t(`services.${s1.key}.title`)} loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 px-4 py-3 flex flex-col justify-center">
              <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-sky-100 text-sky-600 mb-1.5 shrink-0">
                {icons[1]}
              </div>
              <div className="text-[0.82rem] font-bold text-slate-900 leading-snug mb-0.5">{t(`services.${s1.key}.title`)}</div>
              <div className="text-[0.7rem] text-slate-400 leading-relaxed line-clamp-2">{t(`services.${s1.key}.description`)}</div>
            </div>
          </div>

          {/* Cards 2 & 3 — mini row */}
          <div className="grid grid-cols-2 gap-3 srv-mob-fade" style={{ transitionDelay: "0.38s" }}>
            {[s2, s3].map((svc, i) => (
              <div key={svc.key} className="rounded-[1.25rem] overflow-hidden bg-white border border-slate-200 flex flex-col">
                <div className="h-[100px] overflow-hidden">
                  <img src={svc.image} alt={t(`services.${svc.key}.title`)} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div className="p-3 flex flex-col gap-1">
                  <div className="inline-flex items-center justify-center w-[26px] h-[26px] rounded-[7px] bg-slate-100 text-slate-500">
                    {icons[i + 2]}
                  </div>
                  <div className="text-[0.75rem] font-bold text-slate-900 leading-snug">{t(`services.${svc.key}.title`)}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Card 4 — horizontal dark */}
          <div
            className="rounded-[1.25rem] overflow-hidden border-transparent flex flex-row-reverse h-[110px] srv-mob-fade"
            style={{ transitionDelay: "0.48s", background: "#1a1a2e" }}
          >
            <div className="w-[110px] shrink-0 overflow-hidden">
              <img src={s4.image} alt={t(`services.${s4.key}.title`)} loading="lazy" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 px-4 py-3 flex flex-col justify-center">
              <div className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-white/10 text-white mb-1.5 shrink-0">
                {icons[4]}
              </div>
              <div className="text-[0.82rem] font-bold text-white leading-snug mb-0.5">{t(`services.${s4.key}.title`)}</div>
              <div className="text-[0.7rem] text-white/50 leading-relaxed line-clamp-2">{t(`services.${s4.key}.description`)}</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const Services = () => {
  const { t, i18n } = useTranslation();
  const isKm = i18n.language === "km";
  const sectionRef   = useRef(null);
  const activeIdxRef = useRef(0);
  const hasAnimated  = useRef(false);

  const subtitle = isKm
    ? "ដំណោះស្រាយគ្រប់ជ្រុងជ្រោយសម្រាប់អាជីវកម្មលក់រាយ ពីចំណុចលក់រហូតដល់ហាងអនឡាញ"
    : "End-to-end solutions for retail businesses, from point of sale to online store and everything in between.";

  const stats = [
    { value: "60K+", label: isKm ? "ហាងដែលប្រើ" : "Stores using" },
    { value: "5",    label: isKm ? "ផលិតផល" : "Products" },
    { value: "99%",  label: isKm ? "ការពេញចិត្ត" : "Satisfaction" },
  ];

  useEffect(() => {
    const panels     = sectionRef.current.querySelectorAll(".srv-panel");
    const imgs       = sectionRef.current.querySelectorAll(".srv-img");
    const rows       = sectionRef.current.querySelectorAll(".srv-row");
    const totalSteps = services.length;

    const activate = (idx) => {
      if (idx === activeIdxRef.current) return;
      panels[activeIdxRef.current]?.classList.remove("is-active");
      imgs[activeIdxRef.current]?.classList.remove("is-active");
      rows[activeIdxRef.current]?.classList.remove("is-active");
      activeIdxRef.current = idx;
      panels[idx]?.classList.add("is-active");
      imgs[idx]?.classList.add("is-active");
      rows[idx]?.classList.add("is-active");
    };

    const onScroll = () => {
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
      window.removeEventListener("scroll", onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <style>{`
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
        .srv-entered .srv-row:nth-child(1) { opacity:1; transform:translateY(0); transition-delay:0.55s,0.55s,0s; }
        .srv-entered .srv-row:nth-child(2) { opacity:1; transform:translateY(0); transition-delay:0.67s,0.67s,0s; }
        .srv-entered .srv-row:nth-child(3) { opacity:1; transform:translateY(0); transition-delay:0.79s,0.79s,0s; }
        .srv-entered .srv-row:nth-child(4) { opacity:1; transform:translateY(0); transition-delay:0.91s,0.91s,0s; }
        .srv-entered .srv-row:nth-child(5) { opacity:1; transform:translateY(0); transition-delay:1.03s,1.03s,0s; }

        /* ── Right panel fade-in ── */
        .srv-right {
          opacity: 0;
          transition: opacity 0.9s cubic-bezier(0.25,0.46,0.45,0.94) 0.2s;
        }
        .srv-entered .srv-right { opacity: 1; }

        /* ── Row active states ── */
        .srv-row.is-active .srv-row-icon {
          background: #e0f2fe;
          color: #0f8abe;
        }
        .srv-row.is-active .srv-row-title { color: #0f172a; }
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

        /* ── Image transitions ── */
        .srv-img {
          position: absolute;
          inset: 0;
          opacity: 0;
          transform: translateY(100%);
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .srv-img.is-active { opacity: 1; transform: translateY(0); }
        .srv-badge {
          opacity: 0;
          transform: translateY(10px);
          transition: opacity 0.5s 0.2s, transform 0.5s 0.2s;
        }
        .srv-img.is-active .srv-badge { opacity: 1; transform: translateY(0); }

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
        style={{ height: `${services.length * 60}vh` }}
        ref={sectionRef}
      >
        <div className="sticky top-0 h-screen grid grid-cols-2 overflow-hidden">

          {/* LEFT */}
          <div className="relative flex flex-col justify-center items-start bg-white gap-0 px-[5%] pl-[11vw]">

            {/* Header */}
            <div className="w-full mb-2">
              <h2 className="text-[clamp(1.8rem,3vw,2.6rem)] font-extrabold text-slate-900 leading-tight m-0 flex flex-wrap">
                <SliceText text={t("services.header.title")} baseDelay={0.1} />
              </h2>
            </div>

            {/* Subtitle */}
            <p className="srv-subtitle text-[0.82rem] leading-relaxed text-slate-400 max-w-[480px] mb-5">
              {subtitle}
            </p>

            {/* Stats */}
            <div className="flex items-stretch w-full border-t border-slate-100 pt-3 mb-3">
              {stats.map((s, i) => (
                <div
                  key={s.value}
                  className={`srv-stat flex flex-col gap-0.5 flex-1 pr-4 ${i > 0 ? "pl-4 border-l border-slate-100" : ""}`}
                  style={{ transitionDelay: `${0.5 + i * 0.1}s` }}
                >
                  <span className="text-[1.3rem] font-extrabold text-slate-900 leading-none">{s.value}</span>
                  <span className="text-[10px] text-slate-400 uppercase tracking-[0.08em]">{s.label}</span>
                </div>
              ))}
            </div>

            {/* Hidden panels */}
            {services.map((svc, i) => (
              <div key={svc.key} className={`srv-panel hidden${i === 0 ? " is-active" : ""}`} />
            ))}

            {/* Service list */}
            <div className="w-full flex flex-col">
              {services.map((svc, i) => {
                const desc = t(`services.${svc.key}.description`);
                return (
                  <div
                    key={svc.key}
                    className={`srv-row flex items-start gap-4 py-4 border-b border-slate-100 cursor-default ${i === 0 ? "border-t is-active" : ""}`}
                  >
                    <div className="srv-row-icon w-[38px] h-[38px] rounded-[10px] bg-slate-100 flex items-center justify-center text-slate-400 shrink-0 transition-[background,color] duration-[0.6s] ease-[cubic-bezier(0.25,0.46,0.45,0.94)]">
                      {icons[i]}
                    </div>
                    <div className="flex-1">
                      <div className="srv-row-title text-[0.92rem] font-bold text-slate-400 mb-0.5 transition-colors duration-[0.6s]">
                        {t(`services.${svc.key}.title`)}
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
          <div className="srv-right relative overflow-hidden bg-white py-[6vh] pr-[11vw] pl-[1.5vw] flex items-center justify-center">
            <div className="relative w-full h-[70%] rounded-[1.5rem] overflow-hidden">
              {services.map((svc, i) => (
                <div key={svc.key} className={`srv-img${i === 0 ? " is-active" : ""}`}>
                  <img src={svc.image} alt={t(`services.${svc.key}.title`)} loading={i === 0 ? "eager" : "lazy"} className="w-full h-full object-cover" />
                  <div className="srv-badge absolute bottom-6 right-6 z-10 bg-black/20 backdrop-blur-xl border border-white/15 rounded-2xl px-[1.1rem] py-[0.9rem] text-[0.85rem] font-semibold text-white flex items-center gap-2 pointer-events-none">
                    {t(`services.${svc.key}.title`)}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── MOBILE ── */}
      <MobileServices services={services} icons={icons} stats={stats} subtitle={subtitle} t={t} />
    </>
  );
};

export default Services;