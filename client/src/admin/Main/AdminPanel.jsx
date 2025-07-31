import React, { useState, useEffect, useCallback, Routes, Route } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import TopBar from "../components/TopBar/TopBar";
import Dashboard from "../components/Dashbaord/Dashboard";
// import Inbox from "../components/Inbox/Inbox";
import OpenMessage from "../components/Inbox/OpenMessagesPage";
import ClosedMessage from "../components/Inbox/ClosedMessagesPage";
import CMS from "../components/FrontendPages/Layout/CMSContainer.jsx";
import Settings from "../components/Settings/Settings";
import ConfirmationModal from "../components/Modals/ConfirmationModal";
import { motion, AnimatePresence } from "framer-motion";
import WelcomeModal from "./WelcomeModal";
import Soon from "../components/Temp/AvailableSoon.jsx";

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem("adminDarkMode");
    if (savedMode) return savedMode === "true";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const [showWelcome, setShowWelcome] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Optimized welcome message effect
  useEffect(() => {
    const timer = setTimeout(() => {
      const shouldShowWelcome = 
        location.state?.fromLogin || 
        sessionStorage.getItem("showWelcome") === "true";
      
      if (shouldShowWelcome) {
        setShowWelcome(true);
        sessionStorage.removeItem("showWelcome");
        navigate(location.pathname, { replace: true, state: {} });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [location.state, navigate, location.pathname]);

  // Handle dark mode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("adminDarkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("adminDarkMode", "false");
    }
  }, [darkMode]);

  // Debounced resize handler
  useEffect(() => {
    let timeoutId;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setSidebarOpen(window.innerWidth >= 768);
      }, 100);
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Memoized handlers
  const closeWelcome = useCallback(() => setShowWelcome(false), []);
  const handleLogoutClick = useCallback(() => setShowLogoutConfirm(true), []);
  const handleCancelLogout = useCallback(() => setShowLogoutConfirm(false), []);

  const handleConfirmLogout = useCallback(() => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminDarkMode");
    sessionStorage.removeItem("showWelcome");
    navigate("/admin/login");
  }, [navigate]);

  // Sample notifications data
  const notifications = [
    { id: 1, title: "New user registered", time: "2 min ago", type: "user" },
    {
      id: 2,
      title: "Server maintenance scheduled",
      time: "1 hour ago",
      type: "system",
    },
    { id: 3, title: "Payment received", time: "3 hours ago", type: "payment" },
    {
      id: 4,
      title: "New message in inbox",
      time: "5 hours ago",
      type: "message",
    },
  ];

  // Sample notification counts for sidebar
  const sidebarNotifications = {
    inbox: 12,
    users: 3,
    orders: 5,
  };

  return (
    <div className={`flex flex-col h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcome && <WelcomeModal darkMode={darkMode} onClose={closeWelcome} />}
      </AnimatePresence>

      {/* TopBar */}
      <TopBar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        notifications={notifications}
        onLogout={handleLogoutClick}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          notifications={sidebarNotifications}
          darkMode={darkMode}
        />

        <main
          className={`flex-1 overflow-y-auto p-0 transition-all duration-200 ${
            sidebarOpen ? "md:ml-0" : "md:ml-0"
          } ${darkMode ? "bg-gray-800" : "bg-white"}`}
        >
          <div className="max-w-full">
            {activeTab === "dashboard" && <Dashboard darkMode={darkMode} />}
            {activeTab === "inbox-open" && <OpenMessage darkMode={darkMode} />}
            {activeTab === "inbox-closed" && <ClosedMessage darkMode={darkMode} />}
            {activeTab === "frontend" && <CMS darkMode={darkMode} />}
            {activeTab === "blog" && <Soon darkMode={darkMode} />}
            {activeTab === "reports" && <Soon darkMode={darkMode} />}
            {activeTab === "statistics" && <Soon darkMode={darkMode} />}
            {activeTab === "users" && <Soon darkMode={darkMode} />}
            {activeTab === "orders" && <Soon darkMode={darkMode} />}
            {activeTab === "settings" && <Settings darkMode={darkMode} />}
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && window.innerWidth < 768 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        title="Logout Confirmation"
        message="Are you sure you want to logout?"
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
        darkMode={darkMode}
      />
    </div>
  );
};

export default AdminPanel;