import { sendWithProgress } from "./sendWithProgress";
const API_URL = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/content/careers`;

// Admin calls send the token; errors come back as the server's message
const request = async (path, { auth = true, ...options } = {}) => {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: auth ? { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } : {},
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
};

// Public: careers page in one language ("en" | "km"); data is null until it's been edited
export const getActiveCareers = (lang = "en") => request(`/active?lang=${lang}`, { auth: false });

// Admin
export const getCareersAdmin = () => request("/admin");
export const saveCareers = (formData, onProgress) =>
  sendWithProgress(`${API_URL}/admin`, { method: "PUT", body: formData, onProgress });