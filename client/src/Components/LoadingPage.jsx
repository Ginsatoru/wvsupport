import React from 'react';
import './LoadingPage.css'; // Create this CSS file

const LoadingPage = () => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner">
          <div className="spinner-gradient"></div>
        </div>
        <h2 className="loading-text">Loading your experience</h2>
        <p className="loading-subtext">Just a moment please...</p>
      </div>
    </div>
  );
};

export default LoadingPage;