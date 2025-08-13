import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { MapPin, Building2 } from "lucide-react";
import headerImage from './Images/header.png';

const Projects = () => {
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState("All");

  // Filter categories - using translation keys
  const filters = [
    { key: "All", labelKey: "projectsPage.filters.all" },
    { key: "POS Implementation", labelKey: "projectsPage.filters.posImplementation" },
    { key: "E-commerce Integration", labelKey: "projectsPage.filters.ecommerceIntegration" },
    { key: "Business Migration", labelKey: "projectsPage.filters.businessMigration" },
    { key: "Support & Training", labelKey: "projectsPage.filters.supportTraining" }
  ];

  // Project data with translation keys
  const getProjectData = () => [
    {
      id: 1,
      titleKey: "projectsPage.projects.retailManagerMultiStore.title",
      descriptionKey: "projectsPage.projects.retailManagerMultiStore.description",
      category: "POS Implementation",
      locationKey: "projectsPage.projects.retailManagerMultiStore.location",
      industryKey: "projectsPage.projects.retailManagerMultiStore.industry",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop",
      caseStudyLink: "https://www.aaapos.com/",
    },
    {
      id: 2,
      titleKey: "projectsPage.projects.shopifyWooCommerce.title",
      descriptionKey: "projectsPage.projects.shopifyWooCommerce.description",
      category: "E-commerce Integration",
      locationKey: "projectsPage.projects.shopifyWooCommerce.location",
      industryKey: "projectsPage.projects.shopifyWooCommerce.industry",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop",
      caseStudyLink: "https://www.aaapos.com/aaapos-webstore-manager/",
    },
    {
      id: 3,
      titleKey: "projectsPage.projects.myobMigration.title",
      descriptionKey: "projectsPage.projects.myobMigration.description",
      category: "Business Migration",
      locationKey: "projectsPage.projects.myobMigration.location",
      industryKey: "projectsPage.projects.myobMigration.industry",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
      caseStudyLink: "https://www.aaapos.com/",
    },
    {
      id: 4,
      titleKey: "projectsPage.projects.eftposIntegration.title",
      descriptionKey: "projectsPage.projects.eftposIntegration.description",
      category: "POS Implementation",
      locationKey: "projectsPage.projects.eftposIntegration.location",
      industryKey: "projectsPage.projects.eftposIntegration.industry",
      image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&h=200&fit=crop",
      caseStudyLink: "https://www.aaapos.com/",
    },
    {
      id: 5,
      titleKey: "projectsPage.projects.ebayBigCommerce.title",
      descriptionKey: "projectsPage.projects.ebayBigCommerce.description",
      category: "E-commerce Integration",
      locationKey: "projectsPage.projects.ebayBigCommerce.location",
      industryKey: "projectsPage.projects.ebayBigCommerce.industry",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
      caseStudyLink: "https://www.aaapos.com/aaapos-webstore-manager/",
    },
    {
      id: 6,
      titleKey: "projectsPage.projects.support247.title",
      descriptionKey: "projectsPage.projects.support247.description",
      category: "Support & Training",
      locationKey: "projectsPage.projects.support247.location",
      industryKey: "projectsPage.projects.support247.industry",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop",
      caseStudyLink: "https://www.aaapos.com/",
    },
    {
      id: 7,
      titleKey: "projectsPage.projects.agriculturalRetail.title",
      descriptionKey: "projectsPage.projects.agriculturalRetail.description",
      category: "POS Implementation",
      locationKey: "projectsPage.projects.agriculturalRetail.location",
      industryKey: "projectsPage.projects.agriculturalRetail.industry",
      image: "https://cropaia.com/wp-content/uploads/Mockup-computer-with-NDVI-scaled.jpg",
      caseStudyLink: "https://www.aaapos.com/",
    },
    {
      id: 8,
      titleKey: "projectsPage.projects.xeroIntegration.title",
      descriptionKey: "projectsPage.projects.xeroIntegration.description",
      category: "Business Migration",
      locationKey: "projectsPage.projects.xeroIntegration.location",
      industryKey: "projectsPage.projects.xeroIntegration.industry",
      image: "https://www.mindspaceoutsourcing.com/wp-content/uploads/2022/01/Untitled-design-14-1.png",
      caseStudyLink: "https://www.aaapos.com/",
    }
  ];

  const projectData = getProjectData();

  const filteredProjects =
    activeFilter === "All"
      ? projectData
      : projectData.filter((project) => project.category === activeFilter);

  return (
    <div className="projects-page">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center text-white py-15 px-4 text-center"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 138, 190, 0.8), rgba(15, 138, 190, 0.9)), url(${headerImage})`
        }}
      >
        <div className="projects-content animate-[slideIn_0.5s_ease-out_forwards]">
          <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-4xl mb-4 leading-tight">
            {t("projectsPage.hero.title")}
          </h1>
          <p className="text-base sm:text-lg md:text-lg max-w-2xl mx-auto leading-relaxed">
            {t("projectsPage.hero.subtitle")}
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto mt-12 px-4 animate-[slideIn_0.6s_ease-out_forwards]">
        {/* Section Title */}
        <div className="text-center pb-8 -mt-8">
          <h2 className="mt-16 font-bold text-2xl sm:text-3xl md:text-3xl text-[#0f8abe] mb-4">
            {t("projectsPage.section.title")}
          </h2>
          <p className="text-[#52514a] text-sm sm:text-sm max-w-2xl mx-auto">
            {t("projectsPage.section.description")}
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center flex-wrap gap-3 sm:gap-4 mb-8">
          {filters.map((filter) => (
            <button
              key={filter.key}
              className={`text-xs sm:text-sm md:text-xs px-3 py-2 sm:px-4 sm:py-2.5 md:px-3 md:py-2 border-2 border-[#0f8abe] rounded-full font-medium sm:font-semibold transition-all duration-300 ease-in-out transform hover:-translate-y-1 active:translate-y-0 ${
                activeFilter === filter.key
                  ? "bg-[#0f8abe] text-white"
                  : "bg-transparent text-[#0f8abe] hover:bg-[#0f8abe] hover:text-white"
              }`}
              onClick={() => setActiveFilter(filter.key)}
            >
              {t(filter.labelKey)}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pb-16">
          {filteredProjects.map((project) => (
            <div 
              key={project.id} 
              className="bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-400 ease-in-out hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* Project Image */}
              <div className="relative h-48 sm:h-52 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={t(project.titleKey)}
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-[#0f8abe] bg-opacity-90 text-white px-3 py-1 rounded text-xs font-bold">
                  {t(`projectsPage.categories.${project.category.toLowerCase().replace(/[^a-z]/g, '')}`)}
                </div>
              </div>

              {/* Project Content */}
              <div className="p-4 sm:p-6">
                <h3 className="font-semibold text-lg sm:text-xl text-[#52514a] mb-3">
                  {t(project.titleKey)}
                </h3>
                <p className="text-sm sm:text-base text-[#52514a] mb-4 leading-relaxed">
                  {t(project.descriptionKey)}
                </p>

                {/* Project Meta */}
                <div className="flex flex-col gap-2 mb-4 text-xs sm:text-sm text-[#52514a]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0f8abe]" />
                    <span>{t(project.locationKey)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#0f8abe]" />
                    <span>{t(project.industryKey)}</span>
                  </div>
                </div>

                {/* Case Study Link */}
                <a 
                  href={project.caseStudyLink}
                  className="relative inline-block text-sm sm:text-base text-[#0f8abe] font-semibold hover:text-[#0c6e94] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-[#0c6e94] after:transition-all after:duration-300 hover:after:w-full"
                >
                  {t("projectsPage.learnMore")}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(-50px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default Projects;