import React, { useEffect, useRef, useState } from "react";
import { Loader2, Upload, Trash2, Plus, X, Link as LinkIcon } from "lucide-react";
import { ModernAlert } from "../../Modals/Alert";
import SaveButton, { useSaveProgress } from "../../Common/SaveButton";
import { getCareersAdmin, saveCareers } from "../../../../services/careersApi";
import careersImg from "../../../../Components/Images/careers.webp";

// ── Defaults (match the live page) ──
const MAX_OPENINGS = 10;
const EMPTY_TEXT = { en: "", km: "" };
const DEFAULT_TEXT = {
  eyebrow: { en: "Careers", km: "ការងារ" },
  title: { en: "Join the WV Support team", km: "ចូលរួមជាមួយក្រុមការងារ WV Support" },
  body: {
    en: "We're a Siem Reap-based team delivering remote technical support for RetailManager, helping retailers across Australia, New Zealand, and the Asia-Pacific region.",
    km: "យើងជាក្រុមការងារនៅសៀមរាប ដែលផ្តល់ការគាំទ្របច្ចេកទេសពីចម្ងាយសម្រាប់ RetailManager ជូនអតិថិជនអូស្ត្រាលី និយសេឡង់ និងតំបន់អាស៊ី-ប៉ាស៊ីហ្វិក។",
  },
  boxTitle: { en: "No Openings Right Now", km: "មិនមានតំណែងបើកទេនាពេលនេះ" },
  boxText: {
    en: "We don't have any open roles at the moment, but we're always happy to hear from good people. Send us your resume and we'll reach out when a suitable opportunity comes up.",
    km: "យើងគ្មានតំណែងទំនេរនាពេលបច្ចុប្បន្នទេ ប៉ុន្តែយើងតែងតែចង់ស្គាល់មនុស្សល្អ។ ផ្ញើប្រវត្តិរូបសង្ខេបរបស់អ្នកមកយើងខ្ញុំ ហើយយើងនឹងទាក់ទងទៅវិញនៅពេលមានឱកាសសមស្រប។",
  },
  buttonText: { en: "Send Your Resume", km: "ផ្ញើប្រវត្តិរូបសង្ខេប" },
};
const DEFAULT_VALUES = [
  {
    title: { en: "Remote-First", km: "ការងារពីចម្ងាយ" },
    description: {
      en: "Our team works remotely from Siem Reap, with a focus on real outcomes, not desk time.",
      km: "ក្រុមការងាររបស់យើងធ្វើការពីចម្ងាយ ដោយផ្តោតលើលទ្ធផលការងារ។",
    },
  },
  {
    title: { en: "Real Collaboration", km: "ការងារជាក្រុម" },
    description: {
      en: "You'll work closely with clients and teammates every day, not in isolation.",
      km: "ធ្វើការជិតស្និទ្ធជាមួយអតិថិជន និងសហការីរាល់ថ្ងៃ។",
    },
  },
  {
    title: { en: "Room to Grow", km: "ការរីកចម្រើន" },
    description: {
      en: "Learn a real product inside and out, and grow your skills alongside the team.",
      km: "រៀនប្រព័ន្ធ RetailManager ពិតប្រាកដ ហើយអភិវឌ្ឍជំនាញជាមួយក្រុមការងារ។",
    },
  },
];

// Saved text over the defaults (empty keeps the default)
const text = (saved, fallback = EMPTY_TEXT) => ({ en: saved?.en || fallback.en, km: saved?.km || fallback.km });

const toForm = (saved) => ({
  ...Object.fromEntries(Object.entries(DEFAULT_TEXT).map(([field, d]) => [field, text(saved?.[field], d)])),
  buttonLink: saved?.buttonLink || "",
  values: DEFAULT_VALUES.map((d, i) => ({
    title: text(saved?.values?.[i]?.title, d.title),
    description: text(saved?.values?.[i]?.description, d.description),
  })),
  openings: (saved?.openings || []).map((o) => ({ title: text(o.title), type: text(o.type), description: text(o.description) })),
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
const CareersManager = () => {
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
    getCareersAdmin()
      .then((res) => setForm(toForm(res.data)))
      .catch((err) => {
        setForm(toForm(null));
        showAlert(err.message, "error");
      });

  useEffect(() => {
    load();
  }, []);

  // Change anything in the form via a draft copy
  const edit = (fn) =>
    setForm((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });

  // Bilingual input for the current language; path like ["openings", 0, "title"]
  const biProps = (...path) => {
    const node = (obj) => path.reduce((n, key) => n[key], obj);
    return {
      value: node(form)[lang] || "",
      style: lang === "km" ? KHMER_FONT : undefined,
      onChange: (e) => edit((next) => (node(next)[lang] = e.target.value)),
    };
  };

  const pickImage = (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) return showAlert("Please choose an image file", "error");
    if (file.size > 10 * 1024 * 1024) return showAlert("Image must be 10MB or smaller", "error");
    edit((next) => (next.image.file = file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missing = form.openings.findIndex((o) => !o.title.en.trim());
    if (missing !== -1) {
      setLang("en");
      return showAlert(`Opening ${missing + 1} needs an English title`, "error");
    }
    try {
      const body = new FormData();
      body.append("content", JSON.stringify({ ...form, image: form.image.saved }));
      if (form.image.file) body.append("image", form.image.file);
      const res = await save.run((onProgress) => saveCareers(body, onProgress));
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
        <p className="text-black dark:text-white">Loading careers page...</p>
      </div>
    );
  }

  const preview = form.image.file ? URL.createObjectURL(form.image.file) : form.image.saved || careersImg;

  return (
    <div className="px-4 bg-gray-200 dark:bg-gray-900 rounded-xl">
      {alert.show && (
        <div className="mb-4">
          <ModernAlert message={alert.message} type={alert.type} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT — intro + values */}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Eyebrow">
                <input className={inputClass} {...biProps("eyebrow")} />
              </Field>
              <Field label="Title">
                <input className={inputClass} {...biProps("title")} />
              </Field>
            </div>
            <Field label="Text">
              <textarea rows={3} className={inputClass} {...biProps("body")} />
            </Field>
            <div className="relative">
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#0f8abe] overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-700/40"
              >
                {preview ? <img src={preview} alt="" className="w-full h-full object-contain p-2" /> : <Upload className="w-5 h-5 text-gray-400" />}
              </button>
              {(form.image.file || form.image.saved) && (
                <button
                  type="button"
                  title="Use the original image"
                  onClick={() => edit((next) => (next.image = { saved: "", file: null }))}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <input ref={fileRef} type="file" accept="image/*" hidden onChange={pickImage} />
            </div>

            <div className="pt-3 space-y-3">
              <SectionTitle>Values</SectionTitle>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {form.values.map((_, i) => (
                  <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 space-y-2">
                    <input className={`${inputClass} font-semibold`} placeholder="Title" {...biProps("values", i, "title")} />
                    <textarea rows={3} className={inputClass} placeholder="Description" {...biProps("values", i, "description")} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* RIGHT — bottom box + openings */}
          <section className="px-6 py-5 space-y-3 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <SectionTitle>Openings box</SectionTitle>
              <SaveButton state={save} />
            </div>
            <Field label="Title">
              <input className={inputClass} {...biProps("boxTitle")} />
            </Field>
            <Field label="Text">
              <textarea rows={3} className={inputClass} {...biProps("boxText")} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Button text">
                <input className={inputClass} {...biProps("buttonText")} />
              </Field>
              <Field label="Button link">
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    className={`${inputClass} pl-9`}
                    placeholder="Email from Settings"
                    value={form.buttonLink}
                    onChange={(e) => setForm((prev) => ({ ...prev, buttonLink: e.target.value }))}
                  />
                </div>
              </Field>
            </div>

            <div className="pt-3 space-y-3">
              <SectionTitle>Open roles</SectionTitle>
              {form.openings.map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <input className={`${inputClass} font-semibold`} placeholder="Role title" {...biProps("openings", i, "title")} />
                    <input className={`${inputClass} !w-36 flex-shrink-0`} placeholder="Full-time" {...biProps("openings", i, "type")} />
                    <button
                      type="button"
                      title="Remove"
                      onClick={() => edit((next) => next.openings.splice(i, 1))}
                      className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <textarea rows={3} className={inputClass} placeholder="Description" {...biProps("openings", i, "description")} />
                </div>
              ))}
              {form.openings.length < MAX_OPENINGS && (
                <button
                  type="button"
                  onClick={() =>
                    edit((next) =>
                      next.openings.push({ title: { ...EMPTY_TEXT }, type: { ...EMPTY_TEXT }, description: { ...EMPTY_TEXT } })
                    )
                  }
                  className="inline-flex items-center gap-1 text-xs font-medium text-[#0f8abe] hover:opacity-70"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add role
                </button>
              )}
            </div>
          </section>
        </div>
      </form>
    </div>
  );
};

export default CareersManager;