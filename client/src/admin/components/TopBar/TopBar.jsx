import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiBell,
  FiMenu,
  FiX,
  FiChevronDown,
  FiSun,
  FiMoon,
  FiGlobe,
} from "react-icons/fi";
import ProfileDropdown from "./ProfileDropdown"; // Adjust the path as needed
import NotificationsDropdown from "./NotificationsDropdown";
import blueLogo from "../../../Components/Images/bluelogo.png";
import tranlogo from "../../../Components/Images/tranlogo.png";

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

// Everything the top-bar search can jump to: admin pages, CMS pages and each section editor.
// label + where it lives (group) + route + extra words people might type.
const CMS = "/admin-panel/frontend";
const SEARCHABLE_SECTIONS = [
  // Admin pages
  { label: "Dashboard", group: "Admin", route: "/admin-panel/dashboard", keywords: ["analytics", "overview", "stats", "views", "visitors"] },
  { label: "Inbox", group: "Admin", route: "/admin-panel/inbox", keywords: ["messages", "email", "live chat", "chat", "contact form", "replies"] },
  { label: "Subscribers", group: "Admin", route: "/admin-panel/subscribers", keywords: ["newsletter", "email list", "signups"] },
  { label: "Content", group: "Admin", route: CMS, keywords: ["cms", "pages", "frontend", "website"] },
  { label: "Users", group: "Admin", route: "/admin-panel/users", keywords: ["accounts", "team", "roles", "admin", "support", "password"] },
  { label: "Settings", group: "Admin", route: "/admin-panel/settings", keywords: ["company", "config"] },
  { label: "Logo & company details", group: "Settings", route: "/admin-panel/settings", keywords: ["logo", "company name", "phone", "email address", "address"] },
  { label: "Business hours", group: "Settings", route: "/admin-panel/settings", keywords: ["opening hours", "hours", "open", "times"] },
  { label: "Map", group: "Settings", route: "/admin-panel/settings", keywords: ["google maps", "embed", "location", "find us"] },

  // Home page
  { label: "Home page", group: "Content", route: `${CMS}/home`, keywords: ["homepage", "landing"] },
  { label: "Hero Banner", group: "Home", route: `${CMS}/home/hero`, keywords: ["hero", "banner", "title", "testimonial", "highlights", "person image"] },
  { label: "Partner Logos", group: "Home", route: `${CMS}/home/partners`, keywords: ["partners", "logos", "brands"] },
  { label: "Services", group: "Home", route: `${CMS}/home/services`, keywords: ["service cards", "our services"] },
  { label: "About", group: "Home", route: `${CMS}/home/about`, keywords: ["retailmanager", "feature cards", "bento"] },
  { label: "Tech", group: "Home", route: `${CMS}/home/tech`, keywords: ["rm mobile", "devices", "avatars"] },
  { label: "Work", group: "Home", route: `${CMS}/home/work`, keywords: ["our base", "tools", "badges", "service cards"] },
  { label: "Gallery", group: "Home", route: `${CMS}/home/gallery`, keywords: ["photos", "images"] },
  { label: "Newsletter", group: "Home", route: `${CMS}/home/newsletter`, keywords: ["signup", "subscribe", "mockup"] },

  // Other pages
  { label: "About Us page", group: "Content", route: `${CMS}/about/about-page`, keywords: ["about us", "values", "facts"] },
  { label: "Services page", group: "Content", route: `${CMS}/services/services-page`, keywords: ["service panels", "other products", "aaapos products"] },
  { label: "FAQ", group: "Content", route: `${CMS}/faq/faq`, keywords: ["questions", "answers", "faqs"] },
  { label: "Careers", group: "Content", route: `${CMS}/careers/careers-page`, keywords: ["jobs", "openings", "roles", "resume", "hiring"] },
  { label: "Terms & Conditions", group: "Content", route: `${CMS}/legal/legal`, keywords: ["legal", "terms", "privacy", "policy"] },

  // Site-wide
  { label: "Navbar", group: "Site-wide", route: `${CMS}/global/nav`, keywords: ["menu", "navigation", "links", "language", "flags", "get started", "log in"] },
  { label: "News Popup", group: "Site-wide", route: `${CMS}/global/news-popup`, keywords: ["popup", "announcement", "poster", "promotion"] },
  { label: "Footer", group: "Site-wide", route: `${CMS}/global/footer`, keywords: ["social links", "facebook", "youtube", "footer links"] },
];

// Profile for the top bar — the account's name, or the email's first part when no name is set
// (admin@wvsupport.com → "Admin")
const toProfile = ({ name = "", email = "", role, createdAt } = {}) => {
  const local = email.split("@")[0] || "Admin";
  return {
    name: name || local.charAt(0).toUpperCase() + local.slice(1),
    email,
    avatar: blueLogo,
    role: role === "support" ? "Support" : "Admin", // matches the role names on the Users page
    memberSince: createdAt
      ? new Date(createdAt).toLocaleDateString("en-AU", { month: "short", year: "numeric" })
      : null,
  };
};

// Instant first paint from the login token, before the server answers
const profileFromToken = () => {
  try {
    const payload = localStorage.getItem("adminToken").split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return toProfile(JSON.parse(atob(payload)));
  } catch {
    return toProfile();
  }
};

const TopBar = ({
  onLogout = () => {},
  sidebarOpen = true,
  setSidebarOpen = () => {},
  darkMode = false,
  setDarkMode = () => {},
  notifications = [],
  onOpenNotification = () => {},
  onMarkNotificationRead = () => {},
  onMarkAllNotificationsRead = () => {},
}) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchWrapRef = useRef(null);
  const mobileSearchWrapRef = useRef(null);
  const [profileData, setProfileData] = useState(profileFromToken);

  // Load the logged-in admin from the server (on open, and after you edit your own account).
  // A rejected token means the session is over.
  useEffect(() => {
    const loadProfile = () =>
      fetch(`${API_BASE_URL}/api/admin/me`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
      })
        .then((res) => {
          if (res.status === 401) {
            onLogout();
            return null;
          }
          return res.ok ? res.json() : null;
        })
        .then((data) => data?.user && setProfileData(toProfile(data.user)))
        .catch((err) => console.error("Failed to load admin profile:", err));

    loadProfile();
    window.addEventListener("admin-profile-updated", loadProfile);
    return () => window.removeEventListener("admin-profile-updated", loadProfile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Match the query against name, group and keywords; names starting with the query come first
  const searchResults = (() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return [];
    const score = (section) => {
      const label = section.label.toLowerCase();
      if (label.startsWith(query)) return 0;
      if (label.includes(query)) return 1;
      if (section.keywords.some((kw) => kw.toLowerCase().includes(query))) return 2;
      if (section.group.toLowerCase().includes(query)) return 3;
      return -1;
    };
    return SEARCHABLE_SECTIONS.map((section) => ({ section, rank: score(section) }))
      .filter(({ rank }) => rank >= 0)
      .sort((a, b) => a.rank - b.rank)
      .map(({ section }) => section);
  })();

  // Close the results dropdown when clicking outside either search box
  useEffect(() => {
    const handleClickOutside = (e) => {
      const inDesktop = searchWrapRef.current && searchWrapRef.current.contains(e.target);
      const inMobile = mobileSearchWrapRef.current && mobileSearchWrapRef.current.contains(e.target);
      if (!inDesktop && !inMobile) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToSection = (route) => {
    navigate(route);
    setSearchValue("");
    setShowSearchResults(false);
    setShowMobileSearch(false);
  };

  const handleSidebarToggle = () => {
    if (setSidebarOpen) {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowProfile(false);
  };

  const toggleProfile = () => {
    setShowProfile(!showProfile);
    setShowNotifications(false);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      goToSection(searchResults[0].route);
    }
  };

  const toggleDarkMode = () => {
    if (setDarkMode) {
      setDarkMode(!darkMode);
    }
  };

  // Shared results dropdown UI
  const renderResultsDropdown = () => {
    if (!showSearchResults || !searchValue.trim()) return null;
    return (
      <div
        className={`absolute left-0 right-0 top-full mt-2 rounded-xl shadow-lg overflow-hidden z-50 ${
          darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-200"
        }`}
      >
        {searchResults.length > 0 ? (
          <ul className="max-h-64 overflow-y-auto py-1">
            {searchResults.map((section) => (
              <li key={`${section.group}-${section.label}`}>
                <button
                  type="button"
                  onClick={() => goToSection(section.route)}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors ${
                    darkMode
                      ? "text-gray-200 hover:bg-gray-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <FiSearch className="h-3.5 w-3.5 flex-shrink-0 text-sky-400" />
                  <span className="flex-1 truncate">{section.label}</span>
                  <span className={`text-xs flex-shrink-0 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                    {section.group}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className={`px-4 py-3 text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            No matching sections for "{searchValue}"
          </div>
        )}
      </div>
    );
  };

  return (
    <header
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } sticky top-0 z-50 transition-all duration-300 w-full`}
    >
      <div className="flex items-center justify-between px-4 py-5 lg:px-6">
        {/* Left Section - Logo & Sidebar Toggle */}
        <div className="flex items-center space-x-4">
          {/* Logo and Dashboard Title */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-10 w-10 sm:h-10 sm:w-10 rounded-2xl">
                <img
                  src={tranlogo}
                  alt="Admin"
                  className="h-full w-full object-contain"
                />
              </div>
            </div>

            <h1 className="text-lg sm:text-3xl font-bold bg-clip-text text-sky-400 hidden md:block">
              Admin Dashboard
            </h1>
          </div>

          {/* Sidebar Toggle Button */}
          <button
            onClick={handleSidebarToggle}
            className={`p-1.5 sm:p-2.5 rounded-xl ${
              darkMode
                ? "text-sky-300 bg-gray-700 hover:bg-gray-600"
                : "text-sky-300 bg-gray-100 hover:bg-gray-200"
            } transition-all duration-200`}
          >
            <FiMenu className="h-5 w-5 sm:h-5 sm:w-5 transition-transform duration-200" />
          </button>
        </div>

        {/* Right Section - Actions & Profile */}
        <div className="flex items-center space-x-1 sm:space-x-2">
          {/* Mobile Search - Full width when active */}
          {showMobileSearch && (
            <div
              ref={mobileSearchWrapRef}
              className="absolute left-0 top-0 w-full px-4 py-3 bg-inherit z-50 md:hidden"
            >
              <form
                onSubmit={handleSearchSubmit}
                className="relative w-full flex items-center"
              >
                <button
                  type="button"
                  onClick={() => setShowMobileSearch(false)}
                  className={`p-2 rounded-full mr-2 ${
                    darkMode
                      ? "text-gray-300 hover:bg-gray-700"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  <FiX className="h-5 w-5" />
                </button>
                <div className="absolute inset-y-0 left-12 pl-2 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchValue}
                  onChange={(e) => {
                    setSearchValue(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  className={`block w-full pl-10 pr-4 py-2 border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 placeholder-gray-400 focus:bg-gray-700"
                      : "bg-gray-50 border-gray-200 placeholder-gray-400 focus:bg-white"
                  } rounded-full leading-5 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:border-transparent transition-all duration-200 text-sm`}
                  placeholder="Search dashboard"
                  autoFocus
                />
              </form>
              {renderResultsDropdown()}
            </div>
          )}

          {/* Desktop Search Bar */}
          <div ref={searchWrapRef} className="relative w-full max-w-md group hidden md:block">
            <form onSubmit={handleSearchSubmit}>
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <FiSearch
                  className={`${
                    darkMode
                      ? "text-sky-400 group-focus-within:text-sky-400"
                      : "text-sky-400 group-focus-within:text-sky-500"
                  } transition-colors duration-200`}
                />
              </div>
              <input
                type="text"
                value={searchValue}
                onChange={(e) => {
                  setSearchValue(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className={`block w-full pl-12 pr-4 py-2.5 border${
                  darkMode
                    ? "text-sky-400 bg-gray-700 hover:bg-gray-600"
                    : "text-sky-400 bg-gray-100 hover:bg-gray-200"
                } rounded-xl leading-5 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent transition-all duration-200 text-sm`}
                placeholder="Search dashboard"
              />
            </form>
            {renderResultsDropdown()}
          </div>

          {/* Mobile Search Button */}
          <button
            onClick={() => setShowMobileSearch(true)}
            className={`md:hidden p-1.5 rounded-xl ${
              darkMode
                ? "text-sky-400 bg-gray-700 hover:bg-gray-600"
                : "text-sky-400 bg-gray-100 hover:bg-gray-200"
            } transition-all duration-200`}
          >
            <FiSearch className="h-5 w-5" />
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={toggleNotifications}
              className={`relative p-1.5 sm:p-2.5 rounded-xl ${
                darkMode
                  ? "text-sky-400 bg-gray-700 hover:bg-gray-600"
                  : "text-sky-400 bg-gray-100 hover:bg-gray-200"
              } transition-all duration-200`}
            >
              <FiBell className="h-5 w-5" />
              {notifications.length > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-sky-500 text-white text-[10px] font-semibold rounded-full flex items-center justify-center">
                  {notifications.length > 99 ? "99+" : notifications.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            <NotificationsDropdown
              darkMode={darkMode}
              notifications={notifications}
              showNotifications={showNotifications}
              onOpen={(item) => {
                setShowNotifications(false);
                onOpenNotification(item);
              }}
              onMarkRead={onMarkNotificationRead}
              onMarkAllRead={onMarkAllNotificationsRead}
            />
          </div>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className={`p-1.5 sm:p-2.5 rounded-xl ${
              darkMode
                ? "text-sky-400 bg-gray-700 hover:bg-gray-600"
                : "text-sky-400 bg-gray-100 hover:bg-gray-200"
            } transition-all duration-200`}
          >
            {darkMode ? (
              <FiSun className="h-5 w-5" />
            ) : (
              <FiMoon className="h-5 w-5" />
            )}
          </button>

          <a
            href="https://www.wvsupportservices.com/"
            target="_blank"
            rel="noopener noreferrer"
            className={`p-1.5 sm:p-2.5 rounded-xl ${
              darkMode
                ? "text-sky-400 bg-gray-700 hover:bg-gray-600"
                : "text-sky-400 bg-gray-100 hover:bg-gray-200"
            } transition-all duration-200`}
            title="Visit Main Website"
          >
            <FiGlobe className="h-5 w-5" />
          </a>

          {/* Profile Dropdown */}
          <div
            className={`relative flex-shrink-0 rounded-3xl ${
              darkMode ? "bg-gray-700" : "bg-sky-50"
            }`}
          >
            <button
              onClick={toggleProfile}
              className={`flex items-center p-1.5 sm:p-2 pl-2 sm:pl-3 rounded-3xl ${
                darkMode ? "hover:bg-gray-600" : "hover:bg-sky-100"
              } transition-all duration-200 group pr-2 sm:pr-3 max-w-full`}
            >
              <div className="relative flex-shrink-0 mr-1 sm:mr-3">
                <img
                  src={profileData.avatar}
                  alt="Admin"
                  className={`h-8 w-8 rounded-full object-cover shadow-sm border${
                    darkMode ? "border-gray-600" : "border-sky-300"
                  }`}
                  onError={(e) => {
                    e.target.src = blueLogo;
                  }}
                />
              </div>

              <div className="hidden sm:flex flex-col px-1 text-left whitespace-nowrap">
                <p
                  className={`text-sm font-semibold truncate ${
                    darkMode
                      ? "text-gray-200 group-hover:text-white"
                      : "text-gray-700 group-hover:text-gray-900"
                  }`}
                >
                  {profileData.name}
                </p>
                <p
                  className={`text-xs truncate ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {profileData.role}
                </p>
              </div>

              <FiChevronDown
                className={`hidden sm:block h-3.5 w-3.5 ml-2 flex-shrink-0 ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } transition-transform duration-200 ${
                  showProfile ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            <ProfileDropdown
              showProfile={showProfile}
              darkMode={darkMode}
              onLogout={onLogout}
              profileData={profileData}
            />
          </div>
        </div>
      </div>
      {/* Click outside to close dropdowns */}
      {(showNotifications || showProfile) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowNotifications(false);
            setShowProfile(false);
          }}
        />
      )}
    </header>
  );
};

export default TopBar;