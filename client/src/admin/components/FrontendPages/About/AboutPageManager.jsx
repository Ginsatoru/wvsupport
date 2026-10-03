import React, { useEffect, useRef, useState } from "react";
import { Loader2, Upload, Trash2 } from "lucide-react";
import { ModernAlert } from "../../Modals/Alert";
import SaveButton, { useSaveProgress } from "../../Common/SaveButton";
import { getAboutPageAdmin, saveAboutPage } from "../../../../services/aboutPageApi";
import aboutImg from "../../../../Components/Images/about.webp";

// ── Defaults (match the live page) ──
const DEFAULT_TEXT = {
  eyebrow: { en: "About Us", km: "អំពីយើង" },
  headingLine1: { en: "Support that stays close", km: "ក្រុមគាំទ្រនៅជិតអតិថិជន" },
  headingLine2: { en: "to the people we help.", km: "ជានិច្ចកាល" },
  body: {
    en: "WV Support is a Siem Reap-based team delivering remote technical support for RetailManager, helping retailers across Australia, New Zealand, and the Asia-Pacific region every day.",
    km: "WV Support គឺជាក្រុមការងារនៅសៀមរាប ដែលផ្តល់ការគាំទ្របច្ចេកទេសពីចម្ងាយសម្រាប់ RetailManager ជូនអតិថិជនអូស្ត្រាលី និងតំបន់អាស៊ី-ប៉ាស៊ីហ្វិក។",
  },
};
const DEFAULT_FACTS = [
  { en: "25+ Years Trusted", km: "ទុកចិត្តជាង 25 ឆ្នាំ" },
  { en: "AU, NZ & Asia-Pacific", km: "អាស៊ី-ប៉ាស៊ីហ្វិក" },
  { en: "Siem Reap-Based Team", km: "ក្រុមការងារនៅសៀមរាប" },
];
const DEFAULT_VALUES = [
  {
    title: { en: "Reliability", km: "ភាពជឿទុកចិត្តបាន" },
    description: { en: "Consistent, dependable support your team can count on every day.", km: "ការគាំទ្រដែលអាចទុកចិត្តបាន និងស្មើគ្នារាល់ថ្ងៃ។" },
  },
  {
    title: { en: "Customer-First", km: "អតិថិជនជាចម្បង" },
    description: {
      en: "We listen first and solve problems the way that works best for you.",
      km: "យើងស្តាប់មុន ហើយដោះស្រាយតាមរបៀបដែលសមស្របបំផុតសម្រាប់អ្នក។",
    },
  },
  {
    title: { en: "Always Ready", km: "ត្រៀមខ្លួនជានិច្ច" },
    description: {
      en: "Remote support via TeamViewer and phone, whenever you need it.",
      km: "ការគាំទ្រពីចម្ងាយតាម TeamViewer និងទូរស័ព្ទ ពេលណាដែលអ្នកត្រូវការ។",
    },
  },
];

// Saved text over the defaults (empty keeps the default)
const text = (saved, fallback) => ({ en: saved?.en || fallback.en, km: saved?.km || fallback.km });

const toForm = (saved) => ({
  ...Object.fromEntries(Object.entries(DEFAULT_TEXT).map(([field, d]) => [field, text(saved?.[field], d)])),
  facts: DEFAULT_FACTS.map((d, i) => text(saved?.facts?.[i], d)),
  values: DEFAULT_VALUES.map((d, i) => ({
    title: text(saved?.values?.[i]?.title, d.title),
    description: text(saved?.values?.[i]?.description, d.description),
  })),
  image: { saved: saved?.image || "", file: null }, // saved "" = built-in image
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

// ── Editor ──
const AboutPageManager = () => {
  const [form, setForm] = useState(null);
  const [lang, setLang] = useState("en");
  const save = useSaveProgress();
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
  const fileRef = useRef(null);

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
  };

  const load = () =>
    getAboutPageAdmin()
      .then((res) => setForm(toForm(res.data)))
      .catch((err) => {
        setForm(toForm(null));
        showAlert(err.message, "error");
      });

  useEffect(() => {
    load();
  }, []);

  // Bilingual input for the current language; path like ["values", 1, "title"]
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

  const setImage = (changes) => setForm((prev) => ({ ...prev, image: { ...prev.image, ...changes } }));
  const pickImage = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
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
      const res = await save.run((onProgress) => saveAboutPage(body, onProgress));
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
        <p className="text-black dark:text-white">Loading about page...</p>
      </div>
    );
  }

  const preview = form.image.file ? URL.createObjectURL(form.image.file) : form.image.saved || aboutImg;

  return (
    <div className="px-4 bg-gray-200 dark:bg-gray-900 rounded-xl">
      {alert.show && (
        <div className="mb-4">
          <ModernAlert message={alert.message} type={alert.type} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT — intro text + quick facts */}
          <section className="px-6 py-5 space-y-3">
            <div className="flex items-center justify-between">
              <SectionTitle>Intro</SectionTitle>
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {form.facts.map((_, i) => (
                <Field key={i} label={`Fact ${i + 1}`}>
                  <input className={inputClass} {...biProps("facts", i)} />
                </Field>
              ))}
            </div>
          </section>

          {/* RIGHT — image + value cards */}
          <section className="px-6 py-5 space-y-4 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <SectionTitle>Image & values</SectionTitle>
              <SaveButton state={save} />
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full h-44 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#0f8abe] overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-700/40"
              >
                {preview ? <img src={preview} alt="" className="w-full h-full object-contain p-2" /> : <Upload className="w-5 h-5 text-gray-400" />}
              </button>
              {(form.image.file || form.image.saved) && (
                <button
                  type="button"
                  title="Use the original image"
                  onClick={() => setImage({ file: null, saved: "" })}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickImage} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {form.values.map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 space-y-3">
                  <span className="block text-xs font-medium text-gray-500 dark:text-gray-400">Value {i + 1}</span>
                  <Field label="Title">
                    <input className={inputClass} {...biProps("values", i, "title")} />
                  </Field>
                  <Field label="Description">
                    <textarea rows={3} className={inputClass} {...biProps("values", i, "description")} />
                  </Field>
                </div>
              ))}
            </div>
          </section>
        </div>
      </form>
    </div>
  );
};

export default AboutPageManager;