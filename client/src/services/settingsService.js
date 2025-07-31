import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

// Set auth token if available
const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

// Get the auth token from localStorage or sessionStorage
const getAuthToken = () => {
  return localStorage.getItem('token') || sessionStorage.getItem('token') || 
         localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
};

// Login function
export const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
    const { token } = response.data;
    localStorage.setItem('token', token);
    setAuthToken(token);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Logout function
export const logout = () => {
  localStorage.removeItem('token');
  delete axios.defaults.headers.common['Authorization'];
};

// Load token from storage when service is imported
const token = localStorage.getItem('token');
if (token) {
  setAuthToken(token);
}

// Get settings (public)
export const getSettings = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/settings`);
    return response.data;
  } catch (error) {
    console.error('Error fetching settings:', error);
    throw error;
  }
};

// Update settings (requires auth)
export const updateSettings = async (settingsData) => {
  try {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error('No authentication token found. Please log in.');
    }

    const response = await axios.put(`${API_BASE_URL}/settings`, settingsData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating settings:', error);
    throw error;
  }
};