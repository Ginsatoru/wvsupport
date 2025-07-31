import React, { useState, useEffect, useMemo } from "react";
import { getTeamMembers, deleteTeamMember } from "../../../services/api";
import { Layout, Plus, Loader2, Search, Trash2 } from "lucide-react";
import ItemList from "./Layout/ItemList";
import AddSectionModal from "./Layout/AddSectionModal";
import EditModal from "./Layout/EditModal";
import { ModernAlert } from "../Modals/Alert";

const CMSTeam = () => {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentMember, setCurrentMember] = useState(null);
  const [alert, setAlert] = useState({
    show: false,
    message: "",
    type: "success"
  });
  
  // New state for search and selection
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMembers, setSelectedMembers] = useState(new Set());
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchTeamMembers();
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

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await getTeamMembers();
      setTeamMembers(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching team members:", error);
      setLoading(false);
    }
  };

  // Filter team members based on search term
  const filteredTeamMembers = useMemo(() => {
    if (!searchTerm.trim()) return teamMembers;
    
    return teamMembers.filter(member => 
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [teamMembers, searchTerm]);

  const handleDelete = async (id) => {
    try {
      await deleteTeamMember(id);
      fetchTeamMembers();
      showSuccessAlert("Team member deleted successfully!");
    } catch (error) {
      console.error("Error deleting team member:", error);
    }
  };

  const handleEdit = (member) => {
    setCurrentMember(member);
    setIsEditModalOpen(true);
  };

  const handleAddSuccess = () => {
    setIsAddModalOpen(false);
    fetchTeamMembers();
    showSuccessAlert("Team member added successfully!");
  };

  const handleEditSuccess = () => {
    setIsEditModalOpen(false);
    fetchTeamMembers();
    showSuccessAlert("Team member updated successfully!");
  };

  // Selection handlers
  const handleSelectMember = (memberId, checked) => {
    const newSelected = new Set(selectedMembers);
    if (checked) {
      newSelected.add(memberId);
    } else {
      newSelected.delete(memberId);
    }
    setSelectedMembers(newSelected);
  };

  const handleDeleteSelected = async () => {
    if (selectedMembers.size === 0) return;
    
    try {
      setIsDeleting(true);
      
      // Delete all selected members
      const deletePromises = Array.from(selectedMembers).map(id => deleteTeamMember(id));
      await Promise.all(deletePromises);
      
      setSelectedMembers(new Set());
      fetchTeamMembers();
      showSuccessAlert(`${selectedMembers.size} team member${selectedMembers.size > 1 ? 's' : ''} deleted successfully!`);
    } catch (error) {
      console.error("Error deleting selected team members:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const isAllSelected = filteredTeamMembers.length > 0 && 
    filteredTeamMembers.every(member => selectedMembers.has(member.id || member._id));
  const isIndeterminate = selectedMembers.size > 0 && !isAllSelected;

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
                <Layout className="w-6 h-6 text-sky-400" />
                Team Management
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {filteredTeamMembers.length} of {teamMembers.length} team members
                {selectedMembers.size > 0 && ` • ${selectedMembers.size} selected`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-transparent transition-colors w-64"
              />
            </div>

            {/* Delete Selected Button */}
            {selectedMembers.size > 0 && (
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
                Delete Selected ({selectedMembers.size})
              </button>
            )}

            {/* Add New Member Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 bg-sky-500 dark:bg-sky-600 text-white text-sm font-medium rounded-xl hover:bg-sky-600 dark:hover:bg-sky-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add New Member
            </button>
          </div>
        </div>



        {/* Content Area */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-gray-500 dark:text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-sky-500" />
              <p>Loading team members...</p>
            </div>
          ) : filteredTeamMembers.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 max-w-md mx-auto">
                <Layout className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {searchTerm ? "No matching team members" : "No team members found"}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  {searchTerm 
                    ? `No team members match "${searchTerm}". Try a different search term.`
                    : "Add your first team member to get started"
                  }
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-sky-600 dark:bg-sky-700 text-white text-sm font-medium rounded-xl hover:bg-sky-700 dark:hover:bg-sky-600 transition-colors"
                  >
                    Add Team Member
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <ItemList
                teamMembers={filteredTeamMembers}
                onEdit={handleEdit}
                onDelete={handleDelete}
                selectedMembers={selectedMembers}
                onSelectMember={handleSelectMember}
              />
            </div>
          )}
        </div>

        {/* Modals */}
        <AddSectionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleAddSuccess}
        />

        {currentMember && (
          <EditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            member={currentMember}
            onSuccess={handleEditSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default CMSTeam;