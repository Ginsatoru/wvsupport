import { useEffect, useState } from 'react';
import { Info, X } from 'lucide-react';

export const ModernAlert = ({ message, type = 'success', onClose, autoHide = true, duration = 5000 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setIsVisible(true);

    // Auto-hide after specified duration (only if autoHide is true)
    if (autoHide) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [autoHide, duration]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      // Only call onClose if it's provided and is a function
      if (onClose && typeof onClose === 'function') {
        onClose();
      }
    }, 300); // Match exit animation duration
  };

  return (
    <div
      className={`
        fixed top-6 left-1/2 -translate-x-1/2
        bg-white dark:bg-gray-900 text-black dark:text-white
        px-4 py-3 rounded-2xl shadow-lg
        flex items-center gap-3 z-50
        backdrop-blur-sm min-w-80 max-w-md
        transition-all duration-300 ease-out transform
        ${isVisible && !isExiting
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-95 -translate-y-4'
        }
      `}
      style={{
        animation: isVisible && !isExiting ? 'slideInTop 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : undefined
      }}
    >
      {/* Icon container */}
      <div className="flex-shrink-0 bg-gray-100 dark:bg-gray-800 text-black dark:text-white rounded-xl p-2">
        <Info className="w-5 h-5" />
      </div>

      {/* Message */}
      <div className="flex-1">
        <span className="text-sm font-medium leading-relaxed">{message}</span>
      </div>

      {/* Close button - only show if onClose is provided */}
      {onClose && (
        <button
          onClick={handleClose}
          className="flex-shrink-0 ml-2 p-1 rounded-full text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
          aria-label="Close notification"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      <style>{`
        @keyframes slideInTop {
          0% {
            transform: translate(-50%, -120%);
            opacity: 0;
          }
          100% {
            transform: translate(-50%, 0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default ModernAlert;