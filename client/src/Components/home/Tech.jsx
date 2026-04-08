import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  ArrowRight,
  Play,
  Smartphone,
  Monitor,
  Tablet,
  CheckCircle,
} from "lucide-react";
import retailGuy from "../Images/retail-guy.webp";

/* ── Word-slice text, same mechanic as Services ── */
const SliceText = ({ text, inView, baseDelay = 0 }) => (
  <>
    {text.split(" ").map((word, i) => (
      <span key={i} className="tech-word-wrap">
        <span
          className="tech-word"
          style={{ transitionDelay: `${baseDelay + i * 0.055}s` }}
        >
          {word}
          {i < text.split(" ").length - 1 ? "\u00A0" : ""}
        </span>
      </span>
    ))}
  </>
);

const Tech = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.15 });
  const isKm = i18n.language === "km";

  const devices = [
    {
      icon: <Smartphone size={13} />,
      label: isKm ? "iOS កម្មវិធី" : "iOS App",
    },
    {
      icon: <Smartphone size={13} />,
      label: isKm ? "Android កម្មវិធី" : "Android App",
    },
    { icon: <Monitor size={13} />, label: isKm ? "កុំព្យូទ័រ" : "Desktop" },
    { icon: <Tablet size={13} />, label: isKm ? "ថេប្លេត" : "Tablet" },
  ];

  const avatars = [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=64&h=64&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
  ];

  const eyebrow = isKm
    ? "បច្ចេកវិទ្យាលក់រាយជំនាន់ក្រោយ"
    : "Next-Gen Retail Technology";
  const headLine1 = isKm
    ? "អ្នកលក់រាយជាង 60,000+ នាក់"
    : "Over 60,000+ Retailers";
  const headLine2 = isKm ? "គ្រប់គ្រងឆ្លាតជាងមុន" : "Managing Smarter";
  const body = isKm
    ? "RetailManager កំពុងមកដល់ទូរស័ព្ទ និងថេប្លេត ធ្វើសមកាលកម្មពេញលេញជាមួយកុំព្យូទ័ររបស់អ្នកក្នុងពេលវេលាជាក់ស្តែង។ គ្រប់គ្រងស្ទុក លក់ និងបុគ្គលិកពីគ្រប់ទីកន្លែង។"
    : "RetailManager is coming to mobile and tablet, fully synced with your desktop in real time. Manage inventory, sales, and staff from anywhere, on any device, without missing a beat.";

  return (
    <section
      className="flex justify-center items-center min-h-[70vh] py-20 px-6"
      style={{
        background: "#ffffff",
      }}
    >
      <div
        ref={ref}
        className={`flex flex-col-reverse md:flex-row items-center gap-16 w-full max-w-[1400px] mx-auto${inView ? " tech-entered" : ""}`}
      >
        {/* ── LEFT: Image ── */}
        <motion.div
          className="relative flex-1 min-h-[520px] w-full"
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Blob bg */}
          <div
            className="absolute inset-0 z-0"
            style={{
              background:
                "radial-gradient(ellipse 55% 60% at 50% 55%, #c2e6f5 0%, #d9f0f8 30%, #eef8fd 55%, rgba(255,255,255,0) 80%)",
            }}
          />

          {/* Dot grid */}
          <div
            className="absolute top-4 right-[-10px] grid gap-[7px] z-10"
            style={{ gridTemplateColumns: "repeat(5, 1fr)" }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <span
                key={i}
                className="block w-[5px] h-[5px] rounded-full opacity-40"
                style={{ background: "#1a1a2e" }}
              />
            ))}
          </div>

          {/* Person image — bigger with bottom fade */}
          <img
            src={retailGuy}
            alt="RetailManager user"
            className="absolute bottom-0 left-1/2 z-20 w-auto object-contain object-bottom select-none pointer-events-none"
            style={{
              height: "97%",
              maxHeight: 510,
              transform: "translateX(-46%)",
              filter: "drop-shadow(0 8px 24px rgba(26,26,46,0.10))",
              maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
              WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
            }}
            draggable={false}
          />

          {/* Top-left card */}
          <motion.div
            className="absolute top-7 left-[-10px] z-30 flex items-center gap-3 px-4 py-[10px] rounded-2xl"
            style={{
              background: "rgba(255,255,255,0.82)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.95)",
            }}
            initial={{ opacity: 0, x: 100, y: 120, scale: 0.6 }}
            animate={
              inView ? { opacity: 1, x: 0, y: [0, -9, 0], scale: 1 } : {}
            }
            transition={
              inView
                ? {
                    opacity: { duration: 0.5, delay: 0.5 },
                    scale: {
                      type: "spring",
                      stiffness: 80,
                      damping: 18,
                      delay: 0.5,
                    },
                    x: {
                      type: "spring",
                      stiffness: 80,
                      damping: 18,
                      delay: 0.5,
                    },
                    y: {
                      duration: 3.2,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                      delay: 2.0,
                    },
                  }
                : {}
            }
          >
            <div
              className="w-8 h-8 flex items-center justify-center flex-shrink-0"
              style={{ background: "#1a1a2e", borderRadius: "10px" }}
            >
              <CheckCircle size={14} className="text-white" />
            </div>
            <div>
              <p className="text-[12px] font-bold text-[#1a1a2e] leading-none">
                {isKm ? "សមកាលកម្មពហុឧបករណ៍" : "Multi-Device Sync"}
              </p>
              <p className="text-[10px] text-[#8a9bb0] mt-[3px]">
                {isKm
                  ? "ពេលវេលាជាក់ស្តែងគ្រប់ Platform"
                  : "Real-time across all platforms"}
              </p>
            </div>
          </motion.div>

          {/* Bottom card */}
          <motion.div
            className="absolute bottom-5 left-1/2 z-30 rounded-2xl px-5 py-4 text-center"
            style={{
              transform: "translateX(-50%)",
              minWidth: "190px",
              background: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,0.95)",
            }}
            initial={{ opacity: 0, x: -60, y: -120, scale: 0.6 }}
            animate={
              inView ? { opacity: 1, x: 0, y: [0, -11, 0], scale: 1 } : {}
            }
            transition={
              inView
                ? {
                    opacity: { duration: 0.5, delay: 0.75 },
                    scale: {
                      type: "spring",
                      stiffness: 70,
                      damping: 18,
                      delay: 0.75,
                    },
                    x: {
                      type: "spring",
                      stiffness: 70,
                      damping: 18,
                      delay: 0.75,
                    },
                    y: {
                      duration: 3.8,
                      repeat: Infinity,
                      repeatType: "loop",
                      ease: "easeInOut",
                      delay: 2.4,
                    },
                  }
                : {}
            }
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"
              style={{ background: "#1a1a2e" }}
            >
              <Smartphone size={17} className="text-white" />
            </div>
            <p className="text-[13px] font-bold text-[#1a1a2e]">
              {isKm ? "RetailManager មូបាល់" : "RetailManager Mobile"}
            </p>
            <p className="text-[10px] text-[#8a9bb0] mt-[5px] leading-[1.6]">
              {isKm
                ? "មានជា iOS & Android\nធ្វើសមកាលកម្មភ្លាមៗ"
                : "Available on iOS & Android\nSyncs instantly with desktop"}
            </p>
          </motion.div>
        </motion.div>

        {/* ── RIGHT: Content ── */}
        <div className="flex-[1.2] w-full">
          {/* Eyebrow */}
          <div className="overflow-hidden mb-4">
            <span
              className="inline-block text-[11px] font-bold uppercase tracking-[0.12em] text-gray-400 tech-slide-up"
              style={{ transitionDelay: "0.1s" }}
            >
              {eyebrow}
            </span>
          </div>

          {/* Heading line 1 */}
          <h2
            className="font-extrabold leading-[1.18] mb-1 text-gray-900"
            style={{ fontSize: "clamp(28px, 3.2vw, 42px)" }}
          >
            <div className="overflow-hidden">
              <span className="tech-word-wrap">
                <SliceText text={headLine1} inView={inView} baseDelay={0.15} />
              </span>
            </div>
            {/* Heading line 2 */}
            <div className="overflow-hidden mt-1">
              <span className="tech-word-wrap">
                <SliceText text={headLine2} inView={inView} baseDelay={0.35} />
              </span>
            </div>
          </h2>

          {/* Body paragraph */}
          <p
            className="text-[15px] leading-[1.8] mb-7 text-gray-500 mt-5"
            style={{ display: "flex", flexWrap: "wrap" }}
          >
            <SliceText text={body} inView={inView} baseDelay={0.55} />
          </p>

          {/* Avatar row — drop in one by one */}
          <div className="flex items-center mb-7">
            {avatars.map((src, i) => (
              <div
                key={i}
                className="tech-avatar-drop"
                style={{
                  transitionDelay: `${0.9 + i * 0.1}s`,
                  marginLeft: i === 0 ? 0 : "-8px",
                  zIndex: 4 - i,
                }}
              >
                <img
                  src={src}
                  alt="user"
                  className="w-9 h-9 rounded-full border-[2.5px] border-white object-cover"
                />
              </div>
            ))}
            {/* + pill */}
            <div
              className="tech-avatar-drop w-9 h-9 rounded-full border-[2.5px] border-white flex items-center justify-center text-[11px] font-bold text-white"
              style={{
                background: "#1a1a2e",
                marginLeft: "-8px",
                transitionDelay: `${0.9 + avatars.length * 0.1}s`,
              }}
            >
              +
            </div>
            {/* label */}
            <span
              className="ml-4 text-[13px] text-gray-700 tech-avatar-drop"
              style={{
                transitionDelay: `${0.9 + (avatars.length + 1) * 0.1}s`,
              }}
            >
              <span className="font-bold text-gray-900">60,000+</span>{" "}
              {isKm ? "អាជីវកម្មសកម្ម" : "active businesses"}
            </span>
          </div>

          {/* Device badges */}
          <div className="flex flex-wrap gap-[9px] mb-8">
            {devices.map((d, i) => (
              <div
                key={d.label}
                className="tech-badge-pop flex items-center gap-[7px] px-4 py-[7px] rounded-full text-[12px] font-semibold text-gray-600"
                style={{
                  background: "rgba(26,26,46,0.05)",
                  border: "1px solid rgba(26,26,46,0.12)",
                  transitionDelay: `${1.35 + i * 0.08}s`,
                }}
              >
                {d.icon}
                {d.label}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div
            className="flex items-center gap-5 tech-slide-up"
            style={{ transitionDelay: "1.7s" }}
          >
            <button
              onClick={() => navigate("/RetailManager")}
              className="cta-primary-tech px-6 py-3.5 text-sm font-semibold"
            >
              {isKm ? "ស្វែងយល់បន្ថែម" : "Learn More"}
              <ArrowRight size={15} className="ml-2 inline-block" />
            </button>
            <button
              className="cta-ghost-tech group"
              onClick={() => window.open("https://aaapos.com", "_blank")}
            >
              <span className="cta-ghost-tech__ring group-hover:bg-gray-900 group-hover:border-gray-900 transition-colors duration-200">
                <Play
                  size={11}
                  fill="#374151"
                  stroke="none"
                  className="group-hover:fill-white transition-colors duration-200"
                />
              </span>
              {isKm ? "មើលរបៀបដំណើរការ" : "See how it works"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        /* ── Word-slice (same as Services) ── */
        .tech-word-wrap {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
        }
        .tech-word {
          display: inline-block;
          transform: translateY(110%);
          opacity: 0;
          transition: transform 0.55s cubic-bezier(0.77, 0, 0.175, 1),
                      opacity 0.15s ease;
        }
        .tech-entered .tech-word {
          transform: translateY(0);
          opacity: 1;
        }

        /* ── Eyebrow / CTA slide up ── */
        .tech-slide-up {
          display: inline-block;
          transform: translateY(24px);
          opacity: 0;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      opacity 0.6s ease;
        }
        .tech-entered .tech-slide-up {
          transform: translateY(0);
          opacity: 1;
        }

        /* ── Avatar drop-in ── */
        .tech-avatar-drop {
          transform: translateY(-20px);
          opacity: 0;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
                      opacity 0.4s ease;
        }
        .tech-entered .tech-avatar-drop {
          transform: translateY(0);
          opacity: 1;
        }

        /* ── Device badge pop ── */
        .tech-badge-pop {
          transform: scale(0.8) translateY(8px);
          opacity: 0;
          transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
                      opacity 0.35s ease;
        }
        .tech-entered .tech-badge-pop {
          transform: scale(1) translateY(0);
          opacity: 1;
        }

        /* ── Buttons ── */
        .cta-primary-tech {
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
        .cta-primary-tech:hover {
          background: #2d2d44;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(0,0,0,0.18);
        }
        .cta-ghost-tech {
          padding-left: 10px !important;
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
        .cta-ghost-tech:hover { color: #111827; }
        .cta-ghost-tech__ring {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: white;
          border: 1.5px solid #d1d5db;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
        }
        @media (max-width: 640px) {
          .cta-primary-tech { width: 100%; }
          .cta-ghost-tech    { width: 100%; margin-top: 0.75rem; }
        }
      `}</style>
    </section>
  );
};

export default Tech;