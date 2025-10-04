import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight } from "lucide-react";
import IT from "./Images/IT.webp";

const RetailManagerTroubleshooting = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="flex justify-center min-h-[70vh] bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="flex flex-col md:flex-row items-center w-full md:w-[85%] max-w-[1500px] mx-auto gap-8 md:gap-12">
        
        {/* Left - Image Section */}
        <div className="w-full md:w-1/2">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="relative h-[400px] w-full max-w-[800px] mx-auto rounded-xl overflow-hidden shadow-lg group">
              <img 
                src={IT} 
                alt={t('retailManager.imageAlt')} 
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-[#0f8abe]/85 text-white flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 text-center">
                <h4 className="text-2xl font-bold mb-2">{t('retailManager.hoverTitle')}</h4>
                <h5 className="text-lg">{t('retailManager.hoverSubtitle')}</h5>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Right - Content Section */}
        <div className="w-full md:w-1/2 md:pl-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <h2 className="text-[#0f8abe] text-sm md:text-base font-semibold uppercase tracking-wider mb-4">
              {t('retailManager.title')}
            </h2>
            
            <h3 className="text-[#52514a] text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-6">
              {t('retailManager.subtitle')}
            </h3>
            
            <p className="text-[#52514a] text-base md:text-lg leading-relaxed mb-6">
              {t('retailManager.description')}
            </p>
            
            <button
              onClick={() => navigate("/retailmanager")}
              className="group inline-flex items-center gap-2 text-[#0f8abe] text-base md:text-lg font-semibold hover:text-[#0c6e94] transition-colors duration-300 relative pb-1"
            >
              <span className="relative">
                {t('retailManager.exploreMore')}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#0f8abe] group-hover:w-full transition-all duration-300"></span>
              </span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default RetailManagerTroubleshooting;