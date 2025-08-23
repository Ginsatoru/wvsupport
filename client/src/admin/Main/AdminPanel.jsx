import React, { useState, useEffect, useCallback } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import TopBar from "../components/TopBar/TopBar";
import Dashboard from "../components/Dashbaord/Dashboard";
import OpenMessage from "../components/Inbox/OpenMessagesPage";
import ClosedMessage from "../components/Inbox/ClosedMessagesPage";
import CMS from "../components/FrontendPages/Layout/CMSContainer.jsx";
import Settings from "../components/Settings/Settings";
import ConfirmationModal from "../components/Modals/ConfirmationModal";
import { motion, AnimatePresence } from "framer-motion";
import WelcomeModal from "./WelcomeModal";
import Soon from "../components/Temp/AvailableSoon.jsx";
import News from "../components/Managements/CMSNewsletter.jsx";
import Email from "../components/Inbox/Emails/MainEmails.jsx";

const AdminPanel = () => {
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

  // Get the base path for admin routes (determine if it's /admin or /admin-panel)
  const getBasePath = () => {
    const pathname = location.pathname;
    if (pathname.includes("/admin-panel")) {
      return "/admin-panel";
    }
    return "/admin";
  };

  const basePath = getBasePath();

  // Get active tab from current pathname
  const getActiveTabFromPath = (pathname) => {
    // Remove the base path to get the relative path
    const relativePath = pathname.replace(basePath, "").replace(/^\//, "");

    if (relativePath === "" || relativePath === "admin") return "dashboard";
    if (relativePath.startsWith("inbox/open")) return "inbox-open";
    if (relativePath.startsWith("inbox/closed")) return "inbox-closed";
    if (relativePath.startsWith("emails")) return "email-open";
    if (relativePath.startsWith("frontend")) return "frontend";
    if (relativePath.startsWith("blog")) return "blog";
    if (relativePath.startsWith("reports")) return "reports";
    if (relativePath.startsWith("statistics")) return "statistics";
    if (relativePath.startsWith("subscribers")) return "subscribers";
    if (relativePath.startsWith("orders")) return "orders";
    if (relativePath.startsWith("settings")) return "settings";
    return relativePath;
  };

  const activeTab = getActiveTabFromPath(location.pathname);

  // Handle tab change by navigating to new route
  const setActiveTab = useCallback(
    (tab) => {
      const routeMap = {
        dashboard: `${basePath}/dashboard`,
        "inbox-open": `${basePath}/inbox/open`,
        "inbox-closed": `${basePath}/inbox/closed`,
        "email-open": `${basePath}/emails`,
        frontend: `${basePath}/frontend`,
        blog: `${basePath}/blog`,
        reports: `${basePath}/reports`,
        statistics: `${basePath}/statistics`,
        subscribers: `${basePath}/subscribers`,
        orders: `${basePath}/orders`,
        settings: `${basePath}/settings`,
      };

      if (routeMap[tab]) {
        navigate(routeMap[tab]);
      }
    },
    [navigate, basePath]
  );

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
    <div
      className={`flex flex-col h-screen ${
        darkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      {/* Welcome Modal */}
      <AnimatePresence>
        {showWelcome && (
          <WelcomeModal darkMode={darkMode} onClose={closeWelcome} />
        )}
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
            <Routes>
              {/* Default redirect to dashboard - use relative path */}
              <Route path="/" element={<Navigate to="dashboard" replace />} />

              {/* Dashboard */}
              <Route
                path="dashboard"
                element={<Dashboard darkMode={darkMode} />}
              />

              {/* Inbox Routes */}
              <Route
                path="inbox/open"
                element={<OpenMessage darkMode={darkMode} />}
              />
              <Route
                path="inbox/closed"
                element={<ClosedMessage darkMode={darkMode} />}
              />

              {/* Email Management */}
              <Route path="emails" element={<Email darkMode={darkMode} />} />

              {/* Frontend CMS */}
              <Route path="frontend/*" element={<CMS darkMode={darkMode} />} />

              {/* Coming Soon Pages */}
              <Route path="blog" element={<Soon darkMode={darkMode} />} />
              <Route path="reports" element={<Soon darkMode={darkMode} />} />
              <Route path="statistics" element={<Soon darkMode={darkMode} />} />
              <Route path="orders" element={<Soon darkMode={darkMode} />} />

              {/* Newsletter Management */}
              <Route
                path="subscribers"
                element={<News darkMode={darkMode} />}
              />

              {/* Settings */}
              <Route
                path="settings"
                element={<Settings darkMode={darkMode} />}
              />

              {/* Catch all - redirect to dashboard */}
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Routes>
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
