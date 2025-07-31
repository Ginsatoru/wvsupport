import React, { useState } from "react";
import { MapPin, Building2 } from "lucide-react";
import headerImage from './Images/header.png';


const Projects = () => {
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = [
    "All",
    "POS Implementation",
    "E-commerce Integration",
    "Business Migration",
    "Support & Training"
  ];

  const projectData = [
    {
      id: 1,
      title: "RetailManager Multi-Store Deployment",
      description: "Successfully deployed AAAPOS RetailManager across 25+ retail locations with centralized inventory management and real-time reporting.",
      category: "POS Implementation",
      location: "Melbourne, Sydney, Brisbane",
      industry: "Fashion Retail Chain",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=200&fit=crop",
      caseStudyLink: "https://www.aaapos.com/",
    },
    {
      id: 2,
      title: "Shopify & WooCommerce Integration",
      description: "Integrated RetailManager POS with multiple e-commerce platforms using AAAPOS Webstore Manager for seamless inventory synchronization.",
      category: "E-commerce Integration",
      location: "Auckland, Wellington",
      industry: "Home & Garden",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=200&fit=crop",
      caseStudyLink: "https://www.aaapos.com/aaapos-webstore-manager/",
    },
    {
      id: 3,
      title: "MYOB RetailManager Migration",
      description: "Migrated legacy MYOB RetailManager systems to latest AAAPOS RetailManager with zero data loss and minimal downtime.",
      category: "Business Migration",
      location: "Gold Coast, Sunshine Coast",
      industry: "Electronics & Technology",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop",
      caseStudyLink: "https://www.aaapos.com/",
    },
    {
      id: 4,
      title: "EFTPOS Integration Project",
      description: "Implemented comprehensive EFTPOS integration with major Australian banks including CBA, ANZ, Westpac, and NAB for streamlined payment processing.",
      category: "POS Implementation",
      location: "Perth, Adelaide",
      industry: "Specialty Retail",
      image: "https://images.unsplash.com/photo-1556742111-a301076d9d18?w=400&h=200&fit=crop",
      caseStudyLink: "https://www.aaapos.com/",
    },
    {
      id: 5,
      title: "eBay & BigCommerce Integration",
      description: "Connected RetailManager POS with eBay and BigCommerce platforms for unified multi-channel retail management and automated order processing.",
      category: "E-commerce Integration",
      location: "Darwin, Alice Springs",
      industry: "Sporting Goods",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=200&fit=crop",
      caseStudyLink: "https://www.aaapos.com/aaapos-webstore-manager/",
    },
    {
      id: 6,
      title: "24/7 Support Implementation",
      description: "Established comprehensive 7-day support system with phone, email, and TeamViewer remote assistance for Pacific Island retailers.",
      category: "Support & Training",
      location: "Fiji, Papua New Guinea, Vanuatu",
      industry: "Tourism & Hospitality",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop",
      caseStudyLink: "https://www.aaapos.com/",
    },
    {
      id: 7,
      title: "Agricultural Retail System",
      description: "Specialized RetailManager deployment for agricultural retailers with integration to Nutrien Ag CRT for streamlined rural trading operations.",
      category: "POS Implementation",
      location: "Regional Queensland, NSW",
      industry: "Agricultural Supplies",
      image: "https://cropaia.com/wp-content/uploads/Mockup-computer-with-NDVI-scaled.jpg",
      caseStudyLink: "https://www.aaapos.com/",
    },
    {
      id: 8,
      title: "XERO Accounting Integration",
      description: "Seamless integration between RetailManager POS and XERO accounting software for automated financial reporting and GST management.",
      category: "Business Migration",
      location: "Canberra, Hobart",
      industry: "Health & Beauty",
      image: "https://www.mindspaceoutsourcing.com/wp-content/uploads/2022/01/Untitled-design-14-1.png",
      caseStudyLink: "https://www.aaapos.com/",
    }
  ];

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
            Our Projects
          </h1>
          <p className="text-base sm:text-lg md:text-lg max-w-2xl mx-auto leading-relaxed">
            Over 25 years of retail management excellence - delivering RetailManager POS solutions across Australia, New Zealand, and the Pacific Islands
          </p>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto mt-12 px-4 animate-[slideIn_0.6s_ease-out_forwards]">
        {/* Section Title */}
        <div className="text-center pb-8 -mt-8">
          <h2 className="mt-16 font-bold text-2xl sm:text-3xl md:text-3xl text-[#0f8abe] mb-4">
            Featured Project Implementations
          </h2>
          <p className="text-[#52514a] text-sm sm:text-sm max-w-2xl mx-auto">
            Discover how AAAPOS RetailManager has transformed businesses with comprehensive POS solutions, e-commerce integrations, and expert support
          </p>
        </div>

        {/* Filter Buttons */}
        <div className="flex justify-center flex-wrap gap-3 sm:gap-4 mb-8">
          {filters.map((filter) => (
            <button
              key={filter}
              className={`text-xs sm:text-sm md:text-xs px-3 py-2 sm:px-4 sm:py-2.5 md:px-3 md:py-2 border-2 border-[#0f8abe] rounded-full font-medium sm:font-semibold transition-all duration-300 ease-in-out transform hover:-translate-y-1 active:translate-y-0 ${
                activeFilter === filter
                  ? "bg-[#0f8abe] text-white"
                  : "bg-transparent text-[#0f8abe] hover:bg-[#0f8abe] hover:text-white"
              }`}
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
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
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-[#0f8abe] bg-opacity-90 text-white px-3 py-1 rounded text-xs font-bold">
                  {project.category}
                </div>
              </div>

              {/* Project Content */}
              <div className="p-4 sm:p-6">
                <h3 className="font-semibold text-lg sm:text-xl text-[#52514a] mb-3">
                  {project.title}
                </h3>
                <p className="text-sm sm:text-base text-[#52514a] mb-4 leading-relaxed">
                  {project.description}
                </p>

                {/* Project Meta */}
                <div className="flex flex-col gap-2 mb-4 text-xs sm:text-sm text-[#52514a]">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-[#0f8abe]" />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-[#0f8abe]" />
                    <span>{project.industry}</span>
                  </div>
                </div>

                {/* Case Study Link */}
                <a 
                  href={project.caseStudyLink}
                  className="relative inline-block text-sm sm:text-base text-[#0f8abe] font-semibold hover:text-[#0c6e94] transition-colors duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-0.5 after:bg-[#0c6e94] after:transition-all after:duration-300 hover:after:w-full"
                >
                  Learn more ➔
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
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