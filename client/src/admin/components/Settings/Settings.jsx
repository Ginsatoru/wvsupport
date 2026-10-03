import React, { useEffect, useRef, useState } from "react";
import { Loader2, Upload, Plus, X } from "lucide-react";
import { getSettings, updateSettings } from "../../../services/settingsService";
import { ModernAlert } from "../Modals/Alert";
import SaveButton, { useSaveProgress } from "../Common/SaveButton";

// Used until business hours are saved (matches the Contact page)
const DEFAULT_HOURS = [
  { day: { en: "Monday - Friday", km: "ច័ន្ទ - សុក្រ" }, time: { en: "09:00 - 20:00", km: "០៩.០០ - ២០.០០" } },
  { day: { en: "Saturday", km: "សៅរ៍" }, time: { en: "10:30 - 22:30", km: "១០.៣០ - ២២.៣០" } },
  { day: { en: "Sunday", km: "អាទិត្យ" }, time: { en: "10:30 - 22:30", km: "១០.៣០ - ២២.៣០" } },
];
const MAX_HOURS_ROWS = 7;
const EMPTY_TEXT = { en: "", km: "" };

const COMPANY_FIELDS = [
  { name: "companyName", label: "Company name" },
  { name: "phoneNumber", label: "Phone number" },
  { name: "email", label: "Email address", type: "email" },
];

// ── Form parts ──
const KHMER_FONT = { fontFamily: '"Noto Sans Khmer", "Khmer OS", sans-serif' };
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

// Logo is stored inline, so large images are shrunk first
const shrinkImage = (file, maxSide = 800) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.naturalWidth, img.naturalHeight));
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth * scale;
      canvas.height = img.naturalHeight * scale;
      canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(img.src);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("Couldn't read that image"));
    img.src = URL.createObjectURL(file);
  });

export default function SettingsPage() {
  const [form, setForm] = useState(null);
  const [lang, setLang] = useState("en");
  const save = useSaveProgress();
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
  const logoInput = useRef(null);

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
  };

  const load = (data) =>
    setForm({ ...data, businessHours: structuredClone(data?.businessHours?.length ? data.businessHours : DEFAULT_HOURS) });

  useEffect(() => {
    getSettings()
      .then(load)
      .catch(() => {
        load({});
        showAlert("Failed to load settings", "error");
      });
  }, []);

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));
  const editHours = (fn) =>
    setForm((prev) => {
      const hours = structuredClone(prev.businessHours);
      fn(hours);
      return { ...prev, businessHours: hours };
    });
  const hoursProps = (i, key) => ({
    value: form.businessHours[i][key][lang] || "",
    style: lang === "km" ? KHMER_FONT : undefined,
    onChange: (e) => editHours((hours) => (hours[i][key][lang] = e.target.value)),
  });

  const handleLogo = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return showAlert("Please choose an image file", "error");
    if (file.size > 10 * 1024 * 1024) return showAlert("Image must be 10MB or smaller", "error");
    try {
      const logo = await shrinkImage(file);
      setForm((prev) => ({ ...prev, logo }));
    } catch (err) {
      showAlert(err.message, "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.businessHours.some((row) => !row.day.en.trim() || !row.time.en.trim())) {
      setLang("en");
      return showAlert("Every business hours row needs an English day and time", "error");
    }
    try {
      const res = await save.run((onProgress) => updateSettings(form, onProgress));
      if (res?.data) load(res.data);
      showAlert("Settings saved");
    } catch (err) {
      if (err.response?.status === 401) {
        showAlert("Session expired. Please log in again.", "error");
      } else {
        showAlert(err.response?.data?.message || "Failed to save settings", "error");
      }
    }
  };

  if (!form) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#0f8abe]" />
        <p className="text-black dark:text-white">Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-200 dark:bg-gray-900 rounded-xl">
      {alert.show && (
        <div className="mb-4">
          <ModernAlert message={alert.message} type={alert.type} />
        </div>
      )}

      <h1 className="text-2xl font-bold text-black dark:text-white mb-6">Company Settings</h1>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT — company details */}
          <section className="px-6 py-5 space-y-3">
            <SectionTitle>Company</SectionTitle>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => logoInput.current?.click()}
                title="Change logo"
                className="w-16 h-16 flex-shrink-0 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#0f8abe] overflow-hidden flex items-center justify-center bg-white"
              >
                {form.logo ? (
                  <img src={form.logo} alt="" className="w-full h-full object-contain p-1" />
                ) : (
                  <Upload className="w-5 h-5 text-gray-400" />
                )}
              </button>
              <span className="text-xs font-medium text-black dark:text-white">Logo</span>
              <input ref={logoInput} type="file" accept="image/*" hidden onChange={handleLogo} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {COMPANY_FIELDS.map(({ name, label, type = "text" }) => (
                <Field key={name} label={label}>
                  <input type={type} className={inputClass} value={form[name] || ""} onChange={set(name)} />
                </Field>
              ))}
            </div>
            <Field label="Address">
              <textarea rows={2} className={inputClass} value={form.address || ""} onChange={set("address")} />
            </Field>
            <Field label="Map embed code">
              <textarea
                rows={4}
                className={`${inputClass} font-mono`}
                placeholder="Paste the Google Maps <iframe> code"
                value={form.mapEmbedCode || ""}
                onChange={set("mapEmbedCode")}
              />
            </Field>
          </section>

          {/* RIGHT — business hours */}
          <section className="px-6 py-5 space-y-3 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between gap-3">
              <SectionTitle>Business hours</SectionTitle>
              <div className="flex items-center gap-3">
                <div className="flex p-1 rounded-full bg-gray-100 dark:bg-gray-700">
                  {[
                    ["en", "English"],
                    ["km", "ខ្មែរ"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setLang(value)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        lang === value ? "bg-black text-white dark:bg-white dark:text-black" : "text-gray-600 dark:text-gray-300"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <SaveButton state={save} />
              </div>
            </div>

            {form.businessHours.map((_, i) => (
              <div key={i} className="flex items-center gap-2">
                <input className={inputClass} placeholder="Day(s)" {...hoursProps(i, "day")} />
                <input className={`${inputClass} !w-40 flex-shrink-0`} placeholder="Time" {...hoursProps(i, "time")} />
                <button
                  type="button"
                  title="Remove"
                  disabled={form.businessHours.length === 1}
                  onClick={() => editHours((hours) => hours.splice(i, 1))}
                  className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {form.businessHours.length < MAX_HOURS_ROWS && (
              <button
                type="button"
                onClick={() => editHours((hours) => hours.push({ day: { ...EMPTY_TEXT }, time: { ...EMPTY_TEXT } }))}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#0f8abe] hover:opacity-70"
              >
                <Plus className="w-3.5 h-3.5" />
                Add row
              </button>
            )}
          </section>
        </div>
      </form>
    </div>
  );
}