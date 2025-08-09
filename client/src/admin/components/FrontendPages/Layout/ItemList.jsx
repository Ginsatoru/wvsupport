import React, { useState } from "react";
import { Edit2, Trash2 } from "lucide-react";
import ConfirmationModal from "../../Modals/ConfirmationModal";

const ItemList = ({
  teamMembers,
  onEdit,
  onDelete,
  selectedMembers,
  onSelectMember,
}) => {
  const [darkMode] = useState(false); // Removed unused setter
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  // Improved image URL construction with better error handling
  const getFullImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as is
    if (/^https?:\/\//i.test(imagePath)) {
      return imagePath;
    }
    
    // Remove leading slash if present to prevent double slashes
    const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
    
    // Get backend URL from environment variables with fallback
    let backendUrl = import.meta.env.VITE_BACKEND_URL;
    
    // Remove trailing slash from backend URL to prevent double slashes
    if (backendUrl && backendUrl.endsWith('/')) {
      backendUrl = backendUrl.slice(0, -1);
    }
    
    // Enhanced fallback logic for production
    if (!backendUrl) {
      const currentOrigin = window.location.origin;
      
      // If we're on www.domain.com, try domain.com for API
      if (currentOrigin.includes('www.')) {
        backendUrl = currentOrigin.replace('www.', '');
      } else {
        backendUrl = currentOrigin;
      }
    }
    
    // Handle www vs non-www mismatch in production
    if (backendUrl.includes('www.') && !window.location.hostname.includes('www.')) {
      backendUrl = backendUrl.replace('www.', '');
    } else if (!backendUrl.includes('www.') && window.location.hostname.includes('www.')) {
      // Keep as is - usually API is on non-www subdomain
    }
    
    // Construct the full URL
    const fullUrl = `${backendUrl}/${cleanPath}`;
    
    console.log('ItemList Image URL constructed:', fullUrl); // Debug log - remove in production
    console.log('ItemList Current origin:', window.location.origin);
    console.log('ItemList Backend URL used:', backendUrl);
    
    return fullUrl;
  };

  // Enhanced image error handler with retry logic
  const handleImageError = (e, memberName) => {
    const currentSrc = e.target.src;
    console.warn(`ItemList image failed to load for ${memberName}:`, currentSrc);
    
    // Try different URL variations before falling back to placeholder
    if (currentSrc.includes('www.wvsupportservices.com')) {
      // Try without www
      const newSrc = currentSrc.replace('www.wvsupportservices.com', 'wvsupportservices.com');
      console.log('ItemList retrying without www:', newSrc);
      e.target.onerror = () => {
        console.warn('ItemList retry without www failed, using placeholder');
        e.target.onerror = null; // Prevent infinite loop
        e.target.src = placeholderImage;
      };
      e.target.src = newSrc;
    } else if (currentSrc.includes('wvsupportservices.com') && !currentSrc.includes('www.')) {
      // Try with www
      const newSrc = currentSrc.replace('wvsupportservices.com', 'www.wvsupportservices.com');
      console.log('ItemList retrying with www:', newSrc);
      e.target.onerror = () => {
        console.warn('ItemList retry with www failed, using placeholder');
        e.target.onerror = null; // Prevent infinite loop
        e.target.src = placeholderImage;
      };
      e.target.src = newSrc;
    } else {
      // Set to placeholder immediately
      e.target.onerror = null; // Prevent infinite loop
      e.target.src = placeholderImage;
    }
  };

  const handleOpenModal = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedId) {
      onDelete(selectedId);
    }
    setIsModalOpen(false);
    setSelectedId(null);
  };

  const handleCancelDelete = () => {
    setIsModalOpen(false);
    setSelectedId(null);
  };

  // Default placeholder image
  const placeholderImage = "https://dummyimage.com/48x48/f3f4f6/9ca3af?text=No+Image";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider w-12"
            >
              Select
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Team Member
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Position
            </th>
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
            >
              Contact
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {teamMembers.map((member) => (
            <tr
              key={member._id}
              className={`transition-all duration-200 ease-in-out border-b border-transparent hover:bg-sky-50 dark:hover:bg-gray-700/40 hover:shadow-sm hover:border-sky-100 dark:hover:border-gray-600 ${
                selectedMembers?.has(member._id)
                  ? "bg-sky-50 dark:bg-sky-900/20 border-sky-200 dark:border-sky-800"
                  : ""
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedMembers?.has(member._id) || false}
                    onChange={(e) => onSelectMember?.(member._id, e.target.checked)}
                    className="w-4 h-4 text-sky-600 bg-gray-100 border-gray-300 rounded focus:ring-sky-500 dark:focus:ring-sky-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600 cursor-pointer"
                  />
                </div>
              </td>

              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12">
                    <img
                      src={getFullImageUrl(member.image) || placeholderImage}
                      alt={member.name || "Team member"}
                      onError={(e) => handleImageError(e, member.name)}
                      onLoad={(e) => {
                        console.log('ItemList image loaded successfully:', e.target.src); // Debug log - remove in production
                      }}
                      className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 dark:border-gray-600"
                      loading="lazy"
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {member.name || "Unnamed Member"}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {member.department || "Team Member"}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-gray-200">
                  {member.position || "No position"}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-gray-200">
                  {member.contacts?.email || "No email"}
                </div>
                {member.contacts?.phone && (
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {member.contacts.phone}
                  </div>
                )}
                {member.contacts?.telegram && (
                  <div className="text-sm text-blue-600 dark:text-blue-400">
                    {member.contacts.telegram}
                  </div>
                )}
              </td>

              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <button
                  onClick={() => onEdit(member)}
                  className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 transition-colors duration-150 ease-in-out p-2 rounded-full hover:bg-sky-50 dark:hover:bg-sky-900/20"
                  title="Edit"
                  aria-label={`Edit ${member.name}`}
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleOpenModal(member._id)}
                  className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors duration-150 ease-in-out p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                  title="Delete"
                  aria-label={`Delete ${member.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {teamMembers.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 max-w-md mx-auto">
            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No team members found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Add your first team member to get started
            </p>
          </div>
        </div>
      )}
      <ConfirmationModal
        isOpen={isModalOpen}
        title="Delete Member?"
        message="Are you sure you want to delete this team member? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        danger={true}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        darkMode={darkMode}
      />
    </div>
  );
};

export default ItemList;