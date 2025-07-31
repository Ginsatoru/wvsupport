import React, { useState } from "react";
import {
  FiX,
  FiMoon,
  FiSun,
  FiBell,
  FiEye,
  FiEyeOff,
  FiBook,
  FiCircle,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const SettingsManager = ({
  isOpen,
  onClose,
  darkMode,
  onDarkModeToggle,
  highContrastMode,
  onHighContrastToggle,
  readingMode,
  onReadingModeToggle,
  notificationsEnabled,
  onNotificationsToggle,
}) => {
  const [settings, setSettings] = useState({
    darkMode: darkMode,
    highContrastMode: highContrastMode,
    compactMode: false,
    animations: true,
    notifications: notificationsEnabled,
    readingMode: readingMode,
  });

  const handleToggle = (setting) => {
    const newSettings = {
      ...settings,
      [setting]: !settings[setting],
    };
    setSettings(newSettings);

    // Execute the corresponding callback
    switch (setting) {
      case "darkMode":
        onDarkModeToggle();
        break;
      case "highContrastMode":
        onHighContrastToggle();
        break;
      case "readingMode":
        onReadingModeToggle();
        break;
      case "notifications":
        onNotificationsToggle();
        break;
      default:
        break;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Settings Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 flex items-center justify-center p-4 z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={`w-full max-w-md rounded-xl shadow-2xl ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              } border flex flex-col max-h-[90vh] overflow-hidden`}
            >
              {/* Header */}
              <div
                className={`px-6 py-4 border-b flex items-center justify-between ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <h2
                  className={`text-xl font-semibold ${
                    darkMode ? "text-white" : "text-gray-900"
                  }`}
                >
                  Dashboard Settings
                </h2>
                <button
                  onClick={onClose}
                  className={`p-2 rounded-full transition-colors group ${
                    darkMode
                      ? "hover:bg-gray-700 hover:text-red-500 text-gray-400"
                      : "hover:bg-gray-100 hover:text-red-500 text-gray-400"
                  }`}
                >
                  <FiX className="h-5 w-5 transition-colors group-hover:text-red-500" />
                </button>
              </div>

              {/* Settings Content */}
              <div className="overflow-y-auto flex-1 p-6">
                <div className="space-y-6">
                  {/* Dark Mode Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {darkMode ? (
                        <FiMoon
                          className={`h-5 w-5 ${
                            darkMode ? "text-sky-400" : "text-sky-600"
                          }`}
                        />
                      ) : (
                        <FiSun
                          className={`h-5 w-5 ${
                            darkMode ? "text-sky-400" : "text-sky-600"
                          }`}
                        />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        Dark Mode
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggle("darkMode")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.darkMode ? "bg-sky-400" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.darkMode ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* High Contrast Mode Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FiCircle
                        className={`h-5 w-5 ${
                          darkMode ? "text-sky-400" : "text-sky-600"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        High Contrast Mode
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggle("highContrastMode")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.highContrastMode ? "bg-sky-400" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.highContrastMode
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Notifications Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FiBell
                        className={`h-5 w-5 ${
                          darkMode ? "text-sky-400" : "text-sky-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        Notifications
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggle("notifications")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications ? "bg-sky-400" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.notifications
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Reading Mode Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FiBook
                        className={`h-5 w-5 ${
                          darkMode ? "text-sky-400" : "text-sky-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        Reading Mode
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggle("readingMode")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.readingMode ? "bg-sky-400" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.readingMode
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Compact Mode Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {settings.compactMode ? (
                        <FiEyeOff
                          className={`h-5 w-5 ${
                            darkMode ? "text-sky-400" : "text-sky-400"
                          }`}
                        />
                      ) : (
                        <FiEye
                          className={`h-5 w-5 ${
                            darkMode ? "text-sky-400" : "text-sky-400"
                          }`}
                        />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        Compact View
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggle("compactMode")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.compactMode ? "bg-sky-400" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.compactMode
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Animations Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`h-5 w-5 ${
                          darkMode ? "text-sky-400" : "text-sky-400"
                        }`}
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                      </div>
                      <span
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-200" : "text-gray-800"
                        }`}
                      >
                        UI Animations
                      </span>
                    </div>
                    <button
                      onClick={() => handleToggle("animations")}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.animations ? "bg-sky-400" : "bg-gray-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.animations
                            ? "translate-x-6"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                className={`px-6 py-4 border-t ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                } flex justify-end`}
              >
                <button
                  onClick={onClose}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                    darkMode
                      ? "bg-sky-400 hover:bg-sky-500 text-white"
                      : "bg-sky-400 hover:bg-sky-500 text-white"
                  }`}
                >
                  Done
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SettingsManager;