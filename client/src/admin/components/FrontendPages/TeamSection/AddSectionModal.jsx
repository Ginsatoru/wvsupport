import React, { useState, useEffect, useRef } from "react";
import { addTeamMember } from "../../../../services/api";
import Modal from "react-modal";
import {
  X,
  Loader2,
  User,
  Image as ImageIcon,
  Briefcase,
  Mail,
  Phone,
  Send,
} from "lucide-react";

Modal.setAppElement("#root");

const AddSectionModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    image: null,
    imageFile: null,
    contacts: {
      telegram: "",
      email: "",
      phone: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("contacts.")) {
      const contactField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        contacts: {
          ...prev.contacts,
          [contactField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          image: event.target.result,
          imageFile: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.name.trim()) {
      alert("Name is required");
      return;
    }

    if (!formData.position.trim()) {
      alert("Position is required");
      return;
    }

    if (!formData.contacts.email.trim()) {
      alert("Email is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      
      // Append required text fields
      formDataToSend.append("name", formData.name.trim());
      formDataToSend.append("position", formData.position.trim());
      
      // Append contacts in the format expected by backend (nested structure)
      formDataToSend.append("contacts[email]", formData.contacts.email.trim());
      formDataToSend.append("contacts[telegram]", formData.contacts.telegram.trim());
      formDataToSend.append("contacts[phone]", formData.contacts.phone.trim());

      // Append image file with exact field name expected by multer
      if (formData.imageFile && formData.imageFile instanceof File) {
        formDataToSend.append("image", formData.imageFile);
      }

      // Debug logging
      console.log('FormData being sent:');
      for (let [key, value] of formDataToSend.entries()) {
        if (value instanceof File) {
          console.log(`${key}: File(${value.name}, ${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}: "${value}"`);
        }
      }

      const response = await addTeamMember(formDataToSend);
      console.log('Success:', response.data);
      
      // Reset form
      setFormData({
        name: "",
        position: "",
        image: null,
        imageFile: null,
        contacts: { telegram: "", email: "", phone: "" },
      });
      
      onSuccess();
      
    } catch (error) {
      console.error("Error adding team member:", error);
      console.error("Error response:", error.response?.data);
      
      // More detailed error message
      let errorMessage = 'An error occurred while adding the team member';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAfterClose = () => {
    setIsMounted(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      onAfterClose={handleAfterClose}
      closeTimeoutMS={300}
      className="modal-content bg-transparent border-none shadow-none outline-none"
      overlayClassName={`fixed inset-0 bg-gray-600/50 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${
        isMounted && isOpen ? "opacity-100" : "opacity-0"
      }`}
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      onAfterOpen={() => document.getElementById("name-input")?.focus()}
    >
      <div
        className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-2xl border border-gray-200/50 dark:border-gray-700/50 transform transition-all duration-300 ${
          isMounted && isOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-4 opacity-0"
        }`}
      >
        <div className="flex justify-between items-start mb-8">
          <div className="transition-opacity duration-200">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Add New Team Member
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Fill in the details to add a new team member
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors duration-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700/50"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Left Column */}
            <div className="space-y-5">
              <div className="relative transition-all duration-300 delay-75">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500 transition-colors duration-200">
                  <User className="w-5 h-5" />
                </div>
                <input
                  id="name-input"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border text-base border-gray-300/70 dark:border-gray-600/50 rounded-xl bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-transparent transition-all duration-200"
                  placeholder="Full name"
                  required
                />
              </div>

              <div className="relative transition-all duration-300 delay-100">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500 transition-colors duration-200">
                  <Briefcase className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="position"
                  value={formData.position}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border text-base border-gray-300/70 dark:border-gray-600/50 rounded-xl bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-transparent transition-all duration-200"
                  placeholder="Position/Role"
                  required
                />
              </div>

              <div className="relative transition-all duration-300 delay-150">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500 transition-colors duration-200">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <button
                  type="button"
                  onClick={handleImageButtonClick}
                  className="w-full pl-10 pr-4 py-3 border text-base text-left border-gray-300/70 dark:border-gray-600/50 rounded-xl bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600/50 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-transparent transition-all duration-200"
                >
                  {formData.imageFile ? formData.imageFile.name : "Choose image file"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
              <div className="relative transition-all duration-300 delay-75">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500 transition-colors duration-200">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  type="email"
                  name="contacts.email"
                  value={formData.contacts.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border text-base border-gray-300/70 dark:border-gray-600/50 rounded-xl bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-transparent transition-all duration-200"
                  placeholder="Email address"
                  required
                />
              </div>

              <div className="relative transition-all duration-300 delay-100">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500 transition-colors duration-200">
                  <Phone className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="contacts.phone"
                  value={formData.contacts.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border text-base border-gray-300/70 dark:border-gray-600/50 rounded-xl bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-transparent transition-all duration-200"
                  placeholder="Phone number"
                />
              </div>

              <div className="relative transition-all duration-300 delay-150">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500 transition-colors duration-200">
                  <Send className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  name="contacts.telegram"
                  value={formData.contacts.telegram}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border text-base border-gray-300/70 dark:border-gray-600/50 rounded-xl bg-white dark:bg-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-transparent transition-all duration-200"
                  placeholder="Telegram username"
                />
              </div>
            </div>
          </div>

          {/* Image Preview */}
          {formData.image && (
            <div className="mb-8 flex justify-center transition-all duration-300 transform hover:scale-[1.02]">
              <div className="relative group">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-32 h-32 rounded-xl object-cover border-2 border-gray-200 dark:border-gray-600 group-hover:border-sky-400 transition-all duration-300"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 rounded-xl flex items-center justify-center transition-opacity duration-300">
                  <span className="text-white text-sm font-medium">
                    Image Preview
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 transition-all duration-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300/70 dark:border-gray-600/50 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700/50 hover:bg-gray-50/80 dark:hover:bg-gray-700 transition-all duration-200 hover:-translate-x-0.5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 border border-transparent rounded-xl text-sm font-medium text-white bg-sky-500 hover:bg-sky-600 shadow-sm transition-all duration-200 hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin transition-all" />
                  Adding...
                </>
              ) : (
                "Add Member"
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddSectionModal;