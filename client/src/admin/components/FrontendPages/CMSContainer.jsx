import React, { useState, useEffect } from "react";
import {
  Layout, Users, Handshake, MessageSquare, Mail,
  HelpCircle, Search, ChevronLeft, Bell,
} from "lucide-react";
import Team from "./TeamSection/TeamManagement";
import Hero from "./HeroSection/HeroManagement";
import NewsPopup from "../../components/Managements/NewsPopup/NewsPopupManagement";

const CMSContainer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSection, setCurrentSection] = useState(null);

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

  const [sections] = useState([
    { id: "hero", name: "Hero Banner", type: "Banner", status: "Published", description: "Main landing page hero section with call-to-action", icon: <Layout className="w-5 h-5" style={{ color: textColor }} /> },
    { id: "team", name: "Team Section", type: "Content", status: "Published", description: "Display your team members and their information", icon: <Users className="w-5 h-5" style={{ color: textColor }} /> },
    { id: "news-popup", name: "News Popup", type: "Content", status: "Published", description: "Manage promotional popups with expiry dates", icon: <Bell className="w-5 h-5" style={{ color: textColor }} /> },
    { id: "services", name: "Services", type: "Content", status: "Published", description: "Showcase your services or products", icon: <Handshake className="w-5 h-5" style={{ color: textColor }} /> },
    { id: "testimonials", name: "Testimonials", type: "Content", status: "Published", description: "Customer reviews and testimonials", icon: <MessageSquare className="w-5 h-5" style={{ color: textColor }} /> },
    { id: "contact", name: "Contact Info", type: "Form", status: "Published", description: "Contact information and form", icon: <Mail className="w-5 h-5" style={{ color: textColor }} /> },
    { id: "faq", name: "FAQ Section", type: "Content", status: "Published", description: "Frequently asked questions", icon: <HelpCircle className="w-5 h-5" style={{ color: textColor }} /> },
  ]);

  const filteredSections = sections.filter(
    (s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSectionClick = (section) => setCurrentSection(section);
  const handleBackClick = () => setCurrentSection(null);

  const renderSectionContent = () => {
    if (!currentSection) {
      return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                {['Section', 'Description', 'Status', 'Page Type', 'Visibility'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: textColor }}>{h}</th>
                ))}
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Manage</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredSections.map((section) => (
                <tr key={section.id} className="transition-colors duration-150 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/40" onClick={() => handleSectionClick(section)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700">
                        {section.icon}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium" style={{ color: textColor }}>{section.name}</div>
                        <div className="text-sm" style={{ color: textColor }}>{section.type}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4"><div className="text-sm max-w-xs truncate" style={{ color: textColor }}>{section.description}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${section.status === "Published" ? "bg-[#0f8abe]" : "bg-gray-100 dark:bg-gray-700"}`}
                      style={{ color: section.status === "Published" ? '#ffffff' : textColor }}>
                      {section.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: textColor }}>{section.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: textColor }}>Visible</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={(e) => { e.stopPropagation(); handleSectionClick(section); }} className="text-[#0f8abe] hover:opacity-70 transition-opacity duration-150 px-3 py-2 rounded-xl">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredSections.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md mx-auto">
                <Search className="w-12 h-12 mx-auto mb-4" style={{ color: textColor }} />
                <h3 className="text-lg font-semibold mb-2" style={{ color: textColor }}>No sections found</h3>
                <p className="mb-6" style={{ color: textColor }}>Try adjusting your search terms or create a new section</p>
              </div>
            </div>
          )}
        </div>
      );
    }

    switch (currentSection.id) {
      case "team": return <Team />;
      case "hero": return <Hero />;
      case "news-popup": return <NewsPopup />;
      default:
        return (
          <div className="p-6">
            <h2 className="text-xl font-bold mb-4" style={{ color: textColor }}>{currentSection.name} Management</h2>
            <div className="bg-gray-100 dark:bg-gray-700 rounded-xl p-4">
              <p style={{ color: textColor }}>{currentSection.name} management content would appear here</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 rounded-xl">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-200 dark:bg-gray-900 rounded-t-xl px-7 py-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <div className="flex items-center gap-4">
              {!currentSection && (
                <h1 className="text-2xl font-semibold" style={{ color: textColor }}>
                  <Layout className="inline-block w-7 h-7 mr-2" />
                  Content Management
                </h1>
              )}
              {currentSection && (
                <button onClick={handleBackClick} className="flex items-center gap-1 text-lg" style={{ color: textColor }}>
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
              )}
            </div>

            {!currentSection && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: textColor }} />
                <input
                  type="text"
                  placeholder="Search sections..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm focus:ring-1 focus:ring-[#0f8abe] outline-none"
                  style={{ color: textColor }}
                />
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 bg-gray-200 dark:bg-gray-900">
          {renderSectionContent()}
        </div>
      </div>
    </div>
  );
};

export default CMSContainer;