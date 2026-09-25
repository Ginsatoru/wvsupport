import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSettings } from "../../context/SettingsContext";
import enFlag from "../Images/en.png";
import khFlag from "../Images/kh.png";
import { Home, Mail, LayoutGrid, Info, Menu } from "lucide-react";
import LoginModal from "../LoginForm";

const useFontLoader = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    const checkFonts = async () => {
      try {
        await document.fonts.load("400 16px Montserrat");
        setFontsLoaded(true);
      } catch (error) {
        setTimeout(() => setFontsLoaded(true), 1000);
      }
    };
    if (document.fonts && document.fonts.load) {
      checkFonts();
    } else {
      setTimeout(() => setFontsLoaded(true), 500);
    }
  }, []);
  return fontsLoaded;
};

// Display name: the account's name, or the email's first part (admin@wvsupport.com → "Admin")
const displayName = ({ name, email = "" } = {}) => {
  const local = email.split("@")[0];
  return name || (local ? local.charAt(0).toUpperCase() + local.slice(1) : "Admin");
};

// Name from a valid admin token, or null if logged out / expired (quick first paint)
const getAdminName = () => {
  const token = localStorage.getItem("adminToken");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    if (payload.exp && payload.exp * 1000 <= Date.now()) return null;
    return displayName(payload);
  } catch {
    return null;
  }
};

const NAV_LINKS_EN = [
  { label: "Home", to: "/", icon: Home },
  { label: "Contact", to: "/Contact", icon: Mail },
  { label: "Services", to: "/Services", icon: LayoutGrid },
  { label: "About Us", to: "/Aboutus", icon: Info },
];

const NAV_LINKS_KM = [
  { label: "ទំព័រដើម", to: "/", icon: Home },
  { label: "ទំនាក់ទំនង", to: "/Contact", icon: Mail },
  { label: "សេវាកម្ម", to: "/Services", icon: LayoutGrid },
  { label: "អំពីយើង", to: "/Aboutus", icon: Info },
];

function Nav() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [showLogin, setShowLogin] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [languageDropdownActive, setLanguageDropdownActive] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth > 768 && window.innerWidth <= 1024,
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const { i18n } = useTranslation();
  const isKm = i18n.language === "km";
  const NAV_LINKS = isKm ? NAV_LINKS_KM : NAV_LINKS_EN;
  const [currentLang, setCurrentLang] = useState("en");
  const { settings, loading } = useSettings();

  const fontsLoaded = useFontLoader();
  const [adminName, setAdminName] = useState(getAdminName);

  // Logged in: swap in the current name from the server (the token may predate a name change)
  useEffect(() => {
    if (!getAdminName()) return setAdminName(null);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/admin/me`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setAdminName(displayName(data.user));
      })
      .catch(() => {});
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      if (isHomePage) setIsScrolled(window.scrollY > 50);
    };
    const savedLang = localStorage.getItem("language") || "en";
    i18n.changeLanguage(savedLang);
    setCurrentLang(savedLang);
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    handleScroll();
    handleResize();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [i18n, isHomePage]);

  const openLogin = () => {
    setMenuActive(false);
    setShowLogin(true);
  };

  const toggleMenu = () => {
    setMenuActive(!menuActive);
    setLanguageDropdownActive(false);
  };

  const toggleLanguageDropdown = (e) => {
    if (!isMobile && !isTablet) return;
    e.preventDefault();
    setLanguageDropdownActive(!languageDropdownActive);
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setCurrentLang(lang);
    setLanguageDropdownActive(false);
    if (menuActive) setMenuActive(false);
  };

  const isTransparent = isHomePage && !isScrolled;

  if (loading) {
    return (
      <>
        <nav
          className={`w-full z-50 ${isHomePage ? "fixed" : "sticky top-0"} ${
            isTransparent
              ? "bg-transparent"
              : "bg-white border-b border-gray-100"
          }`}
        >
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2 animate-pulse">
              <div className="w-24 h-5 bg-gray-200 rounded"></div>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
          </div>
        </nav>
        {!isHomePage && <div className="h-16 md:h-20"></div>}
      </>
    );
  }

  return (
    <>
      <nav
        className={`w-full z-50 transition-all duration-300 ${
          isHomePage ? "fixed" : "sticky top-0"
        } ${
          isTransparent
            ? "bg-transparent"
            : "bg-white/95 backdrop-blur-md border-b border-gray-100/80 shadow-sm"
        } ${fontsLoaded ? "font-loaded" : "font-loading"}`}
      >
        <div className="w-full px-4 sm:px-6 lg:px-0">
          <div className="flex justify-between items-center h-[56px] md:h-[62px] lg:h-[78px] mx-auto w-full lg:w-[88%] xl:w-[83%] 2xl:max-w-[1400px] [@media(min-width:1700px)]:max-w-[1500px]">

            {/* ── Logo ── */}
            <div className="flex items-center nav-item nav-item--1">
              <Link
                to="/"
                className="flex items-center gap-2 group"
                onClick={() => setMenuActive(false)}
              >
                {settings?.logo ? (
                  <img
                    src={settings.logo}
                    alt={settings.companyName || "Logo"}
                    className="h-5 sm:h-6 lg:h-7 transition-transform duration-200 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex items-center justify-center h-7 w-7 rounded-full bg-black group-hover:scale-105 transition-transform duration-200">
                    <span className="text-white font-bold text-sm">
                      {settings?.companyName?.charAt(0) || "W"}
                    </span>
                  </div>
                )}
                <span className="text-sm sm:text-base lg:text-[15px] font-bold tracking-tight text-black">
                  {settings?.companyName || "WV Support"}
                </span>
              </Link>
            </div>

            {/* ── Desktop Nav Links ── */}
            <div className="hidden lg:flex items-center gap-1 text-[14px] nav-item nav-item--2">
              {NAV_LINKS.map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 text-black hover:bg-[#f1f5f9] ${
                    location.pathname === to ? "text-black" : ""
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* ── Right side: Language + Log in + Get Started ── */}
            <div className="hidden lg:flex items-center gap-2 nav-item nav-item--3">
              {/* Language selector */}
              <div className="relative group">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 text-black hover:bg-[#f1f5f9]">
                  <img
                    src={currentLang === "en" ? enFlag : khFlag}
                    alt={currentLang === "en" ? "English" : "Khmer"}
                    className="w-4 h-3 rounded-sm"
                  />
                  <span>{currentLang === "en" ? "EN" : "KH"}</span>
                  <svg
                    className="w-3 h-3 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-40 origin-top-right rounded-xl bg-white shadow-lg border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-1 transition-all duration-200">
                  <div className="py-1.5">
                    {[
                      { lang: "en", flag: enFlag, label: "English" },
                      { lang: "km", flag: khFlag, label: "Khmer" },
                    ].map(({ lang, flag, label }) => (
                      <button
                        key={lang}
                        onClick={() => changeLanguage(lang)}
                        className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm transition-colors duration-150 text-black ${
                          currentLang === lang
                            ? "bg-[#f1f5f9] font-medium"
                            : "hover:bg-[#f1f5f9]"
                        }`}
                      >
                        <img src={flag} alt={label} className="w-5 h-3.5 rounded-sm" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="w-px h-4 bg-gray-200" />

              {/* Log in — opens modal, or admin name → admin panel when logged in */}
              {adminName ? (
                <Link
                  to="/admin-panel"
                  className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 text-black hover:bg-[#f1f5f9]"
                >
                  {adminName}
                </Link>
              ) : (
                <button
                  onClick={openLogin}
                  className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 text-black hover:bg-[#f1f5f9]"
                >
                  {isKm ? "ចូល" : "Log in"}
                </button>
              )}

              {/* Get Started */}
              <Link
                to="/contact"
                className="px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 bg-black text-white hover:bg-gray-800"
              >
                {isKm ? "ចាប់ផ្តើម" : "Get Started"}
              </Link>
            </div>

            {/* ── Mobile: Language selector (visible on top bar) ── */}
            <div className="lg:hidden relative">
              <button
                onClick={toggleLanguageDropdown}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 text-black hover:bg-[#f1f5f9]"
              >
                <img
                  src={currentLang === "en" ? enFlag : khFlag}
                  alt={currentLang === "en" ? "English" : "Khmer"}
                  className="w-4 h-3 rounded-sm"
                />
                <span>{currentLang === "en" ? "EN" : "KH"}</span>
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${languageDropdownActive ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {languageDropdownActive && (
                <div className="absolute right-0 mt-2 w-36 rounded-xl bg-white shadow-lg border border-gray-100 z-50">
                  <div className="py-1.5">
                    {[
                      { lang: "en", flag: enFlag, label: "English" },
                      { lang: "km", flag: khFlag, label: "Khmer" },
                    ].map(({ lang, flag, label }) => (
                      <button
                        key={lang}
                        onClick={() => changeLanguage(lang)}
                        className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm transition-colors duration-150 text-black ${
                          currentLang === lang
                            ? "bg-[#f1f5f9] font-medium"
                            : "hover:bg-[#f1f5f9]"
                        }`}
                      >
                        <img src={flag} alt={label} className="w-5 h-3.5 rounded-sm" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Mobile Menu ── */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            menuActive ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          } bg-white border-t border-gray-100`}
        >
          <div className="px-4 py-3 space-y-0.5">
            {/* Mobile CTA buttons */}
            <div className="flex gap-2">
              {adminName ? (
                <Link
                  to="/admin-panel"
                  onClick={() => setMenuActive(false)}
                  className="flex-1 py-2.5 text-center text-sm font-medium text-black border border-gray-200 rounded-full hover:bg-[#f1f5f9] transition-colors duration-150"
                >
                  {adminName}
                </Link>
              ) : (
                <button
                  onClick={openLogin}
                  className="flex-1 py-2.5 text-center text-sm font-medium text-black border border-gray-200 rounded-full hover:bg-[#f1f5f9] transition-colors duration-150"
                >
                  {isKm ? "ចូល" : "Log in"}
                </button>
              )}
              <Link
                to="/contact"
                onClick={() => setMenuActive(false)}
                className="flex-1 py-2.5 text-center text-sm font-semibold text-white bg-black rounded-full hover:bg-gray-800 transition-colors duration-150"
              >
                {isKm ? "ចាប់ផ្តើម" : "Get Started"}
              </Link>
            </div>
          </div>
        </div>

        <style>{`
          @keyframes navSlideDown {
            from { opacity: 0; transform: translateY(-20px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .nav-item {
            opacity: 0;
            animation: navSlideDown 1s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }
          .nav-item--1 { animation-delay: 0.1s; }
          .nav-item--2 { animation-delay: 0.35s; }
          .nav-item--3 { animation-delay: 0.6s; }
        `}</style>
      </nav>

      {/* ── Mobile Bottom Nav ── */}
      <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50">
        <div
          className="flex items-center justify-between gap-1 bg-white rounded-full px-2 py-2"
          style={{ boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}
        >
          {NAV_LINKS.map(({ label, to, icon: Icon }) => {
            const isActive = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-2 rounded-full transition-all duration-200 flex-shrink-0 ${
                  isActive
                    ? "bg-black text-white px-4 py-2.5"
                    : "text-black px-3 py-2.5"
                }`}
              >
                <Icon size={18} strokeWidth={2} />
                {isActive && <span className="text-sm font-semibold whitespace-nowrap">{label}</span>}
              </Link>
            );
          })}
          <button
            onClick={toggleMenu}
            className="flex items-center justify-center rounded-full text-black px-3 py-2.5 flex-shrink-0"
          >
            <Menu size={18} strokeWidth={2} />
          </button>
        </div>
      </div>

      {!isHomePage && <div className="h-0 md:h-0"></div>}

      {/* Login Modal */}
      <LoginModal
        isOpen={showLogin}
        onClose={() => setShowLogin(false)}
        onLogin={() => setShowLogin(false)}
      />
    </>
  );
}

export default Nav;