import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import working from "./Images/working.webp";

const CustomerSupportExperience = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="flex justify-center min-h-[70vh] bg-[#fafafb] py-8 px-4">
      <div className="flex flex-col-reverse md:flex-row items-center w-full md:w-[85%] max-w-[1500px] mx-auto gap-8 md:gap-12">
        
        {/* Left - Content Section (shows first on mobile due to flex-col-reverse) */}
        <div className="w-full md:w-1/2">
          <h2 className="text-[#0f8abe] text-sm md:text-base font-semibold uppercase tracking-wider mb-4">
            {t('customerSupport.title')}
          </h2>
          
          <h3 className="text-[#52514a] text-2xl sm:text-3xl md:text-4xl font-bold leading-tight mb-6">
            {t('customerSupport.subtitle')}
          </h3>
          
          <p className="text-[#52514a] text-base md:text-lg leading-relaxed mb-6">
            {t('customerSupport.description')}
          </p>
          
          <button
            onClick={() => navigate("/Support")}
            className="group inline-flex items-center gap-2 text-[#0f8abe] text-base md:text-lg font-semibold hover:text-[#0c6e94] transition-colors duration-300 relative pb-1"
          >
            <span className="relative">
              {t('customerSupport.exploreMore')}
              <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-[#0f8abe] group-hover:w-full transition-all duration-300"></span>
            </span>
            <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        {/* Right - Image Section */}
        <div className="w-full md:w-1/2 md:pl-8">
          <div className="relative h-[400px] w-full max-w-[800px] mx-auto rounded-xl overflow-hidden shadow-lg group">
            <img 
              src={working} 
              alt={t('customerSupport.imageAlt')} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[#0f8abe]/85 text-white flex flex-col justify-center items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 text-center">
              <h4 className="text-2xl font-bold mb-2">{t('customerSupport.hoverTitle')}</h4>
              <h5 className="text-lg font-normal">{t('customerSupport.hoverSubtitle')}</h5>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default CustomerSupportExperience;