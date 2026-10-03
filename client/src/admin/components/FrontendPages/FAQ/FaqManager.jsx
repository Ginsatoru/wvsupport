import React, { useEffect, useState } from "react";
import { Loader2, Plus, X, ChevronUp, ChevronDown } from "lucide-react";
import { ModernAlert } from "../../Modals/Alert";
import SaveButton, { useSaveProgress } from "../../Common/SaveButton";
import { getFaqAdmin, saveFaq } from "../../../../services/faqApi";

// ── Defaults (match the live page) ──
const MAX_ITEMS = 30;
const EMPTY_TEXT = { en: "", km: "" };
const DEFAULT_TEXT = {
  eyebrow: { en: "FAQ", km: "សំណួរញឹកញាប់" },
  title: { en: "Frequently Asked Questions", km: "សំណួរដែលសួរញឹកញាប់" },
  intro: {
    en: "Answers to a few common questions about our services. Can't find what you're looking for? Reach out to us directly.",
    km: "នេះជាចម្លើយចំពោះសំណួរទូទៅមួយចំនួនអំពីសេវាកម្មរបស់យើង។ រកមិនឃើញអ្វីដែលអ្នកកំពុងស្វែងរក? ទាក់ទងមកយើងខ្ញុំដោយផ្ទាល់។",
  },
};
const DEFAULT_ITEMS = [
  {
    question: { en: "What is RetailManager?", km: "តើ RetailManager ជាអ្វី?" },
    answer: {
      en: "AAAPOS RetailManager, formerly known as MYOB RetailManager, has been trusted by retailers for more than 25 years and is used by businesses across Australia, New Zealand, Asia, and the Pacific Islands.",
      km: "AAAPOS RetailManager (ដែលពីមុនហៅថា MYOB RetailManager) ជាកម្មវិធីចំណុចលក់ដែលទុកចិត្តបានដោយអ្នកលក់រាយអស់រយៈពេលជាង 25 ឆ្នាំ, ត្រូវបានប្រើប្រាស់ដោយអាជីវកម្មនៅទូទាំងអូស្ត្រាលី និយសេឡង់ អាស៊ី និងកោះប៉ាស៊ីហ្វិក។",
    },
  },
  {
    question: { en: "What pricing options are available?", km: "តើមានផែនការតម្លៃអ្វីខ្លះ?" },
    answer: {
      en: "There are two options: a monthly subscription at $75/month ($850 upfront covering setup and the first month, with multiple register licenses included at no extra cost), or a one-time perpetual license at $1,995 (including 12 months of support and upgrades, with additional registers at $595 each).",
      km: "មានជម្រើសពីរ៖ ការជាវប្រចាំខែក្នុងតម្លៃ $75/ខែ (បង់ជាមុន $850 គ្របដណ្តប់ការដំឡើង និងខែដំបូង, រួមទាំងអាជ្ញាប័ណ្ណម៉ាស៊ីនច្រើនដោយគ្មានថ្លៃបន្ថែម), ឬអាជ្ញាប័ណ្ណជារៀងរហូតក្នុងតម្លៃ $1,995 ម្តង (រួមទាំងការគាំទ្រ និងបច្ចុប្បន្នភាព 12 ខែ, ម៉ាស៊ីនបន្ថែម $595 ក្នុងមួយ)។",
    },
  },
  {
    question: { en: "What kind of support is included?", km: "តើមានការគាំទ្រអ្វីខ្លះ?" },
    answer: {
      en: "Support is available 7 days a week via phone, email, or remote assistance using TeamViewer, Monday to Friday 7:00am-7:00pm and weekends 9:00am-5:00pm (Australian Eastern Standard Time).",
      km: "ការគាំទ្រអាចរកបាន 7 ថ្ងៃក្នុងមួយសប្តាហ៍ តាមទូរស័ព្ទ អ៊ីមែល ឬការជួយពីចម្ងាយតាម TeamViewer, ចន្ទ័ដល់សុក្រ 7:00-19:00 និងចុងសប្តាហ៍ 9:00-17:00 (ម៉ោងអូស្ត្រាលី)។",
    },
  },
  {
    question: { en: "Can I cancel at any time?", km: "តើខ្ញុំអាចលុបចោលបានពេលណាក៏បាន?" },
    answer: {
      en: "Yes, the subscription plan has no long-term contracts. You can cancel at any time with no long-term commitment required.",
      km: "បាទ/ចាស, ផែនការជាវប្រចាំខែគ្មានកិច្ចសន្យារយៈពេលវែងឡើយ។ អ្នកអាចលុបចោលបានគ្រប់ពេល ដោយគ្មានលក្ខខណ្ឌចងភ្ជាប់រយៈពេលវែង។",
    },
  },
  {
    question: { en: "What does RetailManager integrate with?", km: "តើ RetailManager ភ្ជាប់ជាមួយកម្មវិធីអ្វីខ្លះទៀត?" },
    answer: {
      en: "RetailManager integrates with MYOB and XERO for accounting, Shopify, WooCommerce, eBay, and BigCommerce for e-commerce, and EFTPOS providers including Tyro, Linkly, Westpac, Commonwealth Bank, ANZ, and NAB.",
      km: "RetailManager ភ្ជាប់ជាមួយ MYOB និង XERO សម្រាប់គណនេយ្យ, Shopify, WooCommerce, eBay, BigCommerce សម្រាប់ហាងអនឡាញ, ព្រមទាំង EFTPOS ជាមួយ Tyro, Linkly, Westpac, Commonwealth Bank, ANZ, NAB និងធនាគារផ្សេងទៀត។",
    },
  },
];

const text = (saved, fallback = EMPTY_TEXT) => ({ en: saved?.en || fallback.en, km: saved?.km || fallback.km });
const toForm = (saved) => ({
  ...Object.fromEntries(Object.entries(DEFAULT_TEXT).map(([field, d]) => [field, text(saved?.[field], d)])),
  items: (saved?.items?.length ? saved.items : DEFAULT_ITEMS).map((item) => ({
    question: text(item.question),
    answer: text(item.answer),
  })),
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
const FaqManager = () => {
  const [form, setForm] = useState(null);
  const [lang, setLang] = useState("en");
  const save = useSaveProgress();
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
  };

  const load = () =>
    getFaqAdmin()
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

  // Bilingual input for the current language; path like ["items", 2, "question"]
  const biProps = (...path) => {
    const node = (obj) => path.reduce((n, key) => n[key], obj);
    return {
      value: node(form)[lang] || "",
      style: lang === "km" ? KHMER_FONT : undefined,
      onChange: (e) => edit((next) => (node(next)[lang] = e.target.value)),
    };
  };

  const moveItem = (i, step) =>
    edit((next) => ([next.items[i], next.items[i + step]] = [next.items[i + step], next.items[i]]));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const missing = form.items.findIndex((item) => !item.question.en.trim() || !item.answer.en.trim());
    if (missing !== -1) {
      setLang("en");
      return showAlert(`Question ${missing + 1} needs an English question and answer`, "error");
    }
    try {
      const res = await save.run((onProgress) => saveFaq(form, onProgress));
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
        <p className="text-black dark:text-white">Loading FAQ...</p>
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
            <Field label="Intro">
              <textarea rows={4} className={inputClass} {...biProps("intro")} />
            </Field>
          </section>

          {/* RIGHT — questions */}
          <section className="px-6 py-5 space-y-3 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <SectionTitle>Questions</SectionTitle>
              <SaveButton state={save} />
            </div>

            {form.items.map((_, i) => (
              <div key={i} className="flex gap-2 rounded-xl border border-gray-200 dark:border-gray-700 p-3">
                <div className="flex flex-col">
                  <IconButton title="Move up" disabled={i === 0} onClick={() => moveItem(i, -1)}>
                    <ChevronUp className="w-3.5 h-3.5" />
                  </IconButton>
                  <IconButton title="Move down" disabled={i === form.items.length - 1} onClick={() => moveItem(i, 1)}>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </IconButton>
                </div>
                <div className="flex-1 space-y-2">
                  <input className={`${inputClass} font-semibold`} placeholder="Question" {...biProps("items", i, "question")} />
                  <textarea rows={3} className={inputClass} placeholder="Answer" {...biProps("items", i, "answer")} />
                </div>
                <IconButton
                  title="Remove"
                  danger
                  disabled={form.items.length === 1}
                  onClick={() => edit((next) => next.items.splice(i, 1))}
                >
                  <X className="w-3.5 h-3.5" />
                </IconButton>
              </div>
            ))}

            {form.items.length < MAX_ITEMS && (
              <button
                type="button"
                onClick={() => edit((next) => next.items.push({ question: { ...EMPTY_TEXT }, answer: { ...EMPTY_TEXT } }))}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#0f8abe] hover:opacity-70"
              >
                <Plus className="w-3.5 h-3.5" />
                Add question
              </button>
            )}
          </section>
        </div>
      </form>
    </div>
  );
};

export default FaqManager;