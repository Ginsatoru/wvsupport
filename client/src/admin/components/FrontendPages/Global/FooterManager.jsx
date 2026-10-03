import React, { useEffect, useState } from "react";
import { Loader2, Plus, X } from "lucide-react";
import { ModernAlert } from "../../Modals/Alert";
import SaveButton, { useSaveProgress } from "../../Common/SaveButton";
import { getFooterAdmin, saveFooter } from "../../../../services/footerApi";

// ── Defaults (match the live footer) ──
const DEFAULT_DESCRIPTION = {
  en: "WV Support is a Siem Reap-based team delivering remote technical support for RetailManager, helping retailers across Australia, New Zealand, and the Asia-Pacific region.",
  km: "WV Support គឺជាក្រុមការងារនៅសៀមរាប ដែលផ្តល់ការគាំទ្របច្ចេកទេសពីចម្ងាយសម្រាប់ RetailManager ជូនអតិថិជនអូស្ត្រាលី និយសេឡង់ និងតំបន់អាស៊ី-ប៉ាស៊ីហ្វិក។",
};
const DEFAULT_FOLLOW = { en: "Follow Us", km: "តាមដានយើង" };
const DEFAULT_COLUMNS = [
  {
    heading: { en: "About Us", km: "អំពីយើង" },
    links: [
      { label: { en: "About", km: "អំពី" }, href: "/Aboutus" },
      { label: { en: "Legal", km: "ផ្នែកច្បាប់" }, href: "/Legal" },
      { label: { en: "Contact", km: "ទំនាក់ទំនង" }, href: "/contact" },
      { label: { en: "Careers", km: "ការងារ" }, href: "/Careers" },
    ],
  },
  {
    heading: { en: "Useful Links", km: "តំណភ្ជាប់មានប្រយោជន៍" },
    links: [
      { label: { en: "Browse to AAAPOS", km: "រកមើល AAAPOS" }, href: "https://www.aaapos.com/" },
      { label: { en: "Webstore Manager", km: "Webstore Manager" }, href: "https://www.aaapos.com/webstore-manager" },
      { label: { en: "RM Mobile", km: "RM Mobile" }, href: "https://www.aaapos.com/rm-mobile" },
      { label: { en: "FAQs", km: "សំណួរញឹកញាប់" }, href: "/FAQ" },
    ],
  },
];
const DEFAULT_SOCIALS = [
  { platform: "facebook", url: "https://www.facebook.com/aaapos.retailmanager/" },
  { platform: "youtube", url: "https://www.youtube.com/@aaapos/about" },
];
const PLATFORMS = ["facebook", "youtube", "linkedin", "instagram", "tiktok", "twitter"];
const MAX_LINKS = 10;
const EMPTY_TEXT = { en: "", km: "" };

// Saved content, or the defaults until the footer has been edited
const text = (saved, fallback) => ({ en: saved?.en || fallback.en, km: saved?.km || fallback.km });
const toForm = (saved) => ({
  description: text(saved?.description, DEFAULT_DESCRIPTION),
  followLabel: text(saved?.followLabel, DEFAULT_FOLLOW),
  columns: structuredClone(saved?.columns?.length ? saved.columns : DEFAULT_COLUMNS),
  socials: structuredClone(saved?.socials?.length ? saved.socials : DEFAULT_SOCIALS),
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

const RemoveButton = ({ onClick }) => (
  <button type="button" onClick={onClick} title="Remove" className="p-1.5 rounded-full text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700">
    <X className="w-3.5 h-3.5" />
  </button>
);

const AddButton = ({ onClick, children }) => (
  <button type="button" onClick={onClick} className="inline-flex items-center gap-1 text-xs font-medium text-[#0f8abe] hover:opacity-70">
    <Plus className="w-3.5 h-3.5" />
    {children}
  </button>
);

// ── Editor ──
const FooterManager = () => {
  const [form, setForm] = useState(null);
  const [lang, setLang] = useState("en");
  const save = useSaveProgress();
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
  };

  const load = () =>
    getFooterAdmin()
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

  // Bilingual input for the current language; path like ["columns", 0, "links", 2, "label"]
  const biProps = (...path) => {
    const node = (obj) => path.reduce((n, key) => n[key], obj);
    return {
      value: node(form)[lang] || "",
      style: lang === "km" ? KHMER_FONT : undefined,
      onChange: (e) => edit((next) => (node(next)[lang] = e.target.value)),
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await save.run((onProgress) => saveFooter(form, onProgress));
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
        <p className="text-black dark:text-white">Loading footer...</p>
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
          {/* LEFT — brand text + socials */}
          <section className="px-6 py-5 space-y-3">
            <div className="flex items-center justify-between">
              <SectionTitle>Brand & social</SectionTitle>
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
            <Field label="Description">
              <textarea rows={4} className={inputClass} {...biProps("description")} />
            </Field>
            <Field label="Social label">
              <input className={inputClass} {...biProps("followLabel")} />
            </Field>

            <div className="space-y-2">
              <span className="block text-xs font-medium text-black dark:text-white">Social links</span>
              {form.socials.map((s, i) => (
                <div key={i} className="flex items-center gap-2">
                  <select
                    className={`${inputClass} !w-36 flex-shrink-0 capitalize`}
                    value={s.platform}
                    onChange={(e) => edit((next) => (next.socials[i].platform = e.target.value))}
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <input
                    className={inputClass}
                    placeholder="https://..."
                    value={s.url}
                    onChange={(e) => edit((next) => (next.socials[i].url = e.target.value))}
                  />
                  <RemoveButton onClick={() => edit((next) => next.socials.splice(i, 1))} />
                </div>
              ))}
              <AddButton onClick={() => edit((next) => next.socials.push({ platform: "facebook", url: "" }))}>Add social link</AddButton>
            </div>
          </section>

          {/* RIGHT — link columns */}
          <section className="px-6 py-5 space-y-4 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <SectionTitle>Link columns</SectionTitle>
              <SaveButton state={save} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {form.columns.map((col, c) => (
                <div key={c} className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 space-y-3">
                  <Field label={`Column ${c + 1} heading`}>
                    <input className={inputClass} {...biProps("columns", c, "heading")} />
                  </Field>
                  <div className="space-y-2">
                    <span className="block text-xs font-medium text-black dark:text-white">Links</span>
                    {col.links.map((_, l) => (
                      <div key={l} className="flex items-center gap-2">
                        <input className={inputClass} placeholder="Label" {...biProps("columns", c, "links", l, "label")} />
                        <input
                          className={inputClass}
                          placeholder="/page or https://..."
                          value={col.links[l].href}
                          onChange={(e) => edit((next) => (next.columns[c].links[l].href = e.target.value))}
                        />
                        <RemoveButton onClick={() => edit((next) => next.columns[c].links.splice(l, 1))} />
                      </div>
                    ))}
                    {col.links.length < MAX_LINKS && (
                      <AddButton
                        onClick={() => edit((next) => next.columns[c].links.push({ label: { ...EMPTY_TEXT }, href: "" }))}
                      >
                        Add link
                      </AddButton>
                    )}
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

export default FooterManager;