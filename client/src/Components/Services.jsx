import React, { useEffect } from "react";
import { Link } from "react-router-dom";
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

const services = [
  {
    title: "RetailManager POS",
    description: "Comprehensive point-of-sale solutions for retail businesses.",
    icon: <FaCashRegister />,
    details:
      "Custom setup, barcode scanning, receipt printing, and payment processing.",
  },
  {
    title: "WebStore Integration",
    description:
      "Seamless integration between your physical and online stores.",
    icon: <FaSyncAlt />,
    details:
      "Real-time inventory sync, order management, and customer data integration.",
  },
  {
    title: "Multi-Store Management",
    description: "Centralized control for businesses with multiple locations.",
    icon: <FaStore />,
    details:
      "Unified reporting, inventory transfers, and consolidated purchasing.",
  },
  {
    title: "Web Hosting Service",
    description: "Reliable and scalable hosting solutions for your websites.",
    icon: <FaServer />,
    details:
      "High uptime, fast loading speeds, domain support, and easy management tools.",
  },

  {
    title: "Reporting & Analytics",
    description: "Powerful insights into your business performance.",
    icon: <FaChartBar />,
    details:
      "Custom reports, sales trends, profit analysis, and KPI dashboards.",
  },
  {
    title: "Customer Management",
    description: "Build loyalty and understand your customer base.",
    icon: <FaUsers />,
    details:
      "Customer profiles, purchase history, loyalty programs, and marketing tools.",
  },
];

const Services = () => {
  useEffect(() => {
    AOS.init({ duration: 700, once: true });
  }, []);

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
            Our Services
          </h1>
          <p className="text-xl opacity-90 text-white animate-[slideIn_0.5s_ease-in-out]">
            Comprehensive tools to streamline your retail operations and boost
            your business performance.
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
          Our Retail Technology Stack
        </h2>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
          We specialize in these powerful retail management technologies and
          platforms
        </p>

        <div className="max-w-6xl mx-auto mt-12">
          {/* First Tech Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div
              className="bg-white rounded-xl p-8 shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:transform hover:-translate-y-1"
              data-aos="fade-up"
              data-aos-delay="0"
            >
              <div className="flex justify-center items-center h-20 mb-4">
                <img
                  src={retailManagerIcon}
                  alt="RetailManager"
                  className="w-20 h-20 object-contain mb-4"
                />
              </div>
              <h4 className="text-xl text-gray-900 mb-0 max-[600px]:text-base">
                RetailManager
              </h4>
            </div>
            <div
              className="bg-white rounded-xl p-8 shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:transform hover:-translate-y-1"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="flex justify-center items-center h-20 mb-4">
                <img
                  src={webstoreIcon}
                  alt="WebStore Manager"
                  className="w-20 h-20 object-contain mb-4"
                />
              </div>
              <h4 className="text-xl text-gray-900 mb-0 max-[600px]:text-base">
                WebStore Manager
              </h4>
            </div>
            <div
              className="bg-white rounded-xl p-8 shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:transform hover:-translate-y-1"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="flex justify-center items-center h-20 mb-4">
                <img
                  src={multiStoreIcon}
                  alt="RM Multi-Store"
                  className="w-20 h-20 object-contain mb-4"
                />
              </div>
              <h4 className="text-xl text-gray-900 mb-0 max-[600px]:text-base">
                RM Multi-Store
              </h4>
            </div>

            <div
              className="bg-white rounded-xl p-8 shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:transform hover:-translate-y-1"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="flex justify-center items-center h-20 mb-4">
                <img
                  src={inventoryIcon}
                  alt="Web Hosting"
                  className="w-20 h-20 object-contain mb-4"
                />
              </div>
              <h4 className="text-xl text-gray-900 mb-0 max-[600px]:text-base">
                Web Hosting
              </h4>
            </div>
          </div>

          {/* Second Tech Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div
              className="bg-white rounded-xl p-8 shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:transform hover:-translate-y-1"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="flex justify-center items-center h-20 mb-4">
                <img
                  src={windowsIcon}
                  alt="Windows"
                  className="w-20 h-20 object-contain mb-4"
                />
              </div>
              <h4 className="text-xl text-gray-900 mb-0 max-[600px]:text-base">
                Windows Platform
              </h4>
            </div>
            <div
              className="bg-white rounded-xl p-8 shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:transform hover:-translate-y-1"
              data-aos="fade-up"
              data-aos-delay="0"
            >
              <div className="flex justify-center items-center h-20 mb-4">
                <img
                  src={sqlIcon}
                  alt="SQL Database"
                  className="w-20 h-20 object-contain mb-4"
                />
              </div>
              <h4 className="text-xl text-gray-900 mb-0 max-[600px]:text-base">
                SQL Database
              </h4>
            </div>
            <div
              className="bg-white rounded-xl p-8 shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:transform hover:-translate-y-1"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="flex justify-center items-center h-20 mb-4">
                <img
                  src={posIcon}
                  alt="POS Hardware"
                  className="w-20 h-20 object-contain mb-4"
                />
              </div>
              <h4 className="text-xl text-gray-900 mb-0 max-[600px]:text-base">
                POS Hardware
              </h4>
            </div>

            <div
              className="bg-white rounded-xl p-8 shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:transform hover:-translate-y-1"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="flex justify-center items-center h-20 mb-4">
                <img
                  src={reportingIcon}
                  alt="Reporting Tools"
                  className="w-20 h-20 object-contain mb-4"
                />
              </div>
              <h4 className="text-xl text-gray-900 mb-0 max-[600px]:text-base">
                Reporting Tools
              </h4>
            </div>
          </div>

          {/* Third Tech Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div
              className="bg-white rounded-xl p-8 shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:transform hover:-translate-y-1"
              data-aos="fade-up"
              data-aos-delay="0"
            >
              <div className="flex justify-center items-center h-20 mb-4">
                <img
                  src={teamviewerIcon}
                  alt="TeamViewer"
                  className="w-20 h-20 object-contain mb-4"
                />
              </div>
              <h4 className="text-xl text-gray-900 mb-0 max-[600px]:text-base">
                TeamViewer
              </h4>
            </div>
            <div
              className="bg-white rounded-xl p-8 shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:transform hover:-translate-y-1"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="flex justify-center items-center h-20 mb-4">
                <img
                  src={onedriveIcon}
                  alt="OneDrive"
                  className="w-20 h-20 object-contain mb-4"
                />
              </div>
              <h4 className="text-xl text-gray-900 mb-0 max-[600px]:text-base">
                OneDrive
              </h4>
            </div>
            <div
              className="bg-white rounded-xl p-8 shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:transform hover:-translate-y-1"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="flex justify-center items-center h-20 mb-4">
                <img
                  src={accessIcon}
                  alt="Microsoft Access"
                  className="w-20 h-20 object-contain mb-4"
                />
              </div>
              <h4 className="text-xl text-gray-900 mb-0 max-[600px]:text-base">
                Microsoft Access
              </h4>
            </div>
            <div
              className="bg-white rounded-xl p-8 shadow-[0_5px_15px_rgba(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_10px_25px_rgba(0,0,0,0.1)] hover:transform hover:-translate-y-1"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="flex justify-center items-center h-20 mb-4">
                <img
                  src={outlookIcon}
                  alt="Outlook Classic"
                  className="w-20 h-20 object-contain mb-4"
                />
              </div>
              <h4 className="text-xl text-gray-900 mb-0 max-[600px]:text-base">
                Outlook Classic
              </h4>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 bg-gray-50 text-center">
        <h2 className="text-3xl text-[#0f8abe] mb-4 font-bold relative inline-block leading-tight">
          Our Implementation Process
        </h2>
        <p className="text-gray-700 text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
          We follow a structured approach to ensure successful RetailManager
          deployment
        </p>
        <div className="flex justify-center flex-wrap gap-8 max-w-6xl mx-auto px-5">
          <div
            className="flex-1 min-w-[250px] bg-white rounded-xl p-8 shadow-[0_5px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:transform hover:-translate-y-3 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]"
            data-aos="fade-up"
            data-aos-delay="0"
          >
            <div className="text-3xl text-[#0f8abe] mb-6 inline-flex justify-center items-center w-[70px] h-[70px] bg-[#0f8abe]/10 rounded-full">
              <FaHandshake />
            </div>
            <h3 className="font-semibold text-xl text-slate-800 mb-4">
              Needs Assessment
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm">
              We analyze your business requirements, current processes, and pain
              points to recommend the right solution.
            </p>
          </div>
          <div
            className="flex-1 min-w-[250px] bg-white rounded-xl p-8 shadow-[0_5px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:transform hover:-translate-y-3 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <div className="text-3xl text-[#0f8abe] mb-6 inline-flex justify-center items-center w-[70px] h-[70px] bg-[#0f8abe]/10 rounded-full">
              <FaDatabase />
            </div>
            <h3 className="font-semibold text-xl text-slate-800 mb-4">
              Business Data Migration
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm">
              We securely transfer your existing product, customer, and
              transaction data to the new system.
            </p>
          </div>
          <div
            className="flex-1 min-w-[250px] bg-white rounded-xl p-8 shadow-[0_5px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:transform hover:-translate-y-3 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <div className="text-3xl text-[#0f8abe] mb-6 inline-flex justify-center items-center w-[70px] h-[70px] bg-[#0f8abe]/10 rounded-full">
              <FaTools />
            </div>
            <h3 className="font-semibold text-xl text-slate-800 mb-4">
              System Configuration
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm">
              We customize RetailManager to match your business workflows, tax
              rules, and reporting needs.
            </p>
          </div>
          <div
            className="flex-1 min-w-[250px] bg-white rounded-xl p-8 shadow-[0_5px_20px_rgba(0,0,0,0.05)] transition-all duration-300 hover:transform hover:-translate-y-3 hover:shadow-[0_8px_25px_rgba(0,0,0,0.1)]"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            <div className="text-3xl text-[#0f8abe] mb-6 inline-flex justify-center items-center w-[70px] h-[70px] bg-[#0f8abe]/10 rounded-full">
              <FaShieldAlt />
            </div>
            <h3 className="font-semibold text-xl text-slate-800 mb-4">
              Training & Support
            </h3>
            <p className="text-gray-700 leading-relaxed text-sm">
              Comprehensive staff training and ongoing support to ensure you get
              the most from your system.
            </p>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-slate-50 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <h2
            className="text-3xl text-[#0f8abe] mb-6 font-bold relative inline-block"
            data-aos="fade-up"
          >
            Why Retailers Choose Us
          </h2>
          <p
            className="text-gray-700 text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            We combine deep retail expertise with technical knowledge to deliver
            solutions that drive real business results.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-12">
            <div
              className="bg-white rounded-2xl p-10 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 relative overflow-hidden z-10 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[5px] before:bg-gradient-to-r before:from-[#0f8abe]/60 before:to-[#0f8abe] hover:transform hover:-translate-y-3 hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)]"
              data-aos="fade-up"
              data-aos-delay="0"
            >
              <div className="text-4xl text-[#0f8abe] mb-6 inline-flex justify-center items-center w-20 h-20 bg-[#0f8abe]/10 rounded-full">
                <IoMdTrendingUp />
              </div>
              <h3 className="font-semibold text-2xl text-slate-800 mb-4">
                Retail Specialists
              </h3>
              <p className="text-gray-700 leading-7 text-base">
                Our team understands retail operations from the ground up,
                ensuring solutions that actually work in real retail
                environments.
              </p>
            </div>

            <div
              className="bg-white rounded-2xl p-10 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 relative overflow-hidden z-10 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[5px] before:bg-gradient-to-r before:from-[#0f8abe]/60 before:to-[#0f8abe] hover:transform hover:-translate-y-3 hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)]"
              data-aos="fade-up"
              data-aos-delay="100"
            >
              <div className="text-4xl text-[#0f8abe] mb-6 inline-flex justify-center items-center w-20 h-20 bg-[#0f8abe]/10 rounded-full">
                <GiProgression />
              </div>
              <h3 className="font-semibold text-2xl text-slate-800 mb-4">
                Proven Track Record
              </h3>
              <p className="text-gray-700 leading-7 text-base">
                We've helped hundreds of retailers streamline operations, reduce
                costs, and increase sales through our solutions.
              </p>
            </div>

            <div
              className="bg-white rounded-2xl p-10 shadow-[0_10px_30px_rgba(0,0,0,0.05)] transition-all duration-300 relative overflow-hidden z-10 before:content-[''] before:absolute before:top-0 before:left-0 before:w-full before:h-[5px] before:bg-gradient-to-r before:from-[#0f8abe]/60 before:to-[#0f8abe] hover:transform hover:-translate-y-3 hover:shadow-[0_15px_40px_rgba(0,0,0,0.1)]"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <div className="text-4xl text-[#0f8abe] mb-6 inline-flex justify-center items-center w-20 h-20 bg-[#0f8abe]/10 rounded-full">
                <FaChartLine />
              </div>
              <h3 className="font-semibold text-2xl text-slate-800 mb-4">
                Ongoing Support
              </h3>
              <p className="text-gray-700 leading-7 text-base">
                We don't just implement systems - we provide continuous support,
                updates, and optimizations as your business grows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-gray-200 text-[#0f8abe] text-center">
        <div className="max-w-4xl mx-auto px-5" data-aos="fade-up">
          <h2 className="leading-tight text-3xl mb-6 font-bold">
            Ready to Transform Your Retail Business?
          </h2>
          <p className="text-xl mb-10 leading-7 opacity-90 max-w-2xl mx-auto text-gray-700">
            Let's discuss how RetailManager can streamline your operations and
            boost your profits. Our team is ready to help.
          </p>
          <Link
            to="/contact"
            className="inline-block py-4 px-10 bg-white text-[#0f8abe] rounded-full no-underline font-semibold text-lg transition-all duration-300 shadow-[0_5px_15px_rgba(0,0,0,0.1)] hover:transform hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(0,0,0,0.2)] hover:bg-gray-50"
          >
            Get Started Today
          </Link>
        </div>
      </section>

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
    </>
  );
};

export default Services;
