import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle, FiCheck, FiX } from "react-icons/fi";

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const modalVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -30, scale: 0.95 },
};

const ConfirmationModal = ({
  isOpen,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  dangerOnly = false,
  autoCloseAfterMs = null,
  customIcon = null,
  onConfirm,
  onCancel,
  showCloseButton = true,
  darkMode = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  useEffect(() => {
    let timer;
    if (isOpen && autoCloseAfterMs) {
      timer = setTimeout(() => {
        onCancel();
      }, autoCloseAfterMs);
    }
    return () => clearTimeout(timer);
  }, [isOpen, autoCloseAfterMs, onCancel]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={backdropVariants}
        >
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            aria-describedby="modal-description"
            className={`relative z-10 w-full max-w-md p-6 mx-4 rounded-2xl shadow-xl transition-colors duration-200 ${
              darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
            }`}
            variants={modalVariants}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
          >
            {/* Close Button */}
            {showCloseButton && !dangerOnly && (
              <button
                onClick={onCancel}
                className={`absolute top-4 right-4 p-2 rounded-full transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  darkMode
                    ? "text-gray-300 hover:bg-gray-700 focus:ring-sky-300"
                    : "text-gray-500 hover:bg-gray-100 focus:ring-sky-300"
                }`}
                aria-label="Close"
              >
                <FiX className="w-5 h-5 text-sky-400" />
              </button>
            )}

            {/* Icon */}
            <div
              className={`flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full ${
                danger
                  ? "bg-red-100 dark:bg-red-100"
                  : darkMode
                  ? "bg-sky-900"
                  : "bg-sky-100"
              }`}
            >
              {customIcon ? (
                <div className="w-8 h-8 text-center text-xl text-inherit">
                  {customIcon}
                </div>
              ) : (
                <FiAlertCircle
                  className={`w-8 h-8 ${
                    danger
                      ? "text-red-600 dark:text-red-400"
                      : darkMode
                      ? "text-sky-300"
                      : "text-sky-400"
                  }`}
                />
              )}
            </div>

            {/* Content */}
            <div className="text-center">
              <h2
                id="modal-title"
                className={`text-xl font-semibold mb-2 ${
                  darkMode ? "text-gray-100" : "text-gray-900"
                }`}
              >
                {title}
              </h2>
              <p
                id="modal-description"
                className={`${darkMode ? "text-gray-300" : "text-gray-600"}`}
              >
                {message}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                onClick={onConfirm}
                className="inline-flex items-center justify-center px-6 py-3 text-sm font-medium rounded-[8px] shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-300"
              >
                <FiCheck className="mr-2 text-white" />
                {confirmText}
              </motion.button>

              {!dangerOnly && (
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={onCancel}
                  className={`inline-flex items-center justify-center px-6 py-3 text-sm font-medium border rounded-[8px] shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    darkMode
                      ? "text-gray-200 bg-gray-700 hover:bg-gray-600 border-gray-600 focus:ring-sky-300"
                      : "text-gray-700 bg-white hover:bg-gray-50 border-gray-300 focus:ring-sky-300"
                  }`}
                >
                  {cancelText}
                </motion.button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
