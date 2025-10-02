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

const TroubleshootingExperience = () => {
  // Using placeholder images since we can't import the original ones
  const posSystemImage = "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80";
  const supportTeamImage = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80";
  const troubleshootingImage = "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80";

  return (
    <div className="font-sans bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      {/* Modern Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f8abe]/5 via-[#0f8abe]/10 to-[#0f8abe]/5 opacity-60"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-2 sm:mb-3 px-3 py-1 sm:px-4 sm:py-2 bg-[#0f8abe] rounded-full">
              <span className="text-white text-xs sm:text-sm font-semibold tracking-wide">25+ Years of Excellence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-3 sm:mb-4 md:mb-6">
              RetailManager
              <span className="block mt-1 sm:mt-2 text-[#0f8abe]">
                Troubleshooting Experience
              </span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 mb-4 sm:mb-6 md:mb-8 leading-relaxed">
              Expert solutions for your retail software challenges with precision and care
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center items-center">
              <a
                href="https://www.aaapos.com/support/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-[#0f8abe] text-white rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="relative z-10">Get Support Now</span>
                <div className="absolute inset-0 bg-[#0d7bb5] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </a>
              <a
                href="https://www.aaapos.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white text-gray-800 rounded-xl sm:rounded-2xl font-semibold text-sm sm:text-base border-2 border-gray-200 hover:border-[#0f8abe] hover:bg-gray-50 transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section with Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12 items-center">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="inline-block px-3 py-1 sm:px-4 sm:py-2 bg-[#0f8abe]/10 rounded-full">
              <span className="text-[#0f8abe] text-xs sm:text-sm font-semibold">About Us</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Your trusted partner in retail technology
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
              Our team brings unparalleled expertise in diagnosing and resolving
              RetailManager software issues, ensuring smooth operations
              and minimal downtime for your business.
            </p>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-6 pt-2 sm:pt-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-[#0f8abe] rounded-xl sm:rounded-2xl opacity-10 group-hover:opacity-30 blur group-hover:blur-md transition-all duration-300"></div>
                <div className="relative bg-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0f8abe] mb-1 sm:mb-2">
                    25+
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-700 font-semibold">
                    Years Experience
                  </div>
                </div>
              </div>
              <div className="relative group">
                <div className="absolute inset-0 bg-[#0f8abe] rounded-xl sm:rounded-2xl opacity-10 group-hover:opacity-30 blur group-hover:blur-md transition-all duration-300"></div>
                <div className="relative bg-white p-3 sm:p-4 md:p-6 rounded-xl sm:rounded-2xl sha">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#0f8abe] mb-1 sm:mb-2">
                    500+
                  </div>
                  <div className="text-xs sm:text-sm md:text-base text-gray-700 font-semibold">
                    Clients Served
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500">
              <div className="aspect-square overflow-hidden">
                <img
                  src={posSystemImage}
                  alt="RetailManager POS System"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-bold text-sm sm:text-base md:text-lg">RetailManager POS System</h3>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 sm:mt-8">
              <div className="aspect-square overflow-hidden">
                <img
                  src={supportTeamImage}
                  alt="Expert Support Team"
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 md:p-6 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-bold text-sm sm:text-base md:text-lg">Our Expert Support Team</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Highlight */}
      <section className="py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl sm:rounded-3xl p-5 sm:p-8 md:p-12 shadow-2xl">
            <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 bg-[#0f8abe]/20 rounded-full opacity-50 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-[#0f8abe]/20 rounded-full opacity-50 blur-3xl"></div>
            
            <div className="relative grid lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8 items-center">
              <div className="lg:col-span-1">
                <div className="h-40 sm:h-48 md:h-56 bg-gradient-to-br from-[#0f8abe] to-[#0d7bb5] rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto shadow-xl overflow-hidden">
                  <img
                    src={troubleshootingImage}
                    alt="Troubleshooting"
                    className="w-full h-full object-cover opacity-90"
                  />
                </div>
              </div>
              <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
                <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                  Backed by 25+ Years of Experience
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-gray-300 leading-relaxed">
                  We've developed a deep understanding of the unique challenges
                  retailers face. Our specialists are skilled in troubleshooting software errors,
                  database inconsistencies, and system configuration issues with
                  precision and speed.
                </p>
                <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-full text-white">
                    <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    <span className="font-medium text-xs sm:text-sm md:text-base">Secure Solutions</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-full text-white">
                    <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    <span className="font-medium text-xs sm:text-sm md:text-base">Fast Resolution</span>
                  </div>
                  <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 backdrop-blur-sm px-2.5 py-1.5 sm:px-3 sm:py-2 md:px-4 md:py-2 rounded-full text-white">
                    <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                    <span className="font-medium text-xs sm:text-sm md:text-base">Expert Team</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-block mb-2 sm:mb-3 md:mb-4 px-3 py-1 sm:px-4 sm:py-2 bg-[#0f8abe]/10 rounded-full">
            <span className="text-[#0f8abe] text-xs sm:text-sm font-semibold">Our Services</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
            Comprehensive Technical Support
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We provide end-to-end support for all RetailManager systems,
            ensuring your business runs smoothly
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {[
            {
              icon: <FaCreditCard className="text-2xl sm:text-3xl md:text-xl" />,
              title: "Transaction & Payment Issues",
              description: "Guiding users through transaction errors and payment processing issues",
              gradient: "from-[#0f8abe] to-[#0d7bb5]"
            },
            {
              icon: <FaLink className="text-2xl sm:text-3xl md:text-xl" />,
              title: "Connectivity Solutions",
              description: "Resolving connectivity problems between POS systems and backend servers",
              gradient: "from-[#0f8abe] to-[#0d7bb5]"
            },
            {
              icon: <FaTools className="text-2xl sm:text-3xl md:text-xl" />,
              title: "Integration Support",
              description: "Troubleshooting integration concerns with third-party applications",
              gradient: "from-[#0f8abe] to-[#0d7bb5]"
            },
            {
              icon: <FaChartBar className="text-2xl sm:text-3xl md:text-xl" />,
              title: "Inventory Management",
              description: "Addressing inventory management and reporting discrepancies",
              gradient: "from-[#0f8abe] to-[#0d7bb5]"
            },
            {
              icon: <FaBolt className="text-2xl sm:text-3xl md:text-xl" />,
              title: "Performance Optimization",
              description: "Optimizing system performance for high-volume retail environments",
              gradient: "from-[#0f8abe] to-[#0d7bb5]"
            },
            {
              icon: <FaSearch className="text-2xl sm:text-3xl md:text-xl" />,
              title: "Advanced Diagnostics",
              description: "Log analysis, patches, and workarounds for complex issues",
              gradient: "from-[#0f8abe] to-[#0d7bb5]"
            },
          ].map((service, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-4 sm:p-6 md:p-8 overflow-hidden"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
              <div className={`inline-flex p-2.5 sm:p-3 md:p-4 rounded-xl sm:rounded-2xl bg-gradient-to-br ${service.gradient} text-white mb-3 sm:mb-4 md:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                {service.icon}
              </div>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                {service.title}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="bg-gradient-to-br from-gray-50 to-gray-100 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12 md:mb-16">
            <div className="inline-block mb-2 sm:mb-3 md:mb-4 px-3 py-1 sm:px-4 sm:py-2 bg-[#0f8abe]/10 rounded-full">
            <span className="text-[#0f8abe] text-xs sm:text-sm font-semibold">Our Process</span>
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
              Proven Troubleshooting Process
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We follow a systematic approach to ensure efficient and effective
              resolution of your RetailManager issues
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {[
              {
                number: "1",
                title: "Initial Assessment",
                description: "We gather all relevant information about your issue, including error messages, recent changes, and system environment details.",
              },
              {
                number: "2",
                title: "Diagnosis",
                description: "Our experts analyze logs, replicate issues in test environments, and identify root causes using specialized diagnostic tools.",
              },
              {
                number: "3",
                title: "Solution Development",
                description: "We develop and test solutions, considering both immediate fixes and long-term prevention strategies.",
              },
              {
                number: "4",
                title: "Implementation",
                description: "Solutions are carefully implemented with minimal disruption, including user training if needed.",
              },
              {
                number: "5",
                title: "Follow-up",
                description: "We monitor the solution's effectiveness and provide additional support to ensure complete resolution.",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="relative bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-4 sm:p-6 md:p-8"
              >
                <div className="absolute -top-3 sm:-top-4 left-4 sm:left-6 md:left-8 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#0f8abe] text-white rounded-xl sm:rounded-2xl flex items-center justify-center font-bold text-base sm:text-lg md:text-xl shadow-lg">
                  {step.number}
                </div>
                <div className="pt-4 sm:pt-5 md:pt-6">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-16">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <div className="inline-block mb-2 sm:mb-3 md:mb-4 px-3 py-1 sm:px-4 sm:py-2 bg-[#0f8abe]/10 rounded-full">
            <span className="text-[#0f8abe] text-xs sm:text-sm font-semibold">Testimonials</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
            What Our Clients Say
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Don't just take our word for it. Here's what RetailManager users say
            about our troubleshooting services
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
          {[
            {
              content: "The support team resolved our critical checkout system issue in under an hour during peak holiday season. Their expertise saved us thousands in potential lost sales.",
              author: "Sarah Johnson",
              title: "Retail Operations Manager, Fashion Outlet",
              avatar: "https://randomuser.me/api/portraits/women/68.jpg",
            },
            {
              content: "After struggling with inventory sync issues for months, their team identified and fixed the root cause in two days. We've had zero problems since.",
              author: "Michael Chen",
              title: "IT Director, Home & Living Stores",
              avatar: "https://randomuser.me/api/portraits/men/44.jpg",
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="relative bg-white rounded-2xl sm:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 p-4 sm:p-6 md:p-8 overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full opacity-30 blur-2xl"></div>
              
              <div className="relative">
                <div className="flex gap-0.5 sm:gap-1 mb-3 sm:mb-4 md:mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 fill-current text-yellow-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 15l-5.878 3.09 1.122-6.545L.487 6.91l6.561-.955L10 0l2.952 5.955 6.561.955-4.757 4.635 1.122 6.545z" />
                    </svg>
                  ))}
                </div>

                <p className="text-gray-700 text-sm sm:text-base md:text-lg leading-relaxed mb-4 sm:mb-6 md:mb-8">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-xl sm:rounded-2xl object-cover shadow-md"
                  />
                  <div>
                    <div className="font-bold text-gray-900 text-sm sm:text-base md:text-lg">
                      {testimonial.author}
                    </div>
                    <div className="text-gray-500 text-xs sm:text-sm md:text-base">
                      {testimonial.title}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden py-8 sm:py-12 md:py-16">
        <div className="absolute inset-0 bg-gray-100"></div>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-white rounded-full opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-white rounded-full opacity-10 blur-3xl"></div>
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-600 mb-3 sm:mb-4 md:mb-6">
            Ready to Resolve Your RetailManager Issues?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 md:mb-10 leading-relaxed">
            Our expert team is standing by to help you get back to business
            quickly and efficiently.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 md:px-8 md:py-4 bg-white text-[#0f8abe] rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base md:text-lg hover:bg-gray-100 hover:scale-105 transition-all duration-300 shadow-xl"
            >
              Contact Support Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TroubleshootingExperience;