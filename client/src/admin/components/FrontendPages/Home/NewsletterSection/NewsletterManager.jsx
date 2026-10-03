import React, { useEffect, useRef, useState } from "react";
import { Loader2, Upload, Trash2 } from "lucide-react";
import { ModernAlert } from "../../../Modals/Alert";
import SaveButton, { useSaveProgress } from "../../../Common/SaveButton";
import { getNewsletterContentAdmin, saveNewsletterContent } from "../../../../../services/newsletterContentApi";
import mockupImg from "../../../../../Components/Images/mockup.webp";

// ── Defaults (match the live section) ──
const DEFAULT_TEXT = {
  title: { en: "Subscribe to our newsletter to receive our daily news", km: "ចុះឈ្មោះទទួលព្រឹត្តិបត្រព័ត៌មានរបស់យើង" },
  description: {
    en: "Get the latest updates, news and product offers delivered directly to your inbox. Stay informed and never miss what matters most to your business.",
    km: "ទទួលបានព័ត៌មានថ្មីៗ ការអាប់ដេត និងការផ្តល់ជូនផ្នែកផលិតផលផ្ញើដោយផ្ទាល់មកកាន់ប្រអប់សំបុត្ររបស់អ្នក។ នៅជាប់ជាមួយព័ត៌មានដ៏សំខាន់សម្រាប់អាជីវកម្មរបស់អ្នក។",
  },
  placeholder: { en: "Enter your email", km: "បញ្ចូលអ៊ីមែលរបស់អ្នក" },
  buttonText: { en: "Subscribe", km: "ចុះឈ្មោះ" },
  successTitle: { en: "You're subscribed!", km: "អ្នកបានចុះឈ្មោះហើយ!" },
  successText: {
    en: "Thanks for subscribing. You'll receive our latest news and updates.",
    km: "សូមអរគុណចំពោះការចុះឈ្មោះ។ អ្នកនឹងទទួលបានព័ត៌មានថ្មីៗរបស់យើង។",
  },
};

// Saved text over the defaults (empty keeps the default)
const text = (saved, fallback) => ({ en: saved?.en || fallback.en, km: saved?.km || fallback.km });

const toForm = (saved) => ({
  ...Object.fromEntries(Object.entries(DEFAULT_TEXT).map(([field, d]) => [field, text(saved?.[field], d)])),
  image: { saved: saved?.image || "", file: null }, // saved "" = built-in mockup
});

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
        className="w-full h-48 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#0f8abe] overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-700/40"
      >
        {preview ? <img src={preview} alt="" className="w-full h-full object-contain p-2" /> : <Upload className="w-5 h-5 text-gray-400" />}
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

// ── Editor ──
const NewsletterManager = () => {
  const [form, setForm] = useState(null);
  const [lang, setLang] = useState("en");
  const save = useSaveProgress();
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
  };

  const load = () =>
    getNewsletterContentAdmin()
      .then((res) => setForm(toForm(res.data)))
      .catch((err) => {
        setForm(toForm(null));
        showAlert(err.message, "error");
      });

  useEffect(() => {
    load();
  }, []);

  const biProps = (field) => ({
    value: form[field][lang],
    style: lang === "km" ? KHMER_FONT : undefined,
    onChange: (e) => setForm((prev) => ({ ...prev, [field]: { ...prev[field], [lang]: e.target.value } })),
  });

  const setImage = (changes) => setForm((prev) => ({ ...prev, image: { ...prev.image, ...changes } }));
  const pickImage = (file) => {
    if (!file.type.startsWith("image/")) return showAlert("Please choose an image file", "error");
    if (file.size > 10 * 1024 * 1024) return showAlert("Image must be 10MB or smaller", "error");
    setImage({ file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const body = new FormData();
      body.append("content", JSON.stringify({ ...form, image: form.image.saved }));
      if (form.image.file) body.append("image", form.image.file);
      const res = await save.run((onProgress) => saveNewsletterContent(body, onProgress));
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
        <p className="text-black dark:text-white">Loading newsletter section...</p>
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
          {/* LEFT — signup block text */}
          <section className="px-6 py-5 space-y-3">
            <div className="flex items-center justify-between">
              <SectionTitle>Text</SectionTitle>
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
              <textarea rows={2} className={inputClass} {...biProps("title")} />
            </Field>
            <Field label="Description">
              <textarea rows={4} className={inputClass} {...biProps("description")} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Email placeholder">
                <input className={inputClass} {...biProps("placeholder")} />
              </Field>
              <Field label="Button text">
                <input className={inputClass} {...biProps("buttonText")} />
              </Field>
            </div>
          </section>

          {/* RIGHT — mockup + success pop-up */}
          <section className="px-6 py-5 space-y-4 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <SectionTitle>Image & success message</SectionTitle>
              <SaveButton state={save} />
            </div>
            <Field label="Mockup image">
              <ImagePicker
                preview={form.image.file ? URL.createObjectURL(form.image.file) : form.image.saved || mockupImg}
                onPick={pickImage}
                onReset={form.image.file || form.image.saved ? () => setImage({ file: null, saved: "" }) : undefined}
              />
            </Field>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 space-y-3">
              <span className="block text-xs font-medium text-gray-500 dark:text-gray-400">After subscribing</span>
              <Field label="Title">
                <input className={inputClass} {...biProps("successTitle")} />
              </Field>
              <Field label="Message">
                <textarea rows={2} className={inputClass} {...biProps("successText")} />
              </Field>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
};

export default NewsletterManager;