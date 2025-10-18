import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowRight, Headphones, MessageCircle } from "lucide-react";
import working from "./Images/working.webp";

const CustomerSupportExperience = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <section className="flex justify-center min-h-[70vh] bg-[#fafafb] py-12 px-4">
      <div className="flex flex-col-reverse md:flex-row items-center w-full md:w-[85%] max-w-[1500px] mx-auto gap-8 md:gap-16">
        
        {/* Left - Content Section */}
        <div className="w-full md:w-1/2">
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* Title with Icon */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-[#0f8abe]/10 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-[#0f8abe]" />
              </div>
              <h2 className="text-[#0f8abe] text-sm md:text-base font-semibold uppercase tracking-wider">
                {t('customerSupport.title')}
              </h2>
            </div>
            
            {/* Subtitle with Icon */}
            <div className="flex items-start gap-4 mb-6">
              <div className="mt-1 w-12 h-12 bg-[#0f8abe] rounded-xl flex items-center justify-center flex-shrink-0">
                <Headphones className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-[#52514a] text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
                {t('customerSupport.subtitle')}
              </h3>
            </div>
            
            <p className="text-[#52514a] text-base md:text-lg leading-relaxed mb-8">
              {t('customerSupport.description')}
            </p>
            
            <button
              onClick={() => navigate("/Support")}
              className="group inline-flex items-center gap-2 px-6 py-3 bg-[#0f8abe] text-white rounded-xl font-semibold hover:bg-[#0d7aa4] transition-colors duration-300 will-change-transform"
            >
              <span>{t('customerSupport.exploreMore')}</span>
              <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </motion.div>
        </div>

        {/* Right - Image Section */}
        <div className="w-full md:w-1/2 md:pl-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <div className="relative h-[400px] w-full max-w-[800px] mx-auto rounded-2xl overflow-hidden shadow-xl group will-change-transform">
              <img 
                src={working} 
                alt={t('customerSupport.imageAlt')} 
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 will-change-transform"
              />
              
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-[#0f8abe]/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Hover Content */}
              <div className="absolute inset-0 flex flex-col justify-center items-center p-8 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                <h4 className="text-white text-2xl font-bold mb-2">{t('customerSupport.hoverTitle')}</h4>
                <h5 className="text-white/90 text-lg font-normal">{t('customerSupport.hoverSubtitle')}</h5>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default CustomerSupportExperience;