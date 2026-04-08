import React, { useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import Image1 from "../Images/image1.webp";
import Image2 from "../Images/image2.webp";
import Image3 from "../Images/image3.webp";
import Image4 from "../Images/image4.webp";
import Image5 from "../Images/image5.webp";
import Image6 from "../Images/image6.webp";
import Image7 from "../Images/image7.webp";
import Image8 from "../Images/image8.webp";
import Image9 from "../Images/image9.webp";
import Image10 from "../Images/image10.webp";

/* ── Word-slice text, same mechanic as Tech / Team ── */
const SliceText = ({ text, inView, baseDelay = 0 }) => (
  <>
    {text.split(" ").map((word, i) => (
      <span key={i} className="gl-word-wrap">
        <span
          className="gl-word"
          style={{ transitionDelay: `${baseDelay + i * 0.055}s` }}
        >
          {word}
          {i < text.split(" ").length - 1 ? "\u00A0" : ""}
        </span>
      </span>
    ))}
  </>
);

const Gallery = () => {
  const { i18n } = useTranslation();
  const isKm = i18n.language === "km";
  const sectionRef = useRef(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setEntered(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const eyebrow   = isKm ? "វិចិត្រសាលរបស់យើង"       : "Our Gallery";
  const headLine1 = isKm ? "ជឿជាក់ដោយអ្នកលក់រាយ" : "Retailers trust us worldwide.";

  const firstRow  = [Image1, Image2, Image3, Image7, Image8];
  const secondRow = [Image4, Image5, Image6, Image9, Image10];

  return (
    <>
      <style>{`
        /* ── Word-slice ── */
        .gl-word-wrap { display: inline-block; overflow: hidden; vertical-align: bottom; }
        .gl-word {
          display: inline-block;
          transform: translateY(110%);
          opacity: 0;
          transition: transform 0.55s cubic-bezier(0.77, 0, 0.175, 1),
                      opacity 0.15s ease;
        }
        .gl-in .gl-word { transform: translateY(0); opacity: 1; }

        /* ── Slide up ── */
        .gl-slide-up {
          display: inline-block;
          transform: translateY(24px);
          opacity: 0;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                      opacity 0.6s ease;
        }
        .gl-in .gl-slide-up { transform: translateY(0); opacity: 1; }

        /* ── Row fade-in ── */
        .gl-row {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease,
                      transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .gl-in .gl-row { opacity: 1; transform: translateY(0); }

        /* ── Scroll animations ── */
        @keyframes gl-scroll-ltr {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes gl-scroll-rtl {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .gl-track-ltr {
          animation: gl-scroll-ltr 55s linear infinite;
          width: max-content;
        }
        .gl-track-rtl {
          animation: gl-scroll-rtl 55s linear infinite;
          width: max-content;
        }
        .gl-track-ltr:hover,
        .gl-track-rtl:hover { animation-play-state: paused; }

        @media (hover: none) {
          .gl-track-ltr, .gl-track-rtl { animation-duration: 80s; }
        }
        @media (max-width: 400px) {
          .gl-track-ltr, .gl-track-rtl { animation-duration: 60s; }
        }

        /* ── Full-bleed escape from constrained wrapper ── */
        .gl-full-bleed {
          margin-left: calc(-50vw + 50%);
          margin-right: calc(-50vw + 50%);
        }
      `}</style>

      <section
        ref={sectionRef}
        className={entered ? "gl-in" : ""}
        style={{
          background: "#ffffff",
          position: "relative",
          overflow: "hidden",
          paddingTop: 80,
          paddingBottom: 80,
        }}
      >
        {/* Dot bg texture */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 0,
          backgroundImage: "radial-gradient(circle, #cbd5e1 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          opacity: 0.22,
          pointerEvents: "none",
        }} />

        {/* ── Constrained content wrapper ── */}
        <div style={{
          position: "relative",
          zIndex: 1,
          width: "90%",
          maxWidth: 760,
          marginLeft: "auto",
          marginRight: "auto",
        }}>

          {/* ── Header ── */}
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div style={{ overflow: "hidden", marginBottom: 16 }}>
              <span
                className="gl-slide-up"
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#9ca3af",
                  transitionDelay: "0.1s",
                }}
              >
                {eyebrow}
              </span>
            </div>

            <h2 style={{
              fontSize: "clamp(18px, 2.2vw, 34px)",
              fontWeight: 800,
              lineHeight: 1.08,
              letterSpacing: "-0.025em",
              color: "#0d1f2d",
              marginBottom: 16,
            }}>
              <div style={{ overflow: "hidden", marginBottom: "0.06em" }}>
                <SliceText text={headLine1} inView={entered} baseDelay={0.15} />
              </div>
            </h2>
          </div>

          {/* ── First Row (left-to-right) — breaks out to full viewport width ── */}
          <div
            className="gl-row gl-full-bleed"
            style={{
              position: "relative",
              overflow: "hidden",
              marginBottom: 20,
              transitionDelay: "0.75s",
            }}
          >
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to right, white, transparent)", zIndex: 2, pointerEvents: "none" }} />
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to left, white, transparent)", zIndex: 2, pointerEvents: "none" }} />

            <div className="gl-track-ltr" style={{ display: "flex", gap: 20 }}>
              {[...firstRow, ...firstRow].map((img, index) => (
                <div
                  key={`r1-${index}`}
                  style={{
                    flexShrink: 0,
                    width: "clamp(192px, 20vw, 320px)",
                    height: "clamp(144px, 15vw, 240px)",
                    borderRadius: 16,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={img}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.5s ease",
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── Second Row (right-to-left) — breaks out to full viewport width ── */}
          <div
            className="gl-row gl-full-bleed"
            style={{
              position: "relative",
              overflow: "hidden",
              transitionDelay: "0.9s",
            }}
          >
            <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to right, white, transparent)", zIndex: 2, pointerEvents: "none" }} />
            <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: "linear-gradient(to left, white, transparent)", zIndex: 2, pointerEvents: "none" }} />

            <div className="gl-track-rtl" style={{ display: "flex", gap: 20 }}>
              {[...secondRow, ...secondRow].map((img, index) => (
                <div
                  key={`r2-${index}`}
                  style={{
                    flexShrink: 0,
                    width: "clamp(192px, 20vw, 320px)",
                    height: "clamp(144px, 15vw, 240px)",
                    borderRadius: 16,
                    overflow: "hidden",
                  }}
                >
                  <img
                    src={img}
                    alt=""
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.5s ease",
                    }}
                    onMouseEnter={e => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                  />
                </div>
              ))}
            </div>
          </div>

        </div>{/* end constrained wrapper */}
      </section>
    </>
  );
};

export default Gallery;