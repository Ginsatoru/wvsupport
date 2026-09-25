import React, { useState, useEffect } from 'react';
import {
  Edit, Trash2, Eye, EyeOff, ExternalLink, Globe, Languages
} from 'lucide-react';

const HeroItemList = ({ heroContents, onEdit, onDelete, onToggleActive, selectedHeros, onSelectHero }) => {
  // Dark mode detection
  const [darkMode, setDarkMode] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const observer = new MutationObserver(() => setDarkMode(document.documentElement.classList.contains("dark")));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  const textColor = darkMode ? '#ffffff' : '#000000';

  const isBilingual = (hero) => hero.title && typeof hero.title === 'object' && (hero.title.en || hero.title.km);
  const getDisplayTitle = (hero) => isBilingual(hero) ? (hero.title.en || hero.title.km || 'Untitled') : (hero.title || 'Untitled');
  const getDisplaySubtitle = (hero) => isBilingual(hero) ? (hero.subtitle.en || hero.subtitle.km || '') : (hero.subtitle || '');
  const getDisplayCTA = (hero, type) => {
    const field = type === 'primary' ? 'primaryCtaText' : 'secondaryCtaText';
    if (isBilingual(hero)) return hero[field]?.en || hero[field]?.km || (type === 'primary' ? 'Learn More' : 'Get Started');
    return hero[field] || (type === 'primary' ? 'Learn More' : 'Get Started');
  };

  return (
    <div className="p-4 space-y-4">
      {heroContents.map((hero) => {
        const hasBilingualContent = isBilingual(hero);
        return (
          <div key={hero._id} className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
            <div className="md:flex">
              <div className="absolute top-3 left-3 z-10">
                <input
                  type="checkbox"
                  checked={selectedHeros.has(hero._id)}
                  onChange={(e) => onSelectHero(hero._id, e.target.checked)}
                  className="w-4 h-4 bg-white border-0 rounded focus:ring-2 dark:bg-gray-700"
                  style={{ color: textColor, accentColor: textColor }}
                />
              </div>

              <div className="md:w-1/3 relative">
                <img src={hero.backgroundImage} alt={getDisplayTitle(hero)} className="w-full h-40 md:h-full object-cover" />
                {hero.isActive && (
                  <div className="absolute top-2 right-2 bg-[#0f8abe] text-white px-1.5 py-0.5 rounded text-xs font-medium">Active</div>
                )}
                {hasBilingualContent && (
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 text-white px-1.5 py-0.5 rounded text-xs">
                    <Globe size={10} /><Languages size={10} />
                  </div>
                )}
              </div>

              <div className="md:w-2/3 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 flex-1">
                    <h3 className="text-lg font-semibold" style={{ color: textColor }}>{getDisplayTitle(hero)}</h3>
                    {hasBilingualContent && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full flex items-center gap-1" style={{ color: textColor }}>
                          <Globe size={10} />EN
                        </span>
                        {(hero.title?.km || hero.subtitle?.km || hero.primaryCtaText?.km || hero.secondaryCtaText?.km) && (
                          <span className="text-xs bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded-full flex items-center gap-1" style={{ color: textColor }}>
                            <Languages size={10} />KM
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onToggleActive(hero._id)}
                      className="p-1.5 rounded-xl transition-colors bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600"
                      style={{ color: textColor }}
                      title={hero.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {hero.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      onClick={() => onEdit(hero)}
                      className="p-1.5 bg-[#0f8abe]/10 text-[#0f8abe] rounded-xl hover:bg-[#0f8abe]/20 transition-colors dark:bg-[#0f8abe]/20 dark:text-[#0f8abe] dark:hover:bg-[#0f8abe]/30"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => onDelete(hero)}
                      className="p-1.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-colors dark:bg-white dark:text-black dark:hover:bg-gray-200"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="mb-2 text-sm" style={{ color: textColor }}>{getDisplaySubtitle(hero)}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="font-medium" style={{ color: textColor }}>Primary CTA:</span>
                      <span style={{ color: textColor }}>{getDisplayCTA(hero, 'primary')}</span>
                      {hero.primaryCtaLink?.startsWith('http') && <ExternalLink size={12} style={{ color: textColor }} />}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium" style={{ color: textColor }}>Secondary CTA:</span>
                      <span style={{ color: textColor }}>{getDisplayCTA(hero, 'secondary')}</span>
                      {hero.secondaryCtaLink?.startsWith('http') && <ExternalLink size={12} style={{ color: textColor }} />}
                    </div>
                  </div>
                </div>

                {hasBilingualContent && (
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-3">
                    <div className="bg-gray-100 dark:bg-gray-700/50 rounded-md p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe size={14} style={{ color: textColor }} />
                        <h4 className="font-semibold text-sm" style={{ color: textColor }}>English Content</h4>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div><span className="font-medium" style={{ color: textColor }}>Title:</span><span className="ml-1" style={{ color: textColor }}>{hero.title?.en || 'Not set'}</span></div>
                        <div><span className="font-medium" style={{ color: textColor }}>Subtitle:</span><span className="ml-1" style={{ color: textColor }}>{hero.subtitle?.en || 'Not set'}</span></div>
                        <div className="flex gap-3">
                          <div><span className="font-medium" style={{ color: textColor }}>Primary CTA:</span><span className="ml-1" style={{ color: textColor }}>{hero.primaryCtaText?.en || 'Not set'}</span></div>
                          <div><span className="font-medium" style={{ color: textColor }}>Secondary CTA:</span><span className="ml-1" style={{ color: textColor }}>{hero.secondaryCtaText?.en || 'Not set'}</span></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-100 dark:bg-gray-700/50 rounded-md p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Languages size={14} style={{ color: textColor }} />
                        <h4 className="font-semibold text-sm" style={{ color: textColor }}>ខ្លឹមសារភាសាខ្មែរ (Khmer Content)</h4>
                      </div>
                      <div className="space-y-1 text-xs" style={{ fontFamily: '"Noto Sans Khmer", "Khmer OS", serif' }}>
                        <div><span className="font-medium" style={{ color: textColor }}>ចំណងជើង:</span><span className="ml-1" style={{ color: textColor }}>{hero.title?.km || 'មិនបានកំណត់'}</span></div>
                        <div><span className="font-medium" style={{ color: textColor }}>ចំណងជើងរង:</span><span className="ml-1" style={{ color: textColor }}>{hero.subtitle?.km || 'មិនបានកំណត់'}</span></div>
                        <div className="flex gap-3">
                          <div><span className="font-medium" style={{ color: textColor }}>ប៊ូតុងចម្បង:</span><span className="ml-1" style={{ color: textColor }}>{hero.primaryCtaText?.km || 'មិនបានកំណត់'}</span></div>
                          <div><span className="font-medium" style={{ color: textColor }}>ប៊ូតុងបន្ទាប់:</span><span className="ml-1" style={{ color: textColor }}>{hero.secondaryCtaText?.km || 'មិនបានកំណត់'}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-3 text-xs flex items-center justify-between" style={{ color: textColor }}>
                  <span>Updated: {new Date(hero.updatedAt).toLocaleString()}</span>
                  {hasBilingualContent && <span className="flex items-center gap-1"><Globe size={10} />Bilingual</span>}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default HeroItemList;