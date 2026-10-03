import { sendWithProgress } from "./sendWithProgress";
const API_URL = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/content/footer`;

// Admin calls send the token; errors come back as the server's message
const request = async (path, { auth = true, json, ...options } = {}) => {
  const headers = auth ? { Authorization: `Bearer ${localStorage.getItem("adminToken")}` } : {};
  if (json) headers["Content-Type"] = "application/json";
  const res = await fetch(`${API_URL}${path}`, { ...options, headers, body: json ? JSON.stringify(json) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
};

// Public: footer in one language ("en" | "km"); data is null until it's been edited
export const getActiveFooter = (lang = "en") => request(`/active?lang=${lang}`, { auth: false });

// Admin
export const getFooterAdmin = () => request("/admin");
export const saveFooter = (content, onProgress) =>
  sendWithProgress(`${API_URL}/admin`, { method: "PUT", json: content, onProgress });