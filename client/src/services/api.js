import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/team`;

// Create instance for regular requests
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Create instance for file uploads - DO NOT set Content-Type header
const apiFormData = axios.create({
  baseURL: API_URL
  // Let browser set Content-Type with boundary for multipart/form-data
});

export const getTeamMembers = () => api.get('/');

export const deleteTeamMember = (id) => api.delete(`/${id}`);

// File upload functions - let axios handle headers automatically
export const addTeamMember = (formData) => {
  return axios.post(API_URL, formData);
};

export const updateTeamMember = (id, formData) => {
  return axios.put(`${API_URL}/${id}`, formData);
};