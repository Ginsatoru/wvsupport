import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { getTeamMembers } from "../../services/api";

const Team = () => {
  const { i18n } = useTranslation();
  const isKm = i18n.language === "km";
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        const response = await getTeamMembers();
        let members = [];
        if (response?.data) members = Array.isArray(response.data) ? response.data : [];
        else if (Array.isArray(response)) members = response;
        setTeamMembers(members);
      } catch (err) {
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTeamMembers();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setEntered(true); },
      { threshold: 0.15 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (/^https?:\/\//i.test(imagePath)) return imagePath;
    const cleanPath = imagePath.startsWith("/") ? imagePath.substring(1) : imagePath;
    return `${import.meta.env.VITE_BACKEND_URL}/${cleanPath}`;
  };

  const placeholderSVG = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNTBDODYuMTkgNTAgNzUgNjEuMTkgNzUgNzVDNzUgODguODEgODYuMTkgMTAwIDEwMCAxMDBDMTEzLjgxIDEwMCAxMjUgODguODEgMTI1IDc1QzEyNSA2MS4xOSAxMTMuODEgNTAgMTAwIDUwWiIgZmlsbD0iIzkzOTZBMCIvPgo8cGF0aCBkPSJNMTAwIDExMEM3Mi4zODYgMTEwIDUwIDEzMi4zODYgNTAgMTYwSDE1MEMxNTAgMTMyLjM4NiAxMjcuNjE0IDExMCAxMDAgMTEwWiIgZmlsbD0iIzkzOTZBMCIvPgo8L3N2Zz4K";

  const activeMember = teamMembers[activeIndex] || null;

  const eyebrow = isKm ? "ក្រុមការងាររបស់យើង" : "Our People";
  const headline = isKm ? "ទ្រព្យសម្បត្តិដ៏មានតម្លៃបំផុត\nរបស់យើង។" : "The people\nbehind the work.";
  const weLabel = isKm ? "យើងស្រឡាញ់" : "WE LOVE";
  const weLabelBold = isKm ? "អ្វីដែលយើងធ្វើ" : "WHAT WE DO";
  const defaultBio = isKm
    ? "ផ្តល់ការគាំទ្រពិសេស និងជំនាញដល់អតិថិជនរបស់យើងរៀងរាល់ថ្ងៃ។"
    : "Delivering exceptional support and expertise to our clients every single day.";
  const defaultName = isKm ? "សមាជិកក្រុម" : "Team Member";
  const defaultPosition = isKm ? "មុខតំណែង" : "Position";

  return (
    <>
      <style>{`
        .tm-container {
          width: 100%;
          padding: 0 16px;
          margin: 0 auto;
        }
        @media (min-width: 640px)  { .tm-container { padding: 0 24px; } }
        @media (min-width: 1024px) { .tm-container { width: 88%; padding: 0; } }
        @media (min-width: 1280px) { .tm-container { width: 83%; } }
        @media (min-width: 1536px) { .tm-container { max-width: 1400px; } }
        @media (min-width: 1700px) { .tm-container { max-width: 1500px; } }

        .tm-word-wrap { display: inline-block; overflow: hidden; vertical-align: bottom; }
        .tm-word {
          display: inline-block;
          transform: translateY(110%);
          opacity: 0;
          transition: transform 0.55s cubic-bezier(0.77,0,0.175,1), opacity 0.15s ease;
        }
        .tm-in .tm-word { transform: translateY(0); opacity: 1; }

        .tm-fade {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94);
        }
        .tm-in .tm-fade { opacity: 1; transform: translateY(0); }

        .tm-row {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 18px;
          border-radius: 14px;
          cursor: pointer;
          opacity: 0;
          transform: translateX(-18px);
          width: 300px;
          box-sizing: border-box;
          transition:
            opacity 0.35s ease,
            transform 0.45s cubic-bezier(0.34,1.56,0.64,1),
            background 0.15s ease,
            box-shadow 0.15s ease;
        }
        .tm-in .tm-row { opacity: 1; transform: translateX(0); }
        .tm-row:hover { background: rgba(255,255,255,0.65); }
        .tm-row.tm-active {
          background: #ffffff;
          box-shadow: 0 2px 20px rgba(0,0,0,0.07);
        }

        .tm-av {
          width: 72px; height: 72px;
          border-radius: 50%;
          border: 2px solid transparent;
          padding: 2px;
          flex-shrink: 0;
          transition: border-color 0.25s ease, transform 0.25s ease;
        }
        .tm-row.tm-active .tm-av { border-color: #0f8abe; transform: scale(1.06); }
        .tm-av img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; display: block; }

        /* Person image — hidden on mobile */
        .tm-person-img { display: none; }
        @media (min-width: 768px) { .tm-person-img { display: block; } }

        /* Blurb — hidden on mobile */
        .tm-blurb { display: none; }
        @media (min-width: 768px) { .tm-blurb { display: block; } }

        /* Content column — full width on mobile */
        .tm-content {
          width: 100%;
          min-height: 500px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 48px 0;
          box-sizing: border-box;
        }
        @media (min-width: 768px) {
          .tm-content {
            width: 70%;
            min-height: 640px;
            padding: 80px 0;
          }
        }

        /* Row width — fluid on mobile */
        @media (max-width: 767px) {
          .tm-row {
            width: 100%;
            padding: 10px 12px;
            gap: 12px;
            border-radius: 10px;
            pointer-events: none;
          }
          .tm-av { width: 44px; height: 44px; }
          .tm-content { padding: 32px 0; min-height: unset; }
          .tm-members-grid { gap: 4px !important; flex-direction: row !important; flex-wrap: wrap !important; }
          .tm-members-grid > div { width: calc(50% - 2px) !important; }
          .tm-members-grid > div .tm-row { width: 100% !important; }
          .tm-name { font-size: 12px !important; }
          .tm-position { font-size: 11px !important; }
        }
      `}</style>

      <section
        ref={sectionRef}
        className={entered ? "tm-in" : ""}
        style={{
          background: "#ffffff",
          position: "relative",
          overflow: "hidden",
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

        {/* Person images — contained within right 40%, no overflow */}
        {!loading && teamMembers.map((member, i) => (
          <img
            key={member._id || member.id || i}
            src={getImageUrl(member.image) || placeholderSVG}
            alt={member.name}
            onError={(e) => { e.target.onerror = null; e.target.src = placeholderSVG; }}
            draggable={false}
            className="tm-person-img"
            style={{
              position: "absolute",
              bottom: "-2%",
              right: "8%",
              height: "110%",
              width: "40%",
              objectFit: "cover",
              objectPosition: "top center",
              zIndex: 2,
              pointerEvents: "none",
              userSelect: "none",
              opacity: i === activeIndex ? 1 : 0,
              transition: "opacity 0.5s ease",
              maskImage: "linear-gradient(to top, transparent 10%, black 65%)",
              WebkitMaskImage: "linear-gradient(to top, transparent 10%, black 65%)",
            }}
          />
        ))}

        {/* Blurb overlay — sits in the fade zone at bottom of image */}
        {activeMember && !loading && (
          <div className="tm-fade tm-blurb" style={{
            position: "absolute",
            bottom: 120,
            right: "8%",
            width: "40%",
            zIndex: 3,
            pointerEvents: "none",
            transitionDelay: "0.85s",
            textAlign: "center",
          }}>
            <p style={{
              fontSize: 13, fontWeight: 700,
              letterSpacing: "0.15em", textTransform: "uppercase",
              color: "#475569", marginBottom: 8,
            }}>
              {weLabel}{" "}{weLabelBold}
            </p>
            <p style={{
              fontSize: 13, color: "#64748b", lineHeight: 1.7,
              maxWidth: 260,
              margin: "0 auto",
            }}>
              {activeMember.bio || defaultBio}
            </p>
          </div>
        )}

        {/* Content — left side, above everything */}
        <div className="tm-container" style={{ position: "relative", zIndex: 3 }}>
          <div className="tm-content">

            {/* Headline */}
            <h2 style={{
              fontSize: "clamp(24px, 3vw, 42px)",
              fontWeight: 800,
              lineHeight: isKm ? 1.35 : 1.08,
              letterSpacing: isKm ? "0" : "-0.025em",
              color: "#0d1f2d",
              marginBottom: 24,
              width: "100%",
              maxWidth: 640,
              whiteSpace: "pre-line",
            }}>
              {headline.split("\n").map((line, li) => (
                <div key={li} style={{ overflow: "hidden", marginBottom: li < headline.split("\n").length - 1 ? "0.06em" : 0 }}>
                  {line.split(" ").map((word, wi) => (
                    <span key={wi} className="tm-word-wrap">
                      <span className="tm-word" style={{ transitionDelay: `${0.08 + li * 0.18 + wi * 0.055}s` }}>
                        {word}{wi < line.split(" ").length - 1 ? "\u00A0" : ""}
                      </span>
                    </span>
                  ))}
                </div>
              ))}
            </h2>

            {/* Member list */}
            {loading ? (
              [0,1,2].map(i => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 16, padding: "11px 14px", marginBottom: 4 }}>
                  <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#e2e8f0", flexShrink: 0 }} />
                  <div>
                    <div style={{ height: 11, width: 110, background: "#e2e8f0", borderRadius: 6, marginBottom: 8 }} />
                    <div style={{ height: 9, width: 75, background: "#f1f5f9", borderRadius: 6 }} />
                  </div>
                </div>
              ))
            ) : (
              <div className="tm-members-grid" style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                gap: 6,
              }}>
                {teamMembers.reduce((cols, member, i) => {
                  const colIndex = Math.floor(i / 4);
                  if (!cols[colIndex]) cols[colIndex] = [];
                  cols[colIndex].push({ member, i });
                  return cols;
                }, []).map((col, colIndex) => (
                  <div key={colIndex} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {col.map(({ member, i }) => {
                      const isActive = i === activeIndex;
                      return (
                        <div
                          key={member._id || member.id || i}
                          className={`tm-row${isActive ? " tm-active" : ""}`}
                          style={{ transitionDelay: `${0.3 + i * 0.08}s` }}
                          onClick={() => setActiveIndex(i)}
                        >
                          <div className="tm-av">
                            <img
                              src={getImageUrl(member.image) || placeholderSVG}
                              alt={member.name}
                              onError={(e) => { e.target.onerror = null; e.target.src = placeholderSVG; }}
                            />
                          </div>
                          <div style={{ flex: 1 }}>
                            <div className="tm-name" style={{
                              fontSize: 14, fontWeight: 700,
                              letterSpacing: isActive ? "0.08em" : "0.01em",
                              textTransform: isActive ? "uppercase" : "none",
                              color: isActive ? "#0d1f2d" : "#64748b",
                              lineHeight: 1.2,
                              transition: "all 0.25s ease",
                            }}>
                              {member.name || defaultName}
                            </div>
                            <div className="tm-position" style={{
                              fontSize: 13,
                              color: "#94a3b8",
                              marginTop: 4, fontWeight: 500,
                              transition: "color 0.25s ease",
                            }}>
                              {member.position || defaultPosition}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </section>
    </>
  );
};

export default Team;