import React, { useState, useEffect } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import welcomeImage from "./Images/welcome.png"

const WelcomeMessage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Check if we should show the welcome message
    const checkWelcomeMessage = () => {
      const lastSeenDate = localStorage.getItem('welcomeMessageLastSeen');
      const today = new Date().toDateString();
      
      // Show message if never seen before or if last seen was before today
      if (!lastSeenDate || lastSeenDate !== today) {
        setShouldShow(true);
        const timer = setTimeout(() => {
          setIsVisible(true);
          document.body.style.overflow = 'hidden';
        }, 300);
        
        // Update last seen date
        localStorage.setItem('welcomeMessageLastSeen', today);
        
        return () => {
          clearTimeout(timer);
          document.body.style.overflow = 'unset';
        };
      }
    };

    checkWelcomeMessage();
  }, []);

  const handleContinue = () => {
    setIsVisible(false);
    document.body.style.overflow = 'unset';
    setTimeout(() => setShouldShow(false), 300);
  };

  if (!shouldShow) return null;

  return (
    <>
      {/* Animated overlay with blur */}
      <div 
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm transition-all duration-300 ease-out ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ zIndex: 2147483647 }}
      />
      
      {/* Main card container */}
      <div 
        className={`fixed inset-0 flex items-center justify-center p-4 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{ zIndex: 2147483647 }}
      >
        <div className={`w-full max-w-2xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isVisible 
            ? 'translate-y-0 scale-100' 
            : 'translate-y-5 scale-95'
        }`}>
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden relative">
            {/* Animated border effect */}
            <div className={`absolute inset-0 rounded-2xl border-2 border-[#0f8abe] pointer-events-none transition-all duration-500 ease-out ${
              isVisible ? 'opacity-30 scale-100' : 'opacity-0 scale-105'
            }`} />
            
            {/* Image Section - Made taller */}
            <div className="relative w-full h-64 sm:h-80">
              <img
                src={welcomeImage}
                alt="Professional IT Support Team"
                className="w-full h-full object-cover opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f8abe]/30 to-transparent" />
              <div className="absolute bottom-6 left-6 text-white text-base sm:text-lg font-medium font-poppins bg-[#0f8abe] px-4 py-1.5 rounded-full">
                🇰🇭 Siem Reap Team
              </div>
            </div>
            
            {/* Content Section - Increased padding */}
            <div className="p-8 sm:p-10">
              {/* Animated check icon - Made larger */}
              <div className={`flex justify-center mb-6 transition-all duration-400 ease-out ${
                isVisible 
                  ? 'opacity-100 scale-100 rotate-0' 
                  : 'opacity-0 scale-50 rotate-45'
              }`}>
                <div className="flex items-center justify-center w-16 h-16 bg-[#0f8abe]/10 rounded-full">
                  <CheckCircle className="w-9 h-9 text-[#0f8abe]" />
                </div>
              </div>

              {/* Text content - Increased font sizes */}
              <div className="overflow-hidden text-center">
                <h2 className={`text-2xl sm:text-3xl font-bold text-gray-900 mb-3 font-poppins transition-all duration-300 ease-out ${
                  isVisible 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-3 opacity-0'
                }`}>
                  Welcome to WV Support
                </h2>
                
                <p className={`text-[#0f8abe] text-base sm:text-lg mb-4 font-poppins transition-all duration-300 ease-out delay-75 ${
                  isVisible 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-3 opacity-0'
                }`}>
                  RetailManager Specialists in Cambodia
                </p>

                <div className={`mb-7 transition-all duration-300 ease-out delay-150 ${
                  isVisible 
                    ? 'translate-y-0 opacity-100' 
                    : 'translate-y-3 opacity-0'
                }`}>
                  <p className="text-gray-700 text-base sm:text-lg leading-relaxed font-poppins">
                    Our Siem Reap-based team provides premium RetailManager support with local expertise and 24/7 availability.
                  </p>
                </div>
              </div>

              {/* Continue button - Made larger */}
              <div className={`flex justify-center transition-all duration-300 ease-out delay-200 ${
                isVisible 
                  ? 'translate-y-0 opacity-100' 
                  : 'translate-y-3 opacity-0'
              }`}>
                <button 
                  onClick={handleContinue}
                  className="group relative bg-white text-[#0f8abe] font-medium py-3.5 pl-8 pr-7 rounded-xl 
                    border-2 border-[#0f8abe] hover:text-white
                    shadow-md hover:shadow-lg transition-all duration-200
                    font-poppins flex items-center gap-2 overflow-hidden text-lg"
                >
                  <span className="relative z-10">Continue to Site</span>
                  <ArrowRight className="w-5 h-5 relative z-10 transition-transform duration-200 group-hover:translate-x-1 group-hover:text-white" />
                  
                  {/* Hover fill effect */}
                  <span className="absolute inset-0 bg-[#0f8abe] w-0 group-hover:w-full transition-all duration-300 ease-out"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Font import */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        .font-poppins { font-family: 'Poppins', sans-serif; }
      `}</style>
    </>
  );
};

export default WelcomeMessage;