import React from "react";
import { Star, CheckCircle, Users, Clock, Shield, Zap } from "lucide-react";
import {
  FaLaptop,
  FaUserFriends,
  FaCreditCard,
  FaLink,
  FaTools,
  FaChartBar,
  FaBolt,
  FaSearch,
} from "react-icons/fa";
import posSystemImage from "./Images/RM.png";
import supportTeamImage from "./Images/team.png";
import troubleshootingImage from "./Images/trouble.png";
import { Link } from "react-router-dom";

const TroubleshootingExperience = () => {
  return (
    <div className="font-['Montserrat'] bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Compact Hero Section */}
      <section className="relative bg-white shadow-md rounded-b-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#0f8abe]/5 to-[#0f8abe]/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div className="text-center">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-2 sm:mb-3">
              RetailManager
              <span className="text-[#0f8abe] block mt-1 text-xl sm:text-2xl md:text-3xl">
                Troubleshooting Experience
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-4 sm:mb-5">
              Expert solutions for your retail software challenges with 25+ years of experience
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-center items-center">
              <a
                href="https://www.aaapos.com/support/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-[#0f8abe] text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-semibold text-sm sm:text-base hover:bg-[#0d7bb5] hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Get Support Now
              </a>
              <a
                href="https://www.aaapos.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border-2 border-[#0f8abe] text-[#0f8abe] px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-semibold text-sm sm:text-base hover:bg-[#0f8abe] hover:text-white transition-all duration-300"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              We'd love to tell you about us
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              Our team brings unparalleled expertise in diagnosing and resolving
              RetailManager software issues, ensuring smooth customer operations
              and minimal downtime for your business.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="text-center p-3 sm:p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <div className="text-xl sm:text-2xl font-bold text-[#0f8abe] mb-1">
                  25+
                </div>
                <div className="text-gray-600 font-medium text-xs sm:text-sm">
                  Years Experience
                </div>
              </div>
              <div className="text-center p-3 sm:p-4 bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                <div className="text-xl sm:text-2xl font-bold text-[#0f8abe] mb-1">
                  500+
                </div>
                <div className="text-gray-600 font-medium text-xs sm:text-sm">
                  Clients Served
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="group cursor-pointer">
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                <div className="h-32 sm:h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={posSystemImage}
                    alt="RetailManager POS System Interface"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-center text-xs sm:text-sm">
                    RetailManager POS System
                  </h3>
                </div>
              </div>
            </div>
            <div className="group cursor-pointer">
              <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group-hover:scale-[1.02]">
                <div className="h-32 sm:h-44 bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={supportTeamImage}
                    alt="Our Expert Support Team"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-3">
                  <h3 className="font-semibold text-gray-900 text-center text-xs sm:text-sm">
                    Our Expert Support Team
                  </h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Highlight */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-[#0f8abe]/5 to-[#0f8abe]/10 rounded-xl p-6 sm:p-8 border-l-4 border-[#0f8abe]">
            <div className="grid lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-1">
                <div className="w-24 h-24 sm:w-28 sm:h-28 bg-[#0f8abe]/20 rounded-xl flex items-center justify-center text-[#0f8abe] mx-auto overflow-hidden">
                  <img
                    src={troubleshootingImage}
                    alt="Troubleshooting Expertise"
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
              </div>
              <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Backed by 25+ Years of Experience
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  We've developed a deep understanding of the unique challenges
                  retailers face in today's competitive landscape. Our
                  specialists are skilled in troubleshooting software errors,
                  database inconsistencies, and system configuration issues with
                  precision and speed.
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <div className="flex items-center gap-1 sm:gap-2 text-[#0f8abe] font-medium text-xs sm:text-sm">
                    <Shield className="w-4 h-4" />
                    <span>Secure Solutions</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 text-[#0f8abe] font-medium text-xs sm:text-sm">
                    <Zap className="w-4 h-4" />
                    <span>Fast Resolution</span>
                  </div>
                  <div className="flex items-center gap-1 sm:gap-2 text-[#0f8abe] font-medium text-xs sm:text-sm">
                    <Users className="w-4 h-4" />
                    <span>Expert Team</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            Comprehensive Technical Support
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We provide end-to-end support for all RetailManager systems,
            ensuring your business runs smoothly
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {[
            {
              icon: <FaCreditCard className="text-2xl sm:text-3xl text-[#0f8abe] mb-2" />,
              title: "Transaction & Payment Issues",
              description:
                "Guiding users through transaction errors and payment processing issues",
            },
            {
              icon: <FaLink className="text-2xl sm:text-3xl text-[#0f8abe] mb-2" />,
              title: "Connectivity Solutions",
              description:
                "Resolving connectivity problems between POS systems and backend servers",
            },
            {
              icon: <FaTools className="text-2xl sm:text-3xl text-[#0f8abe] mb-2" />,
              title: "Integration Support",
              description:
                "Troubleshooting integration concerns with third-party applications",
            },
            {
              icon: <FaChartBar className="text-2xl sm:text-3xl text-[#0f8abe] mb-2" />,
              title: "Inventory Management",
              description:
                "Addressing inventory management and reporting discrepancies",
            },
            {
              icon: <FaBolt className="text-2xl sm:text-3xl text-[#0f8abe] mb-2" />,
              title: "Performance Optimization",
              description:
                "Optimizing system performance for high-volume retail environments",
            },
            {
              icon: <FaSearch className="text-2xl sm:text-3xl text-[#0f8abe] mb-2" />,
              title: "Advanced Diagnostics",
              description:
                "Log analysis, patches, and workarounds for complex issues",
            },
          ].map((service, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-4 sm:p-8 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 border-t-2 border-[#0f8abe]"
            >
              <div className="flex justify-center">{service.icon}</div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 text-center">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed text-center text-sm sm:text-base">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
              Our Proven Troubleshooting Process
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We follow a systematic approach to ensure efficient and effective
              resolution of your RetailManager issues
            </p>
          </div>

          <div className="mb-8 sm:mb-10">
            <div className="bg-gradient-to-r from-[#0f8abe]/10 to-[#0f8abe]/20 rounded-xl p-6 text-center">
              <div className="flex justify-center mb-3">
                <FaTools className="text-4xl sm:text-5xl text-[#0f8abe]" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                Our Structured Troubleshooting Methodology
              </h3>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {[
              {
                number: "1",
                title: "Initial Assessment",
                description:
                  "We gather all relevant information about your issue, including error messages, recent changes, and system environment details.",
              },
              {
                number: "2",
                title: "Diagnosis",
                description:
                  "Our experts analyze logs, replicate issues in test environments, and identify root causes using specialized diagnostic tools.",
              },
              {
                number: "3",
                title: "Solution Development",
                description:
                  "We develop and test solutions, considering both immediate fixes and long-term prevention strategies.",
              },
              {
                number: "4",
                title: "Implementation",
                description:
                  "Solutions are carefully implemented with minimal disruption, including user training if needed.",
              },
              {
                number: "5",
                title: "Follow-up",
                description:
                  "We monitor the solution's effectiveness and provide additional support to ensure complete resolution.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md p-4 sm:p-10 hover:shadow-lg transition-all duration-300 relative pt-10 sm:pt-12 border-t-2 border-[#0f8abe]"
              >
                <div className="absolute -top-4 left-4 w-8 h-8 sm:w-9 sm:h-9 bg-[#0f8abe] text-white rounded-xl flex items-center justify-center font-bold text-sm sm:text-base shadow-md">
                  {step.number}
                </div>
                <h3 className="text-sm sm:text-base font-semibold text-[#0f8abe] mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-xs sm:text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
            What Our Clients Say
          </h2>
          <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what RetailManager users say
            about our troubleshooting services
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-5">
          {[
            {
              content:
                "The support team resolved our critical checkout system issue in under an hour during peak holiday season. Their expertise saved us thousands in potential lost sales.",
              author: "Sarah Johnson",
              title: "Retail Operations Manager, Fashion Outlet",
              avatar: "https://randomuser.me/api/portraits/women/68.jpg",
            },
            {
              content:
                "After struggling with inventory sync issues for months, their team identified and fixed the root cause in two days. We've had zero problems since.",
              author: "Michael Chen",
              title: "IT Director, Home & Living Stores",
              avatar: "https://randomuser.me/api/portraits/men/44.jpg",
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-5 sm:p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-[#0f8abe]"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="flex text-[#0f8abe] text-base">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4 sm:w-5 sm:h-5 fill-current"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.122-6.545L.487 6.91l6.561-.955L10 0l2.952 5.955 6.561.955-4.757 4.635 1.122 6.545z" />
                    </svg>
                  ))}
                </div>
              </div>

              <blockquote className="text-gray-600 text-sm sm:text-base italic leading-relaxed mb-4 relative">
                <span className="text-[#0f8abe] text-4xl sm:text-5xl opacity-20 absolute -top-3 -left-1">
                  "
                </span>
                {testimonial.content}
              </blockquote>

              <div className="flex items-center gap-3">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.author}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl object-cover shadow-sm"
                />
                <div>
                  <div className="font-semibold text-[#0f8abe] text-sm sm:text-base">
                    {testimonial.author}
                  </div>
                  <div className="text-gray-500 text-xs sm:text-sm">
                    {testimonial.title}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#0f8abe] mb-4 sm:mb-5">
            Ready to Resolve Your RetailManager Issues?
          </h2>
          <p className="text-sm sm:text-base text-gray-900 mb-6 leading-relaxed">
            Our expert team is standing by to help you get back to business
            quickly and efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/contact"
              className="bg-white text-[#0f8abe] px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg inline-block text-center"
            >
              Contact Support Now
            </Link>
          </div>
        </div>
      </section>
    </div>  
  );
};

export default TroubleshootingExperience;