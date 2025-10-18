import React from 'react';
import Logo from '../Components/Images/tranlogo.png';

const Loading = ({ fullScreen = true, size = 'default' }) => {
  // Size configurations
  const sizeConfig = {
    small: 'w-16 h-16',
    default: 'w-24 h-24',
    large: 'w-32 h-32'
  };

  const containerClass = fullScreen 
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-white/95 backdrop-blur-sm' 
    : 'flex items-center justify-center w-full h-full min-h-[200px]';

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-4">
        {/* Logo container with pulse animation */}
        <div className={`${sizeConfig[size]} relative`}>
          {/* Animated ring */}
          <div className="absolute inset-0 rounded-full border-4 border-[#0f8abe]/20 animate-ping"></div>
          
          {/* Logo */}
          <div className="relative w-full h-full flex items-center justify-center animate-pulse">
            <img 
              src={Logo} 
              alt="Loading" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        {/* Optional loading text */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-[#0f8abe] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
            <span className="w-2 h-2 bg-[#0f8abe] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
            <span className="w-2 h-2 bg-[#0f8abe] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;