import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Preload critical fonts to prevent FOUT (Flash of Unstyled Text)
const preloadFonts = () => {
  // Updated font URLs with correct paths - using Google Fonts CSS API approach
  const fontUrls = [
    // Montserrat Regular (400)
    'https://fonts.gstatic.com/s/montserrat/v26/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2',
    // Montserrat Medium (500) 
    'https://fonts.gstatic.com/s/montserrat/v26/JTURjIg1_i6t8kCHKm459W1hyyTh89Y.woff2',
    // Montserrat SemiBold (600)
    'https://fonts.gstatic.com/s/montserrat/v26/JTURjIg1_i6t8kCHKm459WdhyyTh89Y.woff2',
    // Battambang Regular
    'https://fonts.gstatic.com/s/battambang/v24/uk-mEGe7raEw-HjkzZabNhGp5A.woff2',
    // Battambang Bold
    'https://fonts.gstatic.com/s/battambang/v24/uk-lEGe7raEw-HjkzZabDm-j4xfr8Q.woff2'
  ];

  fontUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'font';
    link.type = 'font/woff2';
    link.href = url;
    link.crossOrigin = 'anonymous';
    
    // Add error handling to prevent 404 issues
    link.addEventListener('error', () => {
      console.warn(`Failed to preload font: ${url}`);
      link.remove();
    });
    
    document.head.appendChild(link);
  });
};

// Better approach: Load Google Fonts CSS instead of individual font files
const loadGoogleFonts = () => {
  const link = document.createElement('link');
  link.rel = 'preconnect';
  link.href = 'https://fonts.googleapis.com';
  document.head.appendChild(link);

  const link2 = document.createElement('link');
  link2.rel = 'preconnect';
  link2.href = 'https://fonts.gstatic.com';
  link2.crossOrigin = 'anonymous';
  document.head.appendChild(link2);

  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600&family=Battambang:wght@400;700&display=swap';
// Better approach: Load Google Fonts CSS with proper preconnect optimization
const loadGoogleFonts = () => {
  // Preconnect to Google Fonts domains for faster loading
  const preconnect1 = document.createElement('link');
  preconnect1.rel = 'preconnect';
  preconnect1.href = 'https://fonts.googleapis.com';
  document.head.appendChild(preconnect1);

  const preconnect2 = document.createElement('link');
  preconnect2.rel = 'preconnect';
  preconnect2.href = 'https://fonts.gstatic.com';
  preconnect2.crossOrigin = 'anonymous';
  document.head.appendChild(preconnect2);

  // Load the font CSS - this should match what's in your CSS file
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Battambang:wght@100;300;400;700;900&display=swap';
  document.head.appendChild(fontLink);
};

// Font loading optimization with better performance
const optimizeFontLoading = () => {
  // Add loading states
  document.body.classList.add('fonts-loading');
  
  // Modern font loading API
  if ('fonts' in document) {
    // Load specific font faces
    // Load specific font faces that are commonly used
    const fontPromises = [
      document.fonts.load('400 16px Montserrat'),
      document.fonts.load('500 16px Montserrat'),
      document.fonts.load('600 16px Montserrat'),
      document.fonts.load('700 16px Montserrat'),
      document.fonts.load('400 16px Battambang'),
      document.fonts.load('700 16px Battambang')
    ];

    Promise.allSettled(fontPromises).then(() => {
      document.body.classList.add('fonts-loaded');
      document.body.classList.remove('fonts-loading');
    });

    // Fallback timeout
    // Fallback timeout - ensure fonts are marked as loaded after 3 seconds
    setTimeout(() => {
      if (!document.body.classList.contains('fonts-loaded')) {
        document.body.classList.add('fonts-loaded');
        document.body.classList.remove('fonts-loading');
      }
    }, 3000);
  } else {
    // Fallback for older browsers
    setTimeout(() => {
      document.body.classList.add('fonts-loaded');
      document.body.classList.remove('fonts-loading');
    }, 1000);
  }

  // Add fallback CSS for font-display
  const style = document.createElement('style');
  style.textContent = `
    .fonts-loading * {
      font-display: swap;
    }
    .fonts-loading {
      visibility: hidden;
    }
    .fonts-loaded {
      visibility: visible;
  // Add CSS for font loading states
  const style = document.createElement('style');
  style.textContent = `
    .fonts-loading {
      opacity: 0;
      transition: opacity 0.3s ease-in-out;
    }
    .fonts-loaded {
      opacity: 1;
    }
    
    /* Ensure font-display swap behavior */
    @font-face {
      font-family: 'Montserrat';
      font-display: swap;
    }
    @font-face {
      font-family: 'Battambang';
      font-display: swap;
    }
  `;
  document.head.appendChild(style);
};

// Initialize font loading - using CSS approach instead of preloading individual files
// Initialize font loading
loadGoogleFonts();
optimizeFontLoading();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
