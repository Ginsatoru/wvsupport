import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Upload, Trash2, Plus, X } from "lucide-react";
import { ModernAlert } from "../../../Modals/Alert";
import SaveButton, { useSaveProgress } from "../../../Common/SaveButton";
import { getServicesAdmin, saveServices } from "../../../../../services/servicesApi";
import posImage from "../../../../../Components/Images/pos1.webp";
import webstoreImage from "../../../../../Components/Images/webstore1.webp";
import multistoreImage from "../../../../../Components/Images/ms.webp";
import emailImage from "../../../../../Components/Images/email.webp";
import supportImage from "../../../../../Components/Images/tech.webp";

// ── Defaults (match the live section) ──
const MAX_SERVICES = 12;
const DEFAULT_IMAGES = { pos: posImage, webstore: webstoreImage, multistore: multistoreImage, hosting: emailImage, support: supportImage };
const I18N_KEYS = ["pos", "webstore", "multistore", "hosting"];
const EMPTY_TEXT = { en: "", km: "" };
const DEFAULT_SUBTITLE = {
  en: "End-to-end solutions for retail businesses, from point of sale to online store and everything in between.",
  km: "ដំណោះស្រាយគ្រប់ជ្រុងជ្រោយសម្រាប់អាជីវកម្មលក់រាយ ពីចំណុចលក់រហូតដល់ហាងអនឡាញ",
};
const DEFAULT_STATS = [
  { en: "All-in-One POS System", km: "ប្រព័ន្ធលក់ពេញលេញ" },
  { en: "Cloud-Synced Multi-Store", km: "ធ្វើសមកាលកម្មច្រើនហាងលើពពក" },
  { en: "Local AU/NZ Support Team", km: "ក្រុមគាំទ្រក្នុងតំបន់ AU/NZ" },
];
const DEFAULT_SUPPORT = {
  title: { en: "Technical Support", km: "ជំនួយបច្ចេកទេស" },
  description: {
    en: "Reliable technical assistance and troubleshooting for all our products, with fast response times and expert guidance.",
    km: "ជំនួយបច្ចេកទេស និងដោះស្រាយបញ្ហាដ៏អាចទុកចិត្តបានសម្រាប់ផលិតផលទាំងអស់របស់យើង ជាមួយពេលឆ្លើយតបលឿន និងការណែនាំពីអ្នកជំនាញ។",
  },
};

// Saved text over the defaults (empty keeps the default)
const text = (saved, fallback) => ({ en: saved?.en || fallback.en, km: saved?.km || fallback.km });

const toForm = (saved, i18n) => {
  const en = i18n.getFixedT("en");
  const km = i18n.getFixedT("km");
  const both = (key) => ({ en: en(key), km: km(key) });
  // Built-in cards, by key
  const defaults = {
    ...Object.fromEntries(
      I18N_KEYS.map((key) => [key, { title: both(`services.${key}.title`), description: both(`services.${key}.description`) }])
    ),
    support: DEFAULT_SUPPORT,
  };
  const list = saved?.items?.length ? saved.items : Object.keys(defaults).map((key) => ({ key }));
  return {
    title: text(saved?.title, both("services.header.title")),
    subtitle: text(saved?.subtitle, DEFAULT_SUBTITLE),
    stats: DEFAULT_STATS.map((d, i) => text(saved?.stats?.[i], d)),
    items: list.map((item) => {
      const d = defaults[item.key] || { title: EMPTY_TEXT, description: EMPTY_TEXT };
      return {
        key: item.key || "",
        title: text(item.title, d.title),
        description: text(item.description, d.description),
        image: item.image || "", // "" = built-in image (built-in cards only)
        file: null, // new image picked in the form
      };
    }),
  };
};

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

const ImagePicker = ({ preview, onPick, onReset }) => {
  const inputRef = useRef(null);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#0f8abe] overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-700/40"
      >
        {preview ? (
          <img src={preview} alt="" className="w-full h-full object-cover" />
        ) : (
          <Upload className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          title="Use the original image"
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          const file = e.target.files?.[0];
          e.target.value = "";
          if (file) onPick(file);
        }}
      />
    </div>
  );
};

// ── Editor: heading, 3 highlights, 5 service cards (text + image) ──
const ServicesManager = () => {
  const { i18n } = useTranslation();
  const [form, setForm] = useState(null);
  const [lang, setLang] = useState("en");
  const save = useSaveProgress();
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
  };

  const load = () =>
    getServicesAdmin()
      .then((res) => {
        setForm(toForm(res.data, i18n));
      })
      .catch((err) => {
        setForm(toForm(null, i18n));
        showAlert(err.message, "error");
      });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Bilingual input for the current language; path like ["items", 2, "title"]
  const biProps = (...path) => {
    const node = (obj) => path.reduce((n, key) => n[key], obj);
    return {
      value: node(form)[lang],
      style: lang === "km" ? KHMER_FONT : undefined,
      onChange: (e) => {
        const next = structuredClone(form);
        node(next)[lang] = e.target.value;
        setForm(next);
      },
    };
  };

  const updateItem = (i, changes) =>
    setForm((prev) => ({ ...prev, items: prev.items.map((item, j) => (j === i ? { ...item, ...changes } : item)) }));

  const pickImage = (i) => (file) => {
    if (!file.type.startsWith("image/")) return showAlert("Please choose an image file", "error");
    if (file.size > 10 * 1024 * 1024) return showAlert("Image must be 10MB or smaller", "error");
    updateItem(i, { file });
  };

  // Drop the new/uploaded image (built-in cards go back to their original image)
  const resetImage = (i) => updateItem(i, { file: null, image: "" });

  const addService = () =>
    setForm((prev) => ({
      ...prev,
      items: [...prev.items, { key: "", title: { ...EMPTY_TEXT }, description: { ...EMPTY_TEXT }, image: "", file: null }],
    }));

  const removeService = (i) => setForm((prev) => ({ ...prev, items: prev.items.filter((_, j) => j !== i) }));

  const previewOf = (item) => (item.file ? URL.createObjectURL(item.file) : item.image || DEFAULT_IMAGES[item.key] || "");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missing = form.items.findIndex((item) => !item.title.en.trim() || !previewOf(item));
    if (missing !== -1) {
      setLang("en");
      return showAlert(`Service ${missing + 1} needs an English title and an image`, "error");
    }
    try {
      const body = new FormData();
      body.append("content", JSON.stringify({ ...form, items: form.items.map(({ file, ...item }) => item) }));
      form.items.forEach((item, i) => item.file && body.append(`image${i}`, item.file));
      const res = await save.run((onProgress) => saveServices(body, onProgress));
      showAlert(res.message);
      await load();
    } catch (err) {
      showAlert(err.message, "error");
    }
  };

  if (!form) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl mx-4">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#0f8abe]" />
        <p className="text-black dark:text-white">Loading services...</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-[2fr_3fr]">
          {/* LEFT — heading + highlights */}
          <section className="px-6 py-5 space-y-3">
            <div className="flex items-center justify-between">
              <SectionTitle>Heading</SectionTitle>
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
            </div>
            <Field label="Title">
              <input className={inputClass} {...biProps("title")} />
            </Field>
            <Field label="Subtitle">
              <textarea rows={3} className={inputClass} {...biProps("subtitle")} />
            </Field>
            {form.stats.map((_, i) => (
              <Field key={i} label={`Highlight ${i + 1}`}>
                <input className={inputClass} {...biProps("stats", i)} />
              </Field>
            ))}
          </section>

          {/* RIGHT — service cards */}
          <section className="px-6 py-5 space-y-3 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <SectionTitle>Services</SectionTitle>
              <SaveButton state={save} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {form.items.map((item, i) => (
                <div key={i} className="relative rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                  <ImagePicker
                    preview={previewOf(item)}
                    onPick={pickImage(i)}
                    onReset={item.file || item.image ? () => resetImage(i) : undefined}
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-black dark:text-white">Service {i + 1}</span>
                    {form.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeService(i)}
                        className="inline-flex items-center gap-1 text-xs text-gray-500 hover:text-red-500"
                      >
                        <X className="w-3.5 h-3.5" />
                        Remove
                      </button>
                    )}
                  </div>
                  <Field label="Title">
                    <input className={inputClass} {...biProps("items", i, "title")} />
                  </Field>
                  <Field label="Description">
                    <textarea rows={3} className={inputClass} {...biProps("items", i, "description")} />
                  </Field>
                </div>
              ))}

              {form.items.length < MAX_SERVICES && (
                <button
                  type="button"
                  onClick={addService}
                  className="min-h-[14rem] rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#0f8abe] flex flex-col items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-[#0f8abe] transition-colors"
                >
                  <Plus className="w-6 h-6" />
                  Add service
                </button>
              )}
            </div>
          </section>
        </div>

      </form>
    </div>
  );
};

export default ServicesManager;