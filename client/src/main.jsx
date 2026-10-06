import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Fonts are loaded by the <link> in index.html (starts immediately, never hides the page)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);