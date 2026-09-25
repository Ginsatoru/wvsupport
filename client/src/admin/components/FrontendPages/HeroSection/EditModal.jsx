import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Upload, Save, X, Link, Loader2, Globe, Languages } from 'lucide-react';

const HeroEditModal = ({ isOpen, onClose, hero, onSuccess, darkMode: darkModeProp }) => {
  const [formData, setFormData] = useState({
    title_en: '', subtitle_en: '', primaryCtaText_en: 'Learn More', secondaryCtaText_en: 'Get Started',
    title_km: '', subtitle_km: '', primaryCtaText_km: '', secondaryCtaText_km: '',
    primaryCtaLink: '/services', secondaryCtaLink: '/contact', isActive: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('en');

  const [darkMode, setDarkMode] = useState(() => {
    if (typeof darkModeProp === 'boolean') return darkModeProp;
    return typeof document !== "undefined" && document.documentElement.classList.contains("dark");
  });
  useEffect(() => {
    if (typeof darkModeProp === 'boolean') { setDarkMode(darkModeProp); return; }
    const observer = new MutationObserver(() => setDarkMode(document.documentElement.classList.contains("dark")));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, [darkModeProp]);

  const textColor = darkMode ? '#ffffff' : '#000000';

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://localhost:5000";

  useEffect(() => {
    if (hero) {
      const isBilingual = hero.title && typeof hero.title === 'object' && hero.title.en;
      if (isBilingual) {
        setFormData({
          title_en: hero.title?.en || '', subtitle_en: hero.subtitle?.en || '',
          primaryCtaText_en: hero.primaryCtaText?.en || 'Learn More',
          secondaryCtaText_en: hero.secondaryCtaText?.en || 'Get Started',
          title_km: hero.title?.km || '', subtitle_km: hero.subtitle?.km || '',
          primaryCtaText_km: hero.primaryCtaText?.km || '', secondaryCtaText_km: hero.secondaryCtaText?.km || '',
          primaryCtaLink: hero.primaryCtaLink || '/services',
          secondaryCtaLink: hero.secondaryCtaLink || '/contact',
          isActive: hero.isActive || false
        });
      } else {
        setFormData({
          title_en: hero.title || '', subtitle_en: hero.subtitle || '',
          primaryCtaText_en: hero.primaryCtaText || 'Learn More',
          secondaryCtaText_en: hero.secondaryCtaText || 'Get Started',
          title_km: '', subtitle_km: '', primaryCtaText_km: '', secondaryCtaText_km: '',
          primaryCtaLink: hero.primaryCtaLink || '/services',
          secondaryCtaLink: hero.secondaryCtaLink || '/contact',
          isActive: hero.isActive || false
        });
      }
      setImagePreview(hero.backgroundImage || null);
      setImageFile(null);
      setActiveTab('en');
    }
  }, [hero]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) { toast.error('Please select a valid image file'); return; }
      if (file.size > 10 * 1024 * 1024) { toast.error('File size must be less than 10MB'); return; }
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      title_en: '', subtitle_en: '', primaryCtaText_en: 'Learn More', secondaryCtaText_en: 'Get Started',
      title_km: '', subtitle_km: '', primaryCtaText_km: '', secondaryCtaText_km: '',
      primaryCtaLink: '/services', secondaryCtaLink: '/contact', isActive: false
    });
    setImageFile(null); setImagePreview(null); setActiveTab('en'); onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title_en.trim()) { toast.error('English title is required'); return; }
    if (!formData.subtitle_en.trim()) { toast.error('English subtitle is required'); return; }
    setSubmitting(true);
    try {
      const token = localStorage.getItem('adminToken');
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => formDataToSend.append(key, formData[key]));
      if (imageFile) formDataToSend.append('backgroundImage', imageFile);
      const response = await fetch(`${API_BASE_URL}/api/content/hero/admin/${hero._id}`, {
        method: 'PUT', headers: { 'Authorization': `Bearer ${token}` }, body: formDataToSend
      });
      if (!response.ok) { const e = await response.json(); throw new Error(e.message || `HTTP error! status: ${response.status}`); }
      const result = await response.json();
      if (result.success) { resetForm(); onSuccess(result.message); }
      else throw new Error(result.message);
    } catch (error) { toast.error(error.message || 'Failed to update hero content'); }
    finally { setSubmitting(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
        <div className="p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold" style={{ color: textColor }}>Edit Hero</h2>
            <button onClick={resetForm} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors">
              <X size={18} style={{ color: textColor }} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl w-fit">
              <button type="button" onClick={() => setActiveTab('en')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === 'en' ? 'bg-white dark:bg-gray-600 text-[#0f8abe] shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                style={{ color: activeTab === 'en' ? '#0f8abe' : textColor }}>
                <Globe size={14} />English
              </button>
              <button type="button" onClick={() => setActiveTab('km')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeTab === 'km' ? 'bg-white dark:bg-gray-600 text-[#0f8abe] shadow-sm' : 'hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                style={{ color: activeTab === 'km' ? '#0f8abe' : textColor }}>
                <Languages size={14} />ខ្មែរ
              </button>
            </div>

            {activeTab === 'en' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Globe size={16} style={{ color: textColor }} />
                  <h3 className="text-base font-semibold" style={{ color: textColor }}>English Content</h3>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: textColor }}>Title (English) *</label>
                  <input type="text" name="title_en" value={formData.title_en} onChange={handleInputChange} required
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f8abe]"
                    style={{ color: textColor }} placeholder="Enter hero title in English" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: textColor }}>Subtitle (English) *</label>
                  <textarea name="subtitle_en" value={formData.subtitle_en} onChange={handleInputChange} required rows="2"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f8abe]"
                    style={{ color: textColor }} placeholder="Enter hero subtitle in English" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: textColor }}>Primary CTA Text</label>
                    <input type="text" name="primaryCtaText_en" value={formData.primaryCtaText_en} onChange={handleInputChange}
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f8abe]"
                      style={{ color: textColor }} placeholder="Learn More" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: textColor }}>Secondary CTA Text</label>
                    <input type="text" name="secondaryCtaText_en" value={formData.secondaryCtaText_en} onChange={handleInputChange}
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f8abe]"
                      style={{ color: textColor }} placeholder="Get Started" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'km' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                  <Languages size={16} style={{ color: textColor }} />
                  <h3 className="text-base font-semibold" style={{ color: textColor }}>ខ្លឹមសារភាសាខ្មែរ</h3>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: textColor }}>ចំណងជើង (Title)</label>
                  <input type="text" name="title_km" value={formData.title_km} onChange={handleInputChange}
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f8abe]"
                    style={{ color: textColor, fontFamily: '"Noto Sans Khmer", "Khmer OS", serif' }} placeholder="បញ្ចូលចំណងជើងជាភាសាខ្មែរ" />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: textColor }}>ចំណងជើងរង (Subtitle)</label>
                  <textarea name="subtitle_km" value={formData.subtitle_km} onChange={handleInputChange} rows="2"
                    className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f8abe]"
                    style={{ color: textColor, fontFamily: '"Noto Sans Khmer", "Khmer OS", serif' }} placeholder="បញ្ចូលចំណងជើងរងជាភាសាខ្មែរ" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: textColor }}>ប៊ូតុងចម្បង (Primary)</label>
                    <input type="text" name="primaryCtaText_km" value={formData.primaryCtaText_km} onChange={handleInputChange}
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f8abe]"
                      style={{ color: textColor, fontFamily: '"Noto Sans Khmer", "Khmer OS", serif' }} placeholder="ស្វែងយល់បន្ថែម" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1" style={{ color: textColor }}>ប៊ូតុងបន្ទាប់ (Secondary)</label>
                    <input type="text" name="secondaryCtaText_km" value={formData.secondaryCtaText_km} onChange={handleInputChange}
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f8abe]"
                      style={{ color: textColor, fontFamily: '"Noto Sans Khmer", "Khmer OS", serif' }} placeholder="ចាប់ផ្តើម" />
                  </div>
                </div>
              </div>
            )}

            <div className="border-t border-gray-200 dark:border-gray-600 pt-4 space-y-3">
              <h3 className="text-base font-semibold" style={{ color: textColor }}>Common Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: textColor }}>Primary CTA Link</label>
                  <div className="relative">
                    <Link size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: textColor }} />
                    <input type="text" name="primaryCtaLink" value={formData.primaryCtaLink} onChange={handleInputChange}
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f8abe]"
                      style={{ color: textColor }} placeholder="/services or https://..." />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1" style={{ color: textColor }}>Secondary CTA Link</label>
                  <div className="relative">
                    <Link size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2" style={{ color: textColor }} />
                    <input type="text" name="secondaryCtaLink" value={formData.secondaryCtaLink} onChange={handleInputChange}
                      className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0f8abe]"
                      style={{ color: textColor }} placeholder="/contact or https://..." />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1" style={{ color: textColor }}>Background Image</label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-3 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
                  <input type="file" onChange={handleImageChange} accept="image/*" className="hidden" id="imageUploadEdit" />
                  <label htmlFor="imageUploadEdit" className="cursor-pointer">
                    {imagePreview ? (
                      <div className="space-y-1">
                        <img src={imagePreview} alt="Preview" className="mx-auto max-h-40 rounded-xl" />
                        <p className="text-xs" style={{ color: textColor }}>Click to change image</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <Upload size={24} className="mx-auto" style={{ color: textColor }} />
                        <p className="text-xs" style={{ color: textColor }}>Click to upload (Max 10MB)</p>
                      </div>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex items-center">
                <input type="checkbox" name="isActive" id="isActiveEdit" checked={formData.isActive} onChange={handleInputChange}
                  className="h-4 w-4 border-0 rounded focus:ring-2" style={{ accentColor: textColor }} />
                <label htmlFor="isActiveEdit" className="ml-2 text-xs" style={{ color: textColor }}>Set as active hero (will deactivate others)</label>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button type="button" onClick={resetForm}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-xl text-xs hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                style={{ color: textColor }}>Cancel</button>
              <button type="submit" disabled={submitting}
                className="bg-[#0f8abe] hover:bg-[#0d7aaa] text-white px-4 py-1.5 rounded-xl flex items-center gap-1 text-xs transition-colors disabled:opacity-50">
                {submitting ? (<><Loader2 className="w-3 h-3 animate-spin" />Updating...</>) : (<><Save size={14} />Update</>)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HeroEditModal;