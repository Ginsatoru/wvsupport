import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const NewsModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [popup, setPopup] = useState(null);
  const [closeBtnHovered, setCloseBtnHovered] = useState(false);

  useEffect(() => {
    const fetchPopup = async () => {
      try {
        const r = await fetch(`${API}/api/content/news-popup/active`);
        const d = await r.json();
        if (d.success && d.data) {
          const key = `news_popup_seen_${d.data._id}`;
          if (!sessionStorage.getItem(key)) {
            setPopup(d.data);
            setTimeout(() => setIsOpen(true), 1200);
          }
        }
      } catch (e) {
        console.error("Failed to fetch popup:", e);
      }
    };
    fetchPopup();
  }, []);

  const handleClose = () => {
    if (popup) sessionStorage.setItem(`news_popup_seen_${popup._id}`, "true");
    setIsOpen(false);
  };

  if (!popup) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[9998]"
            style={{ background: "rgba(10, 15, 30, 0.55)", backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="relative w-full max-w-sm sm:max-w-md"
              initial={{ scale: 0.88, y: 32, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.92, y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 72, damping: 16, delay: 0.05 }}
            >
              {/* Card */}
              <div
                className="relative overflow-hidden rounded-3xl"
                style={{
                  background: "rgba(255,255,255,0.82)",
                  backdropFilter: "blur(20px)",
                  WebkitBackdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.95)",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(194,230,245,0.4)",
                }}
              >

                {/* Close button */}
                <button
                  onClick={handleClose}
                  onMouseEnter={() => setCloseBtnHovered(true)}
                  onMouseLeave={() => setCloseBtnHovered(false)}
                  className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    background: closeBtnHovered ? "#1a1a2e" : "rgba(255,255,255,0.9)",
                    border: "1px solid rgba(209,213,219,0.8)",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M1 1L9 9M9 1L1 9"
                      stroke={closeBtnHovered ? "#ffffff" : "#374151"}
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                {/* Poster image — full size, no crop */}
                <img
                  src={popup.image}
                  alt={popup.title}
                  className="w-full h-auto block"
                  style={{ borderRadius: "20px 20px 0 0" }}
                />

                {/* Content */}
                <div className="px-6 pb-6 pt-4">
                  <h3
                    className="font-extrabold text-gray-900 leading-tight mb-2"
                    style={{ fontSize: "clamp(18px, 3vw, 22px)" }}
                  >
                    {popup.title}
                  </h3>
                  {popup.message && (
                    <p className="text-sm text-gray-500 leading-relaxed mb-5">
                      {popup.message}
                    </p>
                  )}

                  {/* Actions */}
                  <button
                    onClick={handleClose}
                    className="w-full py-3 rounded-full text-sm font-semibold text-white transition-all duration-200"
                    style={{
                      background: "#1a1a2e",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "#2d2d44"; e.currentTarget.style.transform = "translateY(-1px)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "#1a1a2e"; e.currentTarget.style.transform = "translateY(0)"; }}
                  >
                    Got it, thanks!
                  </button>
                </div>
              </div>

              {/* Decorative glow behind card */}
              <div
                className="absolute -z-10 inset-0 rounded-3xl"
                style={{
                  background: "radial-gradient(ellipse 80% 60% at 50% 30%, #c2e6f5 0%, transparent 70%)",
                  filter: "blur(24px)",
                  transform: "scale(1.1)",
                }}
              />
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NewsModal;