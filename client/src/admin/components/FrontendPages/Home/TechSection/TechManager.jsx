import React, { useEffect, useRef, useState } from "react";
import { Loader2, Upload, Trash2, Link as LinkIcon } from "lucide-react";
import { ModernAlert } from "../../../Modals/Alert";
import { getTechAdmin, saveTech } from "../../../../../services/techApi";
import retailGuy from "../../../../../Components/Images/retail-guy.webp";

// ── Defaults (match the live section) ──
const DEFAULT_TEXT = {
  eyebrow: { en: "Next-Gen Retail Technology", km: "បច្ចេកវិទ្យាលក់រាយជំនាន់ក្រោយ" },
  headingLine1: { en: "Over 60,000+ Retailers", km: "អ្នកលក់រាយជាង 60,000+ នាក់" },
  headingLine2: { en: "Managing Smarter", km: "គ្រប់គ្រងឆ្លាតជាងមុន" },
  body: {
    en: "RetailManager is coming to mobile and tablet, fully synced with your desktop in real time. Manage inventory, sales, and staff from anywhere, on any device, without missing a beat.",
    km: "RetailManager កំពុងមកដល់ទូរស័ព្ទ និងថេប្លេត ធ្វើសមកាលកម្មពេញលេញជាមួយកុំព្យូទ័ររបស់អ្នកក្នុងពេលវេលាជាក់ស្តែង។ គ្រប់គ្រងស្ទុក លក់ និងបុគ្គលិកពីគ្រប់ទីកន្លែង។",
  },
  statLabel: { en: "active businesses", km: "អាជីវកម្មសកម្ម" },
  badgeTitle: { en: "Multi-Device Sync", km: "សមកាលកម្មពហុឧបករណ៍" },
  badgeText: { en: "Real-time across all platforms", km: "ពេលវេលាជាក់ស្តែងគ្រប់ Platform" },
  cardTitle: { en: "RM Mobile", km: "RM ម៉ូបាល" },
  cardText: {
    en: "Available on iOS & Android\nSyncs instantly with desktop",
    km: "មានជា iOS & Android\nធ្វើសមកាលកម្មភ្លាមៗ",
  },
  buttonText: { en: "Learn More", km: "ស្វែងយល់បន្ថែម" },
};
const DEFAULT_DEVICES = [
  { en: "iOS App", km: "iOS កម្មវិធី" },
  { en: "Android App", km: "Android កម្មវិធី" },
  { en: "Desktop", km: "កុំព្យូទ័រ" },
  { en: "Tablet", km: "ថេប្លេត" },
];
const DEFAULT_AVATARS = [
  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=64&h=64&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=64&h=64&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
];

// Saved text over the defaults (empty keeps the default)
const text = (saved, fallback) => ({ en: saved?.en || fallback.en, km: saved?.km || fallback.km });

const toForm = (saved) => ({
  ...Object.fromEntries(Object.entries(DEFAULT_TEXT).map(([field, d]) => [field, text(saved?.[field], d)])),
  devices: DEFAULT_DEVICES.map((d, i) => text(saved?.devices?.[i], d)),
  statNumber: saved?.statNumber || "60,000+",
  buttonLink: saved?.buttonLink || "https://www.aaapos.com/",
  image: { saved: saved?.image || "", file: null }, // saved "" = built-in image
  avatars: DEFAULT_AVATARS.map((_, i) => ({ saved: saved?.avatars?.[i] || "", file: null })),
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

const ImagePicker = ({ preview, onPick, onReset, className = "h-40", round }) => {
  const inputRef = useRef(null);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`w-full ${className} ${round ? "rounded-full" : "rounded-xl"} border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#0f8abe] overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-700/40`}
      >
        {preview ? (
          <img src={preview} alt="" className={`w-full h-full ${round ? "object-cover" : "object-contain"}`} />
        ) : (
          <Upload className="w-5 h-5 text-gray-400" />
        )}
      </button>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          title="Use the original image"
          className={`absolute ${round ? "-top-1 -right-1 p-1" : "top-2 right-2 p-1.5"} rounded-full bg-black/70 text-white hover:bg-black`}
        >
          <Trash2 className={round ? "w-3 h-3" : "w-3.5 h-3.5"} />
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
const TechManager = () => {
  const [form, setForm] = useState(null);
  const [lang, setLang] = useState("en");
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
  };

  const load = () =>
    getTechAdmin()
      .then((res) => setForm(toForm(res.data)))
      .catch((err) => {
        setForm(toForm(null));
        showAlert(err.message, "error");
      });

  useEffect(() => {
    load();
  }, []);

  // Bilingual input for the current language; path like ["devices", 2]
  const biProps = (...path) => {
    const node = (obj) => path.reduce((n, key) => n[key], obj);
    return {
      value: node(form)[lang],
      style: lang === "km" ? KHMER_FONT : undefined,
      onChange: (e) => {
        const next = { ...form, devices: form.devices.map((d) => ({ ...d })) };
        path.length === 1 ? (next[path[0]] = { ...form[path[0]], [lang]: e.target.value }) : (node(next)[lang] = e.target.value);
        setForm(next);
      },
    };
  };
  const plainProps = (field) => ({ value: form[field], onChange: (e) => setForm((prev) => ({ ...prev, [field]: e.target.value })) });

  const checkImage = (file) => {
    if (!file.type.startsWith("image/")) return showAlert("Please choose an image file", "error"), false;
    if (file.size > 10 * 1024 * 1024) return showAlert("Image must be 10MB or smaller", "error"), false;
    return true;
  };
  const setPerson = (changes) => setForm((prev) => ({ ...prev, image: { ...prev.image, ...changes } }));
  const setAvatar = (i, changes) =>
    setForm((prev) => ({ ...prev, avatars: prev.avatars.map((a, j) => (j === i ? { ...a, ...changes } : a)) }));
  const previewOf = (img, fallback) => (img.file ? URL.createObjectURL(img.file) : img.saved || fallback);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = new FormData();
      body.append(
        "content",
        JSON.stringify({ ...form, image: form.image.saved, avatars: form.avatars.map((a) => a.saved) })
      );
      if (form.image.file) body.append("image", form.image.file);
      form.avatars.forEach((a, i) => a.file && body.append(`avatar${i}`, a.file));
      const res = await saveTech(body);
      showAlert(res.message);
      await load();
    } catch (err) {
      showAlert(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (!form) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl mx-4">
        <Loader2 className="w-8 h-8 animate-spin mb-3 text-[#0f8abe]" />
        <p className="text-black dark:text-white">Loading tech section...</p>
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
          {/* LEFT — text */}
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
            <Field label="Eyebrow">
              <input className={inputClass} {...biProps("eyebrow")} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Heading line 1">
                <input className={inputClass} {...biProps("headingLine1")} />
              </Field>
              <Field label="Heading line 2">
                <input className={inputClass} {...biProps("headingLine2")} />
              </Field>
            </div>
            <Field label="Body">
              <textarea rows={4} className={inputClass} {...biProps("body")} />
            </Field>
            <div className="grid grid-cols-[1fr_2fr] gap-3">
              <Field label="Figure">
                <input className={inputClass} {...plainProps("statNumber")} />
              </Field>
              <Field label="Figure label">
                <input className={inputClass} {...biProps("statLabel")} />
              </Field>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {form.devices.map((_, i) => (
                <Field key={i} label={`Badge ${i + 1}`}>
                  <input className={inputClass} {...biProps("devices", i)} />
                </Field>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Button text">
                <input className={inputClass} {...biProps("buttonText")} />
              </Field>
              <Field label="Button link">
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input className={`${inputClass} pl-9`} {...plainProps("buttonLink")} />
                </div>
              </Field>
            </div>
          </section>

          {/* RIGHT — images + floating cards */}
          <section className="px-6 py-5 space-y-4 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <SectionTitle>Images & cards</SectionTitle>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-[#0f8abe] hover:bg-[#0d7aaa] disabled:opacity-50"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save changes
              </button>
            </div>

            <Field label="Person image">
              <ImagePicker
                className="h-48"
                preview={previewOf(form.image, retailGuy)}
                onPick={(file) => checkImage(file) && setPerson({ file })}
                onReset={form.image.file || form.image.saved ? () => setPerson({ file: null, saved: "" }) : undefined}
              />
            </Field>

            <div className="space-y-1">
              <span className="text-xs font-medium text-black dark:text-white">Avatars</span>
              <div className="flex gap-3">
                {form.avatars.map((avatar, i) => (
                  <div key={i} className="w-14">
                    <ImagePicker
                      round
                      className="h-14"
                      preview={previewOf(avatar, DEFAULT_AVATARS[i])}
                      onPick={(file) => checkImage(file) && setAvatar(i, { file })}
                      onReset={avatar.file || avatar.saved ? () => setAvatar(i, { file: null, saved: "" }) : undefined}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 space-y-3">
                <span className="block text-xs font-medium text-gray-500 dark:text-gray-400">Top card</span>
                <Field label="Title">
                  <input className={inputClass} {...biProps("badgeTitle")} />
                </Field>
                <Field label="Text">
                  <input className={inputClass} {...biProps("badgeText")} />
                </Field>
              </div>
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 space-y-3">
                <span className="block text-xs font-medium text-gray-500 dark:text-gray-400">Bottom card</span>
                <Field label="Title">
                  <input className={inputClass} {...biProps("cardTitle")} />
                </Field>
                <Field label="Text">
                  <textarea rows={2} className={inputClass} {...biProps("cardText")} />
                </Field>
              </div>
            </div>
          </section>
        </div>
      </form>
    </div>
  );
};

export default TechManager;