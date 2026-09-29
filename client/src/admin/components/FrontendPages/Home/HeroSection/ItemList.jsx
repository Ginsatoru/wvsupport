import React from "react";
import { Edit, Trash2, Eye, EyeOff, ExternalLink } from "lucide-react";

// Older heroes stored plain strings; newer ones { en, km }
const en = (value) => (typeof value === "string" ? value : value?.en || "");
const hasKm = (hero) =>
  [hero.title, hero.subtitle, hero.primaryCtaText, hero.secondaryCtaText, hero.testimonial, ...(hero.features || [])].some(
    (v) => v && typeof v === "object" && v.km
  );

const IconButton = ({ title, onClick, className, children }) => (
  <button type="button" title={title} onClick={onClick} className={`p-2 rounded-full transition-colors ${className}`}>
    {children}
  </button>
);

const Cta = ({ label, text, link }) => (
  <span className="inline-flex items-center gap-1">
    <span className="text-gray-500 dark:text-gray-400">{label}:</span>
    <span className="font-medium">{text}</span>
    <span className="text-gray-400">→ {link}</span>
    {link?.startsWith("http") && <ExternalLink className="w-3 h-3" />}
  </span>
);

const HeroItemList = ({ heroes, selected, onSelect, onEdit, onDelete, onToggleActive }) => (
  <div className="p-4 space-y-4">
    {heroes.map((hero) => {
      const title = en(hero.title) || "Untitled";
      const features = (hero.features || []).map(en).filter(Boolean);
      return (
        <div
          key={hero._id}
          className="md:flex rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
        >
          {/* Preview: background with the person on top, like the live hero */}
          <div className="relative md:w-1/3 h-44 md:h-auto min-h-[11rem] bg-gradient-to-br from-sky-100 to-white">
            <img src={hero.backgroundImage} alt="" className={`absolute inset-0 w-full h-full object-cover ${hero.personImage ? "opacity-20" : ""}`} />
            {hero.personImage && (
              <img src={hero.personImage} alt="" className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[92%] w-auto object-contain" />
            )}
            <input
              type="checkbox"
              checked={selected.has(hero._id)}
              onChange={(e) => onSelect(hero._id, e.target.checked)}
              className="absolute top-3 left-3 w-4 h-4 accent-black"
            />
            {hero.isActive && (
              <span className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-medium bg-[#0f8abe] text-white">Live</span>
            )}
          </div>

          {/* Details */}
          <div className="md:w-2/3 p-4 text-black dark:text-white">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="min-w-0">
                <h3 className="text-lg font-semibold leading-snug whitespace-pre-line">{title}</h3>
                <div className="flex gap-1.5 mt-1">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-200 dark:bg-gray-700">EN</span>
                  {hasKm(hero) && <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-200 dark:bg-gray-700">ខ្មែរ</span>}
                </div>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <IconButton
                  title={hero.isActive ? "Hide from website" : "Show on website"}
                  onClick={() => onToggleActive(hero._id)}
                  className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                >
                  {hero.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </IconButton>
                <IconButton title="Edit" onClick={() => onEdit(hero)} className="bg-[#0f8abe]/10 text-[#0f8abe] hover:bg-[#0f8abe]/20">
                  <Edit className="w-4 h-4" />
                </IconButton>
                <IconButton
                  title="Delete"
                  onClick={() => onDelete(hero)}
                  className="bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black"
                >
                  <Trash2 className="w-4 h-4" />
                </IconButton>
              </div>
            </div>

            <p className="text-sm mb-3 line-clamp-2">{en(hero.subtitle)}</p>

            <div className="flex flex-wrap gap-x-5 gap-y-1 text-xs mb-3">
              <Cta label="Main" text={en(hero.primaryCtaText) || "Learn More"} link={hero.primaryCtaLink} />
              <Cta label="Second" text={en(hero.secondaryCtaText) || "Get Started"} link={hero.secondaryCtaLink} />
            </div>

            {features.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {features.map((f, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-full text-xs bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                    {f.replace(/\n/g, " ")}
                  </span>
                ))}
              </div>
            )}

            <p className="text-xs text-gray-500 dark:text-gray-400">Updated {new Date(hero.updatedAt).toLocaleString()}</p>
          </div>
        </div>
      );
    })}
  </div>
);

export default HeroItemList;