import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'react-toastify';
import { 
  Plus, 
  Trash2, 
  Loader2,
  Search,
  Image as ImageIcon
} from 'lucide-react';
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
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success"
  });
  
  // New state for search and selection
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedHeros, setSelectedHeros] = useState(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  // Confirmation modal states
  const [confirmationModal, setConfirmationModal] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null,
    danger: false,
    confirmText: 'Confirm',
    heroToDelete: null
  });

  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const showSuccessAlert = (message) => {
    setAlert({
      show: true,
      message,
      type: "success"
    });
    
    setTimeout(() => {
      setAlert(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Filter hero content based on search term
  const filteredHeroContents = useMemo(() => {
    if (!searchTerm.trim()) return heroContents;
    
    return heroContents.filter(hero => 
      hero.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hero.subtitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hero.primaryCtaText?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hero.secondaryCtaText?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [heroContents, searchTerm]);

  // Fetch all hero content
  const fetchHeroContent = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/content/hero/admin/all`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setHeroContents(result.data);
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error fetching hero content:', error);
      toast.error('Failed to fetch hero content');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit
  const handleEdit = (hero) => {
    setCurrentHero(hero);
    setIsEditModalOpen(true);
  };

  // Show delete confirmation modal
  const showDeleteConfirmation = (heroId, heroTitle) => {
    setConfirmationModal({
      show: true,
      title: 'Delete Hero Section?',
      message: `Are you sure you want to delete "${heroTitle || 'this hero section'}"? This action cannot be undone.`,
      onConfirm: () => confirmDelete(heroId),
      danger: true,
      confirmText: 'Delete',
      heroToDelete: heroId
    });
  };

  // Handle delete
  const handleDelete = (hero) => {
    showDeleteConfirmation(hero._id, hero.title);
  };

  // Confirm delete action
  const confirmDelete = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/content/hero/admin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        showSuccessAlert(result.message);
        fetchHeroContent(); // Refresh the list
        closeConfirmationModal();
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error deleting hero content:', error);
      toast.error(error.message || 'Failed to delete hero content');
      closeConfirmationModal();
    }
  };

  // Handle toggle active status
  const handleToggleActive = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`${API_BASE_URL}/api/content/hero/admin/${id}/toggle-active`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success) {
        showSuccessAlert(result.message);
        fetchHeroContent(); // Refresh the list
      } else {
        throw new Error(result.message);
      }
    } catch (error) {
      console.error('Error toggling hero status:', error);
      toast.error(error.message || 'Failed to update hero status');
    }
  };

  // Selection handlers
  const handleSelectHero = (heroId, checked) => {
    const newSelected = new Set(selectedHeros);
    if (checked) {
      newSelected.add(heroId);
    } else {
      newSelected.delete(heroId);
    }
    setSelectedHeros(newSelected);
  };

  // Show bulk delete confirmation
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

  // Handle bulk delete
  const handleDeleteSelected = () => {
    showBulkDeleteConfirmation();
  };

  // Confirm bulk delete action
  const confirmBulkDelete = async () => {
    try {
      setIsDeleting(true);
      
      // Delete all selected heros
      const deletePromises = Array.from(selectedHeros).map(id => {
        const token = localStorage.getItem('adminToken');
        return fetch(`${API_BASE_URL}/api/content/hero/admin/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
      });
      
      await Promise.all(deletePromises);
      
      setSelectedHeros(new Set());
      fetchHeroContent();
      showSuccessAlert(`${selectedHeros.size} hero section${selectedHeros.size > 1 ? 's' : ''} deleted successfully!`);
      closeConfirmationModal();
    } catch (error) {
      console.error("Error deleting selected hero sections:", error);
      toast.error('Failed to delete selected hero sections');
      closeConfirmationModal();
    } finally {
      setIsDeleting(false);
    }
  };

  // Close confirmation modal
  const closeConfirmationModal = () => {
    setConfirmationModal({
      show: false,
      title: '',
      message: '',
      onConfirm: null,
      danger: false,
      confirmText: 'Confirm',
      heroToDelete: null
    });
  };

  const handleAddSuccess = (message) => {
    setIsAddModalOpen(false);
    fetchHeroContent();
    showSuccessAlert(message || "Hero section added successfully!");
  };

  const handleEditSuccess = (message) => {
    setIsEditModalOpen(false);
    fetchHeroContent();
    showSuccessAlert(message || "Hero section updated successfully!");
  };

  return (
    <div className="px-4 py-0 bg-gray-200 dark:bg-gray-900 rounded-xl">
      <div className="flex flex-col h-full">
        {/* Alert */}
        {alert.show && (
          <div className="mb-4">
            <ModernAlert message={alert.message} type={alert.type} />
          </div>
        )}

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <ImageIcon className="w-6 h-6 text-sky-400" />
                Hero Section Management
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filteredHeroContents.length} of {heroContents.length} hero sections
                {selectedHeros.size > 0 && ` • ${selectedHeros.size} selected`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search hero sections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent transition-colors w-64"
              />
            </div>

            {/* Delete Selected Button */}
            {selectedHeros.size > 0 && (
              <button
                onClick={handleDeleteSelected}
                disabled={isDeleting}
                className="flex items-center gap-2 px-4 py-3 bg-red-500 dark:bg-red-600 text-white text-sm font-medium rounded-xl hover:bg-red-600 dark:hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Delete Selected ({selectedHeros.size})
              </button>
            )}

            {/* Add New Hero Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-sky-500 dark:bg-sky-600 text-white text-sm font-medium rounded-xl hover:bg-sky-600 dark:hover:bg-sky-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Hero
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-sky-500" />
              <p>Loading hero sections...</p>
            </div>
          ) : filteredHeroContents.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 max-w-md mx-auto">
                <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {searchTerm ? "No matching hero sections" : "No hero sections found"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchTerm 
                    ? `No hero sections match "${searchTerm}". Try a different search term.`
                    : "Create your first hero section to get started"
                  }
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-sky-600 dark:bg-sky-700 text-white text-sm font-medium rounded-xl hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors"
                  >
                    Add Hero Section
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <HeroItemList
                heroContents={filteredHeroContents}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onToggleActive={handleToggleActive}
                selectedHeros={selectedHeros}
                onSelectHero={handleSelectHero}
              />
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={confirmationModal.show}
          title={confirmationModal.title}
          message={confirmationModal.message}
          confirmText={confirmationModal.confirmText}
          cancelText="Cancel"
          danger={confirmationModal.danger}
          onConfirm={confirmationModal.onConfirm}
          onCancel={closeConfirmationModal}
          darkMode={false} // You can make this dynamic based on your theme
        />

        {/* Modals */}
        <HeroAddModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleAddSuccess}
        />

        {currentHero && (
          <HeroEditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            hero={currentHero}
            onSuccess={handleEditSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default HeroManagement;