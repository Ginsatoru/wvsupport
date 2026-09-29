import React, { useEffect, useRef, useState } from "react";
import { Loader2, Upload, Trash2, Link as LinkIcon } from "lucide-react";
import { ModernAlert } from "../../../Modals/Alert";
import { getWorkAdmin, saveWork } from "../../../../../services/workApi";
import workImg from "../../../../../Components/Images/work.webp";
import teamviewerLogo from "../../../../../Components/Images/tools/teamviewer.webp";
import hubspotLogo from "../../../../../Components/Images/tools/hubspot.webp";
import aircallLogo from "../../../../../Components/Images/tools/aircall.webp";
import jiraLogo from "../../../../../Components/Images/tools/jira.webp";

// ── Defaults (match the live section) ──
const DEFAULT_TEXT = {
  eyebrow: { en: "Our Base, Your Backbone", km: "មូលដ្ឋានការងាររបស់យើង" },
  headingLine1: { en: "We do the work,", km: "យើងធ្វើការ" },
  headingLine2: { en: "so you focus on", km: "អ្នកផ្តោតលើ" },
  headingLine3: { en: "what matters.", km: "អ្វីដែលសំខាន់។" },
  body: {
    en: "Our Siem Reap-based team delivers expert remote support, phone assistance, and RetailManager system management to Australian clients, reliably, every day.",
    km: "ក្រុមការងាររបស់យើងនៅសៀមរាបផ្តល់ការជំនួយបច្ចេកទេសពីចម្ងាយ ការទូរស័ព្ទ និងការគ្រប់គ្រងប្រព័ន្ធ RetailManager ដល់អតិថិជនអូស្ត្រាលី ២៤/៧។",
  },
  buttonText: { en: "Learn More", km: "ស្វែងយល់បន្ថែម" },
  toolsLabel: { en: "Tools we work with", km: "ឧបករណ៍ដែលយើងប្រើ" },
  badgeLeftTitle: { en: "100% Remote", km: "ពីចម្ងាយ ១០០%" },
  badgeLeftText: { en: "Via TeamViewer", km: "ភ្ជាប់ជា TeamViewer" },
  badgeRightTitle: { en: "15 Min Response", km: "ឆ្លើយតបក្នុង ១៥ នាទី" },
  badgeRightText: { en: "Avg. Response Time", km: "ពេលវេលាឆ្លើយតបជាមធ្យម" },
};
const DEFAULT_TOOLS = [
  { name: "TeamViewer", logo: teamviewerLogo },
  { name: "HubSpot", logo: hubspotLogo },
  { name: "Aircall", logo: aircallLogo },
  { name: "Jira", logo: jiraLogo },
];
const DEFAULT_CARDS = [
  {
    title: { en: "Remote Support", km: "ការជំនួយពីចម្ងាយ" },
    description: { en: "TeamViewer-powered troubleshooting for POS issues in real time.", km: "ភ្ជាប់ TeamViewer ដោះស្រាយបញ្ហា POS ក្នុងពេលភ្លាមៗ" },
  },
  {
    title: { en: "Phone Assistance", km: "ជំនួយតាមទូរស័ព្ទ" },
    description: { en: "Under 15-minute response for critical issues via direct phone line.", km: "ការឆ្លើយតបក្នុងរយៈពេល ១៥ នាទីសម្រាប់បញ្ហាបន្ទាន់" },
  },
  {
    title: { en: "Email & Ticket Support", km: "ការគាំទ្រតាមអ៊ីមែល" },
    description: { en: "Structured ticketing system with full request tracking and logging.", km: "ប្រព័ន្ធ ticket ស្វ័យប្រវត្តិ ជាមួយការតាមដានសំណើ" },
  },
  {
    title: { en: "System Management", km: "ការគ្រប់គ្រងប្រព័ន្ធ" },
    description: {
      en: "RetailManager monitoring, updates, database optimization, and health checks.",
      km: "ត្រួតពិនិត្យ RetailManager, ធ្វើបច្ចុប្បន្នភាព និងបង្កើនប្រសិទ្ធភាព",
    },
  },
];

// Saved text over the defaults (empty keeps the default)
const text = (saved, fallback) => ({ en: saved?.en || fallback.en, km: saved?.km || fallback.km });

const toForm = (saved) => ({
  ...Object.fromEntries(Object.entries(DEFAULT_TEXT).map(([field, d]) => [field, text(saved?.[field], d)])),
  buttonLink: saved?.buttonLink || "https://aaapos.com/support",
  cards: DEFAULT_CARDS.map((d, i) => ({
    title: text(saved?.cards?.[i]?.title, d.title),
    description: text(saved?.cards?.[i]?.description, d.description),
  })),
  tools: DEFAULT_TOOLS.map((d, i) => ({
    name: saved?.tools?.[i]?.name || d.name,
    logo: saved?.tools?.[i]?.logo || "", // "" = built-in logo
    file: null,
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

const ImagePicker = ({ preview, onPick, onReset, className = "h-40" }) => {
  const inputRef = useRef(null);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`w-full ${className} rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#0f8abe] overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-700/40`}
      >
        {preview ? <img src={preview} alt="" className="w-full h-full object-contain p-1" /> : <Upload className="w-5 h-5 text-gray-400" />}
      </button>
      {onReset && (
        <button
          type="button"
          onClick={onReset}
          title="Use the original image"
          className="absolute -top-1.5 -right-1.5 p-1 rounded-full bg-black/70 text-white hover:bg-black"
        >
          <Trash2 className="w-3 h-3" />
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
const WorkManager = () => {
  const [form, setForm] = useState(null);
  const [lang, setLang] = useState("en");
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
  };

  const load = () =>
    getWorkAdmin()
      .then((res) => setForm(toForm(res.data)))
      .catch((err) => {
        setForm(toForm(null));
        showAlert(err.message, "error");
      });

  useEffect(() => {
    load();
  }, []);

  // Bilingual input for the current language; path like ["cards", 2, "title"]
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
  const plainProps = (field) => ({ value: form[field], onChange: (e) => setForm((prev) => ({ ...prev, [field]: e.target.value })) });

  const checkImage = (file) => {
    if (!file.type.startsWith("image/")) return showAlert("Please choose an image file", "error"), false;
    if (file.size > 10 * 1024 * 1024) return showAlert("Image must be 10MB or smaller", "error"), false;
    return true;
  };
  const setTool = (i, changes) =>
    setForm((prev) => ({ ...prev, tools: prev.tools.map((t, j) => (j === i ? { ...t, ...changes } : t)) }));
  const setPerson = (changes) => setForm((prev) => ({ ...prev, image: { ...prev.image, ...changes } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = new FormData();
      body.append(
        "content",
        JSON.stringify({ ...form, image: form.image.saved, tools: form.tools.map(({ file, ...t }) => t) })
      );
      if (form.image.file) body.append("image", form.image.file);
      form.tools.forEach((t, i) => t.file && body.append(`tool${i}`, t.file));
      const res = await saveWork(body);
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
        <p className="text-black dark:text-white">Loading work section...</p>
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
          {/* LEFT — text + tools */}
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[1, 2, 3].map((n) => (
                <Field key={n} label={`Heading line ${n}`}>
                  <input className={inputClass} {...biProps(`headingLine${n}`)} />
                </Field>
              ))}
            </div>
            <Field label="Body">
              <textarea rows={3} className={inputClass} {...biProps("body")} />
            </Field>
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
            <Field label="Tools label">
              <input className={inputClass} {...biProps("toolsLabel")} />
            </Field>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {form.tools.map((tool, i) => (
                <div key={i} className="space-y-2">
                  <ImagePicker
                    className="h-14"
                    preview={tool.file ? URL.createObjectURL(tool.file) : tool.logo || DEFAULT_TOOLS[i].logo}
                    onPick={(file) => checkImage(file) && setTool(i, { file })}
                    onReset={tool.file || tool.logo ? () => setTool(i, { file: null, logo: "" }) : undefined}
                  />
                  <input className={inputClass} value={tool.name} onChange={(e) => setTool(i, { name: e.target.value })} />
                </div>
              ))}
            </div>
          </section>

          {/* RIGHT — person, badges, service cards */}
          <section className="px-6 py-5 space-y-4 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <SectionTitle>Image, badges & cards</SectionTitle>
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
                className="h-44"
                preview={form.image.file ? URL.createObjectURL(form.image.file) : form.image.saved || workImg}
                onPick={(file) => checkImage(file) && setPerson({ file })}
                onReset={form.image.file || form.image.saved ? () => setPerson({ file: null, saved: "" }) : undefined}
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ["badgeLeft", "Top badge"],
                ["badgeRight", "Bottom badge"],
              ].map(([key, label]) => (
                <div key={key} className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 space-y-3">
                  <span className="block text-xs font-medium text-gray-500 dark:text-gray-400">{label}</span>
                  <Field label="Title">
                    <input className={inputClass} {...biProps(`${key}Title`)} />
                  </Field>
                  <Field label="Text">
                    <input className={inputClass} {...biProps(`${key}Text`)} />
                  </Field>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {form.cards.map((_, i) => (
                <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 space-y-3">
                  <span className="block text-xs font-medium text-gray-500 dark:text-gray-400">Service card {i + 1}</span>
                  <Field label="Title">
                    <input className={inputClass} {...biProps("cards", i, "title")} />
                  </Field>
                  <Field label="Description">
                    <textarea rows={2} className={inputClass} {...biProps("cards", i, "description")} />
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

export default WorkManager;