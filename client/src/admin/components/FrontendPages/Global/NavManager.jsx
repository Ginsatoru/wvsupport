import React, { useEffect, useRef, useState } from "react";
import { Loader2, Plus, X, ChevronUp, ChevronDown, Link as LinkIcon, Trash2 } from "lucide-react";
import { Home, Mail, LayoutGrid, Info, Briefcase, HelpCircle, Phone, Users } from "lucide-react";
import { ModernAlert } from "../../Modals/Alert";
import SaveButton, { useSaveProgress } from "../../Common/SaveButton";
import { getNavAdmin, saveNav } from "../../../../services/navApi";
import enFlag from "../../../../Components/Images/en.png";
import khFlag from "../../../../Components/Images/kh.png";

// Icons offered for the mobile bottom bar (same names the navbar understands)
const ICONS = { home: Home, mail: Mail, grid: LayoutGrid, info: Info, briefcase: Briefcase, help: HelpCircle, phone: Phone, users: Users };
const MAX_LINKS = 5;

// ── Defaults (match the live navbar) ──
const DEFAULT_LINKS = [
  { label: { en: "Home", km: "ទំព័រដើម" }, href: "/", icon: "home" },
  { label: { en: "Contact", km: "ទំនាក់ទំនង" }, href: "/Contact", icon: "mail" },
  { label: { en: "Services", km: "សេវាកម្ម" }, href: "/Services", icon: "grid" },
  { label: { en: "About Us", km: "អំពីយើង" }, href: "/Aboutus", icon: "info" },
];
const DEFAULT_CTA = { en: "Get Started", km: "ចាប់ផ្តើម" };
const DEFAULT_LOGIN = { en: "Log in", km: "ចូល" };
const DEFAULT_LANGUAGES = {
  en: { flag: enFlag, short: "EN", name: "English" },
  km: { flag: khFlag, short: "ខ្មែរ", name: "Khmer" },
};

const text = (saved, fallback) => ({ en: saved?.en || fallback.en, km: saved?.km || fallback.km });
const toForm = (saved) => ({
  links: structuredClone(saved?.links?.length ? saved.links : DEFAULT_LINKS),
  ctaText: text(saved?.ctaText, DEFAULT_CTA),
  ctaLink: saved?.ctaLink || "/contact",
  loginText: text(saved?.loginText, DEFAULT_LOGIN),
  languages: Object.fromEntries(
    Object.entries(DEFAULT_LANGUAGES).map(([code, d]) => {
      const l = saved?.languages?.[code];
      return [code, { flag: l?.flag || "", file: null, short: l?.short || d.short, name: l?.name || d.name }]; // flag "" = built-in
    })
  ),
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

// Small round flag picker
const FlagPicker = ({ preview, onPick, onReset }) => {
  const inputRef = useRef(null);
  return (
    <div className="relative flex-shrink-0">
      <button
        type="button"
        title="Change flag"
        onClick={() => inputRef.current?.click()}
        className="w-12 h-12 rounded-full border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#0f8abe] overflow-hidden flex items-center justify-center bg-gray-50 dark:bg-gray-700/40"
      >
        <img src={preview} alt="" className="w-7 h-auto object-contain" />
      </button>
      {onReset && (
        <button
          type="button"
          title="Use the original flag"
          onClick={onReset}
          className="absolute -top-1 -right-1 p-1 rounded-full bg-black/70 text-white hover:bg-black"
        >
          <Trash2 className="w-2.5 h-2.5" />
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

const IconButton = ({ title, onClick, disabled, children, danger }) => (
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
const NavManager = () => {
  const [form, setForm] = useState(null);
  const [lang, setLang] = useState("en");
  const save = useSaveProgress();
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
  };

  const load = () =>
    getNavAdmin()
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

  // Bilingual input for the current language; path like ["links", 2, "label"]
  const biProps = (...path) => {
    const node = (obj) => path.reduce((n, key) => n[key], obj);
    return {
      value: node(form)[lang] || "",
      style: lang === "km" ? KHMER_FONT : undefined,
      onChange: (e) => edit((next) => (node(next)[lang] = e.target.value)),
    };
  };

  const moveLink = (i, step) =>
    edit((next) => ([next.links[i], next.links[i + step]] = [next.links[i + step], next.links[i]]));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.links.some((l) => !l.label.en.trim() || !l.href.trim())) {
      setLang("en");
      return showAlert("Every menu link needs an English label and a link", "error");
    }
    try {
      const body = new FormData();
      const languages = Object.fromEntries(Object.entries(form.languages).map(([code, { file, ...l }]) => [code, l]));
      body.append("content", JSON.stringify({ ...form, languages }));
      Object.entries(form.languages).forEach(([code, l]) => l.file && body.append(`flag_${code}`, l.file));
      const res = await save.run((onProgress) => saveNav(body, onProgress));
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
        <p className="text-black dark:text-white">Loading navbar...</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-[3fr_2fr]">
          {/* LEFT — menu links */}
          <section className="px-6 py-5 space-y-3">
            <div className="flex items-center justify-between">
              <SectionTitle>Menu links</SectionTitle>
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

            {form.links.map((link, i) => {
              const Icon = ICONS[link.icon] || Home;
              return (
                <div key={i} className="flex items-center gap-2 rounded-xl border border-gray-200 dark:border-gray-700 p-2">
                  <div className="flex flex-col">
                    <IconButton title="Move up" disabled={i === 0} onClick={() => moveLink(i, -1)}>
                      <ChevronUp className="w-3.5 h-3.5" />
                    </IconButton>
                    <IconButton title="Move down" disabled={i === form.links.length - 1} onClick={() => moveLink(i, 1)}>
                      <ChevronDown className="w-3.5 h-3.5" />
                    </IconButton>
                  </div>
                  <div className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center bg-black text-white dark:bg-white dark:text-black">
                    <Icon className="w-4 h-4" />
                  </div>
                  <select
                    className={`${inputClass} !w-28 flex-shrink-0 capitalize`}
                    value={link.icon || "home"}
                    onChange={(e) => edit((next) => (next.links[i].icon = e.target.value))}
                    title="Mobile icon"
                  >
                    {Object.keys(ICONS).map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                  <input className={inputClass} placeholder="Label" {...biProps("links", i, "label")} />
                  <input
                    className={inputClass}
                    placeholder="/page"
                    value={link.href}
                    onChange={(e) => edit((next) => (next.links[i].href = e.target.value))}
                  />
                  <IconButton title="Remove" danger disabled={form.links.length === 1} onClick={() => edit((next) => next.links.splice(i, 1))}>
                    <X className="w-3.5 h-3.5" />
                  </IconButton>
                </div>
              );
            })}

            {form.links.length < MAX_LINKS && (
              <button
                type="button"
                onClick={() => edit((next) => next.links.push({ label: { en: "", km: "" }, href: "", icon: "home" }))}
                className="inline-flex items-center gap-1 text-xs font-medium text-[#0f8abe] hover:opacity-70"
              >
                <Plus className="w-3.5 h-3.5" />
                Add link
              </button>
            )}
          </section>

          {/* RIGHT — buttons */}
          <section className="px-6 py-5 space-y-3 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <SectionTitle>Buttons</SectionTitle>
              <SaveButton state={save} />
            </div>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 space-y-3">
              <span className="block text-xs font-medium text-gray-500 dark:text-gray-400">Main button</span>
              <Field label="Text">
                <input className={inputClass} {...biProps("ctaText")} />
              </Field>
              <Field label="Link">
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    className={`${inputClass} pl-9`}
                    value={form.ctaLink}
                    onChange={(e) => setForm((prev) => ({ ...prev, ctaLink: e.target.value }))}
                  />
                </div>
              </Field>
            </div>
            <Field label="Log in text">
              <input className={inputClass} {...biProps("loginText")} />
            </Field>

            <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 space-y-3">
              <span className="block text-xs font-medium text-gray-500 dark:text-gray-400">Language switcher</span>
              {Object.entries(form.languages).map(([code, l]) => (
                <div key={code} className="flex items-center gap-3">
                  <FlagPicker
                    preview={l.file ? URL.createObjectURL(l.file) : l.flag || DEFAULT_LANGUAGES[code].flag}
                    onPick={(file) => {
                      if (!file.type.startsWith("image/") || file.size > 10 * 1024 * 1024) {
                        return showAlert("Please choose an image up to 10MB", "error");
                      }
                      edit((next) => (next.languages[code].file = file));
                    }}
                    onReset={l.file || l.flag ? () => edit((next) => Object.assign(next.languages[code], { file: null, flag: "" })) : undefined}
                  />
                  <div className="flex-1 min-w-0">
                  <Field label="Short label">
                    <input
                      className={inputClass}
                      value={l.short}
                      onChange={(e) => edit((next) => (next.languages[code].short = e.target.value))}
                    />
                  </Field>
                  </div>
                  <div className="flex-1 min-w-0">
                  <Field label="Full name">
                    <input
                      className={inputClass}
                      value={l.name}
                      onChange={(e) => edit((next) => (next.languages[code].name = e.target.value))}
                    />
                  </Field>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </form>
    </div>
  );
};

export default NavManager;