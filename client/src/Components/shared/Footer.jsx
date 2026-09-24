import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSettings } from "../../context/SettingsContext";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaPhone, FaEnvelope, FaYoutube} from "react-icons/fa";

const Footer = () => {
  const { i18n } = useTranslation();
  const isKm = i18n.language === "km";
  const { settings } = useSettings();
  const location = useLocation();

  const columns = [
    {
      heading: isKm ? "អំពីយើង" : "About Us",
      links: [
        { label: isKm ? "អំពី" : "About",     href: "/Aboutus" },
        { label: isKm ? "ផ្នែកច្បាប់" : "Legal", href: "/Legal" },
        { label: isKm ? "ទំនាក់ទំនង" : "Contact", href: "/contact" },
        { label: isKm ? "ការងារ" : "Careers", href: "/Careers" },
      ],
    },
    {
      heading: isKm ? "តំណភ្ជាប់មានប្រយោជន៍" : "Useful Links",
      links: [
        { label: isKm ? "រកមើល AAAPOS" : "Browse to AAAPOS", href: "https://www.aaapos.com/", external: true },
        { label: "Webstore Manager", href: "https://www.aaapos.com/webstore-manager", external: true },
        { label: "RM Mobile", href: "https://www.aaapos.com/rm-mobile", external: true },
        { label: isKm ? "សំណួរញឹកញាប់" : "FAQs", href: "/FAQ" },
      ],
    },
  ];

  const socials = [
    { icon: FaFacebookF, href: "https://www.facebook.com/aaapos.retailmanager/",  label: "Facebook" },
    { icon: FaYoutube,href: "https://www.youtube.com/@aaapos/about",  label: "Youtube" },
  ];

  const defaultDescription = isKm
    ? "WV Support គឺជាក្រុមការងារនៅសៀមរាប ដែលផ្តល់ការគាំទ្របច្ចេកទេសពីចម្ងាយសម្រាប់ RetailManager ជូនអតិថិជនអូស្ត្រាលី និយសេឡង់ និងតំបន់អាស៊ី-ប៉ាស៊ីហ្វិក។"
    : "WV Support is a Siem Reap-based team delivering remote technical support for RetailManager, helping retailers across Australia, New Zealand, and the Asia-Pacific region.";

  return (
    <>
      <style>{`
        .ft-root {
          background: #0a0a0a;
          border-top: 1px solid #1f1f1f;
        }

        /* ── Same container as nav / Work / Newsletter ── */
        .ft-container {
          width: 100%;
          padding: 0 16px;
          margin: 0 auto;
        }
        @media (min-width: 640px)  { .ft-container { padding: 0 24px; } }
        @media (min-width: 1024px) { .ft-container { width: 88%; padding: 0; } }
        @media (min-width: 1280px) { .ft-container { width: 83%; } }
        @media (min-width: 1536px) { .ft-container { max-width: 1400px; } }
        @media (min-width: 1700px) { .ft-container { max-width: 1500px; } }

        /* ── Top grid ── */
        .ft-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr 1fr;
          gap: 48px;
          padding: 80px 0 72px;
        }
        @media (max-width: 900px) {
          .ft-grid {
            grid-template-columns: 1fr 1fr;
            gap: 36px;
            padding: 64px 0 56px;
          }
          .ft-brand { grid-column: 1 / -1; }
        }
        @media (max-width: 540px) {
          .ft-grid {
            grid-template-columns: 1fr;
            gap: 28px;
            padding: 52px 0 40px;
          }
          .ft-brand { grid-column: auto; }
        }

        /* ── Brand column ── */
        .ft-logo-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 14px;
          text-decoration: none;
        }
        .ft-logo-img {
          height: 24px;
          width: auto;
          transition: transform 0.2s ease;
        }
        .ft-logo-wrap:hover .ft-logo-img { transform: scale(1.05); }
        .ft-logo-fallback {
          width: 28px; height: 28px;
          border-radius: 50%;
          background: #2a2a2a;
          display: flex; align-items: center; justify-content: center;
          transition: transform 0.2s ease;
        }
        .ft-logo-wrap:hover .ft-logo-fallback { transform: scale(1.05); }
        .ft-logo-fallback span {
          color: #fff;
          font-size: 13px;
          font-weight: 700;
        }
        .ft-company-name {
          font-size: 17px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.01em;
        }
        .ft-desc {
          font-size: 15px;
          color: #ffffff;
          line-height: 1.75;
          max-width: 300px;
          margin-bottom: 20px;
        }
        .ft-contact-list {
          display: flex;
          flex-direction: column;
          gap: 9px;
        }
        .ft-contact-item {
          display: flex;
          align-items: center;
          gap: 9px;
          font-size: 14.5px;
          color: #ffffff;
          text-decoration: none;
          transition: color 0.15s ease;
        }
        .ft-contact-item:hover { color: #d1d5db; }
        .ft-contact-icon {
          width: 15px; height: 15px;
          color: #ffffff;
          flex-shrink: 0;
        }

        /* ── Link columns ── */
        .ft-col-heading {
          font-size: 13px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #9ca3af;
          margin-bottom: 16px;
        }
        .ft-links {
          list-style: none;
          padding: 0; margin: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .ft-links a {
          display: inline-block;
          font-size: 15px;
          font-weight: 500;
          color: #ffffff;
          text-decoration: none;
          padding: 5px 10px;
          border-radius: 9999px;
          margin-left: -10px;
          transition: background 0.15s ease, color 0.15s ease;
          cursor: pointer;
        }
        .ft-links a:hover {
          background: #1a1a1a;
          color: #d1d5db;
        }
        .ft-links a.ft-active {
          color: #ffffff;
          font-weight: 600;
        }

        /* ── Divider ── */
        .ft-divider {
          border: none;
          border-top: 1px solid #1f1f1f;
        }

        /* ── Bottom bar ── */
        .ft-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 26px 0;
          gap: 16px;
          flex-wrap: wrap;
        }
        .ft-copyright {
          font-size: 14px;
          color: #ffffff;
        }
        .ft-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        .ft-follow {
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #ffffff;
        }
        .ft-socials {
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .ft-social-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px; height: 32px;
          border-radius: 50%;
          color: #ffffff;
          background: transparent;
          border: none;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.15s ease, color 0.15s ease;
        }
        .ft-social-btn:hover {
          background: #1a1a1a;
          color: #d1d5db;
        }
        .ft-social-btn svg { width: 15px; height: 15px; }
      `}</style>

      <footer className="ft-root">
        <div className="ft-container">
          <div className="ft-grid">

            {/* ── Brand ── */}
            <div className="ft-brand">
              <Link to="/" className="ft-logo-wrap">
                {settings?.logo ? (
                  <img src={settings.logo} alt={settings.companyName || "Logo"} className="ft-logo-img" />
                ) : (
                  <div className="ft-logo-fallback">
                    <span>{settings?.companyName?.charAt(0) || "W"}</span>
                  </div>
                )}
                <span className="ft-company-name">
                  {settings?.companyName || "WV Support"}
                </span>
              </Link>

              <p className="ft-desc">
                {settings?.companyDescription || defaultDescription}
              </p>

              <div className="ft-contact-list">
                {settings?.phoneNumber && (
                  <a href={`tel:${settings.phoneNumber}`} className="ft-contact-item">
                    <FaPhone className="ft-contact-icon" />
                    {settings.phoneNumber}
                  </a>
                )}
                {settings?.email && (
                  <a href={`mailto:${settings.email}`} className="ft-contact-item">
                    <FaEnvelope className="ft-contact-icon" />
                    {settings.email}
                  </a>
                )}
              </div>
            </div>

            {/* ── Link columns ── */}
            {columns.map((col) => (
              <div key={col.heading}>
                <p className="ft-col-heading">{col.heading}</p>
                <ul className="ft-links">
                  {col.links.map(({ label, href, external }) => (
                    <li key={href}>
                      {external ? (
                        <a href={href} target="_blank" rel="noopener noreferrer">
                          {label}
                        </a>
                      ) : (
                        <a
                          href={href}
                          className={location.pathname === href ? "ft-active" : ""}
                          onClick={(e) => { e.preventDefault(); window.location.href = href; }}
                        >
                          {label}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          </div>
        </div>

        <hr className="ft-divider" />

        <div className="ft-container">
          <div className="ft-bottom">
            <span className="ft-copyright">
              © {new Date().getFullYear()} {settings?.companyName || "WV Support"}
            </span>

            <div className="ft-right">
              <span className="ft-follow">{isKm ? "តាមដានយើង" : "Follow Us"}</span>
              <div className="ft-socials">
                {socials.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="ft-social-btn"
                  >
                    <Icon />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;