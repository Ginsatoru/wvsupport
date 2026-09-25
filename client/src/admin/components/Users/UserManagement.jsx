import React, { useEffect, useMemo, useState } from "react";
import { Users, UserPlus, Search, Pencil, Trash2, Loader2, X, Shield, Headphones } from "lucide-react";
import { ModernAlert } from "../Modals/Alert";
import ConfirmationModal from "../Modals/ConfirmationModal";
import { getUsers, createUser, updateUser, deleteUser } from "../../../services/userApi";

const ROLES = [
  { value: "admin", label: "Admin", Icon: Shield },
  { value: "support", label: "Support", Icon: Headphones },
];
const roleOf = (value) => ROLES.find((r) => r.value === value) || ROLES[0]; // older accounts have no role → admin
const EMPTY_FORM = { name: "", email: "", password: "", role: "support" };

// Logged-in user's id, from the login token
const currentUserId = () => {
  try {
    const payload = localStorage.getItem("adminToken").split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload)).id;
  } catch {
    return null;
  }
};

const formatDate = (date) =>
  date ? new Date(date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "—";

const inputClass =
  "w-full px-3 py-2.5 rounded-xl text-sm bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0f8abe]";

// ── Add / edit form ──
const UserModal = ({ user, onClose, onSaved }) => {
  const isEdit = !!user;
  const [form, setForm] = useState(
    isEdit ? { name: user.name || "", email: user.email, password: "", role: user.role || "admin" } : EMPTY_FORM
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = { name: form.name, email: form.email, role: form.role };
      if (form.password) payload.password = form.password;
      const result = isEdit ? await updateUser(user._id, payload) : await createUser(payload);
      onSaved(result.data, isEdit);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 space-y-4"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-black dark:text-white">{isEdit ? "Edit user" : "Add user"}</h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">{error}</div>
        )}

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-black dark:text-white">Name</span>
          <input className={inputClass} value={form.name} onChange={set("name")} placeholder="Full name" />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-black dark:text-white">Email</span>
          <input type="email" required className={inputClass} value={form.email} onChange={set("email")} placeholder="name@company.com" />
        </label>

        <label className="block space-y-1.5">
          <span className="text-sm font-medium text-black dark:text-white">
            {isEdit ? "New password" : "Password"}
          </span>
          <input
            type="password"
            required={!isEdit}
            minLength={8}
            className={inputClass}
            value={form.password}
            onChange={set("password")}
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />
        </label>

        <div className="space-y-1.5">
          <span className="text-sm font-medium text-black dark:text-white">Role</span>
          <div className="grid grid-cols-2 gap-2">
            {ROLES.map(({ value, label, Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm((prev) => ({ ...prev, role: value }))}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-colors ${
                  form.role === value
                    ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
                    : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-[#0f8abe] hover:bg-[#0d7aaa] disabled:opacity-50"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEdit ? "Save changes" : "Add user"}
          </button>
        </div>
      </form>
    </div>
  );
};

// ── Page ──
const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modalUser, setModalUser] = useState(null); // null = closed, {} = add, user = edit
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
  const meId = currentUserId();

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
  };

  useEffect(() => {
    getUsers()
      .then((res) => setUsers(res.data || []))
      .catch((err) => showAlert(err.message, "error"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? users.filter((u) => `${u.name} ${u.email} ${roleOf(u.role).label}`.toLowerCase().includes(q)) : users;
  }, [users, search]);

  const handleSaved = (saved, isEdit) => {
    setUsers((prev) => (isEdit ? prev.map((u) => (u._id === saved._id ? saved : u)) : [...prev, saved]));
    // Your own name/role changed → top bar reloads your profile
    if (saved._id === meId) window.dispatchEvent(new Event("admin-profile-updated"));
    setModalUser(null);
    showAlert(isEdit ? "User updated" : "User added");
  };

  const handleDelete = async () => {
    const user = confirmDelete;
    setConfirmDelete(null);
    try {
      await deleteUser(user._id);
      setUsers((prev) => prev.filter((u) => u._id !== user._id));
      showAlert("User deleted");
    } catch (err) {
      showAlert(err.message, "error");
    }
  };

  const counts = ROLES.map((r) => ({ ...r, count: users.filter((u) => roleOf(u.role).value === r.value).length }));

  return (
    <div className="px-9 py-7 bg-gray-200 dark:bg-gray-900 rounded-xl min-h-[80vh]">
      {alert.show && (
        <div className="mb-4">
          <ModernAlert message={alert.message} type={alert.type} />
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2 text-black dark:text-white">
            <Users className="w-6 h-6" />
            Users
          </h1>
          <p className="text-sm text-black dark:text-white">
            {users.length} {users.length === 1 ? "account" : "accounts"} ·{" "}
            {counts.map((c) => `${c.count} ${c.label}`).join(" · ")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="pl-10 pr-4 py-3 w-64 rounded-xl text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-[#0f8abe]"
            />
          </div>
          <button
            onClick={() => setModalUser({})}
            className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium text-white bg-[#0f8abe] hover:bg-[#0d7aaa]"
          >
            <UserPlus className="w-4 h-4" />
            Add user
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#0f8abe] mb-3" />
            <p className="text-black dark:text-white">Loading users...</p>
          </div>
        ) : filtered.length === 0 ? (
          <p className="py-16 text-center text-gray-500 dark:text-gray-400">
            {search ? "No matching users" : "No users yet"}
          </p>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {["User", "Role", "Added", ""].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-black dark:text-white">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filtered.map((user) => {
                const role = roleOf(user.role);
                const isMe = user._id === meId;
                return (
                  <tr key={user._id} className="group hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-sm font-semibold">
                          {(user.name || user.email).charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-black dark:text-white truncate">
                            {user.name || user.email.split("@")[0]}
                            {isMe && (
                              <span className="ml-2 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                                You
                              </span>
                            )}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                          role.value === "admin"
                            ? "bg-black text-white dark:bg-white dark:text-black"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                        }`}
                      >
                        <role.Icon className="w-3.5 h-3.5" />
                        {role.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-black dark:text-white">{formatDate(user.createdAt)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1">
                        <button
                          onClick={() => setModalUser(user)}
                          title="Edit"
                          className="p-2 rounded-full text-gray-400 hover:text-[#0f8abe] hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        {!isMe && (
                          <button
                            onClick={() => setConfirmDelete(user)}
                            title="Delete"
                            className="p-2 rounded-full text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {modalUser && (
        <UserModal user={modalUser._id ? modalUser : null} onClose={() => setModalUser(null)} onSaved={handleSaved} />
      )}

      <ConfirmationModal
        isOpen={!!confirmDelete}
        title="Delete user"
        message={`Delete ${confirmDelete?.email}? They will no longer be able to log in.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(null)}
      />
    </div>
  );
};

export default UserManagement;