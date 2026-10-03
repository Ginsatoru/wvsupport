import { sendWithProgress } from "./sendWithProgress";
const API_URL = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/content/news-popup`;

// Admin calls send the token; errors come back as the server's message
const request = async (path, options = {}) => {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
};

// Admin — formData: title, message, isActive, expiresAt, image (file)
export const getNewsPopups = () => request("/admin/all");
export const saveNewsPopup = (id, formData, onProgress) =>
  sendWithProgress(`${API_URL}${id ? `/admin/${id}` : "/admin"}`, { method: id ? "PUT" : "POST", body: formData, onProgress });