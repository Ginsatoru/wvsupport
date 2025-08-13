import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";
import {
  FaCashRegister,
  FaSyncAlt,
  FaStore,
  FaServer,
  FaChartBar,
  FaUsers,
  FaHandshake,
  FaDatabase,
  FaTools,
  FaShieldAlt,
  FaChartLine,
} from "react-icons/fa";
import { IoMdTrendingUp } from "react-icons/io";
import { GiProgression } from "react-icons/gi";
import headerImage from "./Images/header.png";

// Technology icons
import windowsIcon from "./Images/windows.png";
import sqlIcon from "./Images/sql.png";
import retailManagerIcon from "./Images/retailmanager.png";
import webstoreIcon from "./Images/webstore.png";
import multiStoreIcon from "./Images/multistore.png";
import posIcon from "./Images/pos.png";
import inventoryIcon from "./Images/inventory.png";
import reportingIcon from "./Images/reporting.png";
import teamviewerIcon from "./Images/teamviewer.png";
import onedriveIcon from "./Images/onedrive.png";
import accessIcon from "./Images/access.png";
import outlookIcon from "./Images/outlook.png";

const Services = () => {
  const { t } = useTranslation();
  
  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

  const services = [
    {
      title: t("servicesPage.services.retailManagerPos.title"),
      description: t("servicesPage.services.retailManagerPos.description"),
      icon: <FaCashRegister />,
      details: t("servicesPage.services.retailManagerPos.details"),
    },
    {
      title: t("servicesPage.services.webstoreIntegration.title"),
      description: t("servicesPage.services.webstoreIntegration.description"),
      icon: <FaSyncAlt />,
      details: t("servicesPage.services.webstoreIntegration.details"),
    },
    {
      title: t("servicesPage.services.multiStoreManagement.title"),
      description: t("servicesPage.services.multiStoreManagement.description"),
      icon: <FaStore />,
      details: t("servicesPage.services.multiStoreManagement.details"),
    },
    {
      title: t("servicesPage.services.webHostingService.title"),
      description: t("servicesPage.services.webHostingService.description"),
      icon: <FaServer />,
      details: t("servicesPage.services.webHostingService.details"),
    },
    {
      title: t("servicesPage.services.reportingAnalytics.title"),
      description: t("servicesPage.services.reportingAnalytics.description"),
      icon: <FaChartBar />,
      details: t("servicesPage.services.reportingAnalytics.details"),
    },
    {
      title: t("servicesPage.services.customerManagement.title"),
      description: t("servicesPage.services.customerManagement.description"),
      icon: <FaUsers />,
      details: t("servicesPage.services.customerManagement.details"),
    },
  ];

  const technologies = [
    {
      name: t("servicesPage.technologies.retailManager"),
      icon: retailManagerIcon,
      alt: "RetailManager"
    },
    {
      name: t("servicesPage.technologies.webStoreManager"),
      icon: webstoreIcon,
      alt: "WebStore Manager"
    },
    {
      name: t("servicesPage.technologies.rmMultiStore"),
      icon: multiStoreIcon,
      alt: "RM Multi-Store"
    },
    {
      name: t("servicesPage.technologies.webHosting"),
      icon: inventoryIcon,
      alt: "Web Hosting"
    },
    {
      name: t("servicesPage.technologies.windowsPlatform"),
      icon: windowsIcon,
      alt: "Windows"
    },
    {
      name: t("servicesPage.technologies.sqlDatabase"),
      icon: sqlIcon,
      alt: "SQL Database"
    },
    {
      name: t("servicesPage.technologies.posHardware"),
      icon: posIcon,
      alt: "POS Hardware"
    },
    {
      name: t("servicesPage.technologies.reportingTools"),
      icon: reportingIcon,
      alt: "Reporting Tools"
    },
    {
      name: t("servicesPage.technologies.teamViewer"),
      icon: teamviewerIcon,
      alt: "TeamViewer"
    },
    {
      name: t("servicesPage.technologies.oneDrive"),
      icon: onedriveIcon,
      alt: "OneDrive"
    },
    {
      name: t("servicesPage.technologies.microsoftAccess"),
      icon: accessIcon,
      alt: "Microsoft Access"
    },
    {
      name: t("servicesPage.technologies.outlookClassic"),
      icon: outlookIcon,
      alt: "Outlook Classic"
    },
  ];

  const processSteps = [
    {
      title: t("servicesPage.process.needsAssessment.title"),
      description: t("servicesPage.process.needsAssessment.description"),
      icon: <FaHandshake />,
    },
    {
      title: t("servicesPage.process.dataMigration.title"),
      description: t("servicesPage.process.dataMigration.description"),
      icon: <FaDatabase />,
    },
    {
      title: t("servicesPage.process.systemConfiguration.title"),
      description: t("servicesPage.process.systemConfiguration.description"),
      icon: <FaTools />,
    },
    {
      title: t("servicesPage.process.trainingSupport.title"),
      description: t("servicesPage.process.trainingSupport.description"),
      icon: <FaShieldAlt />,
    },
  ];

  const whyChooseUs = [
    {
      title: t("servicesPage.whyChooseUs.retailSpecialists.title"),
      description: t("servicesPage.whyChooseUs.retailSpecialists.description"),
      icon: <IoMdTrendingUp />,
    },
    {
      title: t("servicesPage.whyChooseUs.provenTrackRecord.title"),
      description: t("servicesPage.whyChooseUs.provenTrackRecord.description"),
      icon: <GiProgression />,
    },
    {
      title: t("servicesPage.whyChooseUs.ongoingSupport.title"),
      description: t("servicesPage.whyChooseUs.ongoingSupport.description"),
      icon: <FaChartLine />,
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <div
        className="relative text-white py-15 text-center bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 138, 190, 0.8), rgba(15, 138, 190, 0.9)), url(${headerImage})`,
        }}
      >
        <div className="max-w-4xl mx-auto px-5">
          <h1 className="text-4xl mb-4 font-bold animate-[slideIn_0.5s_ease-in-out]">
            {t("servicesPage.hero.title")}
          </h1>
          <p className="text-xl opacity-90 text-white animate-[slideIn_0.5s_ease-in-out]">
            {t("servicesPage.hero.subtitle")}
          </p>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto my-16 px-5">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.05)] text-center h-full transition-all duration-300 hover:transform hover:-translate-y-3 hover:shadow-[0_15px_35px_rgba(0,0,0,0.1)]"
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <div className="text-4xl text-[#0f8abe] mb-6 inline-flex justify-center items-center w-20 h-20 bg-[#0f8abe]/10 rounded-full">
              {service.icon}
            </div>
            <h3 className="font-semibold text-xl text-gray-700 mb-4">
              {service.title}
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm mb-4">
              {service.description}
            </p>
            <p className="text-gray-700 text-xs leading-relaxed">
              {service.details}
            </p>
          </div>
        ))}
      </div>

      {/* Technologies Section */}
      <section className="py-16 px-8 bg-gradient-to-br from-gray-50 to-gray-200 text-center">
        <h2 className="text-3xl text-[#0f8abe] mb-4 font-bold relative inline-block leading-tight">
          {t("servicesPage.technologies.title")}
        </h2>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
          {t("servicesPage.technologies.subtitle")}
        </p>

        <div className="max-w-6xl mx-auto mt-12">
          {/* First Tech Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {technologies.slice(0, 4).map((tech, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-8 shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:transform hover:-translate-y-1"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="flex justify-center items-center h-20 mb-4">
                  <img
                    src={tech.icon}
                    alt={tech.alt}
                    className="w-20 h-20 object-contain mb-4"
                  />
                </div>
                <h4 className="text-xl text-gray-900 mb-0 max-[600px]:text-base">
                  {tech.name}
                </h4>
              </div>
            ))}
          </div>

          {/* Second Tech Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {technologies.slice(4, 8).map((tech, index) => (
              <div
                key={index + 4}
                className="bg-white rounded-xl p-8 shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:transform hover:-translate-y-1"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="flex justify-center items-center h-20 mb-4">
                  <img
                    src={tech.icon}
                    alt={tech.alt}
                    className="w-20 h-20 object-contain mb-4"
                  />
                </div>
                <h4 className="text-xl text-gray-900 mb-0 max-[600px]:text-base">
                  {tech.name}
                </h4>
              </div>
            ))}
          </div>

          {/* Third Tech Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {technologies.slice(8, 12).map((tech, index) => (
              <div
                key={index + 8}
                className="bg-white rounded-xl p-8 shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:transform hover:-translate-y-1"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="flex justify-center items-center h-20 mb-4">
                  <img
                    src={tech.icon}
                    alt={tech.alt}
                    className="w-20 h-20 object-contain mb-4"
                  />
                </div>
                <h4 className="text-xl text-gray-900 mb-0 max-[600px]:text-base">
                  {tech.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50 text-center">
        <h2 className="text-3xl text-[#0f8abe] mb-4 font-bold relative inline-block leading-tight">
          {t("servicesPage.process.title")}
        </h2>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
          {t("servicesPage.process.subtitle")}
        </p>
        <div className="flex justify-center flex-wrap gap-8 max-w-6xl mx-auto px-5">
          {processSteps.map((step, index) => (
            <div
              key={index}
              className="flex-1 min-w-[250px] bg-white rounded-xl p-8 shadow-[0_5px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:transform hover:-translate-y-3 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="text-3xl text-[#0f8abe] mb-6 inline-flex justify-center items-center w-[70px] h-[70px] bg-[#0f8abe]/10 rounded-full">
                {step.icon}
              </div>
              <h3 className="font-semibold text-xl text-slate-800 mb-4">
                {step.title}
              </h3>
              <p className="text-gray-700 leading-relaxed text-sm">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-slate-50 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <h2
            className="text-3xl text-[#0f8abe] mb-6 font-bold relative inline-block"
            data-aos="fade-up"
          >
            {t("servicesPage.whyChooseUs.title")}
          </h2>
          <p
            className="text-gray-700 text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {t("servicesPage.whyChooseUs.subtitle")}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
            {whyChooseUs.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-10 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 relative overflow-hidden z-10 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[5px] before:bg-gradient-to-r before:from-[#0f8abe]/60 before:to-[#0f8abe] hover:transform hover:-translate-y-3 hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)]"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <div className="text-4xl text-[#0f8abe] mb-6 inline-flex justify-center items-center w-20 h-20 bg-[#0f8abe]/10 rounded-full">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-2xl text-slate-800 mb-4">
                  {item.title}
                </h3>
                <p className="text-gray-700 leading-7 text-base">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-200 text-[#0f8abe] text-center">
        <div className="max-w-4xl mx-auto px-5" data-aos="fade-up">
          <h2 className="leading-tight text-3xl mb-6 font-bold">
            {t("servicesPage.cta.title")}
          </h2>
          <p className="text-xl mb-10 leading-7 opacity-90 max-w-2xl mx-auto text-gray-700">
            {t("servicesPage.cta.subtitle")}
          </p>
          <Link
            to="/contact"
            className="inline-block py-4 px-10 bg-white text-[#0f8abe] rounded-full no-underline font-semibold text-lg transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.1)] hover:transform hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)] hover:bg-gray-50"
          >
            {t("servicesPage.cta.button")}
          </Link>
        </div>
      </section>

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
    </>
  );
};

export default Services;