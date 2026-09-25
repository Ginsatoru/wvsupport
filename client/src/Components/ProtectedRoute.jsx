import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// Token expiry in ms — Infinity if it has no "exp", 0 if it can't be read
const getTokenExpiry = (token) => {
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const { exp } = JSON.parse(atob(payload));
    return exp ? exp * 1000 : Infinity;
  } catch {
    return 0;
  }
};

const MAX_TIMEOUT = 2147483647; // setTimeout limit (~24.8 days)

const ProtectedRoute = ({ children, isAuthenticated }) => {
  const token = localStorage.getItem('adminToken');
  const expiry = token ? getTokenExpiry(token) : 0;
  const [expired, setExpired] = useState(false);

  // Log out at the moment the token expires, even if the page is left open
  useEffect(() => {
    if (!token || expiry === Infinity) return;
    const msLeft = expiry - Date.now();
    if (msLeft <= 0) return;

    const timer = setTimeout(() => {
      localStorage.removeItem('adminToken');
      setExpired(true);
    }, Math.min(msLeft, MAX_TIMEOUT));

    return () => clearTimeout(timer);
  }, [token, expiry]);

  // Expired or broken token — clear it and send back to login
  if (expired || (token && expiry <= Date.now())) {
    localStorage.removeItem('adminToken');
    return <Navigate to="/admin/login" replace />;
  }

  if (!token && !isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;