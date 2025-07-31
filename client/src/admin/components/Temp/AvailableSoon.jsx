import { Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

const AvailableSoon = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Animate progress to 65%
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 65) {
            clearInterval(interval);
            return 65;
          }
          return prev + 1;
        });
      }, 30);
      
      return () => clearInterval(interval);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="rounded-xl flex items-center justify-center min-h-[90vh] bg-gray-200 dark:bg-gray-900 transition-colors duration-300 px-4">

      <div className={`max-w-md w-full mx-auto text-center transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Animated Icon */}
        <div className="mx-auto mb-6 w-20 h-20 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-lg dark:shadow-gray-800/50 p-4">
          <Clock className="w-10 h-10 text-sky-500 dark:text-sky-400 animate-pulse" />
        </div>

        {/* Heading */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100 mb-3 font-sans">
          Coming Soon
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 font-sans">
          We're working on something amazing! Stay tuned for updates.
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-sky-400 to-sky-600 h-2 rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {/* Progress Percentage */}
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-8">
          <span className="font-medium">{progress}% Complete</span>
        </div>
      </div>
    </div>
  );
};

export default AvailableSoon;