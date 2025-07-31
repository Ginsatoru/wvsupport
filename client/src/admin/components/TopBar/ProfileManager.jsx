import React, { useState, useRef, useEffect } from "react";
import {
  FiUser,
  FiCamera,
  FiSave,
  FiX,
  FiEdit3,
  FiMail,
  FiPhone,
  FiMapPin,
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const ProfileManager = ({ 
  isOpen, 
  onClose, 
  darkMode, 
  onSave = () => {}, 
  initialData 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState({ ...initialData });
  const fileInputRef = useRef(null);

  useEffect(() => {
    setTempData({ ...initialData });
  }, [initialData]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setTempData({ ...tempData, profileImage: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (typeof onSave === 'function') {
      onSave(tempData);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempData({ ...initialData });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setTempData({ ...tempData, [field]: value });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with smoother transition */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal with enhanced styling */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
            className="fixed inset-0 flex items-center justify-center p-6 z-50" // Increased padding
          >
            <div
              className={`w-full max-w-2xl max-h-[90vh] rounded-2xl shadow-2xl ${
                darkMode
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              } flex flex-col overflow-hidden`}
            >
              {/* Header with increased padding */}
              <div
                className={`px-8 py-5 border-b flex items-center justify-between ${
                  darkMode ? "border-gray-700" : "border-gray-200"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <FiUser
                    className={`h-6 w-6 ${
                      darkMode ? "text-sky-400" : "text-sky-400"
                    } transition-colors duration-200`}
                  />
                  <h2
                    className={`text-xl font-semibold ${
                      darkMode ? "text-gray-100" : "text-gray-800"
                    } transition-colors duration-200`}
                  >
                    Your Profile
                  </h2>
                </div>

                <div className="flex items-center space-x-3">
                  {!isEditing ? (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsEditing(true)}
                      className={`p-2 rounded-3xl transition-all duration-200 ${
                        darkMode
                          ? "text-gray-400 hover:text-sky-400 hover:bg-gray-700/50"
                          : "text-gray-600 hover:text-sky-400 hover:bg-gray-100/70"
                      }`}
                    >
                      <FiEdit3 className="h-5 w-5" />
                    </motion.button>
                  ) : (
                    <div className="flex space-x-3">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleSave}
                        className="px-4 py-2 bg-sky-400 hover:bg-sky-500 text-white text-sm rounded-xl transition-all duration-200 flex items-center space-x-2"
                      >
                        <FiSave className="h-4 w-4" />
                        <span>Save</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={handleCancel}
                        className={`px-4 py-2 text-sm rounded-xl transition-all duration-200 ${
                          darkMode
                            ? "text-gray-300 hover:text-gray-100 hover:bg-gray-700/50"
                            : "text-gray-600 hover:text-gray-800 hover:bg-gray-100/70"
                        }`}
                      >
                        Cancel
                      </motion.button>
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className={`p-2 rounded-3xl transition-all duration-200 ${
                      darkMode
                        ? "text-gray-400 hover:text-red-400 hover:bg-gray-700/50"
                        : "text-gray-600 hover:text-red-400 hover:bg-gray-100/70"
                    }`}
                  >
                    <FiX className="h-5 w-5" />
                  </motion.button>
                </div>
              </div>

              {/* Content with increased padding */}
              <div className="overflow-y-auto flex-1 px-8 py-6">
                <div className="flex flex-col items-center">
                  {/* Profile Picture Section */}
                  <div className="flex flex-col items-center mb-8 w-full max-w-xs">
                    <div className="relative group">
                      <motion.img
                        src={tempData.profileImage}
                        alt="Profile"
                        className="h-28 w-28 rounded-full object-cover border-4 border-blue-400 shadow-lg transition-all duration-300"
                        whileHover={{ scale: 1.02 }}
                      />

                      {isEditing && (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <FiCamera className="h-7 w-7 text-white" />
                        </motion.button>
                      )}

                      <div
                        className={`absolute -bottom-1 -right-1 h-7 w-7 rounded-full border-3 transition-all duration-200 ${
                          darkMode
                            ? "border-gray-800 bg-green-500"
                            : "border-white bg-green-500"
                        }`}
                      />
                    </div>

                    {isEditing && (
                      <p
                        className={`text-xs mt-3 text-center transition-colors duration-200 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Click on image to change profile picture
                      </p>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Profile Fields with adjusted font sizes */}
                  <div className="w-full max-w-2xl space-y-5">
                    {/* Name Field */}
                    <div>
                      <label
                        className={`block text-xs font-medium mb-2 uppercase tracking-wider transition-colors duration-200 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Full Name
                      </label>
                      {isEditing ? (
                        <motion.input
                          type="text"
                          value={tempData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-gray-100 hover:border-gray-500"
                              : "bg-white border-gray-300 text-gray-800 hover:border-gray-400"
                          }`}
                          whileFocus={{ scale: 1.01 }}
                        />
                      ) : (
                        <motion.div
                          className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                            darkMode ? "bg-gray-700/40 hover:bg-gray-700/60" : "bg-gray-50 hover:bg-gray-100"
                          }`}
                          whileHover={{ x: 2 }}
                        >
                          <FiUser
                            className={`h-4 w-4 flex-shrink-0 transition-colors duration-200 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                          <span
                            className={`text-sm transition-colors duration-200 ${
                              darkMode ? "text-gray-200" : "text-gray-700"
                            }`}
                          >
                            {tempData.name}
                          </span>
                        </motion.div>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label
                        className={`block text-xs font-medium mb-2 uppercase tracking-wider transition-colors duration-200 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Email Address
                      </label>
                      {isEditing ? (
                        <motion.input
                          type="email"
                          value={tempData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-gray-100 hover:border-gray-500"
                              : "bg-white border-gray-300 text-gray-800 hover:border-gray-400"
                          }`}
                          whileFocus={{ scale: 1.01 }}
                        />
                      ) : (
                        <motion.div
                          className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                            darkMode ? "bg-gray-700/40 hover:bg-gray-700/60" : "bg-gray-50 hover:bg-gray-100"
                          }`}
                          whileHover={{ x: 2 }}
                        >
                          <FiMail
                            className={`h-4 w-4 flex-shrink-0 transition-colors duration-200 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                          <span
                            className={`text-sm transition-colors duration-200 ${
                              darkMode ? "text-gray-200" : "text-gray-700"
                            }`}
                          >
                            {tempData.email}
                          </span>
                        </motion.div>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label
                        className={`block text-xs font-medium mb-2 uppercase tracking-wider transition-colors duration-200 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Phone Number
                      </label>
                      {isEditing ? (
                        <motion.input
                          type="tel"
                          value={tempData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-gray-100 hover:border-gray-500"
                              : "bg-white border-gray-300 text-gray-800 hover:border-gray-400"
                          }`}
                          whileFocus={{ scale: 1.01 }}
                        />
                      ) : (
                        <motion.div
                          className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                            darkMode ? "bg-gray-700/40 hover:bg-gray-700/60" : "bg-gray-50 hover:bg-gray-100"
                          }`}
                          whileHover={{ x: 2 }}
                        >
                          <FiPhone
                            className={`h-4 w-4 flex-shrink-0 transition-colors duration-200 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                          <span
                            className={`text-sm transition-colors duration-200 ${
                              darkMode ? "text-gray-200" : "text-gray-700"
                            }`}
                          >
                            {tempData.phone}
                          </span>
                        </motion.div>
                      )}
                    </div>

                    {/* Location Field */}
                    <div>
                      <label
                        className={`block text-xs font-medium mb-2 uppercase tracking-wider transition-colors duration-200 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Location
                      </label>
                      {isEditing ? (
                        <motion.input
                          type="text"
                          value={tempData.location}
                          onChange={(e) => handleInputChange("location", e.target.value)}
                          className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-gray-100 hover:border-gray-500"
                              : "bg-white border-gray-300 text-gray-800 hover:border-gray-400"
                          }`}
                          whileFocus={{ scale: 1.01 }}
                        />
                      ) : (
                        <motion.div
                          className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
                            darkMode ? "bg-gray-700/40 hover:bg-gray-700/60" : "bg-gray-50 hover:bg-gray-100"
                          }`}
                          whileHover={{ x: 2 }}
                        >
                          <FiMapPin
                            className={`h-4 w-4 flex-shrink-0 transition-colors duration-200 ${
                              darkMode ? "text-gray-400" : "text-gray-500"
                            }`}
                          />
                          <span
                            className={`text-sm transition-colors duration-200 ${
                              darkMode ? "text-gray-200" : "text-gray-700"
                            }`}
                          >
                            {tempData.location}
                          </span>
                        </motion.div>
                      )}
                    </div>

                    {/* Bio Field */}
                    <div>
                      <label
                        className={`block text-xs font-medium mb-2 uppercase tracking-wider transition-colors duration-200 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        Bio
                      </label>
                      {isEditing ? (
                        <motion.textarea
                          rows={3}
                          value={tempData.bio}
                          onChange={(e) => handleInputChange("bio", e.target.value)}
                          className={`w-full px-4 py-2.5 text-sm rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-gray-100 hover:border-gray-500"
                              : "bg-white border-gray-300 text-gray-800 hover:border-gray-400"
                          }`}
                          whileFocus={{ scale: 1.01 }}
                          placeholder="Tell us about yourself..."
                        />
                      ) : (
                        <motion.div
                          className={`px-4 py-2.5 rounded-xl transition-all duration-200 ${
                            darkMode ? "bg-gray-700/40 hover:bg-gray-700/60" : "bg-gray-50 hover:bg-gray-100"
                          }`}
                          whileHover={{ x: 2 }}
                        >
                          <p
                            className={`text-sm transition-colors duration-200 ${
                              darkMode ? "text-gray-200" : "text-gray-700"
                            }`}
                          >
                            {tempData.bio}
                          </p>
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProfileManager;