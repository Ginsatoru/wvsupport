import React, { useState } from "react";
import { FiUser, FiSettings, FiSun, FiMoon, FiLogOut } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import blueLogo from "../../../Components/Images/bluelogo.png";

const ProfileDropdown = ({
  showProfile,
  setShowProfile, // Add this prop
  darkMode,
  toggleDarkMode,
  onLogout,
}) => {
  const [showProfileManager, setShowProfileManager] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Admin User",
    email: "admin@wvsupport.com",
    profileImage: blueLogo,
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning, Admin";
    if (hour < 18) return "Good afternoon, Admin";
    return "Good evening, Admin";
  };

  const handleProfileClick = () => {
    setShowProfileManager(true);
  };

  const handleProfileUpdate = (updatedData) => {
    setProfileData(updatedData);
    setShowProfileManager(false);
  };

  // Add the missing toggleFullscreen function
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Listen for fullscreen changes
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  return (
    <>
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
              <div
                className={`text-lg mb-2 ${
                  darkMode ? "text-sky-300" : "text-sky-300"
                } font-bold`}
              >
                {getGreeting()}
              </div>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={profileData.profileImage}
                    alt="Admin"
                    className="h-10 w-10 rounded-full object-cover border-2 border-opacity-50 border-sky-400"
                  />
                  <div
                    className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 ${
                      darkMode
                        ? "border-gray-800 bg-sky-500"
                        : "border-white bg-sky-500"
                    }`}
                  />
                </div>
                <div>
                  <p
                    className={`text-base font-semibold ${
                      darkMode ? "text-gray-100" : "text-gray-800"
                    }`}
                  >
                    {profileData.name}
                  </p>
                  <p
                    className={`text-xs ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    {profileData.email}
                  </p>
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

    </>
  );
};

export default ProfileDropdown;
