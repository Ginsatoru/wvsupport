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
import { useTranslation } from 'react-i18next';

const Careers = () => {
  const { t } = useTranslation();
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
      title: t('careersPage.positions.customerSupport.title'),
      fullDescription: [
        t('careersPage.positions.customerSupport.description.paragraph1'),
        t('careersPage.positions.customerSupport.description.paragraph2'),
        t('careersPage.positions.customerSupport.description.paragraph3'),
        t('careersPage.positions.customerSupport.description.paragraph4'),
        t('careersPage.positions.customerSupport.description.paragraph5')
      ],
      requirements: [
        t('careersPage.positions.customerSupport.requirements.experience'),
        t('careersPage.positions.customerSupport.requirements.computerKnowledge'),
        t('careersPage.positions.customerSupport.requirements.englishFluency'),
        t('careersPage.positions.customerSupport.requirements.communication'),
        t('careersPage.positions.customerSupport.requirements.teamwork'),
        t('careersPage.positions.customerSupport.requirements.troubleshooting'),
        t('careersPage.positions.customerSupport.requirements.shiftWork')
      ],
      benefits: [
        t('careersPage.positions.customerSupport.benefits.salary'),
        t('careersPage.positions.customerSupport.benefits.bonuses'),
        t('careersPage.positions.customerSupport.benefits.insurance'),
        t('careersPage.positions.customerSupport.benefits.leave'),
        t('careersPage.positions.customerSupport.benefits.career'),
        t('careersPage.positions.customerSupport.benefits.technology'),
        t('careersPage.positions.customerSupport.benefits.flexibility')
      ],
      type: t('careersPage.positions.customerSupport.type'),
      location: t('careersPage.positions.customerSupport.location'),
      contact: {
        phone: "0974839135",
        telegram: "0974839135",
        email: "wvservicescambodia@gmail.com",
        address: t('careersPage.positions.customerSupport.contact.address')
      }
    },
    {
      title: t('careersPage.positions.backendDeveloper.title'),
      fullDescription: [
        t('careersPage.positions.backendDeveloper.description.paragraph1'),
        t('careersPage.positions.backendDeveloper.description.paragraph2'),
        t('careersPage.positions.backendDeveloper.description.paragraph3')
      ],
      requirements: [
        t('careersPage.positions.backendDeveloper.requirements.nodejs'),
        t('careersPage.positions.backendDeveloper.requirements.database'),
        t('careersPage.positions.backendDeveloper.requirements.aws'),
        t('careersPage.positions.backendDeveloper.requirements.cicd')
      ],
      benefits: [
        t('careersPage.positions.backendDeveloper.benefits.compensation'),
        t('careersPage.positions.backendDeveloper.benefits.stocks'),
        t('careersPage.positions.backendDeveloper.benefits.training'),
        t('careersPage.positions.backendDeveloper.benefits.remote')
      ],
      type: t('careersPage.positions.backendDeveloper.type'),
      location: t('careersPage.positions.backendDeveloper.location')
    },
    {
      title: t('careersPage.positions.uiuxDesigner.title'),
      fullDescription: [
        t('careersPage.positions.uiuxDesigner.description.paragraph1'),
        t('careersPage.positions.uiuxDesigner.description.paragraph2'),
        t('careersPage.positions.uiuxDesigner.description.paragraph3')
      ],
      requirements: [
        t('careersPage.positions.uiuxDesigner.requirements.experience'),
        t('careersPage.positions.uiuxDesigner.requirements.tools'),
        t('careersPage.positions.uiuxDesigner.requirements.portfolio'),
        t('careersPage.positions.uiuxDesigner.requirements.designSystems')
      ],
      benefits: [
        t('careersPage.positions.uiuxDesigner.benefits.freedom'),
        t('careersPage.positions.uiuxDesigner.benefits.hardware'),
        t('careersPage.positions.uiuxDesigner.benefits.schedule'),
        t('careersPage.positions.uiuxDesigner.benefits.retreat')
      ],
      type: t('careersPage.positions.uiuxDesigner.type'),
      location: t('careersPage.positions.uiuxDesigner.location')
    },
    {
      title: t('careersPage.positions.marketingSpecialist.title'),
      fullDescription: [
        t('careersPage.positions.marketingSpecialist.description.paragraph1'),
        t('careersPage.positions.marketingSpecialist.description.paragraph2'),
        t('careersPage.positions.marketingSpecialist.description.paragraph3')
      ],
      requirements: [
        t('careersPage.positions.marketingSpecialist.requirements.experience'),
        t('careersPage.positions.marketingSpecialist.requirements.analytics'),
        t('careersPage.positions.marketingSpecialist.requirements.copywriting'),
        t('careersPage.positions.marketingSpecialist.requirements.socialMedia')
      ],
      benefits: [
        t('careersPage.positions.marketingSpecialist.benefits.bonuses'),
        t('careersPage.positions.marketingSpecialist.benefits.budget'),
        t('careersPage.positions.marketingSpecialist.benefits.networking'),
        t('careersPage.positions.marketingSpecialist.benefits.travel')
      ],
      type: t('careersPage.positions.marketingSpecialist.type'),
      location: t('careersPage.positions.marketingSpecialist.location')
    },
  ];

  return (
    <div className="max-w-[1100px] mx-auto my-8 px-4 sm:px-6 py-8 sm:py-10 bg-white rounded-xl shadow-md font-[var(--font-primary)]">
      <header className="text-center mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl text-[#0f8abe] font-bold mb-3">{t('careersPage.hero.title')}</h1>
        <p className="text-base sm:text-lg text-[#555] max-w-2xl mx-auto">
          {t('careersPage.hero.subtitle')}
        </p>
      </header>

      <section className="mb-12">
        <div className="bg-gradient-to-r from-[#0f8abe] to-[#0c6f94] rounded-xl p-6 text-white">
          <h2 className="text-xl sm:text-2xl font-semibold mb-4">{t('careersPage.whyWorkWithUs.title')}</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm sm:text-base leading-relaxed mb-4">
                {t('careersPage.whyWorkWithUs.description')}
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
                <span>{t('careersPage.contact.address')}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <FaRegLightbulb className="text-xl mb-1" />
                <h3 className="font-medium text-sm mb-1">{t('careersPage.whyWorkWithUs.values.innovation.title')}</h3>
                <p className="text-xs opacity-90">{t('careersPage.whyWorkWithUs.values.innovation.description')}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <FaHandshake className="text-xl mb-1" />
                <h3 className="font-medium text-sm mb-1">{t('careersPage.whyWorkWithUs.values.collaboration.title')}</h3>
                <p className="text-xs opacity-90">{t('careersPage.whyWorkWithUs.values.collaboration.description')}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <FaShieldAlt className="text-xl mb-1" />
                <h3 className="font-medium text-sm mb-1">{t('careersPage.whyWorkWithUs.values.security.title')}</h3>
                <p className="text-xs opacity-90">{t('careersPage.whyWorkWithUs.values.security.description')}</p>
              </div>
              <div className="bg-white bg-opacity-20 p-3 rounded-xl">
                <FaMedal className="text-xl mb-1" />
                <h3 className="font-medium text-sm mb-1">{t('careersPage.whyWorkWithUs.values.growth.title')}</h3>
                <p className="text-xs opacity-90">{t('careersPage.whyWorkWithUs.values.growth.description')}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xl sm:text-2xl text-[#0f8abe] font-semibold mb-6 text-center">{t('careersPage.openings.title')}</h2>

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
                  {t('careersPage.buttons.viewDetails')} <FaArrowRight className="text-xs" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="text-center mt-12">
        <p className="text-sm sm:text-base text-[#666] mb-3">
          {t('careersPage.footer.noMatch')}
        </p>
        <motion.a
          href="mailto:careers@wvsupport.com.kh"
          className="inline-block bg-[#0f8abe] text-white px-6 py-3 rounded-xl hover:bg-[#0c6f94] transition-colors text-sm sm:text-base"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          {t('careersPage.buttons.sendResume')}
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
                    <h3 className="text-base sm:text-lg font-semibold text-[#0f8abe] mb-2">{t('careersPage.modal.positionOverview')}</h3>
                    {selectedPosition.fullDescription.map((paragraph, idx) => (
                      <p key={idx} className="text-xs sm:text-sm text-[#555] mb-2 leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-[#0f8abe] mb-2">{t('careersPage.modal.requirements')}</h3>
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
                      <h3 className="text-base sm:text-lg font-semibold text-[#0f8abe] mb-2">{t('careersPage.modal.benefits')}</h3>
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
                    {t('careersPage.buttons.close')}
                  </motion.button>
                  <motion.button
                    onClick={handleApplyClick}
                    className="px-3 py-1.5 bg-[#0f8abe] text-xs sm:text-sm text-white rounded-xl hover:bg-[#0c6f94] transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {t('careersPage.buttons.applyNow')}
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
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-1.5">{t('careersPage.unavailableModal.title')}</h3>
                  <div className="mt-1.5">
                    <p className="text-xs sm:text-sm text-gray-500">
                      {t('careersPage.unavailableModal.message')}
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
                      {t('careersPage.buttons.understood')}
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