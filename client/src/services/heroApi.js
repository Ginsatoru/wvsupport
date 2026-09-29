const API_URL = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/content/hero`;

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

// Public: active hero in one language ("en" | "km")
export const getActiveHeroContent = (lang = "en") => request(`/active?lang=${lang}`, { auth: false });

// Admin
export const getAllHeroContent = () => request("/admin/all");
export const saveHeroContent = (id, formData) =>
  request(id ? `/admin/${id}` : "/admin", { method: id ? "PUT" : "POST", body: formData });
export const deleteHeroContent = (id) => request(`/admin/${id}`, { method: "DELETE" });
export const toggleHeroActive = (id) => request(`/admin/${id}/toggle-active`, { method: "PATCH" });