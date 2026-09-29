import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Navigate } from "react-router-dom";
import {
  Layout, Handshake, Mail, Link as LinkIcon, HelpCircle, Search, ChevronLeft, ChevronRight, Bell,
  Home, Info, LayoutGrid, Briefcase, Scale, Globe, ExternalLink, Award, Smartphone, Headphones, Images, Send, Menu,
} from "lucide-react";
import Hero from "./Home/HeroSection/HeroManagement";
import NewsPopup from "./Global/NewsPopupManager";
import PartnersManager from "./Home/PartnersSection/PartnersManager";
import ServicesManager from "./Home/ServicesSection/ServicesManager";
import AboutManager from "./Home/AboutSection/AboutManager";
import TechManager from "./Home/TechSection/TechManager";
import WorkManager from "./Home/WorkSection/WorkManager";
import GalleryManager from "./Home/GallerySection/GalleryManager";
import NewsletterManager from "./Home/NewsletterSection/NewsletterManager";
import FooterManager from "./Global/FooterManager";
import NavManager from "./Global/NavManager";
import { getActiveHeroContent } from "../../../services/heroApi";
import { getPartners } from "../../../services/partnerApi";
import { getActiveServices } from "../../../services/servicesApi";
import defaultServiceImage from "../../../Components/Images/pos1.webp";
import { getActiveAbout } from "../../../services/aboutApi";
import defaultAboutImage from "../../../Components/Images/team.webp";
import { getActiveTech } from "../../../services/techApi";
import defaultTechImage from "../../../Components/Images/retail-guy.webp";
import { getActiveWork } from "../../../services/workApi";
import defaultWorkImage from "../../../Components/Images/work.webp";
import { getActiveGallery } from "../../../services/galleryApi";
import defaultGalleryImage from "../../../Components/Images/image1.webp";
import { getActiveNewsletterContent } from "../../../services/newsletterContentApi";
import { getNewsPopups } from "../../../services/newsPopupApi";
import defaultNewsletterImage from "../../../Components/Images/mockup.webp";

// ── Editable sections ──
const SECTIONS = [
  { id: "hero", name: "Hero Banner", type: "Banner", description: "Main landing page hero section with call-to-action", Icon: Layout },
  { id: "partners", name: "Partner Logos", type: "Logos", description: "Scrolling logo strip under the hero", Icon: Award },
  { id: "news-popup", name: "News Popup", type: "Content", description: "Manage promotional popups with expiry dates", Icon: Bell },
  { id: "services", name: "Services", type: "Content", description: "Heading, highlights and the 5 service cards", Icon: Handshake },
  { id: "about", name: "About", type: "Content", description: "Heading and the 4 RetailManager feature cards", Icon: Info },
  { id: "tech", name: "Tech", type: "Content", description: "RM Mobile block: text, badges, cards, person and avatars", Icon: Smartphone },
  { id: "work", name: "Work", type: "Content", description: "Our base block: text, tools, badges, person and service cards", Icon: Headphones },
  { id: "gallery", name: "Gallery", type: "Content", description: "Heading and the two scrolling photo rows", Icon: Images },
  { id: "newsletter", name: "Newsletter", type: "Content", description: "Signup block: text, button, mockup and success message", Icon: Send },
  { id: "nav", name: "Navbar", type: "Content", description: "Menu links, mobile icons and the top buttons", Icon: Menu },
  { id: "footer", name: "Footer", type: "Content", description: "Description, link columns and social links", Icon: LinkIcon },
  { id: "contact", name: "Contact Info", type: "Form", description: "Contact information and form", Icon: Mail },
  { id: "faq", name: "FAQ Section", type: "Content", description: "Frequently asked questions", Icon: HelpCircle },
];

// ── Site pages and the sections that live on each ──
const PAGES = [
  { id: "home", name: "Home", path: "/", Icon: Home, sections: ["hero", "partners", "services", "about", "tech", "work", "gallery", "newsletter"] },
  { id: "about", name: "About Us", path: "/aboutus", Icon: Info, sections: [] },
  { id: "services", name: "Services", path: "/services", Icon: LayoutGrid, sections: [] },
  { id: "contact", name: "Contact", path: "/contact", Icon: Mail, sections: ["contact"] },
  { id: "faq", name: "FAQ", path: "/FAQ", Icon: HelpCircle, sections: ["faq"] },
  { id: "careers", name: "Careers", path: "/Careers", Icon: Briefcase, sections: [] },
  { id: "legal", name: "Legal", path: "/Legal", Icon: Scale, sections: [] },
  { id: "global", name: "Site-wide", path: null, Icon: Globe, sections: ["nav", "news-popup", "footer"], note: "Shows on every page" },
];

const sectionById = (id) => SECTIONS.find((s) => s.id === id);
const pageOfSection = (id) => PAGES.find((p) => p.sections.includes(id));

const CMSContainer = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // ── Page / section come from the URL ──
  //   /admin-panel/frontend                    → pages
  //   /admin-panel/frontend/home               → Home's sections
  //   /admin-panel/frontend/home/hero          → Hero Banner editor
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { "*": rest = "" } = useParams();
  const [pageId, sectionId] = rest.split("/").filter(Boolean);
  const basePath = pathname.slice(0, pathname.indexOf("/frontend") + "/frontend".length);

  const currentPage = PAGES.find((p) => p.id === pageId) || null;
  const currentSection =
    currentPage && currentPage.sections.includes(sectionId) ? sectionById(sectionId) : null;
  const invalidUrl = (pageId && !currentPage) || (sectionId && !currentSection);

  // Dark mode detection
  const [darkMode, setDarkMode] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark")
  );
  useEffect(() => {
    const observer = new MutationObserver(() => setDarkMode(document.documentElement.classList.contains("dark")));
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);
  const textColor = darkMode ? "#ffffff" : "#000000";

  // Real thumbnails for sections that have one (live hero image; re-fetched after editing it)
  const [thumbs, setThumbs] = useState({});
  useEffect(() => {
    if (currentSection) return;
    getActiveHeroContent()
      .then(({ data }) => setThumbs((prev) => ({ ...prev, hero: data.personImage || data.backgroundImage })))
      .catch(() => {});
    getPartners()
      .then(({ data }) => data?.[0] && setThumbs((prev) => ({ ...prev, partners: data[0].image })))
      .catch(() => {});
    getActiveAbout()
      .then(({ data }) => setThumbs((prev) => ({ ...prev, about: data?.cards?.[0]?.image || defaultAboutImage })))
      .catch(() => setThumbs((prev) => ({ ...prev, about: defaultAboutImage })));
    getActiveTech()
      .then(({ data }) => setThumbs((prev) => ({ ...prev, tech: data?.image || defaultTechImage })))
      .catch(() => setThumbs((prev) => ({ ...prev, tech: defaultTechImage })));
    getActiveWork()
      .then(({ data }) => setThumbs((prev) => ({ ...prev, work: data?.image || defaultWorkImage })))
      .catch(() => setThumbs((prev) => ({ ...prev, work: defaultWorkImage })));
    getActiveGallery()
      .then(({ data }) => {
        const first = data?.topRow?.[0];
        setThumbs((prev) => ({ ...prev, gallery: first && !first.startsWith("default:") ? first : defaultGalleryImage }));
      })
      .catch(() => setThumbs((prev) => ({ ...prev, gallery: defaultGalleryImage })));
    getActiveNewsletterContent()
      .then(({ data }) => setThumbs((prev) => ({ ...prev, newsletter: data?.image || defaultNewsletterImage })))
      .catch(() => setThumbs((prev) => ({ ...prev, newsletter: defaultNewsletterImage })));
    getNewsPopups()
      .then(({ data }) => {
        const popup = data?.find((p) => p.isActive) || data?.[0];
        if (popup?.image) setThumbs((prev) => ({ ...prev, "news-popup": popup.image }));
      })
      .catch(() => {});
    getActiveServices()
      .then(({ data }) => setThumbs((prev) => ({ ...prev, services: data?.items?.[0]?.image || defaultServiceImage })))
      .catch(() => setThumbs((prev) => ({ ...prev, services: defaultServiceImage })));
  }, [currentSection]);

  // ── Navigation: pages → page's sections → section editor (each has its own URL) ──
  const go = (path) => {
    setSearchTerm("");
    navigate(`${basePath}${path}`);
  };
  const goToPages = () => go("");
  const openPage = (page) => go(`/${page.id}`);
  const openSection = (section) => go(`/${pageOfSection(section.id).id}/${section.id}`);
  const handleBackClick = () => (currentSection ? openPage(currentPage) : goToPages());

  // Search on the pages screen looks through every section
  const query = searchTerm.trim().toLowerCase();
  const matches = (s) => s.name.toLowerCase().includes(query) || s.description.toLowerCase().includes(query);
  const listedSections = currentPage
    ? currentPage.sections.map(sectionById).filter((s) => !query || matches(s))
    : SECTIONS.filter(matches);

  // ── Sections table (a page's sections, or search results across pages) ──
  const renderSectionsTable = (sections, { showPage = false } = {}) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {["Section", ...(showPage ? ["Page"] : []), "Description"].map((h) => (
              <th key={h} className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider" style={{ color: textColor }}>
                {h}
              </th>
            ))}
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Manage</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {sections.map((section) => (
            <tr
              key={section.id}
              className="transition-colors duration-150 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/40"
              onClick={() => openSection(section)}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                    {thumbs[section.id] ? (
                      <img
                        src={thumbs[section.id]}
                        alt=""
                        className={`w-full h-full ${
                          section.id === "partners" ? "object-contain p-1.5 bg-white" : "object-cover object-top"
                        }`}
                      />
                    ) : (
                      <section.Icon className="w-5 h-5" style={{ color: textColor }} />
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium" style={{ color: textColor }}>{section.name}</div>
                    <div className="text-sm" style={{ color: textColor }}>{section.type}</div>
                  </div>
                </div>
              </td>
              {showPage && (
                <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: textColor }}>
                  {pageOfSection(section.id)?.name || "—"}
                </td>
              )}
              <td className="px-6 py-4">
                <div className="text-sm max-w-xl truncate" style={{ color: textColor }}>{section.description}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openSection(section);
                  }}
                  className="text-[#0f8abe] hover:opacity-70 transition-opacity duration-150 px-3 py-2 rounded-xl"
                >
                  Manage
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sections.length === 0 && (
        <div className="text-center py-12 px-6">
          <Search className="w-12 h-12 mx-auto mb-4" style={{ color: textColor }} />
          <h3 className="text-lg font-semibold mb-2" style={{ color: textColor }}>
            {query ? "No sections found" : "No editable sections yet"}
          </h3>
          <p style={{ color: textColor }}>
            {query ? "Try different search terms." : "This page's content isn't editable from the dashboard yet."}
          </p>
        </div>
      )}
    </div>
  );

  // ── Pages grid ──
  const renderPages = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {PAGES.map((page) => {
        const count = page.sections.length;
        return (
          <button
            key={page.id}
            onClick={() => openPage(page)}
            className="group text-left bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-black text-white dark:bg-white dark:text-black">
                <page.Icon className="w-5 h-5" />
              </div>
              <ChevronRight
                className="w-5 h-5 opacity-40 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                style={{ color: textColor }}
              />
            </div>
            <div className="text-base font-semibold" style={{ color: textColor }}>{page.name}</div>
            <div className="text-xs mt-0.5 text-gray-500 dark:text-gray-400">{page.path || page.note}</div>
            <div className="mt-4">
              <span
                className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                  count ? "bg-gray-100 dark:bg-gray-700" : "bg-gray-50 dark:bg-gray-700/40 text-gray-400"
                }`}
                style={count ? { color: textColor } : undefined}
              >
                {count ? `${count} ${count === 1 ? "section" : "sections"}` : "No editable sections"}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );

  // ── Section editors ──
  const renderSectionEditor = () => {
    switch (currentSection.id) {
      case "hero":
        return <Hero />;
      case "partners":
        return <PartnersManager />;
      case "services":
        return <ServicesManager />;
      case "about":
        return <AboutManager />;
      case "tech":
        return <TechManager />;
      case "work":
        return <WorkManager />;
      case "gallery":
        return <GalleryManager />;
      case "newsletter":
        return <NewsletterManager />;
      case "footer":
        return <FooterManager />;
      case "nav":
        return <NavManager />;
      case "news-popup":
        return <NewsPopup />;
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

  const renderContent = () => {
    if (currentSection) return renderSectionEditor();
    if (currentPage) return renderSectionsTable(listedSections);
    return query ? renderSectionsTable(listedSections, { showPage: true }) : renderPages();
  };

  const crumbClass = "hover:opacity-70 transition-opacity";

  // Unknown page/section in the URL → back to the pages list
  if (invalidUrl) return <Navigate to={basePath} replace />;

  // Fills the admin content area exactly; only the part under the header scrolls
  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900 rounded-xl">
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-gray-200 dark:bg-gray-900 rounded-t-xl px-7 py-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            {/* Title on the pages screen; back button + breadcrumb inside */}
            {!currentPage && !currentSection ? (
              <h1 className="text-2xl font-semibold" style={{ color: textColor }}>
                <Layout className="inline-block w-7 h-7 mr-2" />
                Content Management
              </h1>
            ) : (
              <div className="flex items-center gap-3 flex-wrap" style={{ color: textColor }}>
                <button
                  onClick={handleBackClick}
                  className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Back"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <nav className="flex items-center gap-2 text-sm">
                  <button onClick={goToPages} className={crumbClass}>Content</button>
                  {currentPage && (
                    <>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                      {currentSection ? (
                        <button onClick={() => openPage(currentPage)} className={crumbClass}>{currentPage.name}</button>
                      ) : (
                        <span className="text-lg font-semibold">{currentPage.name}</span>
                      )}
                    </>
                  )}
                  {currentSection && (
                    <>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                      <span className="text-lg font-semibold">{currentSection.name}</span>
                    </>
                  )}
                </nav>
                {currentPage?.path && !currentSection && (
                  <a
                    href={currentPage.path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs hover:opacity-70"
                    style={{ color: "#0f8abe" }}
                  >
                    View page <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {!currentSection && (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{ color: textColor }} />
                <input
                  type="text"
                  placeholder={currentPage ? `Search ${currentPage.name} sections...` : "Search all sections..."}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 rounded-xl bg-gray-50 dark:bg-gray-800 text-sm focus:ring-1 focus:ring-[#0f8abe] outline-none"
                  style={{ color: textColor }}
                />
              </div>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-auto p-6 bg-gray-200 dark:bg-gray-900">{renderContent()}</div>
      </div>
    </div>
  );
};

export default CMSContainer;