// src/components/WelcomeModal/WelcomeModal.jsx
import { motion } from "framer-motion";
import React from "react";

const WelcomeModal = ({ darkMode, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 10 }}
        animate={{ scale: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
        }}
        className={`rounded-2xl shadow-xl p-6 max-w-md w-full border ${
          darkMode
            ? "bg-gray-800 text-gray-100 border-gray-700"
            : "bg-white text-gray-800 border-gray-200"
        }`}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2
              className="text-2xl font-bold bg-gradient-to-r from-sky-400 to-sky-400 bg-clip-text text-transparent"
            >
              Welcome Back!
            </h2>
            <p className="text-sm mt-1 text-gray-500 dark:text-gray-400">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded-3xl transition-all ${
              darkMode
                ? "hover:bg-gray-700 text-gray-300"
                : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <p className="mb-6 text-gray-600 dark:text-gray-300">
          You've successfully logged in to the administration dashboard. Here's
          what's new since your last visit:
        </p>

        <div className="mb-8 space-y-4">
          <div
            className={`flex items-center p-3 rounded-xl ${
              darkMode ? "bg-gray-700/50" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 mr-4">
              <svg
                className="w-5 h-5 text-blue-600 dark:text-blue-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-xl">New Users</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                3 new registrations
              </p>
            </div>
          </div>

          <div
            className={`flex items-center p-3 rounded-xl ${
              darkMode ? "bg-gray-700/50" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/50 mr-4">
              <svg
                className="w-5 h-5 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-xl">Pending Orders</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                5 orders to review
              </p>
            </div>
          </div>

          <div
            className={`flex items-center p-3 rounded-xl ${
              darkMode ? "bg-gray-700/50" : "bg-gray-50"
            }`}
          >
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/50 mr-4">
              <svg
                className="w-5 h-5 text-amber-600 dark:text-amber-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="font-medium text-xl">Messages</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                2 unread messages
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}

          className={`w-full py-3 px-6 rounded-xl text-lg font-medium transition-all flex bg-sky-500 items-center justify-center text-white hover:opacity-90`}
        >
          Continue to Dashboard
          <svg
            className="w-5 h-5 ml-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default WelcomeModal;
