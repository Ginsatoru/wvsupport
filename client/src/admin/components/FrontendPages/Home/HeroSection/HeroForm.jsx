import React, { useRef, useState } from "react";
import { Upload, Trash2, Link as LinkIcon } from "lucide-react";
import { saveHeroContent } from "../../../../../services/heroApi";
import SaveButton, { useSaveProgress } from "../../../Common/SaveButton";

// ── Form parts ──
const KHMER_FONT = { fontFamily: '"Noto Sans Khmer", "Khmer OS", sans-serif' };

const inputClass =
  "w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-2 !text-[13px] leading-relaxed text-black dark:text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0f8abe]";

// Bilingual value from the API (older content stored plain strings)
const bi = (value, fallback = { en: "", km: "" }) =>
  typeof value === "string" ? { en: value, km: "" } : { en: value?.en || fallback.en, km: value?.km || fallback.km };

const checkImage = (file) =>
  !file.type.startsWith("image/") ? "Please choose an image file" : file.size > 10 * 1024 * 1024 ? "Image must be 10MB or smaller" : "";

const Field = ({ label, children }) => (
  <label className="block space-y-1">
    <span className="text-xs font-medium text-black dark:text-white">{label}</span>
    {children}
  </label>
);

const SectionTitle = ({ children }) => (
  <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{children}</h3>
);

const LangSwitch = ({ lang, onChange }) => (
  <div className="flex p-1 rounded-full bg-gray-100 dark:bg-gray-700">
    {[
      ["en", "English"],
      ["km", "ខ្មែរ"],
    ].map(([value, label]) => (
      <button
        key={value}
        type="button"
        onClick={() => onChange(value)}
        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
          lang === value ? "bg-black text-white dark:bg-white dark:text-black" : "text-gray-600 dark:text-gray-300"
        }`}
      >
        {label}
      </button>
    ))}
  </div>
);

const ImagePicker = ({ label, preview, onPick, onRemove, height = "h-36" }) => {
  const inputRef = useRef(null);
  return (
    <div className="space-y-1">
      {label && <span className="text-xs font-medium text-black dark:text-white">{label}</span>}
      <div className="relative">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={`w-full ${height} rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#0f8abe] overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-700/40 transition-colors`}
        >
          {preview ? (
            <img src={preview} alt="" className="w-full h-full object-contain" />
          ) : (
            <span className="flex flex-col items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
              <Upload className="w-5 h-5" />
              Click to upload (max 10MB)
            </span>
          )}
        </button>
        {preview && onRemove && (
          <button
            type="button"
            onClick={onRemove}
            title="Remove"
            className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-white hover:bg-black"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
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

const SaveBar = ({ save, updatedAt }) => (
  <div className="sticky bottom-0 flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-b-xl">
    {updatedAt && (
      <span className="mr-auto text-xs text-gray-500 dark:text-gray-400">Last saved {new Date(updatedAt).toLocaleString()}</span>
    )}
    <SaveButton state={save} />
  </div>
);

// ── Defaults (match the live hero) ──
const DEFAULT_FEATURES = [
  { en: "25+ Years\nTrusted", km: "ទុកចិត្តជាង 25 ឆ្នាំ" },
  { en: "AU, NZ & Asia-\nPacific Reach", km: "អាស៊ី-ប៉ាស៊ីហ្វិក" },
  { en: "7 Days a Week\nSupport", km: "គាំទ្រ 7 ថ្ងៃក្នុងសប្តាហ៍" },
];
const DEFAULT_TESTIMONIAL = {
  en: "WV Support is a game changer in my life that offered me an incredible opportunity to get this position. I can't be more thankful than today.",
  km: "WV Support គឺជាការប្រែប្រួលយ៉ាងខ្លាំង ដែលផ្តល់ឱ្យខ្ញុំនូវឱកាសសំខាន់ ខ្ញុំមិនអាចដឹងគុណបានគ្រប់គ្រាន់ជាងនេះទេ។",
};

const toForm = (hero = {}) => ({
  title: bi(hero.title),
  subtitle: bi(hero.subtitle),
  primaryCtaText: bi(hero.primaryCtaText, { en: "Learn More", km: "ស្វែងយល់បន្ថែម" }),
  secondaryCtaText: bi(hero.secondaryCtaText, { en: "Get Started", km: "ចាប់ផ្តើម" }),
  features: DEFAULT_FEATURES.map((d, i) => bi(hero.features?.[i], d)),
  testimonial: bi(hero.testimonial, DEFAULT_TESTIMONIAL),
  primaryCtaLink: hero.primaryCtaLink || "/services",
  secondaryCtaLink: hero.secondaryCtaLink || "/contact",
});

/**
 * The home page hero, edited in place. `hero` = the current hero, or null to create it.
 * Every piece of the live hero is here: text in EN + KM, links, 3 highlights,
 * testimonial, and background + person images. Saving always makes it the live hero.
 */
const HeroForm = ({ hero, onSaved }) => {
  const [form, setForm] = useState(() => toForm(hero || {}));
  const [lang, setLang] = useState("en");
  const [images, setImages] = useState({
    background: { file: null, preview: hero?.backgroundImage || "" },
    person: { file: null, preview: hero?.personImage || "", removed: false },
  });
  const save = useSaveProgress();
  const [error, setError] = useState("");

  // Bilingual input bound to the current language tab
  const biProps = (field, index) => {
    const value = index === undefined ? form[field][lang] : form[field][index][lang];
    return {
      value,
      style: lang === "km" ? KHMER_FONT : undefined,
      onChange: (e) => {
        const next = e.target.value;
        setForm((prev) =>
          index === undefined
            ? { ...prev, [field]: { ...prev[field], [lang]: next } }
            : { ...prev, [field]: prev[field].map((item, i) => (i === index ? { ...item, [lang]: next } : item)) }
        );
      },
    };
  };
  const plainProps = (field) => ({
    value: form[field],
    onChange: (e) => setForm((prev) => ({ ...prev, [field]: e.target.value })),
  });

  const pickImage = (key) => (file) => {
    const problem = checkImage(file);
    if (problem) return setError(problem);
    setError("");
    setImages((prev) => ({ ...prev, [key]: { file, preview: URL.createObjectURL(file), removed: false } }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.en.trim() || !form.subtitle.en.trim()) {
      setLang("en");
      return setError("English title and subtitle are required");
    }
    if (!images.background.preview) return setError("Background image is required");

    setError("");
    try {
      const body = new FormData();
      body.append("content", JSON.stringify({ ...form, isActive: true, removePersonImage: images.person.removed }));
      if (images.background.file) body.append("backgroundImage", images.background.file);
      if (images.person.file) body.append("personImage", images.person.file);
      const result = await save.run((onProgress) => saveHeroContent(hero?._id, body, onProgress));
      onSaved(result);
    } catch (err) {
      setError(err.message);
    }
  };

  const km = lang === "km";

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow">
        {error && (
          <div className="mx-6 mt-5 p-3 rounded-xl text-sm bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">{error}</div>
        )}

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* LEFT — text + button links */}
          <div className="px-6 py-5 space-y-6">

          {/* ── Text (per language) ── */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <SectionTitle>Text</SectionTitle>
              <LangSwitch lang={lang} onChange={setLang} />
            </div>

            <Field label="Title">
              <textarea rows={2} className={inputClass} {...biProps("title")} />
            </Field>
            <Field label="Subtitle">
              <textarea rows={3} className={inputClass} {...biProps("subtitle")} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Main button">
                <input className={inputClass} {...biProps("primaryCtaText")} />
              </Field>
              <Field label="Second button">
                <input className={inputClass} {...biProps("secondaryCtaText")} />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {form.features.map((_, i) => (
                <Field key={i} label={`Highlight ${i + 1}`}>
                  <textarea rows={2} className={inputClass} {...biProps("features", i)} />
                </Field>
              ))}
            </div>
          </section>

          {/* ── Links ── */}
          <section className="space-y-3">
            <SectionTitle>Button links</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ["primaryCtaLink", "Main button link", "/services"],
                ["secondaryCtaLink", "Second button link", "/contact"],
              ].map(([field, label, placeholder]) => (
                <Field key={field} label={label}>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                    <input className={`${inputClass} pl-9`} placeholder={`${placeholder} or https://...`} {...plainProps(field)} />
                  </div>
                </Field>
              ))}
            </div>
          </section>

          </div>

          {/* RIGHT — testimonial + images */}
          <div className="px-6 py-5 space-y-6 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
          {/* ── Testimonial ── */}
          <section className="space-y-3">
            <SectionTitle>Testimonial</SectionTitle>
            <Field label={lang === "km" ? "Quote (ខ្មែរ)" : "Quote"}>
              <textarea rows={3} className={inputClass} {...biProps("testimonial")} />
            </Field>
          </section>

          {/* ── Images ── */}
          <section className="space-y-3">
            <SectionTitle>Images</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <ImagePicker label="Background" preview={images.background.preview} onPick={pickImage("background")} />
              <ImagePicker
                label="Person"
                preview={images.person.preview}
                onPick={pickImage("person")}
                onRemove={() => setImages((prev) => ({ ...prev, person: { file: null, preview: "", removed: true } }))}
              />
            </div>
          </section>

          </div>
        </div>

        <SaveBar save={save} updatedAt={hero?.updatedAt} />
    </form>
  );
};

export default HeroForm;