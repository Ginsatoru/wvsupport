import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Loader2, Upload, Trash2, Link as LinkIcon } from "lucide-react";
import { ModernAlert } from "../../../Modals/Alert";
import { getAboutAdmin, saveAbout } from "../../../../../services/aboutApi";
import teamImg from "../../../../../Components/Images/team.webp";
import reportIcon from "../../../../../Components/Images/report.gif";
import integrationIcon from "../../../../../Components/Images/integration.gif";
import techImg from "../../../../../Components/Images/tech-guy.webp";

// ── Defaults (match the live section) — one entry per card, in grid order ──
const DEFAULT_CARDS = [
  {
    label: "Card 1 · large image",
    image: teamImg,
    title: { en: "Point of Sale & Inventory", km: "ចំណុចលក់ និងស្តុកទំនិញ" },
    description: {
      en: "Process sales, manage stock levels, and track inventory across every register in real time.",
      km: "ដំណើរការការលក់ គ្រប់គ្រងស្តុក និងតាមដានទំនិញគ្រប់ម៉ាស៊ីនលក់ជាក់ស្តែង។",
    },
  },
  {
    label: "Card 2 · icon + button",
    image: reportIcon,
    title: { en: "Sales Reporting & Analytics", km: "របាយការណ៍ និងការវិភាគលក់" },
    description: {
      en: "Track sales activity, monitor stock movement, and generate detailed reports to guide business decisions.",
      km: "តាមដានប្រតិបត្តិការលក់ តាមដានស្តុក និងបង្កើតរបាយការណ៍លម្អិតដើម្បីជួយសម្រេចចិត្តអាជីវកម្ម។",
    },
    buttonText: { en: "Learn More", km: "ស្វែងយល់បន្ថែម" },
    buttonLink: "https://www.aaapos.com/",
  },
  {
    label: "Card 3 · icon",
    image: integrationIcon,
    title: { en: "Xero & MYOB Integration", km: "ការតភ្ជាប់ជាមួយ Xero និង MYOB" },
    description: {
      en: "Sync sales and financial data directly with Xero and MYOB, keeping your books accurate automatically.",
      km: "ធ្វើសមកាលកម្មទិន្នន័យលក់ និងហិរញ្ញវត្ថុដោយផ្ទាល់ជាមួយ Xero និង MYOB ដើម្បីរក្សាបញ្ជីគណនេយ្យឲ្យត្រឹមត្រូវដោយស្វ័យប្រវត្តិ។",
    },
  },
  {
    label: "Card 4 · dark with person",
    image: techImg,
    title: { en: "EFTPOS & Payment Integration", km: "ការទូទាត់ EFTPOS" },
    description: {
      en: "Accept payments seamlessly with integrated EFTPOS support from Tyro and Linkly, right at the counter.",
      km: "ទទួលការទូទាត់យ៉ាងរលូនជាមួយ EFTPOS ដែលភ្ជាប់ជាមួយ Tyro និង Linkly នៅចំណុចលក់។",
    },
  },
];

const EMPTY_TEXT = { en: "", km: "" };
// Saved text over the defaults (empty keeps the default)
const text = (saved, fallback = EMPTY_TEXT) => ({ en: saved?.en || fallback.en, km: saved?.km || fallback.km });

const toForm = (saved, i18n) => ({
  title: text(saved?.title, { en: i18n.getFixedT("en")("retailManager.subtitle"), km: i18n.getFixedT("km")("retailManager.subtitle") }),
  cards: DEFAULT_CARDS.map((d, i) => {
    const card = saved?.cards?.[i];
    return {
      title: text(card?.title, d.title),
      description: text(card?.description, d.description),
      buttonText: text(card?.buttonText, d.buttonText),
      buttonLink: card?.buttonLink || d.buttonLink || "",
      image: card?.image || "", // "" = built-in image
      file: null, // new image picked in the form
    };
  }),
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

const ImagePicker = ({ preview, onPick, onReset, contain }) => {
  const inputRef = useRef(null);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#0f8abe] overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-700/40"
      >
        {preview ? (
          <img src={preview} alt="" className={`w-full h-full ${contain ? "object-contain p-3" : "object-cover"}`} />
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

// ── Editor: heading + the 4 cards ──
const AboutManager = () => {
  const { i18n } = useTranslation();
  const [form, setForm] = useState(null);
  const [lang, setLang] = useState("en");
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
  };

  const load = () =>
    getAboutAdmin()
      .then((res) => setForm(toForm(res.data, i18n)))
      .catch((err) => {
        setForm(toForm(null, i18n));
        showAlert(err.message, "error");
      });

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Bilingual input for the current language; path like ["cards", 1, "title"]
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

  const updateCard = (i, changes) =>
    setForm((prev) => ({ ...prev, cards: prev.cards.map((card, j) => (j === i ? { ...card, ...changes } : card)) }));

  const pickImage = (i) => (file) => {
    if (!file.type.startsWith("image/")) return showAlert("Please choose an image file", "error");
    if (file.size > 10 * 1024 * 1024) return showAlert("Image must be 10MB or smaller", "error");
    updateCard(i, { file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = new FormData();
      body.append("content", JSON.stringify({ ...form, cards: form.cards.map(({ file, ...card }) => card) }));
      form.cards.forEach((card, i) => card.file && body.append(`image${i}`, card.file));
      const res = await saveAbout(body);
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
        <p className="text-black dark:text-white">Loading about section...</p>
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
            <Field label="Title">
              <textarea rows={3} className={inputClass} {...biProps("title")} />
            </Field>
          </section>

          {/* RIGHT — cards */}
          <section className="px-6 py-5 space-y-3 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <SectionTitle>Cards</SectionTitle>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-[#0f8abe] hover:bg-[#0d7aaa] disabled:opacity-50"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save changes
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {form.cards.map((card, i) => {
                const d = DEFAULT_CARDS[i];
                return (
                  <div key={i} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                    <span className="block text-xs font-medium text-gray-500 dark:text-gray-400">{d.label}</span>
                    <ImagePicker
                      contain={i === 1 || i === 2 || i === 3}
                      preview={card.file ? URL.createObjectURL(card.file) : card.image || d.image}
                      onPick={pickImage(i)}
                      onReset={card.file || card.image ? () => updateCard(i, { file: null, image: "" }) : undefined}
                    />
                    <Field label="Title">
                      <input className={inputClass} {...biProps("cards", i, "title")} />
                    </Field>
                    <Field label="Description">
                      <textarea rows={3} className={inputClass} {...biProps("cards", i, "description")} />
                    </Field>
                    {d.buttonText && (
                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Button text">
                          <input className={inputClass} {...biProps("cards", i, "buttonText")} />
                        </Field>
                        <Field label="Button link">
                          <div className="relative">
                            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <input
                              className={`${inputClass} pl-9`}
                              value={card.buttonLink}
                              onChange={(e) => updateCard(i, { buttonLink: e.target.value })}
                            />
                          </div>
                        </Field>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </form>
    </div>
  );
};

export default AboutManager;