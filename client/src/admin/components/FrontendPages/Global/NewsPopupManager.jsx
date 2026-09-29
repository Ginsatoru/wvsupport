import React, { useEffect, useRef, useState } from "react";
import { Loader2, Upload } from "lucide-react";
import { ModernAlert } from "../../Modals/Alert";
import { getNewsPopups, saveNewsPopup } from "../../../../services/newsPopupApi";

const EMPTY_FORM = { title: "", message: "", isActive: true, expiresAt: "" };

// Popup from the API → form values ("2026-10-01T09:00" for the date input)
const toForm = (popup) =>
  popup
    ? {
        title: popup.title || "",
        message: popup.message || "",
        isActive: !!popup.isActive,
        expiresAt: popup.expiresAt ? popup.expiresAt.slice(0, 16) : "",
      }
    : EMPTY_FORM;

// ── Form parts ──
const inputClass =
  "w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 !text-[13px] leading-relaxed text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0f8abe]";

const Field = ({ label, children }) => (
  <label className="block space-y-1">
    <span className="text-xs font-medium text-black dark:text-white">{label}</span>
    {children}
  </label>
);

const SectionTitle = ({ children }) => (
  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{children}</h3>
);

// ── Editor: the site's news popup, edited in place (the newest one, or a new one if none exist) ──
const NewsPopupManager = () => {
  const [popup, setPopup] = useState(undefined); // undefined = loading, null = none yet
  const [form, setForm] = useState(EMPTY_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
  const fileRef = useRef(null);

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
  };

  const load = () =>
    getNewsPopups()
      .then((res) => {
        const list = res.data || [];
        const current = list.find((p) => p.isActive) || list[0] || null;
        setPopup(current);
        setForm(toForm(current));
        setImageFile(null);
      })
      .catch((err) => {
        setPopup(null);
        showAlert(err.message, "error");
      });

  useEffect(() => {
    load();
  }, []);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.type === "checkbox" ? e.target.checked : e.target.value }));

  const pickImage = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return showAlert("Please choose an image file", "error");
    if (file.size > 10 * 1024 * 1024) return showAlert("Image must be 10MB or smaller", "error");
    setImageFile(file);
  };

  const preview = imageFile ? URL.createObjectURL(imageFile) : popup?.image || "";
  const expired = form.expiresAt && new Date(form.expiresAt) < new Date();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return showAlert("Title is required", "error");
    if (!preview) return showAlert("Poster image is required", "error");
    setSaving(true);
    try {
      const body = new FormData();
      Object.entries(form).forEach(([key, value]) => body.append(key, value));
      if (imageFile) body.append("image", imageFile);
      const res = await saveNewsPopup(popup?._id, body);
      showAlert(res.message || "Popup saved");
      await load();
    } catch (err) {
      showAlert(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (popup === undefined) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl mx-4">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#0f8abe]" />
        <p className="text-black dark:text-white">Loading news popup...</p>
      </div>
    );
  }

  return (
    <div className="px-4 bg-gray-200 dark:bg-gray-900 rounded-xl">
      {alert.show && (
        <div className="mb-4">
          <ModernAlert message={alert.message} type={alert.type} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT — text + schedule */}
          <section className="px-6 py-5 space-y-3">
            <SectionTitle>Popup</SectionTitle>
            <Field label="Title">
              <input className={inputClass} placeholder="e.g. Happy Khmer New Year!" value={form.title} onChange={set("title")} />
            </Field>
            <Field label="Message">
              <textarea rows={4} className={inputClass} value={form.message} onChange={set("message")} />
            </Field>
            <Field label="Expires">
              <input type="datetime-local" className={inputClass} value={form.expiresAt} onChange={set("expiresAt")} />
            </Field>
            {expired && <p className="text-xs text-red-500">This date has passed, so the popup won't show.</p>}

            <label className="flex items-center justify-between gap-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/40 cursor-pointer">
              <span className="text-sm font-medium text-black dark:text-white">Show on website</span>
              <input type="checkbox" checked={form.isActive} onChange={set("isActive")} className="w-5 h-5 accent-[#0f8abe]" />
            </label>
          </section>

          {/* RIGHT — poster */}
          <section className="px-6 py-5 space-y-3 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <SectionTitle>Poster</SectionTitle>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-[#0f8abe] hover:bg-[#0d7aaa] disabled:opacity-50"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save changes
              </button>
            </div>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full h-72 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#0f8abe] overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-700/40"
            >
              {preview ? (
                <img src={preview} alt="" className="w-full h-full object-contain" />
              ) : (
                <span className="flex flex-col items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                  <Upload className="w-5 h-5" />
                  Click to upload (max 10MB)
                </span>
              )}
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickImage} />
          </section>
        </div>
      </form>
    </div>
  );
};

export default NewsPopupManager;