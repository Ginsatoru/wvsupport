import React, { useEffect, useState } from "react";
import { Loader2, Plus, X, ChevronUp, ChevronDown } from "lucide-react";
import { ModernAlert } from "../../Modals/Alert";
import { getLegalAdmin, saveLegal } from "../../../../services/legalApi";

// ── Defaults (match the live page) ──
const MAX_SECTIONS = 20;
const EMPTY_TEXT = { en: "", km: "" };
const DEFAULT_TEXT = {
  eyebrow: { en: "Legal", km: "លក្ខខណ្ឌ" },
  title: { en: "Terms & Conditions", km: "លក្ខខណ្ឌ និងលក្ខខណ្ឌប្រើប្រាស់" },
};
const DEFAULT_SECTIONS = [
  {
    title: { en: "Welcome", km: "សេចក្តីស្វាគមន៍" },
    body: {
      en: "Welcome to WV Support Services Cambodia. By using this website, you agree to be bound by the terms outlined on this page. Please read them carefully before continuing to use our services.",
      km: "សូមស្វាគមន៍មកកាន់គេហទំព័ររបស់ WV Support Services Cambodia។ ដោយប្រើប្រាស់គេហទំព័រនេះ អ្នកយល់ព្រមតាមលក្ខខណ្ឌដែលបានរៀបរាប់ក្នុងទំព័រនេះ។ សូមអានលក្ខខណ្ឌទាំងនេះដោយប្រុងប្រយ័ត្នមុននឹងបន្តប្រើប្រាស់សេវាកម្មរបស់យើង។",
    },
  },
  {
    title: { en: "Use of Services", km: "ការប្រើប្រាស់សេវាកម្ម" },
    body: {
      en: "We provide remote technical support services for RetailManager to clients across Australia, New Zealand, and the Asia-Pacific region. You agree to use these services only for lawful purposes and not to engage in any activity that could disrupt our systems or affect other clients.",
      km: "យើងផ្តល់សេវាកម្មគាំទ្របច្ចេកទេសពីចម្ងាយសម្រាប់ RetailManager ជូនអតិថិជននៅអូស្ត្រាលី និយសេឡង់ និងតំបន់អាស៊ី-ប៉ាស៊ីហ្វិក។ អ្នកយល់ព្រមប្រើប្រាស់សេវាកម្មទាំងនេះសម្រាប់គោលបំណងស្របច្បាប់តែប៉ុណ្ណោះ ហើយមិនធ្វើសកម្មភាពណាមួយដែលអាចប៉ះពាល់ដល់ប្រព័ន្ធ ឬអតិថិជនផ្សេងទៀតឡើយ។",
    },
  },
  {
    title: { en: "Intellectual Property", km: "កម្មសិទ្ធិបញ្ញា" },
    body: {
      en: "The content, branding, and materials on this website belong to WV Support Services Cambodia or its partners, including AAAPOS RetailManager. Copying or reusing this material without written permission is not permitted.",
      km: "មាតិកា និន្នការ និមិត្តសញ្ញា និងសម្ភារៈផ្សេងទៀតនៅលើគេហទំព័រនេះជាកម្មសិទ្ធិរបស់ WV Support Services Cambodia ឬដៃគូរបស់ខ្លួន ដូចជា AAAPOS RetailManager ជាដើម។ ការចម្លង ឬប្រើប្រាស់ឡើងវិញដោយគ្មានការអនុញ្ញាតជាលាយលក្ខណ៍អក្សរគឺមិនត្រូវបានអនុញ្ញាតឡើយ។",
    },
  },
  {
    title: { en: "Limitation of Liability", km: "កម្រិតនៃការទទួលខុសត្រូវ" },
    body: {
      en: "WV Support Services Cambodia works hard to provide reliable support, but we do not guarantee that our services will always be uninterrupted or error-free. We are not liable for any loss arising from your use of, or inability to use, our services.",
      km: "WV Support Services Cambodia ខិតខំផ្តល់សេវាកម្មគាំទ្រយ៉ាងអាចទុកចិត្តបាន ប៉ុន្តែយើងមិនធានាថាសេវាកម្មនឹងគ្មានការរំខាន ឬកំហុសទាំងស្រុងឡើយ។ យើងមិនទទួលខុសត្រូវចំពោះការខាតបង់ណាមួយដែលកើតឡើងពីការប្រើប្រាស់ ឬការមិនអាចប្រើប្រាស់សេវាកម្មរបស់យើងបានឡើយ។",
    },
  },
  {
    title: { en: "Changes to These Terms", km: "ការផ្លាស់ប្តូរលក្ខខណ្ឌ" },
    body: {
      en: "We may update these terms from time to time. Continued use of our website or services after any changes means you accept the updated terms.",
      km: "យើងអាចធ្វើបច្ចុប្បន្នភាពលក្ខខណ្ឌទាំងនេះជាកាលៈទេសៈ។ ការបន្តប្រើប្រាស់គេហទំព័រ ឬសេវាកម្មរបស់យើងបន្ទាប់ពីមានការផ្លាស់ប្តូរ មានន័យថាអ្នកយល់ព្រមទទួលយកលក្ខខណ្ឌដែលបានធ្វើបច្ចុប្បន្នភាព។",
    },
  },
  {
    title: { en: "Contact Us", km: "ទាក់ទងមកយើងខ្ញុំ" },
    body: {
      en: "If you have any questions about these terms, please contact us at wvservicescambodia@gmail.com or +855 974 839 135.",
      km: "ប្រសិនបើអ្នកមានសំណួរអំពីលក្ខខណ្ឌទាំងនេះ សូមទាក់ទងមកយើងខ្ញុំតាមរយៈ wvservicescambodia@gmail.com ឬលេខទូរស័ព្ទ +855 974 839 135។",
    },
  },
];

const text = (saved, fallback = EMPTY_TEXT) => ({ en: saved?.en || fallback.en, km: saved?.km || fallback.km });
const toForm = (saved) => ({
  ...Object.fromEntries(Object.entries(DEFAULT_TEXT).map(([field, d]) => [field, text(saved?.[field], d)])),
  sections: (saved?.sections?.length ? saved.sections : DEFAULT_SECTIONS).map((s) => ({ title: text(s.title), body: text(s.body) })),
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

const IconButton = ({ title, onClick, disabled, danger, children }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    disabled={disabled}
    className={`p-1.5 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 ${
      danger ? "hover:text-red-500" : "hover:text-black dark:hover:text-white"
    }`}
  >
    {children}
  </button>
);

// ── Editor ──
const LegalManager = () => {
  const [form, setForm] = useState(null);
  const [lang, setLang] = useState("en");
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
  };

  const load = () =>
    getLegalAdmin()
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

  // Bilingual input for the current language; path like ["sections", 2, "title"]
  const biProps = (...path) => {
    const node = (obj) => path.reduce((n, key) => n[key], obj);
    return {
      value: node(form)[lang] || "",
      style: lang === "km" ? KHMER_FONT : undefined,
      onChange: (e) => edit((next) => (node(next)[lang] = e.target.value)),
    };
  };

  const moveSection = (i, step) =>
    edit((next) => ([next.sections[i], next.sections[i + step]] = [next.sections[i + step], next.sections[i]]));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missing = form.sections.findIndex((s) => !s.title.en.trim() || !s.body.en.trim());
    if (missing !== -1) {
      setLang("en");
      return showAlert(`Section ${missing + 1} needs an English heading and text`, "error");
    }
    setSaving(true);
    try {
      const res = await saveLegal(form);
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
        <p className="text-black dark:text-white">Loading legal page...</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr]">
          {/* LEFT — heading */}
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
            <Field label="Eyebrow">
              <input className={inputClass} {...biProps("eyebrow")} />
            </Field>
            <Field label="Title">
              <input className={inputClass} {...biProps("title")} />
            </Field>
          </section>

          {/* RIGHT — sections */}
          <section className="px-6 py-5 space-y-3 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <SectionTitle>Sections</SectionTitle>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-[#0f8abe] hover:bg-[#0d7aaa] disabled:opacity-50"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save changes
              </button>
            </div>

            {form.sections.map((_, i) => (
              <div key={i} className="flex gap-2 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
                <div className="flex flex-col">
                  <IconButton title="Move up" disabled={i === 0} onClick={() => moveSection(i, -1)}>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </IconButton>
                  <IconButton title="Move down" disabled={i === form.sections.length - 1} onClick={() => moveSection(i, 1)}>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </IconButton>
                </div>
                <div className="flex-1 space-y-2">
                  <input className={`${inputClass} font-semibold`} placeholder="Heading" {...biProps("sections", i, "title")} />
                  <textarea rows={4} className={inputClass} placeholder="Text" {...biProps("sections", i, "body")} />
                </div>
                <IconButton
                  title="Remove"
                  danger
                  disabled={form.sections.length === 1}
                  onClick={() => edit((next) => next.sections.splice(i, 1))}
                >
                  <X className="w-3.5 h-3.5" />
                </IconButton>
              </div>
            ))}

            {form.sections.length < MAX_SECTIONS && (
              <button
                type="button"
                onClick={() => edit((next) => next.sections.push({ title: { ...EMPTY_TEXT }, body: { ...EMPTY_TEXT } }))}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#0f8abe] hover:opacity-70"
              >
                <Plus className="w-3.5 h-3.5" />
                Add section
              </button>
            )}
          </section>
        </div>
      </form>
    </div>
  );
};

export default LegalManager;