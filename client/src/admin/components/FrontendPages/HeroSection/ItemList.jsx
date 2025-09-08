import React, { useState } from 'react';
import {
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Globe,
  Languages,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const HeroItemList = ({ 
  heroContents, 
  onEdit, 
  onDelete, 
  onToggleActive,
  selectedHeros, 
  onSelectHero 
}) => {
  const [expandedItems, setExpandedItems] = useState(new Set());

  // Toggle expanded state for hero item
  const toggleExpanded = (heroId) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(heroId)) {
      newExpanded.delete(heroId);
    } else {
      newExpanded.add(heroId);
    }
    setExpandedItems(newExpanded);
  };

  // Helper function to check if hero has bilingual structure
  const isBilingual = (hero) => {
    return hero.title && typeof hero.title === 'object' && (hero.title.en || hero.title.km);
  };

  // Helper function to get display title
  const getDisplayTitle = (hero) => {
    if (isBilingual(hero)) {
      return hero.title.en || hero.title.km || 'Untitled';
    }
    return hero.title || 'Untitled';
  };

  // Helper function to get display subtitle
  const getDisplaySubtitle = (hero) => {
    if (isBilingual(hero)) {
      return hero.subtitle.en || hero.subtitle.km || '';
    }
    return hero.subtitle || '';
  };

  // Helper function to get display CTA text
  const getDisplayCTA = (hero, type) => {
    const field = type === 'primary' ? 'primaryCtaText' : 'secondaryCtaText';
    if (isBilingual(hero)) {
      return hero[field]?.en || hero[field]?.km || (type === 'primary' ? 'Learn More' : 'Get Started');
    }
    return hero[field] || (type === 'primary' ? 'Learn More' : 'Get Started');
  };

  return (
    <div className="p-4 space-y-4">
      {heroContents.map((hero) => {
        const isExpanded = expandedItems.has(hero._id);
        const hasBilingualContent = isBilingual(hero);

        return (
          <div key={hero._id} className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden border border-gray-200 dark:border-gray-600">
            <div className="md:flex">
              {/* Selection Checkbox */}
              <div className="absolute top-3 left-3 z-10">
                <input
                  type="checkbox"
                  checked={selectedHeros.has(hero._id)}
                  onChange={(e) => onSelectHero(hero._id, e.target.checked)}
                  className="w-4 h-4 text-sky-600 bg-white border-gray-300 rounded focus:ring-sky-500 dark:focus:ring-sky-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>

              {/* Image Preview */}
              <div className="md:w-1/3 relative">
                <img
                  src={hero.backgroundImage}
                  alt={getDisplayTitle(hero)}
                  className="w-full h-40 md:h-full object-cover"
                />
                {hero.isActive && (
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-1.5 py-0.5 rounded text-xs font-medium">
                    Active
                  </div>
                )}
                {/* Language indicator */}
                {hasBilingualContent && (
                  <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-black/70 text-white px-1.5 py-0.5 rounded text-xs">
                    <Globe size={10} />
                    <Languages size={10} />
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="md:w-2/3 p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {getDisplayTitle(hero)}
                    </h3>
                    {hasBilingualContent && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                          <Globe size={10} />
                          EN
                        </span>
                        {(hero.title?.km || hero.subtitle?.km || hero.primaryCtaText?.km || hero.secondaryCtaText?.km) && (
                          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                            <Languages size={10} />
                            KM
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {/* Expand/Collapse button for bilingual content */}
                    {hasBilingualContent && (
                      <button
                        onClick={() => toggleExpanded(hero._id)}
                        className="p-1.5 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        title={isExpanded ? 'Collapse languages' : 'View all languages'}
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    )}

                    <button
                      onClick={() => onToggleActive(hero._id)}
                      className={`p-1.5 rounded-xl transition-colors ${
                        hero.isActive 
                          ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-200 dark:hover:bg-yellow-700' 
                          : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-800 dark:text-green-200 dark:hover:bg-green-700'
                      }`}
                      title={hero.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {hero.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    
                    <button
                      onClick={() => onEdit(hero)}
                      className="p-1.5 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700"
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    
                    <button
                      onClick={() => onDelete(hero)}
                      className="p-1.5 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors dark:bg-red-800 dark:text-red-200 dark:hover:bg-red-700"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Basic Info (Always visible) */}
                <div className="mb-3">
                  <p className="text-gray-600 dark:text-gray-300 mb-2 text-sm">
                    {getDisplaySubtitle(hero)}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-700 dark:text-gray-200">Primary CTA:</span>
                      <span className="text-sky-600 dark:text-sky-400">{getDisplayCTA(hero, 'primary')}</span>
                      {hero.primaryCtaLink?.startsWith('http') && <ExternalLink size={12} />}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-700 dark:text-gray-200">Secondary CTA:</span>
                      <span className="text-sky-600 dark:text-sky-400">{getDisplayCTA(hero, 'secondary')}</span>
                      {hero.secondaryCtaLink?.startsWith('http') && <ExternalLink size={12} />}
                    </div>
                  </div>
                </div>

                {/* Expanded Bilingual Content */}
                {hasBilingualContent && isExpanded && (
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-3 space-y-3">
                    {/* English Content */}
                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-md p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Globe size={14} className="text-blue-600 dark:text-blue-400" />
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200 text-sm">English Content</h4>
                      </div>
                      <div className="space-y-1 text-xs">
                        <div>
                          <span className="font-medium text-blue-700 dark:text-blue-300">Title:</span>
                          <span className="ml-1 text-blue-600 dark:text-blue-200">{hero.title?.en || 'Not set'}</span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-700 dark:text-blue-300">Subtitle:</span>
                          <span className="ml-1 text-blue-600 dark:text-blue-200">{hero.subtitle?.en || 'Not set'}</span>
                        </div>
                        <div className="flex gap-3">
                          <div>
                            <span className="font-medium text-blue-700 dark:text-blue-300">Primary CTA:</span>
                            <span className="ml-1 text-blue-600 dark:text-blue-200">{hero.primaryCtaText?.en || 'Not set'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-blue-700 dark:text-blue-300">Secondary CTA:</span>
                            <span className="ml-1 text-blue-600 dark:text-blue-200">{hero.secondaryCtaText?.en || 'Not set'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Khmer Content */}
                    <div className="bg-green-50 dark:bg-green-900/30 rounded-md p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <Languages size={14} className="text-green-600 dark:text-green-400" />
                        <h4 className="font-semibold text-green-800 dark:text-green-200 text-sm">ខ្លឹមសារភាសាខ្មែរ (Khmer Content)</h4>
                      </div>
                      <div className="space-y-1 text-xs" style={{ fontFamily: '"Noto Sans Khmer", "Khmer OS", serif' }}>
                        <div>
                          <span className="font-medium text-green-700 dark:text-green-300">ចំណងជើង:</span>
                          <span className="ml-1 text-green-600 dark:text-green-200">{hero.title?.km || 'មិនបានកំណត់'}</span>
                        </div>
                        <div>
                          <span className="font-medium text-green-700 dark:text-green-300">ចំណងជើងរង:</span>
                          <span className="ml-1 text-green-600 dark:text-green-200">{hero.subtitle?.km || 'មិនបានកំណត់'}</span>
                        </div>
                        <div className="flex gap-3">
                          <div>
                            <span className="font-medium text-green-700 dark:text-green-300">ប៊ូតុងចម្បង:</span>
                            <span className="ml-1 text-green-600 dark:text-green-200">{hero.primaryCtaText?.km || 'មិនបានកំណត់'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-green-700 dark:text-green-300">ប៊ូតុងបន្ទាប់:</span>
                            <span className="ml-1 text-green-600 dark:text-green-200">{hero.secondaryCtaText?.km || 'មិនបានកំណត់'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                  <span>Updated: {new Date(hero.updatedAt).toLocaleString()}</span>
                  {hasBilingualContent && (
                    <span className="flex items-center gap-1">
                      <Globe size={10} />
                      Bilingual
                    </span>
                  )}
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