import React, { useState } from "react";
import { 
  FaTimes, 
  FaArrowRight, 
  FaRegLightbulb, 
  FaHandshake, 
  FaShieldAlt, 
  FaMedal, 
  FaSadTear
} from "react-icons/fa";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

const Careers = () => {
  const [showModal, setShowModal] = useState(false);
  const [showUnavailableModal, setShowUnavailableModal] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);

  const toggleModal = (position = null) => {
    setSelectedPosition(position);
    setShowModal(!showModal);
    document.body.style.overflow = showModal ? 'auto' : 'hidden';
  };

  const toggleUnavailableModal = () => {
    setShowUnavailableModal(!showUnavailableModal);
    document.body.style.overflow = showUnavailableModal ? 'auto' : 'hidden';
  };

  const handleApplyClick = (e) => {
    e.preventDefault();
    toggleModal();
    toggleUnavailableModal();
  };

  const positions = [
    {
      title: "Customer Support Specialist",
      fullDescription: [
        "WV Support Services is a software support company serving customers throughout Australia, New Zealand, and the Asia/Pacific Region. As a Customer Support Specialist, you'll be the frontline of our customer experience. You'll handle inquiries via phone, email, and chat, providing solutions that delight our clients.",
        "This role requires troubleshooting technical issues, guiding customers through our products, and documenting solutions for our knowledge base. You'll work closely with our product team to communicate customer needs and feedback.",
        "We're looking for someone with a minimum of 1 year customer service experience, excellent problem-solving skills, and patience in handling diverse customer personalities. Computer knowledge is required. Bilingual candidates are highly preferred.",
        "You should be able to speak, read, and write English fluently and have excellent communication skills combined with a nice, friendly personality. The ability to work in a team environment is essential.",
        "Working hours are Monday to Friday, 6am to 3pm (with a 1-hour lunch break), plus 6am to 1pm on two Saturdays per month. The working week is 43 hours."
      ],
      requirements: [
        "Minimum 1 year customer service experience",
        "Computer knowledge is required",
        "Fluent in English (speaking, reading, writing)",
        "Excellent verbal and written communication skills",
        "Friendly personality and ability to work in a team environment",
        "Technical troubleshooting skills",
        "Ability to work rotating shifts, including Saturdays"
      ],
      benefits: [
        "Competitive salary",
        "Performance bonuses",
        "Comprehensive health insurance included",
        "Annual leave and public holidays as per Cambodian laws",
        "Opportunity to learn and advance your career",
        "Work with the latest technology",
        "Flexible work arrangements"
      ],
      type: "Full-time",
      location: "Siem Reap, Cambodia",
      contact: {
        phone: "0974839135",
        telegram: "0974839135",
        email: "wvservicescambodia@gmail.com",
        address: "Phum Thmey, Sangkat Svay Dankum, Siem Reap, Cambodia"
      }
    },
    {
      title: "Backend Developer",
      fullDescription: [
        "Join our engineering team to design, develop, and maintain the backend services that power our applications. You'll work with modern technologies including Node.js, Express, MongoDB, and AWS services.",
        "Responsibilities include implementing new features, optimizing performance, writing unit tests, and participating in code reviews. You'll collaborate with frontend developers to create seamless integrations.",
        "Ideal candidates have 3+ years of backend development experience, strong knowledge of RESTful API design, and experience with database optimization. Open source contributions are a plus."
      ],
      requirements: [
        "3+ years Node.js experience",
        "Proficient with MongoDB/PostgreSQL",
        "Experience with AWS services",
        "Understanding of CI/CD pipelines"
      ],
      benefits: [
        "Above-market compensation",
        "Stock options package",
        "Conference/training budget",
        "Remote work options"
      ],
      type: "Full-time",
      location: "Remote (Cambodia-based)"
    },
    {
      title: "UI/UX Designer",
      fullDescription: [
        "As our UI/UX Designer, you'll lead the design of our digital products from concept to implementation. You'll conduct user research, create wireframes and prototypes, and collaborate with developers to bring designs to life.",
        "You'll establish and maintain our design system, ensuring consistency across all platforms. We value designers who can balance aesthetic appeal with functional usability.",
        "The perfect candidate has 3+ years of product design experience, proficiency in Figma/Sketch, and a portfolio demonstrating user-centered design solutions. Experience with front-end development is a bonus."
      ],
      requirements: [
        "3+ years UI/UX design experience",
        "Expertise in Figma/Sketch",
        "Strong portfolio of work",
        "Understanding of design systems"
      ],
      benefits: [
        "Creative freedom on projects",
        "Latest hardware/software",
        "Flexible schedule",
        "Annual design retreat"
      ],
      type: "Contract",
      location: "Siem Reap, Cambodia"
    },
    {
      title: "Marketing Specialist",
      fullDescription: [
        "Our Marketing Specialist will develop and execute campaigns across digital and traditional channels. You'll create content, manage social media, analyze performance metrics, and help shape our brand voice.",
        "This role involves coordinating with external agencies, planning events, and developing strategies to increase brand awareness and customer acquisition.",
        "We're looking for someone with 2+ years in digital marketing, strong writing skills, and experience with analytics tools. Video editing and graphic design skills are advantageous."
      ],
      requirements: [
        "2+ years marketing experience",
        "Proficiency in digital analytics",
        "Excellent copywriting skills",
        "Social media management"
      ],
      benefits: [
        "Performance-based bonuses",
        "Creative campaign budgets",
        "Networking opportunities",
        "Travel for industry events"
      ],
      type: "Full-time",
      location: "Siem Reap, Cambodia"
    },
  ];

  return (
    <div className="max-w-[1100px] mx-auto my-8 px-4 sm:px-6 py-8 sm:py-10 bg-white rounded-xl shadow-md font-[Montserrat]">
      <header className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-[#0f8abe] font-bold mb-3">Join Our Growing Team</h1>
        <p className="text-base sm:text-lg text-[#555] max-w-2xl mx-auto">
          Be part of something amazing. We're building the future of business solutions in Cambodia.
        </p>
      </header>

      <section className="mb-12">
        <div className="bg-gradient-to-r from-[#0f8abe] to-[#0c6f94] rounded-xl p-6 text-white">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">Why Work With Us?</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm sm:text-base leading-relaxed mb-4">
                At WV Support Services Cambodia, we believe in creativity, collaboration, and growth.
                We're passionate about building a team that feels like family while achieving remarkable things together.
              </p>
              <div className="flex items-center space-x-3 mb-3 text-sm sm:text-base">
                <FiPhone className="text-lg" />
                <span>+855 974 839 135</span>
              </div>
              <div className="flex items-center space-x-3 mb-3 text-sm sm:text-base">
                <FiMail className="text-lg" />
                <span>wvsservicescambodia@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm sm:text-base">
                <FiMapPin className="text-lg" />
                <span>Phum Thmey, Sangkat Svay Dankum, Siem Reap Cambodia</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <FaRegLightbulb className="text-xl mb-1" />
                <h3 className="font-medium text-sm mb-1">Innovation</h3>
                <p className="text-xs opacity-90">Cutting-edge projects</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <FaHandshake className="text-xl mb-1" />
                <h3 className="font-medium text-sm mb-1">Collaboration</h3>
                <p className="text-xs opacity-90">Team-oriented culture</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <FaShieldAlt className="text-xl mb-1" />
                <h3 className="font-medium text-sm mb-1">Security</h3>
                <p className="text-xs opacity-90">Stable environment</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <FaMedal className="text-xl mb-1" />
                <h3 className="font-medium text-sm mb-1">Growth</h3>
                <p className="text-xs opacity-90">Career development</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl sm:text-2xl text-[#0f8abe] font-semibold mb-6 text-center">Current Openings</h2>

        <div className="space-y-4">
          {positions.map((position, index) => (
            <motion.div
              key={index}
              className="bg-[#f9fbfd] border border-[#e0e6ed] rounded-xl p-4 transition-all duration-200 hover:border-[#0f8abe] hover:shadow-sm"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div className="mb-3 sm:mb-0">
                  <h3 className="text-lg sm:text-xl font-semibold text-[#0f8abe] mb-1">
                    {position.title}
                  </h3>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs sm:text-sm text-[#666]">
                    <span>{position.type}</span>
                    <span>{position.location}</span>
                  </div>
                </div>
                <button
                  onClick={() => toggleModal(position)}
                  className="flex items-center gap-1 bg-[#0f8abe] text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl hover:bg-[#0c6f94] transition-colors text-sm sm:text-base"
                >
                  View Details <FaArrowRight className="text-xs" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="text-center mt-12">
        <p className="text-sm sm:text-base text-[#666] mb-3">
          Don't see the perfect match for your skills?
        </p>
        <motion.a
          href="mailto:careers@wvsupport.com.kh"
          className="inline-block bg-[#0f8abe] text-white px-6 py-3 rounded-xl hover:bg-[#0c6f94] transition-colors text-sm sm:text-base"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Send Us Your Resume
        </motion.a>
      </footer>

      {/* Job Details Modal */}
      <AnimatePresence>
        {showModal && selectedPosition && (
          <>
            <motion.div 
              onClick={() => toggleModal()}
              className="fixed inset-0 z-40 bg-black bg-opacity-70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            ></motion.div>
            
            <motion.div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div 
                className="relative bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto shadow-lg"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-white z-10 p-4 border-b border-[#e0e6ed] flex justify-between items-start">
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-[#0f8abe]">{selectedPosition.title}</h2>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs sm:text-sm text-[#666]">
                      <span>{selectedPosition.type}</span>
                      <span>{selectedPosition.location}</span>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => toggleModal()}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    whileHover={{ rotate: 90 }}
                  >
                    <FaTimes className="text-base" />
                  </motion.button>
                </div>

                {/* Modal Body */}
                <div className="p-4 sm:p-5 space-y-4">
                  <div className="mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-[#0f8abe] mb-2">Position Overview</h3>
                    {selectedPosition.fullDescription.map((paragraph, idx) => (
                      <p key={idx} className="text-xs sm:text-sm text-[#555] mb-2 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-[#0f8abe] mb-2">Requirements</h3>
                      <ul className="space-y-1.5">
                        {selectedPosition.requirements.map((req, idx) => (
                          <motion.li 
                            key={idx} 
                            className="flex items-start"
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                          >
                            <span className="inline-block w-1.5 h-1.5 bg-[#0f8abe] rounded-full mt-1.5 mr-2"></span>
                            <span className="text-xs sm:text-sm text-[#555]">{req}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-[#0f8abe] mb-2">Benefits</h3>
                      <ul className="space-y-1.5">
                        {selectedPosition.benefits.map((benefit, idx) => (
                          <motion.li 
                            key={idx} 
                            className="flex items-start"
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.03 }}
                          >
                            <span className="inline-block w-1.5 h-1.5 bg-[#0f8abe] rounded-full mt-1.5 mr-2"></span>
                            <span className="text-xs sm:text-sm text-[#555]">{benefit}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="sticky bottom-0 bg-white border-t border-[#e0e6ed] p-3 flex flex-col sm:flex-row justify-end gap-2">
                  <motion.button 
                    onClick={() => toggleModal()}
                    className="px-3 py-1.5 bg-[#e0e6ed] text-xs sm:text-sm text-[#555] rounded-xl hover:bg-[#d0d6dd] transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Close
                  </motion.button>
                  <motion.button
                    onClick={handleApplyClick}
                    className="px-3 py-1.5 bg-[#0f8abe] text-xs sm:text-sm text-white rounded-xl hover:bg-[#0c6f94] transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Apply Now
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Job Unavailable Modal */}
      <AnimatePresence>
        {showUnavailableModal && (
          <>
            <motion.div 
              onClick={toggleUnavailableModal}
              className="fixed inset-0 z-40 bg-black bg-opacity-70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            ></motion.div>
            
            <motion.div 
              className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <motion.div 
                className="relative bg-white rounded-xl max-w-md w-full shadow-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-5 text-center">
                  <motion.div
                    className="mx-auto flex items-center justify-center h-10 w-10 rounded-full bg-red-100 mb-3"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <FaSadTear className="h-5 w-5 text-red-600" />
                  </motion.div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1.5">Position Unavailable</h3>
                  <div className="mt-1.5">
                    <p className="text-xs sm:text-sm text-gray-500">
                      We're sorry, but this job position is currently unavailable. Please check back later or explore our other open positions.
                    </p>
                  </div>
                  <div className="mt-4">
                    <motion.button
                      type="button"
                      className="inline-flex justify-center rounded-xl border border-transparent px-3 py-1.5 bg-[#0f8abe] text-xs sm:text-sm font-medium text-white hover:bg-[#0c6f94] focus:outline-none"
                      onClick={toggleUnavailableModal}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      Understood
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Careers;