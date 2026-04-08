import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSettings } from "../../context/SettingsContext";
import enFlag from "../Images/en.png";
import khFlag from "../Images/kh.png";
import { FaCode, FaHeadset, FaUsers, FaChevronRight } from "react-icons/fa";
import LoginModal from "../LoginForm";

const useFontLoader = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    const checkFonts = async () => {
      try {
        await Promise.all([
          document.fonts.load("400 16px Montserrat"),
          document.fonts.load("400 16px Battambang"),
        ]);
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

const useLanguageFontSwitcher = () => {
  const { i18n } = useTranslation();
  useEffect(() => {
    const updateBodyClass = () => {
      const body = document.body;
      const html = document.documentElement;
      body.classList.remove("lang-en", "lang-km");
      html.classList.remove("lang-en", "lang-km");
      const langClass = `lang-${i18n.language}`;
      body.classList.add(langClass);
      html.classList.add(langClass);
      document.documentElement.style.setProperty(
        "--current-lang-font",
        i18n.language === "km" ? "var(--font-khmer)" : "var(--font-primary)",
      );
    };
    updateBodyClass();
    i18n.on("languageChanged", updateBodyClass);
    return () => i18n.off("languageChanged", updateBodyClass);
  }, [i18n]);
};

function Nav() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";
  const [showLogin, setShowLogin] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [pagesDropdownActive, setPagesDropdownActive] = useState(false);
  const [languageDropdownActive, setLanguageDropdownActive] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth > 768 && window.innerWidth <= 1024,
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState("en");
  const { settings, loading } = useSettings();

  const fontsLoaded = useFontLoader();
  useLanguageFontSwitcher();

  const safeTranslate = (key) => {
    try {
      const translation = t(key);
      if (typeof translation === "object") return key.split(".").pop();
      return translation;
    } catch (error) {
      return key.split(".").pop();
    }
  };

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
    setPagesDropdownActive(false);
    setLanguageDropdownActive(false);
  };

  const togglePagesDropdown = (e) => {
    if (!isMobile && !isTablet) return;
    e.preventDefault();
    setPagesDropdownActive(!pagesDropdownActive);
    setLanguageDropdownActive(false);
  };

  const toggleLanguageDropdown = (e) => {
    if (!isMobile && !isTablet) return;
    e.preventDefault();
    setLanguageDropdownActive(!languageDropdownActive);
    setPagesDropdownActive(false);
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
          <div className="flex justify-between items-center h-[52px] md:h-[56px] lg:h-[72px] mx-auto w-full lg:w-[88%] xl:w-[83%] 2xl:max-w-[1400px] [@media(min-width:1700px)]:max-w-[1500px]">

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
                  <div className="flex items-center justify-center h-7 w-7 rounded-full bg-gray-900 group-hover:scale-105 transition-transform duration-200">
                    <span className="text-white font-bold text-sm">
                      {settings?.companyName?.charAt(0) || "W"}
                    </span>
                  </div>
                )}
                <span className="text-sm sm:text-base lg:text-[15px] font-bold tracking-tight text-gray-900">
                  {settings?.companyName || "WV Support"}
                </span>
              </Link>
            </div>

            {/* ── Desktop Nav Links ── */}
            <div className="hidden lg:flex items-center gap-1 text-[14px] nav-item nav-item--2">
              {[
                { label: safeTranslate("home"), to: "/" },
                { label: safeTranslate("contact"), to: "/Contact" },
                { label: safeTranslate("servicesnav"), to: "/Services" },
                { label: safeTranslate("about"), to: "/Aboutus" },
              ].map(({ label, to }) => (
                <Link
                  key={to}
                  to={to}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 ${
                    location.pathname === to ? "text-gray-900" : ""
                  }`}
                >
                  {label}
                </Link>
              ))}

              {/* Pages Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-1 px-4 py-2 rounded-full font-medium transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
                  {safeTranslate("pages")}
                  <svg
                    className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className="absolute left-0 mt-2 w-72 origin-top-left rounded-2xl bg-white shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 translate-y-1 transition-all duration-200">
                  <div className="p-2">
                    {[
                      {
                        to: "/Project",
                        icon: FaCode,
                        label: safeTranslate("project"),
                        desc: "Innovative projects and cutting-edge solutions",
                      },
                      {
                        to: "/Support",
                        icon: FaHeadset,
                        label: safeTranslate("support"),
                        desc: "Help from our dedicated support team",
                      },
                      {
                        to: "/Whoweare",
                        icon: FaUsers,
                        label: safeTranslate("whoWeAre"),
                        desc: "Our mission, values, and passionate team",
                      },
                    ].map(({ to, icon: Icon, label, desc }) => (
                      <Link
                        key={to}
                        to={to}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-all duration-150 group/item"
                      >
                        <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0 group-hover/item:bg-gray-900 transition-colors duration-150">
                          <Icon className="w-4 h-4 text-gray-500 group-hover/item:text-white transition-colors duration-150" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 group-hover/item:text-gray-900">
                            {label}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">
                            {desc}
                          </p>
                        </div>
                        <FaChevronRight className="w-3 h-3 text-gray-300 group-hover/item:text-gray-600 group-hover/item:translate-x-0.5 transition-all duration-150 flex-shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right side: Language + Log in + Get Started ── */}
            <div className="hidden lg:flex items-center gap-2 nav-item nav-item--3">
              {/* Language selector */}
              <div className="relative group">
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50">
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
                        className={`flex items-center gap-2.5 w-full px-4 py-2.5 text-sm transition-colors duration-150 ${
                          currentLang === lang
                            ? "text-gray-900 bg-gray-50 font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
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

              {/* Log in — opens modal */}
              <button
                onClick={openLogin}
                className="px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              >
                {safeTranslate("login") || "Log in"}
              </button>

              {/* Get Started */}
              <Link
                to="/contact"
                className="px-5 py-2 text-sm font-semibold rounded-full transition-all duration-200 bg-gray-900 text-white hover:bg-gray-800"
              >
                {safeTranslate("Get Started") || "Get Started"}
              </Link>
            </div>

            {/* ── Mobile hamburger ── */}
            <div className="lg:hidden nav-item nav-item--2">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-full transition-colors duration-200 text-gray-700 hover:bg-gray-100"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  {menuActive ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
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
            {[
              { label: safeTranslate("home"), to: "/" },
              { label: safeTranslate("contact"), to: "/Contact" },
              { label: safeTranslate("servicesnav"), to: "/Services" },
              { label: safeTranslate("about"), to: "/Aboutus" },
            ].map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuActive(false)}
                className="block py-2.5 px-3 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
              >
                {label}
              </Link>
            ))}

            {/* Mobile Pages Dropdown */}
            <div>
              <button
                onClick={togglePagesDropdown}
                className="flex items-center justify-between w-full py-2.5 px-3 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150"
              >
                {safeTranslate("pages")}
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${pagesDropdownActive ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${pagesDropdownActive ? "max-h-60" : "max-h-0"}`}
              >
                <div className="pl-3 pt-1 space-y-0.5">
                  {[
                    { to: "/Project", label: safeTranslate("project") },
                    { to: "/Support", label: safeTranslate("support") },
                    { to: "/Whoweare", label: safeTranslate("whoWeAre") },
                  ].map(({ to, label }) => (
                    <Link
                      key={to}
                      to={to}
                      onClick={() => setMenuActive(false)}
                      className="block py-2.5 px-3 rounded-full text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Language Dropdown */}
            <div>
              <button
                onClick={toggleLanguageDropdown}
                className="flex items-center justify-between w-full py-2.5 px-3 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-150"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={currentLang === "en" ? enFlag : khFlag}
                    alt=""
                    className="w-5 h-3.5 rounded-sm"
                  />
                  {safeTranslate("language")}
                </div>
                <svg
                  className={`h-4 w-4 transition-transform duration-200 ${languageDropdownActive ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-200 ${languageDropdownActive ? "max-h-32" : "max-h-0"}`}
              >
                <div className="pl-3 pt-1 space-y-0.5">
                  {[
                    { lang: "en", flag: enFlag, label: "English" },
                    { lang: "km", flag: khFlag, label: "Khmer" },
                  ].map(({ lang, flag, label }) => (
                    <button
                      key={lang}
                      onClick={() => changeLanguage(lang)}
                      className="flex items-center gap-2.5 w-full py-2.5 px-3 rounded-full text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
                    >
                      <img src={flag} alt={label} className="w-5 h-3.5 rounded-sm" />
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile CTA buttons */}
            <div className="flex gap-2 pt-3 border-t border-gray-100 mt-2">
              <button
                onClick={openLogin}
                className="flex-1 py-2.5 text-center text-sm font-medium text-gray-700 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors duration-150"
              >
                {safeTranslate("login") || "Log in"}
              </button>
              <Link
                to="/contact"
                onClick={() => setMenuActive(false)}
                className="flex-1 py-2.5 text-center text-sm font-semibold text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors duration-150"
              >
                {safeTranslate("Get Started") || "Get Started"}
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