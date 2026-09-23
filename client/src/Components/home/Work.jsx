import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Monitor, Phone, Mail, Server, CheckCircle, Clock } from "lucide-react";
import { motion } from "framer-motion";
import teamviewerLogo from "../Images/tools/teamviewer.webp";
import hubspotLogo from "../Images/tools/hubspot.webp";
import aircallLogo from "../Images/tools/aircall.webp";
import jiraLogo from "../Images/tools/jira.webp";
import techGuy from "../Images/work.webp";

/* ── Word-slice (same mechanic as Hero & Tech) ── */
const SliceText = ({ text, inView, baseDelay = 0 }) => (
  <>
    {text.split(" ").map((word, i) => (
      <span key={i} className="fs-word-wrap">
        <span
          className="fs-word"
          style={{ transitionDelay: `${baseDelay + i * 0.055}s` }}
        >
          {word}
          {i < text.split(" ").length - 1 ? "\u00A0" : ""}
        </span>
      </span>
    ))}
  </>
);

const Work = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const [entered, setEntered] = useState(false);
  const isKm = i18n.language === "km";

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const headline1 = isKm ? "យើងធ្វើការ" : "We do the work,";
  const headline2 = isKm ? "អ្នកផ្តោតលើ" : "so you focus on";
  const headline3 = isKm ? "អ្វីដែលសំខាន់។" : "what matters.";

  const body = isKm
    ? "ក្រុមការងាររបស់យើងនៅសៀមរាបផ្តល់ការជំនួយបច្ចេកទេសពីចម្ងាយ ការទូរស័ព្ទ និងការគ្រប់គ្រងប្រព័ន្ធ RetailManager ដល់អតិថិជនអូស្ត្រាលី ២៤/៧។"
    : "Our Siem Reap-based team delivers expert remote support, phone assistance, and RetailManager system management to Australian clients, reliably, every day.";

  const services = [
    {
      icon: <Monitor size={18} strokeWidth={1.8} />,
      title: isKm ? "ការជំនួយពីចម្ងាយ" : "Remote Support",
      desc: isKm
        ? "ភ្ជាប់ TeamViewer ដោះស្រាយបញ្ហា POS ក្នុងពេលភ្លាមៗ"
        : "TeamViewer-powered troubleshooting for POS issues in real time.",
    },
    {
      icon: <Phone size={18} strokeWidth={1.8} />,
      title: isKm ? "ជំនួយតាមទូរស័ព្ទ" : "Phone Assistance",
      desc: isKm
        ? "ការឆ្លើយតបក្នុងរយៈពេល ១៥ នាទីសម្រាប់បញ្ហាបន្ទាន់"
        : "Under 15-minute response for critical issues via direct phone line.",
    },
    {
      icon: <Mail size={18} strokeWidth={1.8} />,
      title: isKm ? "ការគាំទ្រតាមអ៊ីមែល" : "Email & Ticket Support",
      desc: isKm
        ? "ប្រព័ន្ធ ticket ស្វ័យប្រវត្តិ ជាមួយការតាមដានសំណើ"
        : "Structured ticketing system with full request tracking and logging.",
    },
    {
      icon: <Server size={18} strokeWidth={1.8} />,
      title: isKm ? "ការគ្រប់គ្រងប្រព័ន្ធ" : "System Management",
      desc: isKm
        ? "ត្រួតពិនិត្យ RetailManager, ធ្វើបច្ចុប្បន្នភាព និងបង្កើនប្រសិទ្ធភាព"
        : "RetailManager monitoring, updates, database optimization, and health checks.",
    },
  ];

  return (
    <>
      <style>{`
        .fs-word-wrap {
          display: inline-block;
          overflow: hidden;
          vertical-align: bottom;
        }
        .fs-word {
          display: inline-block;
          transform: translateY(110%);
          opacity: 0;
          transition: transform 0.55s cubic-bezier(0.77, 0, 0.175, 1),
                      opacity 0.15s ease;
        }
        .fs-entered .fs-word {
          transform: translateY(0);
          opacity: 1;
        }
        .fs-slide-up {
          transform: translateY(22px);
          opacity: 0;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      opacity 0.6s ease;
        }
        .fs-entered .fs-slide-up {
          transform: translateY(0);
          opacity: 1;
        }
        .fs-drop {
          transform: translateY(-18px);
          opacity: 0;
          transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1),
                      opacity 0.4s ease;
        }
        .fs-entered .fs-drop {
          transform: translateY(0);
          opacity: 1;
        }
        .fs-card-pop {
          transform: scale(0.94) translateX(14px);
          opacity: 0;
          transition: transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1),
                      opacity 0.35s ease,
                      background 0.25s ease;
        }
        .fs-entered .fs-card-pop {
          transform: scale(1) translateX(0);
          opacity: 1;
        }
        .fs-person {
          transform: translateY(20px);
          opacity: 0;
          transition: transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.3s,
                      opacity 0.9s ease 0.3s;
        }
        .fs-entered .fs-person {
          transform: translateY(0);
          opacity: 1;
        }
        .fs-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 13px 26px;
          background: #111111;
          color: white;
          border: none;
          border-radius: 9999px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.25s ease;
        }
        .fs-cta-btn:hover {
          background: #2a2a2a;
        }

        .fs-container {
          width: 100%;
          padding: 0 16px;
          margin: 0 auto;
          position: relative;
        }
        @media (min-width: 640px) {
          .fs-container { padding: 0 24px; }
        }
        @media (min-width: 1024px) {
          .fs-container { width: 88%; padding: 0; }
        }
        @media (min-width: 1280px) {
          .fs-container { width: 83%; }
        }
        @media (min-width: 1536px) {
          .fs-container { max-width: 1400px; }
        }
        @media (min-width: 1700px) {
          .fs-container { max-width: 1500px; }
        }

        @media (max-width: 1023px) {
          .fs-center-col { display: none !important; }
          .fs-main-grid {
            grid-template-columns: 1fr 1fr !important;
            gap: 40px !important;
          }
          .fs-right-col {
            padding-left: 0 !important;
          }
        }
        @media (max-width: 600px) {
          .fs-main-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      <section
        ref={sectionRef}
        className={entered ? "fs-entered" : ""}
        style={{
          background: "#ffffff",
          padding: "80px 0 90px",
          overflow: "hidden",
          position: "relative",
        }}
      >
        <div className="fs-container">
          <div
            className="fs-main-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "0 40px",
              alignItems: "center",
              minHeight: 560,
            }}
          >
            {/* ── LEFT ── */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              {/* Eyebrow */}
              <div style={{ overflow: "hidden", marginBottom: 18 }}>
                <span
                  className="fs-slide-up"
                  style={{
                    display: "inline-block",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.13em",
                    textTransform: "uppercase",
                    color: "#0f8abe",
                    transitionDelay: "0.05s",
                  }}
                >
                  {isKm ? "មូលដ្ឋានការងាររបស់យើង" : "Our Base, Your Backbone"}
                </span>
              </div>

              {/* Headline */}
              <h2
                style={{
                  fontSize: "clamp(26px, 3vw, 42px)",
                  fontWeight: 800,
                  lineHeight: 1.12,
                  letterSpacing: "-0.02em",
                  color: "#000000",
                  marginBottom: 20,
                }}
              >
                {[headline1, headline2, headline3].map((line, li) => (
                  <div
                    key={li}
                    style={{ overflow: "hidden", marginBottom: "0.04em" }}
                  >
                    <SliceText
                      text={line}
                      inView={entered}
                      baseDelay={0.1 + li * 0.15}
                    />
                  </div>
                ))}
              </h2>

              {/* Body */}
              <p
                className="fs-slide-up"
                style={{
                  fontSize: 14,
                  color: "#000000",
                  lineHeight: 1.8,
                  maxWidth: 360,
                  marginBottom: 28,
                  transitionDelay: "0.55s",
                }}
              >
                {body}
              </p>

              {/* CTA */}
              <div className="fs-slide-up" style={{ transitionDelay: "0.7s" }}>
                <a href="https://aaapos.com/support" className="fs-cta-btn">
                  {isKm ? "ស្វែងយល់បន្ថែម" : "Learn More"}
                  <ArrowRight size={15} />
                </a>
              </div>

              {/* Trust badge strip */}
              <div
                style={{
                  borderTop: "1px solid #e2e8f0",
                  marginTop: 32,
                  paddingTop: 22,
                }}
              >
                <div
                  className="fs-slide-up"
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: "#000000",
                    marginBottom: 14,
                    transitionDelay: "0.85s",
                  }}
                >
                  {isKm ? "ឧបករណ៍ដែលយើងប្រើ" : "Tools we work with"}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    flexWrap: "wrap",
                  }}
                >
                  {[
                    { src: teamviewerLogo, alt: "TeamViewer" },
                    { src: hubspotLogo, alt: "HubSpot" },
                    { src: aircallLogo, alt: "Aircall" },
                    { src: jiraLogo, alt: "Jira" },
                  ].map((tool, i) => (
                    <div
                      key={tool.alt}
                      className="fs-drop"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        paddingLeft: i > 0 ? 16 : 0,
                        borderLeft: i > 0 ? "1px solid #e2e8f0" : "none",
                        transitionDelay: `${0.9 + i * 0.07}s`,
                      }}
                    >
                      <img
                        src={tool.src}
                        alt={tool.alt}
                        draggable={false}
                        style={{
                          height: 20,
                          width: "auto",
                          objectFit: "contain",
                          userSelect: "none",
                        }}
                      />
                      <span
                        style={{
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#000000",
                        }}
                      >
                        {tool.alt}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── CENTER: Person image ── */}
            <div
              className="fs-center-col"
              style={{
                position: "relative",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                height: "100%",
                minHeight: 520,
              }}
            >
              {/* Blob bg */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "radial-gradient(ellipse 55% 60% at 50% 55%, #c2e6f5 0%, #d9f0f8 30%, #eef8fd 55%, rgba(255,255,255,0) 80%)",
                  zIndex: 0,
                }}
              />

              {/* Person */}
              <img
                src={techGuy}
                alt="Support specialist"
                className="fs-person"
                draggable={false}
                style={{
                  position: "relative",
                  zIndex: 2,
                  height: "112%",
                  maxHeight: 600,
                  width: "auto",
                  objectFit: "contain",
                  objectPosition: "bottom",
                  filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.10))",
                  maskImage:
                    "linear-gradient(to bottom, black 60%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 60%, transparent 100%)",
                  userSelect: "none",
                  pointerEvents: "none",
                }}
              />

              {/* Badge — top left: 100% Remote */}
              <motion.div
                style={{
                  position: "absolute",
                  top: 36,
                  left: -18,
                  zIndex: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  borderRadius: 20,
                  background: "#f1f5f9",
                  whiteSpace: "nowrap",
                }}
                initial={{ opacity: 0, x: 60, y: 80, scale: 0.6 }}
                animate={
                  entered ? { opacity: 1, x: 0, y: [0, -9, 0], scale: 1 } : {}
                }
                transition={
                  entered
                    ? {
                        opacity: { duration: 0.5, delay: 0.9 },
                        scale: {
                          type: "spring",
                          stiffness: 80,
                          damping: 18,
                          delay: 0.9,
                        },
                        x: {
                          type: "spring",
                          stiffness: 80,
                          damping: 18,
                          delay: 0.9,
                        },
                        y: {
                          duration: 3.2,
                          repeat: Infinity,
                          repeatType: "loop",
                          ease: "easeInOut",
                          delay: 2.2,
                        },
                      }
                    : {}
                }
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: "#111111",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <CheckCircle size={14} className="text-white" />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#000000",
                      lineHeight: 1,
                    }}
                  >
                    {isKm ? "ពីចម្ងាយ ១០០%" : "100% Remote"}
                  </div>
                  <div style={{ fontSize: 10, color: "#000000", marginTop: 2 }}>
                    {isKm ? "ភ្ជាប់ជា TeamViewer" : "Via TeamViewer"}
                  </div>
                </div>
              </motion.div>

              {/* Badge — bottom right: 15 min Response */}
              <motion.div
                style={{
                  position: "absolute",
                  bottom: 52,
                  right: -18,
                  zIndex: 10,
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 14px",
                  borderRadius: 20,
                  background: "#f1f5f9",
                  whiteSpace: "nowrap",
                }}
                initial={{ opacity: 0, x: -60, y: -80, scale: 0.6 }}
                animate={
                  entered ? { opacity: 1, x: 0, y: [0, -11, 0], scale: 1 } : {}
                }
                transition={
                  entered
                    ? {
                        opacity: { duration: 0.5, delay: 1.1 },
                        scale: {
                          type: "spring",
                          stiffness: 70,
                          damping: 18,
                          delay: 1.1,
                        },
                        x: {
                          type: "spring",
                          stiffness: 70,
                          damping: 18,
                          delay: 1.1,
                        },
                        y: {
                          duration: 3.8,
                          repeat: Infinity,
                          repeatType: "loop",
                          ease: "easeInOut",
                          delay: 2.6,
                        },
                      }
                    : {}
                }
              >
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 10,
                    background: "#111111",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Clock size={14} className="text-white" />
                </div>
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: "#000000",
                      lineHeight: 1,
                    }}
                  >
                    {isKm ? "ឆ្លើយតបក្នុង ១៥ នាទី" : "15 Min Response"}
                  </div>
                  <div style={{ fontSize: 10, color: "#000000", marginTop: 2 }}>
                    {isKm ? "ពេលវេលាឆ្លើយតបជាមធ្យម" : "Avg. Response Time"}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* ── RIGHT: Service cards ── */}
            <div
              className="fs-right-col"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 12,
                paddingLeft: 16,
              }}
            >
              {services.map((svc, i) => (
                <div
                  key={i}
                  className="fs-service-card fs-card-pop"
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 14,
                    padding: "16px 18px",
                    borderRadius: 20,
                    background: "#f1f5f9",
                    transitionDelay: `${0.6 + i * 0.1}s`,
                  }}
                >
                  <div
                    className="fs-card-icon"
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      background: "#000000",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {svc.icon}
                  </div>
                  <div>
                    <div
                      className="fs-card-title"
                      style={{
                        fontSize: 13,
                        fontWeight: 700,
                        color: "#000000",
                        lineHeight: 1.2,
                        marginBottom: 4,
                      }}
                    >
                      {svc.title}
                    </div>
                    <div
                      className="fs-card-desc"
                      style={{
                        fontSize: 12,
                        color: "#000000",
                        lineHeight: 1.6,
                      }}
                    >
                      {svc.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Work;