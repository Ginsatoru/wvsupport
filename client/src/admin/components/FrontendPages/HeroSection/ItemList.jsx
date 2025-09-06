import React from 'react';
import {
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink
} from 'lucide-react';

const HeroItemList = ({ 
  heroContents, 
  onEdit, 
  onDelete, 
  onToggleActive,
  selectedHeros, 
  onSelectHero 
}) => {
  return (
    <div className="p-6 space-y-6">
      {heroContents.map((hero) => (
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
                alt={hero.title}
                className="w-full h-48 md:h-full object-cover"
              />
              {hero.isActive && (
                <div className="absolute top-4 right-4 bg-green-500 text-white px-2 py-1 rounded-xl text-xs font-medium">
                  Active
                </div>
              )}
            </div>
            
            {/* Content */}
            <div className="md:w-2/3 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{hero.title}</h3>
                </div>
                
                <div className="flex items-center gap-2">
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
                    onClick={() => onDelete(hero._id)}
                    className="p-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-colors dark:bg-red-800 dark:text-red-200 dark:hover:bg-red-700"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-300 mb-4">{hero.subtitle}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700 dark:text-gray-200">Primary CTA:</span>
                  <span className="text-sky-600 dark:text-sky-400">{hero.primaryCtaText}</span>
                  {hero.primaryCtaLink.startsWith('http') && <ExternalLink size={14} />}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-700 dark:text-gray-200">Secondary CTA:</span>
                  <span className="text-sky-600 dark:text-sky-400">{hero.secondaryCtaText}</span>
                  {hero.secondaryCtaLink.startsWith('http') && <ExternalLink size={14} />}
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
                Last updated: {new Date(hero.updatedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HeroItemList;