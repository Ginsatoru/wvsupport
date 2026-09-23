import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Award, Globe2, MapPin, ShieldCheck, Heart, Headphones } from "lucide-react";
import Newsletter from "../Components/home/Newsletter";
import aboutImg from "../Components/Images/about.webp";

/* ── Word-slice text, same mechanic as Hero / Tech / Work ── */
const SliceText = ({ text, inView, baseDelay = 0 }) => (
  <>
    {text.split(" ").map((word, i) => (
      <span key={i} className="ab-word-wrap">
        <span
          className="ab-word"
          style={{ transitionDelay: `${baseDelay + i * 0.055}s` }}
        >
          {word}
          {i < text.split(" ").length - 1 ? "\u00A0" : ""}
        </span>
      </span>
    ))}
  </>
);

const AboutUs = () => {
  const { i18n } = useTranslation();
  const isKm = i18n.language === "km";
  const sectionRef = useRef(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const eyebrow = isKm ? "អំពីយើង" : "About Us";
  const headline1 = isKm ? "ក្រុមគាំទ្រនៅជិតអតិថិជន" : "Support that stays close";
  const headline2 = isKm ? "ជានិច្ចកាល" : "to the people we help.";
  const body = isKm
    ? "WV Support គឺជាក្រុមការងារនៅសៀមរាប ដែលផ្តល់ការគាំទ្របច្ចេកទេសពីចម្ងាយសម្រាប់ RetailManager ជូនអតិថិជនអូស្ត្រាលី និងតំបន់អាស៊ី-ប៉ាស៊ីហ្វិក។"
    : "WV Support is a Siem Reap-based team delivering remote technical support for RetailManager, helping retailers across Australia, New Zealand, and the Asia-Pacific region every day.";

  const quickFacts = [
    {
      icon: <Award size={22} strokeWidth={1.6} />,
      label: isKm ? "ទុកចិត្តជាង 25 ឆ្នាំ" : "25+ Years Trusted",
    },
    {
      icon: <Globe2 size={22} strokeWidth={1.6} />,
      label: isKm ? "អាស៊ី-ប៉ាស៊ីហ្វិក" : "AU, NZ & Asia-Pacific",
    },
    {
      icon: <MapPin size={22} strokeWidth={1.6} />,
      label: isKm ? "ក្រុមការងារនៅសៀមរាប" : "Siem Reap-Based Team",
    },
  ];

  const values = [
    {
      icon: <ShieldCheck size={20} strokeWidth={1.8} />,
      title: isKm ? "ភាពជឿទុកចិត្តបាន" : "Reliability",
      desc: isKm
        ? "ការគាំទ្រដែលអាចទុកចិត្តបាន និងស្មើគ្នារាល់ថ្ងៃ។"
        : "Consistent, dependable support your team can count on every day.",
    },
    {
      icon: <Heart size={20} strokeWidth={1.8} />,
      title: isKm ? "អតិថិជនជាចម្បង" : "Customer-First",
      desc: isKm
        ? "យើងស្តាប់មុន ហើយដោះស្រាយតាមរបៀបដែលសមស្របបំផុតសម្រាប់អ្នក។"
        : "We listen first and solve problems the way that works best for you.",
    },
    {
      icon: <Headphones size={20} strokeWidth={1.8} />,
      title: isKm ? "ត្រៀមខ្លួនជានិច្ច" : "Always Ready",
      desc: isKm
        ? "ការគាំទ្រពីចម្ងាយតាម TeamViewer និងទូរស័ព្ទ ពេលណាដែលអ្នកត្រូវការ។"
        : "Remote support via TeamViewer and phone, whenever you need it.",
    },
  ];

  return (
    <>
      <style>{`
        .ab-word-wrap {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
        }
        .ab-word {
          display: inline-block;
          transform: translateY(110%);
          opacity: 0;
          transition: transform 0.55s cubic-bezier(0.77, 0, 0.175, 1),
                      opacity 0.15s ease;
        }
        .ab-entered .ab-word {
          transform: translateY(0);
          opacity: 1;
        }
        .ab-slide-up {
          transform: translateY(22px);
          opacity: 0;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      opacity 0.6s ease;
        }
        .ab-entered .ab-slide-up {
          transform: translateY(0);
          opacity: 1;
        }
        .ab-drop {
          transform: translateY(-16px);
          opacity: 0;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
                      opacity 0.4s ease;
        }
        .ab-entered .ab-drop {
          transform: translateY(0);
          opacity: 1;
        }
        .ab-card-pop {
          transform: translateY(20px);
          opacity: 0;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
                      opacity 0.4s ease;
        }
        .ab-entered .ab-card-pop {
          transform: translateY(0);
          opacity: 1;
        }
        .ab-container {
          width: 100%;
          padding: 0 16px;
          margin: 0 auto;
        }
        @media (min-width: 640px)  { .ab-container { padding: 0 24px; } }
        @media (min-width: 1024px) { .ab-container { width: 88%; padding: 0; } }
        @media (min-width: 1280px) { .ab-container { width: 83%; } }
        @media (min-width: 1536px) { .ab-container { max-width: 1400px; } }
        @media (min-width: 1700px) { .ab-container { max-width: 1500px; } }
      `}</style>

      <div
        ref={sectionRef}
        className={`bg-white${entered ? " ab-entered" : ""}`}
      >
        {/* ── Intro ── */}
        <section className="pt-12 pb-10 md:pt-16 md:pb-12">
          <div className="ab-container">
            <div className="flex flex-col-reverse lg:flex-row items-start gap-10 lg:gap-16">
              <div className="flex-1 max-w-3xl">
                <div className="overflow-hidden mb-4">
                  <span
                    className="ab-slide-up inline-block text-[11px] font-bold uppercase tracking-[0.13em]"
                    style={{ color: "#0f8abe", transitionDelay: "0.05s" }}
                  >
                    {eyebrow}
                  </span>
                </div>

                <h1
                  className="font-extrabold leading-[1.15] mb-6"
                  style={{ fontSize: "clamp(28px, 4vw, 48px)", color: "#000000" }}
                >
                  <div className="overflow-hidden">
                    <SliceText text={headline1} inView={entered} baseDelay={0.1} />
                  </div>
                  <div className="overflow-hidden mt-1">
                    <SliceText text={headline2} inView={entered} baseDelay={0.25} />
                  </div>
                </h1>

                <p
                  className="ab-slide-up text-[15px] md:text-base leading-[1.8] max-w-xl mb-10"
                  style={{ color: "#000000", transitionDelay: "0.5s" }}
                >
                  {body}
                </p>

                {/* Quick facts row */}
                <div className="flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-gray-100 pt-8">
                  {quickFacts.map((f, i) => (
                    <div
                      key={i}
                      className="ab-drop flex items-center gap-2.5"
                      style={{ transitionDelay: `${0.65 + i * 0.1}s`, color: "#000000" }}
                    >
                      {f.icon}
                      <span className="text-sm font-medium">{f.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="ab-slide-up flex-1 w-full max-w-sm lg:max-w-none mx-auto lg:mx-0" style={{ transitionDelay: "0.3s" }}>
                <div className="rounded-2xl overflow-hidden">
                  <img
                    src={aboutImg}
                    alt=""
                    draggable={false}
                    className="w-full h-auto max-h-[360px] object-contain select-none mx-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Values ── */}
        <section className="py-10 md:py-14">
          <div className="ab-container">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-10 text-center">
              {values.map((v, i) => (
                <div
                  key={i}
                  className="ab-card-pop flex flex-col items-center"
                  style={{ transitionDelay: `${0.1 + i * 0.1}s` }}
                >
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mb-5 bg-white"
                    style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.10)", color: "#000000" }}
                  >
                    {v.icon}
                  </div>
                  <h3 className="text-base font-bold mb-2" style={{ color: "#000000" }}>
                    {v.title}
                  </h3>
                  <p className="text-sm leading-relaxed max-w-[240px]" style={{ color: "#000000" }}>{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Newsletter />
    </>
  );
};

export default AboutUs;