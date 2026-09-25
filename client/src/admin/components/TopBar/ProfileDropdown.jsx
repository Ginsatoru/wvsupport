import React from "react";
import { FiLogOut } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import blueLogo from "../../../Components/Images/bluelogo.png";

const getGreeting = (name) => {
  const hour = new Date().getHours();
  const part = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  return `Good ${part}, ${name}`;
};

const ProfileDropdown = ({ showProfile, darkMode, onLogout, profileData }) => (
  <AnimatePresence>
    {showProfile && (
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -5, scale: 0.98 }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
          duration: 0.15,
        }}
        className={`fixed sm:absolute right-0 mt-3 w-72 rounded-xl shadow-xl border ${
          darkMode
            ? "bg-gray-800 border-gray-600 shadow-gray-900/50"
            : "bg-white border-gray-200 shadow-gray-400/30"
        } z-50 overflow-hidden`}
      >
        {/* Profile Header */}
        <div
          className={`p-4 border-b ${
            darkMode ? "border-gray-700" : "border-gray-100"
          }`}
        >
          <div className="text-lg mb-2 text-sky-300 font-bold">
            {getGreeting(profileData.name)}
          </div>

          <div className="flex items-center space-x-3">
            <div className="relative">
              <img
                src={profileData.avatar}
                alt="Admin"
                className="h-10 w-10 rounded-full object-cover border-2 border-opacity-50 border-sky-400"
                onError={(e) => {
                  e.target.src = blueLogo;
                }}
              />
              <div
                className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 ${
                  darkMode
                    ? "border-gray-800 bg-sky-500"
                    : "border-white bg-sky-500"
                }`}
              />
            </div>
            <div className="min-w-0">
              <p
                className={`text-base font-semibold truncate ${
                  darkMode ? "text-gray-100" : "text-gray-800"
                }`}
              >
                {profileData.name}
              </p>
              <p
                className={`text-xs truncate ${
                  darkMode ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {profileData.email}
              </p>
              {profileData.memberSince && (
                <p
                  className={`text-xs mt-0.5 ${
                    darkMode ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  Admin since {profileData.memberSince}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sign Out Section */}
        <div
          className={`border-t ${
            darkMode ? "border-gray-700" : "border-gray-100"
          } py-1`}
        >
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onLogout}
            className={`flex items-center space-x-3 w-full px-4 py-3 text-sm ${
              darkMode
                ? "text-red-400 hover:bg-gray-700/70"
                : "text-red-600 hover:bg-red-50/90"
            } transition-all duration-200 ease-out`}
          >
            <FiLogOut className="h-4 w-4 flex-shrink-0" />
            <span>Sign out</span>
          </motion.button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ProfileDropdown;