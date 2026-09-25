const API_URL = `${import.meta.env.VITE_BACKEND_URL || "http://localhost:5000"}/api/users`;

// All user requests need the admin token; errors come back as the server's message
const request = async (path = "", options = {}) => {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Request failed (${res.status})`);
  return data;
};

export const getUsers = () => request();
export const createUser = (user) => request("", { method: "POST", body: JSON.stringify(user) });
export const updateUser = (id, changes) => request(`/${id}`, { method: "PATCH", body: JSON.stringify(changes) });
export const deleteUser = (id) => request(`/${id}`, { method: "DELETE" });