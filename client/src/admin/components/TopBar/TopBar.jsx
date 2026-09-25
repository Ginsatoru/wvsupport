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

// Searchable admin sections — label + route + a few keywords to match against.
// Mirrors the sections available in the sidebar/content management area.
const SEARCHABLE_SECTIONS = [
  { label: "Dashboard", route: "/admin-panel/dashboard", keywords: ["analytics", "overview", "stats"] },
  { label: "Email", route: "/admin-panel/emails", keywords: ["inbox", "mail", "messages"] },
  { label: "Open Messages", route: "/admin-panel/inbox/open", keywords: ["inbox", "open", "messages"] },
  { label: "Closed Messages", route: "/admin-panel/inbox/closed", keywords: ["inbox", "closed", "archive", "messages"] },
  { label: "Subscribers", route: "/admin-panel/subscribers", keywords: ["newsletter", "email list", "users"] },
  { label: "Pages", route: "/admin-panel/frontend", keywords: ["content", "frontend", "hero", "team"] },
  { label: "Settings", route: "/admin-panel/settings", keywords: ["company", "logo", "config"] },
];

const TopBar = ({
  onLogout = () => {},
  sidebarOpen = true,
  setSidebarOpen = () => {},
  darkMode = false,
  setDarkMode = () => {},
  notifications = [
    { id: 1, title: "New user registered", time: "2 min ago", type: "user" },
    {
      id: 2,
      title: "Server maintenance scheduled",
      time: "1 hour ago",
      type: "system",
    },
    { id: 3, title: "Payment received", time: "3 hours ago", type: "payment" },
  ],
}) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchWrapRef = useRef(null);
  const mobileSearchWrapRef = useRef(null);
  const [profileData, setProfileData] = useState(() => {
    const savedProfile = localStorage.getItem("profileData");
    return savedProfile
      ? JSON.parse(savedProfile)
      : {
          name: "Admin User",
          email: "admin@wvsupport.com",
          avatar: blueLogo,
          role: "Administrator",
          // Add other profile fields as needed
        };
  });

  useEffect(() => {
    localStorage.setItem("profileData", JSON.stringify(profileData));
  }, [profileData]);

  // Filter searchable sections against the current query
  const searchResults = (() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return [];
    return SEARCHABLE_SECTIONS.filter(
      (section) =>
        section.label.toLowerCase().includes(query) ||
        section.keywords.some((kw) => kw.toLowerCase().includes(query))
    );
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

  // Gradient styles
  const gradientStyle = {
    background: "linear-gradient(to right, #60a5fa, #3b82f6)", // blue-400 to blue-500
  };

  const gradientTextStyle = {
    background: "linear-gradient(120deg, #60a5fa 0%, #60a5fa 100%)",
    WebkitBackgroundClip: "text",
    backgroundClip: "text",
    color: "transparent",
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
              <li key={section.route}>
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
                  {section.label}
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
            {sidebarOpen ? (
              <FiMenu className="h-5 w-5 sm:h-5 sm:w-5 transition-transform duration-200" />
            ) : (
              <FiMenu className="h-5 w-5 sm:h-5 sm:w-5 transition-transform duration-200" />
            )}
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
                  <FiSearch
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-400"
                    }`}
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
              {/* {notifications.length > 0 && (
                <span
                  style={gradientStyle}
                  className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 text-white text-xs rounded-full flex items-center justify-center animate-bounce"
                >
                  {notifications.length}
                </span>
              )} */}
            </button>

            {/* Notifications Dropdown */}
            <NotificationsDropdown
              darkMode={darkMode}
              notifications={notifications}
              showNotifications={showNotifications}
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
            className={`relative rounded-3xl ${
              darkMode ? "bg-gray-700" : "bg-sky-50"
            }`}
          >
            <button
              onClick={toggleProfile}
              className={`flex items-center p-1.5 sm:p-2 pl-2 sm:pl-3 rounded-3xl ${
                darkMode ? "hover:bg-gray-600" : "hover:bg-sky-100"
              } transition-all duration-200 group min-w-[40px] sm:min-w-[180px] max-w-full`}
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

              <div className="hidden sm:flex flex-col px-1 text-left min-w-0 overflow-hidden">
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
              toggleDarkMode={toggleDarkMode}
              onLogout={onLogout}
              profileData={profileData}
              onProfileUpdate={(updatedData) => setProfileData(updatedData)}
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