import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSettings } from "./context/SettingsContext";
import enFlag from "./Components/Images/en.png";
import khFlag from "./Components/Images/kh.png";
import Support from "./Components/Images/supportm.jpg";
import Projects from "./Components/Images/projectsm.jpg";
import Who from "./Components/Images/whowearem.jpg";

// Font loading optimization hook
const useFontLoader = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Check if fonts are loaded to prevent FOUT (Flash of Unstyled Text)
    const checkFonts = async () => {
      try {
        await Promise.all([
          document.fonts.load("400 16px Montserrat"),
          document.fonts.load("400 16px Battambang"),
        ]);
        setFontsLoaded(true);
      } catch (error) {
        console.warn("Font loading failed:", error);
        // Fallback: assume fonts are loaded after timeout
        setTimeout(() => setFontsLoaded(true), 1000);
      }
    };

    // Check if Font Loading API is supported
    if (document.fonts && document.fonts.load) {
      checkFonts();
    } else {
      // Fallback for browsers without Font Loading API
      setTimeout(() => setFontsLoaded(true), 500);
    }
  }, []);

  return fontsLoaded;
};

// Language font switcher hook
const useLanguageFontSwitcher = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const updateBodyClass = () => {
      const body = document.body;
      const html = document.documentElement;

      // Remove existing language classes
      body.classList.remove("lang-en", "lang-km");
      html.classList.remove("lang-en", "lang-km");

      // Add new language class based on current language
      const langClass = `lang-${i18n.language}`;
      body.classList.add(langClass);
      html.classList.add(langClass);

      // Update CSS custom properties for dynamic access
      document.documentElement.style.setProperty(
        "--current-lang-font",
        i18n.language === "km" ? "var(--font-khmer)" : "var(--font-primary)"
      );
    };

    // Update on initial load
    updateBodyClass();

    // Listen for language changes
    i18n.on("languageChanged", updateBodyClass);

    // Cleanup listener
    return () => {
      i18n.off("languageChanged", updateBodyClass);
    };
  }, [i18n]);
};

// Font loading optimization hook
const useFontLoader = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    // Check if fonts are loaded to prevent FOUT (Flash of Unstyled Text)
    const checkFonts = async () => {
      try {
        await Promise.all([
          document.fonts.load('400 16px Montserrat'),
          document.fonts.load('400 16px Battambang')
        ]);
        setFontsLoaded(true);
      } catch (error) {
        console.warn('Font loading failed:', error);
        // Fallback: assume fonts are loaded after timeout
        setTimeout(() => setFontsLoaded(true), 1000);
      }
    };

    // Check if Font Loading API is supported
    if (document.fonts && document.fonts.load) {
      checkFonts();
    } else {
      // Fallback for browsers without Font Loading API
      setTimeout(() => setFontsLoaded(true), 500);
    }
  }, []);

  return fontsLoaded;
};

// Language font switcher hook
const useLanguageFontSwitcher = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    const updateBodyClass = () => {
      const body = document.body;
      const html = document.documentElement;
      
      // Remove existing language classes
      body.classList.remove('lang-en', 'lang-km');
      html.classList.remove('lang-en', 'lang-km');
      
      // Add new language class based on current language
      const langClass = `lang-${i18n.language}`;
      body.classList.add(langClass);
      html.classList.add(langClass);
      
      // Update CSS custom properties for dynamic access
      document.documentElement.style.setProperty(
        '--current-lang-font',
        i18n.language === 'km' ? 'var(--font-khmer)' : 'var(--font-primary)'
      );
    };

    // Update on initial load
    updateBodyClass();

    // Listen for language changes
    i18n.on('languageChanged', updateBodyClass);

    // Cleanup listener
    return () => {
      i18n.off('languageChanged', updateBodyClass);
    };
  }, [i18n]);
};

function Nav() {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const [menuActive, setMenuActive] = useState(false);
  const [pagesDropdownActive, setPagesDropdownActive] = useState(false);
  const [languageDropdownActive, setLanguageDropdownActive] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isTablet, setIsTablet] = useState(
    window.innerWidth > 768 && window.innerWidth <= 1024
  );
  const [isScrolled, setIsScrolled] = useState(false);
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState("en");
  const { settings, loading } = useSettings();

  // Initialize font hooks
  const fontsLoaded = useFontLoader();
  useLanguageFontSwitcher();

  // Safe translation function that handles nested objects
  const safeTranslate = (key) => {
    try {
      const translation = t(key);
      if (typeof translation === 'object') {
        console.warn(`Translation for "${key}" is an object, using key as fallback`);
        return key.split('.').pop(); // Return the last part of the key as fallback
      if (typeof translation === "object") {
        console.warn(
          `Translation for "${key}" is an object, using key as fallback`
        );
        return key.split(".").pop(); // Return the last part of the key as fallback
      }
      return translation;
    } catch (error) {
      console.warn(`Translation error for "${key}":`, error);
      return key.split('.').pop(); // Return the last part of the key as fallback
      return key.split(".").pop(); // Return the last part of the key as fallback
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (isHomePage) {
        setIsScrolled(window.scrollY > 50);
      }
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

    // Initialize scroll state
    handleScroll();
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [i18n, isHomePage]);

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
    // Font switching will happen automatically via useLanguageFontSwitcher hook
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
    setCurrentLang(lang);
    setLanguageDropdownActive(false);
    if (menuActive) setMenuActive(false);
  };

  if (loading) {
    return (
      <>
        <nav
          className={`w-full z-50 bg-[#0f8abe] shadow-md ${
            isHomePage ? "fixed" : "sticky top-0"
          } ${fontsLoaded ? 'font-loaded' : 'font-loading'}`}
          } ${fontsLoaded ? "font-loaded" : "font-loading"}`}
        >
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-2 animate-pulse">
              <div className="w-10 h-10 bg-white/30 rounded-full"></div>
              <div className="w-32 h-4 bg-white/30 rounded"></div>
            </div>
            <div className="w-8 h-8 bg-white/30 rounded"></div>
          </div>
        </nav>
        {/* Spacer for non-home pages */}
        {!isHomePage && <div className="h-16 md:h-20"></div>}
      </>
    );
  }

  // Determine navbar positioning and styling based on page
  const getNavbarClasses = () => {
    const baseClasses = `${fontsLoaded ? 'font-loaded' : 'font-loading'}`;
    const baseClasses = `${fontsLoaded ? "font-loaded" : "font-loading"}`;
    if (isHomePage) {
      return `fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-[#0f8abe] shadow-md" : "bg-transparent shadow-none"
      } ${baseClasses}`;
    } else {
      return `sticky top-0 w-full z-50 bg-[#0f8abe] shadow-md ${baseClasses}`;
    }
  };

  const textColor = isHomePage && !isScrolled ? "text-white" : "text-white";
  const hoverTextColor = "hover:text-blue-100";
  const mobileMenuBg =
    isHomePage && !isScrolled ? "bg-[#0f8abe]/90" : "bg-[#0f8abe]";

  return (
    <>
      <nav className={getNavbarClasses()}>
        <div className="w-full px-4 sm:px-6 lg:px-0">
          <div className="flex justify-between items-center h-[52px] md:h-[56px] lg:h-[82px] mx-auto w-full lg:w-[88%] xl:w-[83%] 2xl:max-w-[1400px] [@media(min-width:1700px)]:max-w-[1500px]">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <Link
                to="/"
                className="flex items-center group"
                onClick={() => setMenuActive(false)}
              >
                {settings?.logo ? (
                  <img
                    src={settings.logo}
                    alt={settings.companyName || "Company Logo"}
                    className={`h-5 sm:h-6 md:h-7 lg:h-8 xl:h-7 transition-all duration-300 ${
                      isHomePage && !isScrolled ? "opacity-90" : "opacity-100"
                    } group-hover:scale-105`}
                  />
                ) : (
                  <div
                    className={`flex items-center justify-center h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 lg:h-11 lg:w-11 rounded-full ${
                      isHomePage && !isScrolled ? "bg-white" : "bg-white"
                    } group-hover:scale-105 transition-transform duration-300`}
                  >
                    <span
                      className={`${
                        isHomePage && !isScrolled
                          ? "text-[#0f8abe]"
                          : "text-[#0f8abe]"
                      } font-bold text-sm sm:text-base md:text-lg lg:text-xl`}
                    >
                      {settings?.companyName?.charAt(0) || ""}
                    </span>
                  </div>
                )}
                <h3
                  className={`ml-2 text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-semibold ${textColor} transition-colors duration-300`}
                >
                  {settings?.companyName || "WV Support Services Cambodia"}
                </h3>
              </Link>
            </div>

            {/* Desktop Menu - Hidden on tablet and mobile */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-1 text-base lg:text-lg xl:text-lg">
              <Link
                to="/"
                className={`font-medium transition-all duration-300 ${textColor} hover:text-white/90 px-3 py-2 rounded-xl hover:bg-white/10`}
              >
                {safeTranslate("home")}
              </Link>
              <Link
                to="/Contact"
                className={`font-medium transition-all duration-300 ${textColor} hover:text-white/90 px-3 py-2 rounded-xl hover:bg-white/10`}
              >
                {safeTranslate("contact")}
              </Link>
              <Link
                to="/Services"
                className={`font-medium transition-all duration-300 ${textColor} hover:text-white/90 px-3 py-2 rounded-xl hover:bg-white/10`}
              >
                {safeTranslate("servicesnav")}
              </Link>
              <Link
                to="/Aboutus"
                className={`font-medium transition-all duration-300 ${textColor} hover:text-white/90 px-3 py-2 rounded-xl hover:bg-white/10`}
              >
                {safeTranslate("about")}
              </Link>

              {/* Pages Dropdown - Modern Design */}
              <div className="relative group">
                <button
                  className={`relative flex items-center font-medium transition-all duration-300 ${textColor} hover:text-white/90 px-3 py-2 rounded-xl hover:bg-white/10 no-underline hover:no-underline focus:no-underline`}
                >
                  {safeTranslate("pages")}
                  <svg
                    className="ml-1 h-4 w-4 transition-all duration-300 group-hover:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                <div className="absolute right-0 mt-3 w-56 origin-top-right rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 group-hover:scale-100 scale-95">
                  <div className="py-3">
                    <Link
                      to="/Project"
                      className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#0f8abe]/10 hover:to-[#0f8abe]/5 hover:text-[#0f8abe] transition-all duration-300 group/item"
                    >
                      <div className="w-2 h-2 bg-[#0f8abe]/30 rounded-full mr-3 transition-all duration-300 group-hover/item:bg-[#0f8abe] group-hover/item:scale-125"></div>
                      <span className="font-medium">{safeTranslate("project")}</span>
                    </Link>
                    <Link
                      to="/Support"
                      className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#0f8abe]/10 hover:to-[#0f8abe]/5 hover:text-[#0f8abe] transition-all duration-300 group/item"
                    >
                      <div className="w-2 h-2 bg-[#0f8abe]/30 rounded-full mr-3 transition-all duration-300 group-hover/item:bg-[#0f8abe] group-hover/item:scale-125"></div>
                      <span className="font-medium">{safeTranslate("support")}</span>
                    </Link>
                    <Link
                      to="/Whoweare"
                      className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#0f8abe]/10 hover:to-[#0f8abe]/5 hover:text-[#0f8abe] transition-all duration-300 group/item"
                    >
                      <div className="w-2 h-2 bg-[#0f8abe]/30 rounded-full mr-3 transition-all duration-300 group-hover/item:bg-[#0f8abe] group-hover/item:scale-125"></div>
                      <span className="font-medium">{safeTranslate("whoWeAre")}</span>
                    </Link>
                <div className="absolute right-0 mt-2 w-[64rem] origin-top-right rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 group-hover:scale-100 scale-95">
                  <div className="p-4">
                    <div className="flex flex-row flex-wrap justify-between gap-1">
                      {/* Project */}
                      <Link
                        to="/Project"
                        className="flex flex-col items-center text-center p-3 rounded-xl hover:bg-gradient-to-b hover:from-[#0f8abe]/10 hover:to-[#0f8abe]/5 hover:shadow-md transition-all duration-300 group/item border border-transparent hover:border-[#0f8abe]/20 flex-1 min-w-[20rem] max-w-[22rem]"
                      >
                        <div className="space-y-1 mb-2">
                          <h3 className="font-semibold text-base text-gray-900 group-hover/item:text-[#0f8abe] transition-colors duration-300">
                            {safeTranslate("project")}
                          </h3>
                          <p className="text-xs text-gray-600 leading-snug group-hover/item:text-gray-700 transition-colors duration-300">
                            Explore our innovative projects and cutting-edge
                            solutions
                          </p>
                        </div>

                        <div className="w-full h-48 rounded-xl overflow-hidden transition-transform duration-300 group-hover/item:scale-102 group-hover/item:shadow-lg">
                          <img
                            src={Projects}
                            alt="Project"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                          />
                        </div>
                      </Link>

                      {/* Support */}
                      <Link
                        to="/Support"
                        className="flex flex-col items-center text-center p-3 rounded-xl hover:bg-gradient-to-b hover:from-[#0f8abe]/10 hover:to-[#0f8abe]/5 hover:shadow-md transition-all duration-300 group/item border border-transparent hover:border-[#0f8abe]/20 flex-1 min-w-[20rem] max-w-[22rem]"
                      >
                        <div className="space-y-1 mb-2">
                          <h3 className="font-semibold text-base text-gray-900 group-hover/item:text-[#0f8abe] transition-colors duration-300">
                            {safeTranslate("support")}
                          </h3>
                          <p className="text-xs text-gray-600 leading-snug group-hover/item:text-gray-700 transition-colors duration-300">
                            Get help and assistance from our dedicated support
                            team
                          </p>
                        </div>

                        <div className="w-full h-48 rounded-xl overflow-hidden transition-transform duration-300 group-hover/item:scale-102 group-hover/item:shadow-lg">
                          <img
                            src={Support}
                            alt="Support"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                          />
                        </div>
                      </Link>

                      {/* Who We Are */}
                      <Link
                        to="/Whoweare"
                        className="flex flex-col items-center text-center p-3 rounded-xl hover:bg-gradient-to-b hover:from-[#0f8abe]/10 hover:to-[#0f8abe]/5 hover:shadow-md transition-all duration-300 group/item border border-transparent hover:border-[#0f8abe]/20 flex-1 min-w-[20rem] max-w-[22rem]"
                      >
                        <div className="space-y-1 mb-2">
                          <h3 className="font-semibold text-base text-gray-900 group-hover/item:text-[#0f8abe] transition-colors duration-300">
                            {safeTranslate("whoWeAre")}
                          </h3>
                          <p className="text-xs text-gray-600 leading-snug group-hover/item:text-gray-700 transition-colors duration-300">
                            Learn about our mission, values, and passionate team
                            work
                          </p>
                        </div>

                        <div className="w-full h-48 rounded-xl overflow-hidden transition-transform duration-300 group-hover/item:scale-102 group-hover/item:shadow-lg">
                          <img
                            src={Who}
                            alt="Who We Are"
                            className="w-full h-full object-cover transition-transform duration-300 group-hover/item:scale-105"
                          />
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Language Dropdown - Modern Design */}
              <div className="relative group ml-2">
                <button
                  className={`flex items-center font-medium transition-all duration-300 ${textColor} hover:text-white/90 px-4 py-2 rounded-xl bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/20`}
                >
                  {currentLang === "en" ? (
                    <img
                      src={enFlag}
                      alt="English"
                      className="w-5 h-3.5 mr-2 rounded-sm"
                    />
                  ) : (
                    <img
                      src={khFlag}
                      alt="Khmer"
                      className="w-5 h-3.5 mr-2 rounded-sm"
                    />
                  )}
                  <span className="mr-2 font-semibold">
                    {currentLang === "en" ? "EN" : "KH"}
                  </span>
                  <svg
                    className="h-4 w-4 transition-all duration-300 group-hover:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div className="absolute right-0 mt-3 w-48 origin-top-right rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-white/20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 group-hover:scale-100 scale-95">
                  <div className="py-3">
                    <button
                      onClick={() => changeLanguage("en")}
                      className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#0f8abe]/10 hover:to-[#0f8abe]/5 hover:text-[#0f8abe] w-full text-left transition-all duration-300 group/item"
                    >
                      <img
                        src={enFlag}
                        alt="English"
                        className="w-6 h-4 mr-3 rounded-sm shadow-sm"
                      />
                      <span className="font-medium">English</span>
                    </button>
                    <button
                      onClick={() => changeLanguage("km")}
                      className="flex items-center px-5 py-3 text-sm text-gray-700 hover:bg-gradient-to-r hover:from-[#0f8abe]/10 hover:to-[#0f8abe]/5 hover:text-[#0f8abe] w-full text-left transition-all duration-300 group/item"
                    >
                      <img
                        src={khFlag}
                        alt="Khmer"
                        className="w-6 h-4 mr-3 rounded-sm shadow-sm"
                      />
                      <span className="font-medium">Khmer</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile & Tablet Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className={`p-2 rounded-md focus:outline-none ${textColor} ${hoverTextColor}`}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {menuActive ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile & Tablet Menu */}
        <div
          className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            menuActive ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
          } ${mobileMenuBg}`}
        >
          <div className="px-1 pb-4 w-full lg:w-4/5 mx-auto">
            <div
              className={`flex flex-col space-y-0 ${
                isTablet ? "text-xl" : "text-lg"
              }`}
            >
              <Link
                to="/"
                onClick={() => setMenuActive(false)}
                className={`py-3 px-4 rounded-md transition-colors ${
                  isHomePage && !isScrolled
                    ? "text-white hover:bg-white/20"
                    : "text-white hover:bg-white/20"
                }`}
              >
                {safeTranslate("home")}
              </Link>
              <Link
                to="/Contact"
                onClick={() => setMenuActive(false)}
                className={`py-3 px-4 rounded-md transition-colors ${
                  isHomePage && !isScrolled
                    ? "text-white hover:bg-white/20"
                    : "text-white hover:bg-white/20"
                }`}
              >
                {safeTranslate("contact")}
              </Link>
              <Link
                to="/Services"
                onClick={() => setMenuActive(false)}
                className={`py-3 px-4 rounded-md transition-colors ${
                  isHomePage && !isScrolled
                    ? "text-white hover:bg-white/20"
                    : "text-white hover:bg-white/20"
                }`}
              >
                {safeTranslate("servicesnav")}
              </Link>
              <Link
                to="/Aboutus"
                onClick={() => setMenuActive(false)}
                className={`py-3 px-4 rounded-md transition-colors ${
                  isHomePage && !isScrolled
                    ? "text-white hover:bg-white/20"
                    : "text-white hover:bg-white/20"
                }`}
              >
                {safeTranslate("about")}
              </Link>

              {/* Mobile & Tablet Pages Dropdown */}
              <div className="relative">
                <button
                  onClick={togglePagesDropdown}
                  className={`flex items-center justify-between w-full py-3 px-4 rounded-md transition-colors ${
                    isHomePage && !isScrolled
                      ? "text-white hover:bg-white/20"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  {safeTranslate("pages")}
                  <svg
                    className={`h-5 w-5 transform transition-transform ${
                      pagesDropdownActive ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    pagesDropdownActive ? "max-h-60" : "max-h-0"
                  }`}
                >
                  <div
                    className={`pl-4 py-1 space-y-1 ${
                      isTablet ? "text-lg" : "text-base"
                    }`}
                  >
                    <Link
                      to="/Project"
                      onClick={() => setMenuActive(false)}
                      className={`block py-3 px-4 rounded-md transition-colors ${
                        isHomePage && !isScrolled
                          ? "text-white hover:bg-white/20"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      {safeTranslate("project")}
                    </Link>
                    <Link
                      to="/Support"
                      onClick={() => setMenuActive(false)}
                      className={`block py-3 px-4 rounded-md transition-colors ${
                        isHomePage && !isScrolled
                          ? "text-white hover:bg-white/20"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      {safeTranslate("support")}
                    </Link>
                    <Link
                      to="/Whoweare"
                      onClick={() => setMenuActive(false)}
                      className={`block py-3 px-4 rounded-md transition-colors ${
                        isHomePage && !isScrolled
                          ? "text-white hover:bg-white/20"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      {safeTranslate("whoWeAre")}
                    </Link>
                  </div>
                </div>
              </div>

              {/* Mobile & Tablet Language Dropdown */}
              <div className="relative">
                <button
                  onClick={toggleLanguageDropdown}
                  className={`flex items-center justify-between w-full py-3 px-4 rounded-md transition-colors ${
                    isHomePage && !isScrolled
                      ? "text-white hover:bg-white/20"
                      : "text-white hover:bg-white/20"
                  }`}
                >
                  <div className="flex items-center">
                    {currentLang === "en" ? (
                      <img
                        src={enFlag}
                        alt="English"
                        className={`${isTablet ? "w-6 h-4" : "w-5 h-3.5"} mr-2`}
                      />
                    ) : (
                      <img
                        src={khFlag}
                        alt="Khmer"
                        className={`${isTablet ? "w-6 h-4" : "w-5 h-3.5"} mr-2`}
                      />
                    )}
                    <span>{safeTranslate("language")}</span>
                  </div>
                  <svg
                    className={`h-5 w-5 transform transition-transform ${
                      languageDropdownActive ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    languageDropdownActive ? "max-h-40" : "max-h-0"
                  }`}
                >
                  <div
                    className={`pl-4 py-1 space-y-1 ${
                      isTablet ? "text-lg" : "text-base"
                    }`}
                  >
                    <button
                      onClick={() => changeLanguage("en")}
                      className={`flex items-center w-full py-3 px-4 rounded-md transition-colors ${
                        isHomePage && !isScrolled
                          ? "text-white hover:bg-white/20"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      <img
                        src={enFlag}
                        alt="English"
                        className={`${isTablet ? "w-6 h-4" : "w-5 h-3.5"} mr-2`}
                      />
                      English
                    </button>
                    <button
                      onClick={() => changeLanguage("km")}
                      className={`flex items-center w-full py-3 px-4 rounded-md transition-colors ${
                        isHomePage && !isScrolled
                          ? "text-white hover:bg-white/20"
                          : "text-white hover:bg-white/20"
                      }`}
                    >
                      <img
                        src={khFlag}
                        alt="Khmer"
                        className={`${isTablet ? "w-6 h-4" : "w-5 h-3.5"} mr-2`}
                      />
                      Khmer
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer div for non-home pages to prevent content overlap */}
      {!isHomePage && <div className="h-0 md:h-0"></div>}
    </>
  );
}

export default Nav;
