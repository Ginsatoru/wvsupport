import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { Plus, Trash2, Loader2, Search, Image as ImageIcon } from 'lucide-react';
import HeroItemList from './ItemList';
import HeroAddModal from './AddModal';
import HeroEditModal from './EditModal';
import { ModernAlert } from '../../Modals/Alert';
import ConfirmationModal from '../../Modals/ConfirmationModal';

const HeroManagement = () => {
  const [heroContents, setHeroContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentHero, setCurrentHero] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: "", type: "success" });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHeros, setSelectedHeros] = useState(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState({
    show: false, title: '', message: '', onConfirm: null, danger: false, confirmText: 'Confirm', heroToDelete: null
  });

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

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => { fetchHeroContent(); }, []);

  const showSuccessAlert = (message) => {
    setAlert({ show: true, message, type: "success" });
    setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 3000);
  };

  const filteredHeroContents = useMemo(() => {
    if (!searchTerm.trim()) return heroContents;
    return heroContents.filter(hero =>
      hero.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hero.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hero.primaryCtaText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hero.secondaryCtaText?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [heroContents, searchTerm]);

  const fetchHeroContent = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/content/hero/admin/all`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (result.success) setHeroContents(result.data);
      else throw new Error(result.message);
    } catch (error) {
      toast.error('Failed to fetch hero content');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (hero) => { setCurrentHero(hero); setIsEditModalOpen(true); };

  const showDeleteConfirmation = (heroId, heroTitle) => {
    setConfirmationModal({
      show: true,
      title: 'Delete Hero Section?',
      message: `Are you sure you want to delete "${heroTitle || 'this hero section'}"? This action cannot be undone.`,
      onConfirm: () => confirmDelete(heroId),
      danger: true, confirmText: 'Delete', heroToDelete: heroId
    });
  };

  const handleDelete = (hero) => showDeleteConfirmation(hero._id, hero.title);

  const confirmDelete = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/content/hero/admin/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) { const e = await response.json(); throw new Error(e.message || `HTTP error! status: ${response.status}`); }
      const result = await response.json();
      if (result.success) { showSuccessAlert(result.message); fetchHeroContent(); closeConfirmationModal(); }
      else throw new Error(result.message);
    } catch (error) { toast.error(error.message || 'Failed to delete hero content'); closeConfirmationModal(); }
  };

  const handleToggleActive = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/content/hero/admin/${id}/toggle-active`, { method: 'PATCH', headers: { 'Authorization': `Bearer ${token}` } });
      if (!response.ok) { const e = await response.json(); throw new Error(e.message || `HTTP error! status: ${response.status}`); }
      const result = await response.json();
      if (result.success) { showSuccessAlert(result.message); fetchHeroContent(); }
      else throw new Error(result.message);
    } catch (error) { toast.error(error.message || 'Failed to update hero status'); }
  };

  const handleSelectHero = (heroId, checked) => {
    const newSelected = new Set(selectedHeros);
    checked ? newSelected.add(heroId) : newSelected.delete(heroId);
    setSelectedHeros(newSelected);
  };

  const showBulkDeleteConfirmation = () => {
    if (selectedHeros.size === 0) return;
    setConfirmationModal({
      show: true,
      title: 'Delete Multiple Hero Sections?',
      message: `Are you sure you want to delete ${selectedHeros.size} hero section${selectedHeros.size > 1 ? 's' : ''}? This action cannot be undone.`,
      onConfirm: confirmBulkDelete,
      danger: true,
      confirmText: `Delete ${selectedHeros.size} Section${selectedHeros.size > 1 ? 's' : ''}`,
      heroToDelete: null
    });
  };

  const handleDeleteSelected = () => showBulkDeleteConfirmation();

  const confirmBulkDelete = async () => {
    try {
      setIsDeleting(true);
      const deletePromises = Array.from(selectedHeros).map(id => {
        const token = localStorage.getItem('adminToken');
        return fetch(`${API_BASE_URL}/api/content/hero/admin/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
      });
      await Promise.all(deletePromises);
      setSelectedHeros(new Set());
      fetchHeroContent();
      showSuccessAlert(`${selectedHeros.size} hero section${selectedHeros.size > 1 ? 's' : ''} deleted successfully!`);
      closeConfirmationModal();
    } catch (error) {
      toast.error('Failed to delete selected hero sections');
      closeConfirmationModal();
    } finally { setIsDeleting(false); }
  };

  const closeConfirmationModal = () => {
    setConfirmationModal({ show: false, title: '', message: '', onConfirm: null, danger: false, confirmText: 'Confirm', heroToDelete: null });
  };

  const handleAddSuccess = (message) => { setIsAddModalOpen(false); fetchHeroContent(); showSuccessAlert(message || "Hero section added successfully!"); };
  const handleEditSuccess = (message) => { setIsEditModalOpen(false); fetchHeroContent(); showSuccessAlert(message || "Hero section updated successfully!"); };

  return (
    <div className="px-4 py-0 bg-gray-200 dark:bg-gray-900 rounded-xl">
      <div className="flex flex-col h-full">
        {alert.show && <div className="mb-4"><ModernAlert message={alert.message} type={alert.type} /></div>}

        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: textColor }}>
                <ImageIcon className="w-6 h-6" />
                Hero Section Management
              </h1>
              <p className="text-sm" style={{ color: textColor }}>
                {filteredHeroContents.length} of {heroContents.length} hero sections
                {selectedHeros.size > 0 && ` • ${selectedHeros.size} selected`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: textColor }} />
              <input
                type="text"
                placeholder="Search hero sections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-[#0f8abe] focus:border-transparent transition-colors w-64"
                style={{ color: textColor }}
              />
            </div>

            {selectedHeros.size > 0 && (
              <button
                onClick={handleDeleteSelected}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-3 bg-black text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-gray-200"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Delete Selected ({selectedHeros.size})
              </button>
            )}

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0f8abe] text-white text-sm font-medium rounded-xl hover:bg-[#0d7aaa] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Hero
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-[#0f8abe]" />
              <p style={{ color: textColor }}>Loading hero sections...</p>
            </div>
          ) : filteredHeroContents.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 max-w-md mx-auto">
                <ImageIcon className="w-12 h-12 mx-auto mb-4" style={{ color: textColor }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: textColor }}>
                  {searchTerm ? "No matching hero sections" : "No hero sections found"}
                </h3>
                <p className="mb-6" style={{ color: textColor }}>
                  {searchTerm ? `No hero sections match "${searchTerm}". Try a different search term.` : "Create your first hero section to get started"}
                </p>
                {!searchTerm && (
                  <button onClick={() => setIsAddModalOpen(true)} className="px-4 py-2 bg-[#0f8abe] text-white text-sm font-medium rounded-xl hover:bg-[#0d7aaa] transition-colors">
                    Add Hero Section
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <HeroItemList heroContents={filteredHeroContents} onEdit={handleEdit} onDelete={handleDelete} onToggleActive={handleToggleActive} selectedHeros={selectedHeros} onSelectHero={handleSelectHero} />
            </div>
          )}
        </div>

        <ConfirmationModal
          isOpen={confirmationModal.show}
          title={confirmationModal.title}
          message={confirmationModal.message}
          confirmText={confirmationModal.confirmText}
          cancelText="Cancel"
          danger={confirmationModal.danger}
          onConfirm={confirmationModal.onConfirm}
          onCancel={closeConfirmationModal}
          darkMode={darkMode}
        />

        <HeroAddModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSuccess={handleAddSuccess} />
        {currentHero && <HeroEditModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} hero={currentHero} onSuccess={handleEditSuccess} />}
      </div>
    </div>
  );
};

export default HeroManagement;