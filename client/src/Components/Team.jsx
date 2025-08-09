import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FaTelegram, FaEnvelope, FaPhone } from "react-icons/fa";
import { getTeamMembers } from '../services/api';

const Team = () => {
  const { t } = useTranslation();
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  // Fetch team members from API
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching team members...');
        const response = await getTeamMembers();
        console.log('API Response:', response);
        
        let members = [];
        if (response?.data) {
          members = Array.isArray(response.data) ? response.data : [];
        } else if (Array.isArray(response)) {
          members = response;
        } else {
          console.warn('Unexpected response structure:', response);
          members = [];
        }
        
        console.log('Processed team members:', members);
        setTeamMembers(members);
        
        if (members.length === 0) {
          setError(t('team.error.noMembers'));
        }
        
      } catch (error) {
        console.error('Error fetching team members:', error);
        
        let errorMessage = t('team.error.default');
        
        if (error.response) {
          errorMessage = t('team.error.server', {
            status: error.response.status,
            statusText: error.response.statusText
          });
        } else if (error.request) {
          errorMessage = t('team.error.network');
        } else if (error.message) {
          errorMessage = t('team.error.generic', { message: error.message });
        }
        
        setError(errorMessage);
        setTeamMembers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamMembers();
  }, [t]);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, []);

  // Function to get the correct image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
      return imagePath;
    }
    
    // If it's a relative path, construct the full URL pointing to backend server
    if (imagePath.startsWith('/uploads/') || imagePath.startsWith('uploads/')) {
      const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
      // Use the backend URL from environment variables (same as your API calls)
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      return `${backendUrl}${cleanPath}`;
    }
    
    return imagePath;
  };

  // Error state
  if (error) {
    return (
      <div className="bg-white">
        <div className="w-full mx-auto py-12 md:py-16 max-w-full lg:max-w-[1250px] 2xl:max-w-[1350px] [@media(min-width:1700px)]:max-w-[1585px]">
          <div className="w-full text-center mb-8 md:mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0f8abe] mb-4 font-montserrat">
              {t('team.title')}
            </h1>
            <p className="text-base sm:text-lg text-red-600 max-w-3xl mx-auto font-montserrat px-4">
              {error}
            </p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-2 bg-[#0f8abe] text-white rounded-xl hover:bg-[#0d7aa3] transition-colors"
            >
              {t('team.retryButton')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (!loading && !error && teamMembers.length === 0) {
    return (
      <div className="bg-white">
        <div className="w-full mx-auto py-12 md:py-16 max-w-full lg:max-w-[1250px] 2xl:max-w-[1350px] [@media(min-width:1700px)]:max-w-[1585px]">
          <div className="w-full text-center mb-8 md:mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0f8abe] mb-4 font-montserrat">
              {t('team.title')}
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto font-montserrat px-4">
              {t('team.emptyMessage')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div
        ref={sectionRef}
        className={`w-full mx-auto py-12 md:py-16 transition-all duration-300 ease-in-out
          max-w-full lg:max-w-[1250px] 2xl:max-w-[1350px] [@media(min-width:1700px)]:max-w-[1585px]
          ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
        `}
      >
        <div className="w-full text-center mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0f8abe] mb-4 font-montserrat">
            {t('team.title')}
          </h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto font-montserrat px-4">
            {t('team.subtitle')}
          </p>
        </div>

        <div className="w-full px-4 sm:px-6 lg:px-8 mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
            {teamMembers.map((member, index) => (
              <div
                key={member._id || member.id || `member-${index}`}
                className={`bg-white rounded-xl shadow-md border overflow-hidden transition-all duration-500 ease-in-out ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="relative h-36 sm:h-40 md:h-48 overflow-hidden group">
                  <img
                    src={getImageUrl(member.image) || 'https://dummyimage.com/200x200/f3f4f6/9ca3af?text=No+Image'}
                    alt={member.name || t('team.defaultAltText')}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      console.log('Image failed to load:', e.target.src);
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgNTBDODYuMTkgNTAgNzUgNjEuMTkgNzUgNzVDNzUgODguODEgODYuMTkgMTAwIDEwMCAxMDBDMTEzLjgxIDEwMCAxMjUgODguODEgMTI1IDc1QzEyNSA2MS4xOSAxMTMuODEgNTAgMTAwIDUwWiIgZmlsbD0iIzkzOTZBMCIvPgo8cGF0aCBkPSJNMTAwIDExMEM3Mi4zODYgMTEwIDUwIDEzMi4zODYgNTAgMTYwSDE1MEMxNTAgMTMyLjM4NiAxMjcuNjE0IDExMCAxMDAgMTEwWiIgZmlsbD0iIzkzOTZBMCIvPgo8L3N2Zz4K';
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-[#0f8abe]/90 flex justify-center gap-2 sm:gap-3 p-2 sm:p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    {member.contacts?.telegram && (
                      <a
                        href={`https://t.me/${member.contacts.telegram.replace("@", "")}`}
                        className="text-white text-base sm:text-lg hover:scale-125 transition-transform duration-200"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FaTelegram />
                      </a>
                    )}
                    {member.contacts?.email && (
                      <a
                        href={`mailto:${member.contacts.email}`}
                        className="text-white text-base sm:text-lg hover:scale-125 transition-transform duration-200"
                      >
                        <FaEnvelope />
                      </a>
                    )}
                    {member.contacts?.phone && (
                      <a
                        href={`tel:${member.contacts.phone}`}
                        className="text-white text-base sm:text-lg hover:scale-125 transition-transform duration-200"
                      >
                        <FaPhone />
                      </a>
                    )}
                  </div>
                </div>
                <div className="p-3 sm:p-4 text-center">
                  <h3 className="font-semibold text-gray-800 text-sm sm:text-base md:text-lg mb-1">
                    {member.name || t('team.defaultName')}
                  </h3>
                  <p className="text-[#0f8abe] font-medium text-xs sm:text-sm mb-1 sm:mb-2">
                    {member.position || t('team.defaultPosition')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;