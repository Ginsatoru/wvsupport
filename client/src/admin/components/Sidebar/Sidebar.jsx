import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome,
  FiMail,
  FiImage,
  FiSettings,
  FiUsers,
  FiBarChart,
  FiShoppingCart,
  FiFileText,
  FiChevronDown,
  FiChevronRight,
  FiStar,
  FiTrendingUp,
  FiArchive,
  FiUserPlus,
} from "react-icons/fi";
import MessagesContainer from "../Inbox/MessagesContainer";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({
  activeTab = "dashboard",
  darkMode = false,
  setActiveTab = () => {},
  isOpen = true,
  notifications = {},
  onToggleSidebar = () => {}, // Added prop to handle sidebar toggle
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [expandedSections, setExpandedSections] = useState({
    analytics: false,
    inbox: false,
    management: false,
    content: false,
  });

  // State for today's stats
  const [todayStats, setTodayStats] = useState({
    viewers: 0,
    visitors: 0,
    loading: true,
  });

  // Fetch today's stats
  useEffect(() => {
    const fetchTodayStats = async () => {
      try {
        const response = await fetch("/api/analytics/today");
        if (!response.ok) throw new Error("Failed to fetch stats");

        const data = await response.json();
        setTodayStats({
          viewers: data.totalViews || 0,
          visitors: data.uniqueVisitors || 0,
          loading: false,
        });
      } catch (error) {
        console.error("Error fetching today stats:", error);
        setTodayStats((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    };

    fetchTodayStats();

    // Optional: Refresh data every 5 minutes (matches cache duration)
    const interval = setInterval(fetchTodayStats, 300000);
    return () => clearInterval(interval);
  }, []);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: FiHome,
      route: "/admin-panel/dashboard",
      notification: null,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: FiBarChart,
      isExpandable: true,
      isExpanded: expandedSections.analytics,
      children: [
        {
          id: "reports",
          label: "Reports",
          icon: FiTrendingUp,
          route: "/admin-panel/reports",
        },
        {
          id: "statistics",
          label: "Statistics",
          icon: FiBarChart,
          route: "/admin-panel/statistics",
        },
      ],
    },
    {
      id: "inbox",
      label: "Inbox",
      icon: FiMail,
      isExpandable: true,
      isExpanded: expandedSections.inbox,
      children: [
        {
          id: "email-open",
          label: "Email",
          icon: FiMail,
          route: "/admin-panel/emails",
        },
        {
          id: "inbox-open",
          label: "Open",
          icon: FiMail,
          route: "/admin-panel/inbox/open",
          component: <MessagesContainer status="open" />,
        },
        {
          id: "inbox-closed",
          label: "Closed",
          icon: FiArchive,
          route: "/admin-panel/inbox/closed",
          component: <MessagesContainer status="closed" />,
        },
      ],
    },
    {
      id: "management",
      label: "Contacts",
      icon: FiUsers,
      isExpandable: true,
      isExpanded: expandedSections.management,
      children: [
        {
          id: "subscribers",
          label: "Subscribers",
          icon: FiUserPlus,
          route: "/admin-panel/subscribers",
        },
        {
          id: "orders",
          label: "Orders",
          icon: FiShoppingCart,
          route: "/admin-panel/orders",
          notification: notifications?.orders || 0,
        },
      ],
    },
    {
      id: "content",
      label: "Content",
      icon: FiFileText,
      isExpandable: true,
      isExpanded: expandedSections.content,
      children: [
        {
          id: "frontend",
          label: "Pages",
          icon: FiImage,
          route: "/admin-panel/frontend",
        },
        {
          id: "blog",
          label: "Blog Posts",
          icon: FiFileText,
          route: "/admin-panel/blog",
        },
      ],
    },
    {
      id: "settings",
      label: "Settings",
      icon: FiSettings,
      route: "/admin-panel/settings",
    },
  ];

  // Handle navigation click
  const handleNavClick = (item) => {
    if (item.isExpandable && isOpen) {
      toggleSection(item.id);
      return;
    }

    if (item.route) {
      navigate(item.route);
    } else {
      setActiveTab(item.id);
    }
  };

  // Handle submenu click
  const handleSubmenuClick = (subItem) => {
    if (subItem.route) {
      navigate(subItem.route);
    } else {
      setActiveTab(subItem.id);
    }
  };

  // Check if current path matches the item
  const isActive = (item) => {
    if (item.route) {
      return location.pathname === item.route;
    }
    return activeTab === item.id;
  };

  // Check if submenu item is active
  const isSubmenuActive = (subItem) => {
    if (subItem.route) {
      return location.pathname === subItem.route;
    }
    return activeTab === subItem.id;
  };

  // Check if parent menu should be highlighted (if any submenu item is active)
  const shouldHighlightParent = (item) => {
    if (!item.children) return false;
    return item.children.some((subItem) => isSubmenuActive(subItem));
  };

  // Auto-expand sections if any child is active
  useEffect(() => {
    const newExpandedSections = { ...expandedSections };
    let shouldUpdate = false;

    menuItems.forEach((item) => {
      if (item.isExpandable && shouldHighlightParent(item) && !newExpandedSections[item.id]) {
        newExpandedSections[item.id] = true;
        shouldUpdate = true;
      }
    });

    if (shouldUpdate) {
      setExpandedSections(newExpandedSections);
    }
  }, [location.pathname]);

  const MenuItem = ({ item, isChild = false }) => {
    const IconComponent = item.icon;
    const hasNotification = item.notification && item.notification > 0;
    const isItemActive = isActive(item);
    const hasActiveChild = shouldHighlightParent(item);

    if (item.isExpandable && isOpen) {
      return (
        <div className="mb-2">
          <motion.button
            onClick={() => handleNavClick(item)}
            className={`w-full flex items-center justify-between p-3 rounded-xl ${
              isItemActive && !hasActiveChild
                ? "text-white bg-sky-400 shadow-lg"
                : darkMode
                ? "text-gray-200 hover:bg-gray-700 hover:text-white"
                : "text-gray-600 hover:bg-sky-50 hover:text-sky-600"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center">
              <IconComponent
                className={`mr-3 h-5 w-5 ${
                  isItemActive && !hasActiveChild
                    ? "text-white"
                    : darkMode
                    ? "text-gray-300 group-hover:text-white"
                    : "group-hover:scale-110"
                }`}
              />
              <motion.span
                className="font-medium text-base"
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {item.label}
              </motion.span>
              {hasNotification && (
                <motion.span
                  className="ml-2 px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full min-w-[20px] text-center"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                  }}
                >
                  {item.notification > 99 ? "99+" : item.notification}
                </motion.span>
              )}
            </div>
            {item.isExpanded || hasActiveChild ? (
              <FiChevronDown
                className={`h-4 w-4 ${darkMode ? "text-gray-300" : ""}`}
              />
            ) : (
              <FiChevronRight
                className={`h-4 w-4 ${darkMode ? "text-gray-300" : ""}`}
              />
            )}
          </motion.button>

          <AnimatePresence>
            {(item.isExpanded || hasActiveChild) && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <div className="ml-8 mt-2 space-y-2">
                  {item.children.map((child) => (
                    <MenuItem key={child.id} item={child} isChild={true} />
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <motion.div
        className="mb-2 relative group"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <motion.button
          onClick={() =>
            isChild ? handleSubmenuClick(item) : handleNavClick(item)
          }
          className={`w-full flex items-center ${
            isOpen ? "justify-between" : "justify-center"
          } p-3.5 rounded-xl ${
            isItemActive
              ? "text-white bg-sky-400 shadow-sm"
              : darkMode
              ? `text-gray-200 hover:bg-gray-700 hover:text-white ${
                  isChild ? "ml-0" : ""
                }`
              : `text-gray-600 hover:bg-sky-50 hover:text-sky-500 ${
                  isChild ? "ml-0" : ""
                }`
          } ${!isOpen ? "relative" : ""}`}
          title={!isOpen ? item.label : ""}
        >
          <div
            className={`flex items-center ${!isOpen ? "justify-center" : ""}`}
          >
            <IconComponent
              className={`${isOpen ? "mr-3" : ""} h-5 w-5 ${
                isItemActive
                  ? "text-white"
                  : darkMode
                  ? "text-gray-300 group-hover:text-white"
                  : "group-hover:scale-110 group-hover:text-sky-500"
              }`}
            />
            {isOpen && (
              <motion.span
                className={`font-medium text-base ${
                  darkMode ? "text-gray-200" : ""
                }`}
                initial={{ opacity: 1 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {item.label}
              </motion.span>
            )}
          </div>

          {isOpen && (
            <div className="flex items-center space-x-2">
              {hasNotification && (
                <motion.span
                  className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full min-w-[20px] text-center"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 1.5,
                  }}
                >
                  {item.notification > 99 ? "99+" : item.notification}
                </motion.span>
              )}
            </div>
          )}

          {!isOpen && hasNotification && (
            <motion.span
              className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full min-w-[18px] text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{
                repeat: Infinity,
                duration: 1.5,
              }}
            >
              {item.notification > 99 ? "99+" : item.notification}
            </motion.span>
          )}
        </motion.button>
      </motion.div>
    );
  };

  return (
    <motion.div
      className={`${
        darkMode ? "bg-gray-800" : "bg-white"
      } shadow-sm flex flex-col justify-between`}
      initial={{ width: isOpen ? 288 : 80 }}
      animate={{ width: isOpen ? 288 : 80 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      <div>
        {/* Quick Stats */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className={`p-4 -mt-4 ${
                darkMode ? "border-gray-700" : "border-gray-100"
              }`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className={`rounded-xl p-4 ${
                  darkMode ? "bg-gray-700" : "bg-sky-100"
                }`}
              >
                <div className="flex items-center justify-around mb-5">
                  <span
                    className={`text-sm font-medium ${
                      darkMode ? "text-gray-300" : "text-gray-600"
                    }`}
                  >
                    Today's Overview
                  </span>
                  <FiStar
                    className={`h-5 w-5 ${
                      darkMode ? "text-sky-400" : "text-sky-400"
                    }`}
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    {todayStats.loading ? (
                      <div className="h-8 w-12 mx-auto bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse"></div>
                    ) : (
                      <p className="text-2xl font-bold text-sky-400">
                        {todayStats.viewers}
                      </p>
                    )}
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      Viewers
                    </p>
                  </div>
                  <div className="text-center">
                    {todayStats.loading ? (
                      <div className="h-8 w-12 mx-auto bg-gray-300 dark:bg-gray-600 rounded-md animate-pulse"></div>
                    ) : (
                      <p className="text-2xl font-bold text-sky-400">
                        {todayStats.visitors}
                      </p>
                    )}
                    <p
                      className={`text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-500"
                      }`}
                    >
                      Visitors
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => (
              <MenuItem key={item.id} item={item} />
            ))}
          </div>
        </nav>
      </div>

      {/* Version number at the bottom */}
      <motion.div
        className={`p-4 text-center ${
          darkMode ? "text-gray-400" : "text-gray-500"
        } text-xs`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        V1.2
      </motion.div>
    </motion.div>
  );
};

export default Sidebar;