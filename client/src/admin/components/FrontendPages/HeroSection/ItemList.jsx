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
    <div className="p-6 space-y-6">
      {heroContents.map((hero) => {
        const isExpanded = expandedItems.has(hero._id);
        const hasBilingualContent = isBilingual(hero);

        return (
          <div key={hero._id} className="bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-gray-600">
            <div className="md:flex">
              {/* Selection Checkbox */}
              <div className="absolute top-4 left-4 z-10">
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
                  className="w-full h-48 md:h-full object-cover"
                />
                {hero.isActive && (
                  <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-xl text-xs font-medium">
                    Active
                  </div>
                )}
                {/* Language indicator */}
                {hasBilingualContent && (
                  <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-lg text-xs">
                    <Globe size={12} />
                    <Languages size={12} />
                  </div>
                )}
              </div>
              
              {/* Content */}
              <div className="md:w-2/3 p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 flex-1">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                      {getDisplayTitle(hero)}
                    </h3>
                    {hasBilingualContent && (
                      <div className="flex items-center gap-1">
                        <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full flex items-center gap-1">
                          <Globe size={10} />
                          EN
                        </span>
                        {(hero.title?.km || hero.subtitle?.km || hero.primaryCtaText?.km || hero.secondaryCtaText?.km) && (
                          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 px-2 py-1 rounded-full flex items-center gap-1">
                            <Languages size={10} />
                            KM
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Expand/Collapse button for bilingual content */}
                    {hasBilingualContent && (
                      <button
                        onClick={() => toggleExpanded(hero._id)}
                        className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-colors dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                        title={isExpanded ? 'Collapse languages' : 'View all languages'}
                      >
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    )}

                    <button
                      onClick={() => onToggleActive(hero._id)}
                      className={`p-2 rounded-xl transition-colors ${
                        hero.isActive 
                          ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200 dark:bg-yellow-800 dark:text-yellow-200 dark:hover:bg-yellow-700' 
                          : 'bg-green-100 text-green-600 hover:bg-green-200 dark:bg-green-800 dark:text-green-200 dark:hover:bg-green-700'
                      }`}
                      title={hero.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {hero.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    
                    <button
                      onClick={() => onEdit(hero)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-xl hover:bg-blue-200 transition-colors dark:bg-blue-800 dark:text-blue-200 dark:hover:bg-blue-700"
                      title="Edit"
                    >
                      <Edit size={16} />
                    </button>
                    
                    <button
                      onClick={() => onDelete(hero)}
                      className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors dark:bg-red-800 dark:text-red-200 dark:hover:bg-red-700"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Basic Info (Always visible) */}
                <div className="mb-4">
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    {getDisplaySubtitle(hero)}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700 dark:text-gray-200">Primary CTA:</span>
                      <span className="text-sky-600 dark:text-sky-400">{getDisplayCTA(hero, 'primary')}</span>
                      {hero.primaryCtaLink?.startsWith('http') && <ExternalLink size={14} />}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700 dark:text-gray-200">Secondary CTA:</span>
                      <span className="text-sky-600 dark:text-sky-400">{getDisplayCTA(hero, 'secondary')}</span>
                      {hero.secondaryCtaLink?.startsWith('http') && <ExternalLink size={14} />}
                    </div>
                  </div>
                </div>

                {/* Expanded Bilingual Content */}
                {hasBilingualContent && isExpanded && (
                  <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-4">
                    {/* English Content */}
                    <div className="bg-blue-50 dark:bg-blue-900/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Globe size={16} className="text-blue-600 dark:text-blue-400" />
                        <h4 className="font-semibold text-blue-800 dark:text-blue-200">English Content</h4>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium text-blue-700 dark:text-blue-300">Title:</span>
                          <span className="ml-2 text-blue-600 dark:text-blue-200">{hero.title?.en || 'Not set'}</span>
                        </div>
                        <div>
                          <span className="font-medium text-blue-700 dark:text-blue-300">Subtitle:</span>
                          <span className="ml-2 text-blue-600 dark:text-blue-200">{hero.subtitle?.en || 'Not set'}</span>
                        </div>
                        <div className="flex gap-4">
                          <div>
                            <span className="font-medium text-blue-700 dark:text-blue-300">Primary CTA:</span>
                            <span className="ml-2 text-blue-600 dark:text-blue-200">{hero.primaryCtaText?.en || 'Not set'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-blue-700 dark:text-blue-300">Secondary CTA:</span>
                            <span className="ml-2 text-blue-600 dark:text-blue-200">{hero.secondaryCtaText?.en || 'Not set'}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Khmer Content */}
                    <div className="bg-green-50 dark:bg-green-900/30 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Languages size={16} className="text-green-600 dark:text-green-400" />
                        <h4 className="font-semibold text-green-800 dark:text-green-200">ខ្លឹមសារភាសាខ្មែរ (Khmer Content)</h4>
                      </div>
                      <div className="space-y-2 text-sm" style={{ fontFamily: '"Noto Sans Khmer", "Khmer OS", serif' }}>
                        <div>
                          <span className="font-medium text-green-700 dark:text-green-300">ចំណងជើង:</span>
                          <span className="ml-2 text-green-600 dark:text-green-200">{hero.title?.km || 'មិនបានកំណត់'}</span>
                        </div>
                        <div>
                          <span className="font-medium text-green-700 dark:text-green-300">ចំណងជើងរង:</span>
                          <span className="ml-2 text-green-600 dark:text-green-200">{hero.subtitle?.km || 'មិនបានកំណត់'}</span>
                        </div>
                        <div className="flex gap-4">
                          <div>
                            <span className="font-medium text-green-700 dark:text-green-300">ប៊ូតុងចម្បង:</span>
                            <span className="ml-2 text-green-600 dark:text-green-200">{hero.primaryCtaText?.km || 'មិនបានកំណត់'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-green-700 dark:text-green-300">ប៊ូតុងបន្ទាប់:</span>
                            <span className="ml-2 text-green-600 dark:text-green-200">{hero.secondaryCtaText?.km || 'មិនបានកំណត់'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                  <span>Last updated: {new Date(hero.updatedAt).toLocaleString()}</span>
                  {hasBilingualContent && (
                    <span className="flex items-center gap-1">
                      <Globe size={12} />
                      Bilingual Content
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