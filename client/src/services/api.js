import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/team`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getTeamMembers = () => {
  return api.get('/');
};

export const addTeamMember = (memberData) => {
  return api.post('/', memberData);
};

export const updateTeamMember = (id, memberData) => {
  return api.put(`/${id}`, memberData);
};

export const deleteTeamMember = (id) => {
  return api.delete(`/${id}`);
};