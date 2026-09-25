import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FiHome, FiMail, FiImage, FiSettings, FiUsers, FiBarChart,
  FiShoppingCart, FiFileText, FiChevronDown, FiChevronRight,
  FiTrendingUp, FiArchive, FiUserPlus,
} from "react-icons/fi";
import VisitorRecord from "./VisitorRecord";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({
  activeTab = "dashboard",
  darkMode = false,
  setActiveTab = () => {},
  isOpen = true,
  notifications = {},
  onToggleSidebar = () => {},
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [expandedSections, setExpandedSections] = useState({});

  // Dynamic text color: white in dark mode, black in light mode
  const textColor = darkMode ? '#ffffff' : '#000000';

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: FiHome, route: "/admin-panel/dashboard", notification: null },
    { id: "inbox", label: "Inbox", icon: FiMail, route: "/admin-panel/inbox", notification: null },
    { id: "subscribers", label: "Subscribers", icon: FiUsers, route: "/admin-panel/subscribers" },
    { id: "content", label: "Content", icon: FiFileText, route: "/admin-panel/frontend" },
    { id: "settings", label: "Settings", icon: FiSettings, route: "/admin-panel/settings" },
  ];

  const handleNavClick = (item) => {
    if (item.isExpandable && isOpen) { toggleSection(item.id); return; }
    if (item.route) navigate(item.route);
    else setActiveTab(item.id);
  };

  const handleSubmenuClick = (subItem) => {
    if (subItem.route) navigate(subItem.route);
    else setActiveTab(subItem.id);
  };

  const isActive = (item) => item.route ? location.pathname === item.route : activeTab === item.id;
  const isSubmenuActive = (subItem) => subItem.route ? location.pathname === subItem.route : activeTab === subItem.id;
  const shouldHighlightParent = (item) => item.children ? item.children.some(isSubmenuActive) : false;

  useEffect(() => {
    const newExpandedSections = { ...expandedSections };
    let shouldUpdate = false;
    menuItems.forEach((item) => {
      if (item.isExpandable && shouldHighlightParent(item) && !newExpandedSections[item.id]) {
        newExpandedSections[item.id] = true;
        shouldUpdate = true;
      }
    });
    if (shouldUpdate) setExpandedSections(newExpandedSections);
  }, [location.pathname]);

  const MenuItem = ({ item, isChild = false }) => {
    const IconComponent = item.icon;
    const hasNotification = item.notification && item.notification > 0;
    const isItemActive = isActive(item);
    const hasActiveChild = shouldHighlightParent(item);
    const isActiveState = isItemActive || (isChild && isItemActive);

    // When active (blue bg) → white text. Otherwise → dynamic theme color.
    const itemTextColor = isActiveState ? '#ffffff' : textColor;

    if (item.isExpandable && isOpen) {
      return (
        <div className="mb-2">
          <button
            onClick={() => handleNavClick(item)}
            className={`w-full flex items-center justify-between p-3 rounded-xl transition-colors ${
              isActiveState && !hasActiveChild ? "bg-sky-400 shadow-lg" : "hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
            style={{ color: isActiveState && !hasActiveChild ? '#ffffff' : textColor }}
          >
            <div className="flex items-center">
              <IconComponent className="mr-3 h-5 w-5" style={{ color: isActiveState && !hasActiveChild ? '#ffffff' : textColor }} />
              <span className="font-medium text-base">{item.label}</span>
              {hasNotification && (
                <span className="ml-2 px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full min-w-[20px] text-center">
                  {item.notification > 99 ? "99+" : item.notification}
                </span>
              )}
            </div>
            {hasActiveChild ? (
              <FiChevronDown className="h-4 w-4" style={{ color: textColor }} />
            ) : (
              <FiChevronRight className="h-4 w-4" style={{ color: textColor }} />
            )}
          </button>
          <AnimatePresence>
            {hasActiveChild && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <div className="ml-8 mt-2 space-y-2">
                  {item.children.map((child) => <MenuItem key={child.id} item={child} isChild={true} />)}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <div className="mb-2 relative group">
        <button
          onClick={() => isChild ? handleSubmenuClick(item) : handleNavClick(item)}
          className={`w-full flex items-center ${isOpen ? "justify-between" : "justify-center"} p-3.5 rounded-xl transition-colors ${
            isItemActive ? "bg-sky-400 shadow-sm" : "hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
          style={{ color: itemTextColor }}
          title={!isOpen ? item.label : ""}
        >
          <div className={`flex items-center ${!isOpen ? "justify-center" : ""}`}>
            <IconComponent className={`${isOpen ? "mr-3" : ""} h-5 w-5`} style={{ color: itemTextColor }} />
            {isOpen && <span className="font-medium text-base">{item.label}</span>}
          </div>
          {isOpen && hasNotification && (
            <span className="px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-full min-w-[20px] text-center">
              {item.notification > 99 ? "99+" : item.notification}
            </span>
          )}
          {!isOpen && hasNotification && (
            <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full min-w-[18px] text-center">
              {item.notification > 99 ? "99+" : item.notification}
            </span>
          )}
        </button>
      </div>
    );
  };

  return (
    <motion.div
      className={`${darkMode ? "bg-gray-800" : "bg-white"} shadow-sm flex flex-col justify-between`}
      initial={{ width: isOpen ? 288 : 80 }}
      animate={{ width: isOpen ? 288 : 80 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
    >
      <div>
        <VisitorRecord darkMode={darkMode} isOpen={isOpen} />
        <nav className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-2">
            {menuItems.map((item) => <MenuItem key={item.id} item={item} />)}
          </div>
        </nav>
      </div>
      <div className="p-4 text-center text-xs" style={{ color: textColor }}>V1.3</div>
    </motion.div>
  );
};

export default Sidebar;