import React, { useEffect, useRef, useState } from "react";
import { Loader2, Plus, X, ChevronLeft, ChevronRight } from "lucide-react";
import { ModernAlert } from "../../../Modals/Alert";
import { getGalleryAdmin, saveGallery } from "../../../../../services/galleryApi";
import Image1 from "../../../../../Components/Images/image1.webp";
import Image2 from "../../../../../Components/Images/image2.webp";
import Image3 from "../../../../../Components/Images/image3.webp";
import Image4 from "../../../../../Components/Images/image4.webp";
import Image5 from "../../../../../Components/Images/image5.webp";
import Image6 from "../../../../../Components/Images/image6.webp";
import Image7 from "../../../../../Components/Images/image7.webp";
import Image8 from "../../../../../Components/Images/image8.webp";
import Image9 from "../../../../../Components/Images/image9.webp";
import Image10 from "../../../../../Components/Images/image10.webp";

// ── Defaults (match the live section) ──
// Built-in photos are saved as "default:<n>" so they survive rebuilds
const BUILT_IN = { 1: Image1, 2: Image2, 3: Image3, 4: Image4, 5: Image5, 6: Image6, 7: Image7, 8: Image8, 9: Image9, 10: Image10 };
const DEFAULT_ROWS = {
  topRow: [1, 2, 3, 7, 8].map((n) => `default:${n}`),
  bottomRow: [4, 5, 6, 9, 10].map((n) => `default:${n}`),
};
const DEFAULT_TEXT = {
  eyebrow: { en: "Our Gallery", km: "វិចិត្រសាលរបស់យើង" },
  title: { en: "Retailers trust us worldwide.", km: "ជឿជាក់ដោយអ្នកលក់រាយ" },
};
const MAX_PER_ROW = 12;
const ROWS = [
  ["topRow", "Top row", "scrolls left to right"],
  ["bottomRow", "Bottom row", "scrolls right to left"],
];

const text = (saved, fallback) => ({ en: saved?.en || fallback.en, km: saved?.km || fallback.km });

const toForm = (saved) => ({
  eyebrow: text(saved?.eyebrow, DEFAULT_TEXT.eyebrow),
  title: text(saved?.title, DEFAULT_TEXT.title),
  ...Object.fromEntries(
    ROWS.map(([key]) => [key, (saved?.[key]?.length ? saved[key] : DEFAULT_ROWS[key]).map((value) => ({ value, file: null }))])
  ),
});

const srcOf = (photo) =>
  photo.file ? URL.createObjectURL(photo.file) : photo.value.startsWith("default:") ? BUILT_IN[photo.value.slice(8)] : photo.value;

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

// One row of photos: move, remove, add
const PhotoRow = ({ label, hint, photos, onMove, onRemove, onAdd }) => {
  const inputRef = useRef(null);
  return (
    <div className="space-y-2">
      <div className="flex items-baseline gap-2">
        <span className="text-xs font-medium text-black dark:text-white">{label}</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {hint} · {photos.length}/{MAX_PER_ROW}
        </span>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
        {photos.map((photo, i) => (
          <div key={i} className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-700">
            <img src={srcOf(photo)} alt="" className="w-full h-full object-cover" draggable={false} />
            <div className="absolute inset-0 flex items-end justify-between p-1.5 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex gap-1">
                <button
                  type="button"
                  title="Move left"
                  disabled={i === 0}
                  onClick={() => onMove(i, -1)}
                  className="p-1 rounded-full bg-white/90 text-black disabled:opacity-30"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  title="Move right"
                  disabled={i === photos.length - 1}
                  onClick={() => onMove(i, 1)}
                  className="p-1 rounded-full bg-white/90 text-black disabled:opacity-30"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                type="button"
                title="Remove"
                disabled={photos.length === 1}
                onClick={() => onRemove(i)}
                className="p-1 rounded-full bg-black/80 text-white disabled:opacity-30"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {photos.length < MAX_PER_ROW && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-[#0f8abe] flex flex-col items-center justify-center gap-1 text-xs text-gray-500 dark:text-gray-400 hover:text-[#0f8abe]"
          >
            <Plus className="w-5 h-5" />
            Add photos
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          e.target.value = "";
          if (files.length) onAdd(files);
        }}
      />
    </div>
  );
};

// ── Editor ──
const GalleryManager = () => {
  const [form, setForm] = useState(null);
  const [lang, setLang] = useState("en");
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });

  const showAlert = (message, type = "success") => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert((prev) => ({ ...prev, show: false })), 3000);
  };

  const load = () =>
    getGalleryAdmin()
      .then((res) => setForm(toForm(res.data)))
      .catch((err) => {
        setForm(toForm(null));
        showAlert(err.message, "error");
      });

  useEffect(() => {
    load();
  }, []);

  const biProps = (field) => ({
    value: form[field][lang],
    style: lang === "km" ? KHMER_FONT : undefined,
    onChange: (e) => setForm((prev) => ({ ...prev, [field]: { ...prev[field], [lang]: e.target.value } })),
  });

  const updateRow = (key, fn) => setForm((prev) => ({ ...prev, [key]: fn(prev[key]) }));

  const movePhoto = (key) => (i, step) =>
    updateRow(key, (row) => {
      const next = [...row];
      [next[i], next[i + step]] = [next[i + step], next[i]];
      return next;
    });

  const removePhoto = (key) => (i) => updateRow(key, (row) => row.filter((_, j) => j !== i));

  const addPhotos = (key) => (files) => {
    const valid = files.filter((f) => f.type.startsWith("image/") && f.size <= 10 * 1024 * 1024);
    if (valid.length < files.length) showAlert("Some files were skipped (images up to 10MB only)", "error");
    updateRow(key, (row) => [...row, ...valid.map((file) => ({ value: "", file }))].slice(0, MAX_PER_ROW));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // New photos go up as "photos" files; the row lists point at them with "new:<i>"
      const body = new FormData();
      const uploads = [];
      const rowValues = (row) =>
        row.map((photo) => {
          if (!photo.file) return photo.value;
          uploads.push(photo.file);
          return `new:${uploads.length - 1}`;
        });
      const content = {
        eyebrow: form.eyebrow,
        title: form.title,
        topRow: rowValues(form.topRow),
        bottomRow: rowValues(form.bottomRow),
      };
      body.append("content", JSON.stringify(content));
      uploads.forEach((file) => body.append("photos", file));
      const res = await saveGallery(body);
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
        <p className="text-black dark:text-white">Loading gallery...</p>
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
              <textarea rows={2} className={inputClass} {...biProps("title")} />
            </Field>
          </section>

          {/* RIGHT — photo rows */}
          <section className="px-6 py-5 space-y-5 border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <SectionTitle>Photos</SectionTitle>
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white bg-[#0f8abe] hover:bg-[#0d7aaa] disabled:opacity-50"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save changes
              </button>
            </div>
            {ROWS.map(([key, label, hint]) => (
              <PhotoRow
                key={key}
                label={label}
                hint={hint}
                photos={form[key]}
                onMove={movePhoto(key)}
                onRemove={removePhoto(key)}
                onAdd={addPhotos(key)}
              />
            ))}
          </section>
        </div>
      </form>
    </div>
  );
};

export default GalleryManager;