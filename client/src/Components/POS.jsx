import React from "react";
import {
  Monitor,
  Shield,
  Globe,
  Headphones,
  Search,
  Wrench,
  Check,
  Quote,
  Clock,
  Lock,
  Users,
  Database,
  Printer,
  Network,
  GraduationCap,
} from "lucide-react";

const RetailManagerPOSSupport = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header Section with Image Background */}
      <div 
        className="relative py-20 px-4 sm:px-6 lg:px-8 text-center overflow-hidden"
        style={{
          backgroundImage: "url('https://web-assets.bcg.com/dc/eb/b3a2abf44e32b5cfba378b05a77c/the-next-normal-outlook-for-australian-retail-in-2022.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black opacity-50"></div>
        
        <div className="relative max-w-4xl mx-auto z-10">
          <div className="inline-flex items-center justify-center bg-white bg-opacity-20 p-5 rounded-xl mb-8 transition-all duration-500 hover:rotate-6 hover:scale-105">
            <Monitor className="h-16 w-16 text-white" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            RetailManager <span className="text-white">POS</span> Support
          </h1>
          <p className="text-xl text-gray-200">
            Premium 24/7 support with{" "}
            <span className="font-semibold text-white">
              97% satisfaction rate
            </span>
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-10">
        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: <Clock className="h-8 w-8 text-primary" />,
              title: "Fast Response",
              description:
                "Under 10 minute average response time for critical issues",
              stats: "98% uptime guarantee",
            },
            {
              icon: <Lock className="h-8 w-8 text-primary" />,
              title: "Secure Support",
              description: "Military-grade encrypted remote sessions",
              stats: "100% security compliance",
            },
            {
              icon: <Globe className="h-8 w-8 text-primary" />,
              title: "Global Coverage",
              description: "Support in multiple languages and timezones",
              stats: "24/7 availability",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className="bg-gray p-8 rounded-xl transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 border border-gray-100 hover:border-primary hover:border-opacity-30"
            >
              <div className="bg-blue-500 bg-opacity-10 p-4 rounded-xl inline-flex mb-6 transition-transform duration-300 hover:scale-110">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 mb-4">{feature.description}</p>
              <div className="bg-gray-100 px-4 py-2 rounded-xl inline-block transition-colors duration-300 hover:text-white">
                <span className="font-normal text-gray-800">
                  {feature.stats}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-20 border border-gray-200 transition-shadow duration-300 hover:shadow-xl">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Our Support Process
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                icon: <Headphones className="h-6 w-6 text-white" />,
                step: "1",
                title: "Report Issue",
                description: "Contact us via phone, chat, or email",
              },
              {
                icon: <Search className="h-6 w-6 text-white" />,
                step: "2",
                title: "Diagnose",
                description: "We analyze your system remotely",
              },
              {
                icon: <Wrench className="h-6 w-6 text-white" />,
                step: "3",
                title: "Resolve",
                description: "Immediate solution implementation",
              },
              {
                icon: <Check className="h-6 w-6 text-white" />,
                step: "4",
                title: "Verify",
                description: "We confirm everything works perfectly",
              },
            ].map((step, index) => (
              <div
                key={index}
                className="group transform transition-all duration-300 ease-in-out hover:-translate-y-2"
              >
                <div className="bg-primary w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-bold text-white mb-4 mx-auto transition-transform duration-300 group-hover:scale-110">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-center text-gray-800 mb-2 transition-colors duration-300 group-hover:text-primary">
                  {step.title}
                </h3>
                <p className="text-gray-600 text-center transition-colors duration-300 group-hover:text-gray-800">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Coverage Areas */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Comprehensive Coverage
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Database className="h-8 w-8 text-white" />,
                title: "Software Support",
                items: [
                  "System errors & crashes",
                  "Performance optimization",
                  "Updates & installations",
                  "Database maintenance",
                ],
              },
              {
                icon: <Printer className="h-8 w-8 text-white" />,
                title: "Hardware Support",
                items: [
                  "Printer/scanner setup",
                  "Peripheral configuration",
                  "Network troubleshooting",
                  "POS hardware issues",
                ],
              },
              {
                icon: <GraduationCap className="h-8 w-8 text-white" />,
                title: "Training",
                items: [
                  "New staff onboarding",
                  "Feature walkthroughs",
                  "Best practices",
                  "Custom reporting",
                ],
              },
            ].map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 transform transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-2 hover:border-primary hover:border-opacity-50"
              >
                <div className="bg-primary text-white p-6 flex items-center transition-colors duration-300 hover:bg-primary-dark">
                  <div className="mr-4">{category.icon}</div>
                  <h3 className="text-xl font-bold">{category.title}</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-3">
                    {category.items.map((item, itemIndex) => (
                      <li 
                        key={itemIndex} 
                        className="flex items-start transition-colors duration-200 hover:text-primary"
                      >
                        <svg
                          className="flex-shrink-0 h-5 w-5 text-primary mt-1 mr-3 transition-colors duration-200 group-hover:text-primary-dark"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Trusted by Retailers Worldwide
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote:
                  "Their team resolved our critical system outage in just 8 minutes! We've never experienced such fast support.",
                name: "Sarah Johnson",
                company: "Fashion Boutique Chain",
              },
              {
                quote:
                  "The bilingual support has been invaluable for our international stores. Truly a global service.",
                name: "Michael Chen",
                company: "Grocery Supermarkets",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl border border-gray-200 transform transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 hover:border-primary hover:border-opacity-50"
              >
                <div className="text-primary mb-6 transition-transform duration-300 hover:scale-110">
                  <Quote className="h-10 w-10" />
                </div>
                <p className="text-lg text-gray-600 italic mb-6 transition-colors duration-300 hover:text-gray-800">
                  "{testimonial.quote}"
                </p>
                <div className="transition-colors duration-300 hover:text-primary">
                  <p className="font-bold text-gray-800">{testimonial.name}</p>
                  <p className="text-gray-500">{testimonial.company}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-primary rounded-xl p-12 text-center text-white shadow-2xl transform transition-all duration-500 ease-in-out hover:shadow-3xl hover:-translate-y-1">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready for Stress-Free POS Support?
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Join thousands of retailers who trust our expert team
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white hover:bg-gray-100 text-primary font-bold py-4 px-10 rounded-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center hover:scale-105">
              <Headphones className="mr-2 h-5 w-5 transition-transform duration-300 hover:scale-125" /> 
              Get Instant Support
            </button>
            <button className="border-2 border-white hover:bg-white hover:bg-opacity-20 text-white font-bold py-4 px-10 rounded-xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 flex items-center justify-center">
              <Users className="mr-2 h-5 w-5 transition-transform duration-300 hover:scale-125" /> 
              View Pricing Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RetailManagerPOSSupport;