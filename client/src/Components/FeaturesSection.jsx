import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Building2, TrendingUp, ShieldCheck, DollarSign } from "lucide-react";
import Organization from "./Images/Organization.png";
import Marketing from "./Images/Marketing.png";
import Risk from "./Images/Risk.png";
import Success from "./Images/Success.webp";
import Market from "./Images/Market.png";

export default function FeaturesSection() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  // Track if user has scrolled
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasScrolled) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, [hasScrolled]);

  const features = [
    {
      icon: Building2,
      image: Organization,
      title: t('features.organization.title'),
      description: t('features.organization.description')
    },
    {
      icon: TrendingUp,
      image: Marketing,
      title: t('features.marketing.title'),
      description: t('features.marketing.description')
    },
    {
      icon: ShieldCheck,
      image: Risk,
      title: t('features.risk.title'),
      description: t('features.risk.description')
    },
    {
      icon: DollarSign,
      image: Market,
      title: t('features.capital.title'),
      description: t('features.capital.description')
    }
  ];

  return (
    <div className="min-h-[87vh] bg-gradient-to-br from-gray-50 to-gray-200">
      <div
        ref={sectionRef}
        className="w-[95%] sm:w-[90%] lg:w-[85%] max-w-[1550px] mx-auto flex flex-col lg:flex-row gap-10 px-4 sm:px-6 py-8 lg:py-16"
      >
        {/* Left Side */}
        <div className={`flex-1 pt-0 lg:pt-[5%] transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-[#0f8abe] rounded-xl flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-[#0f8abe] text-3xl font-bold">
              {t('features.mainTitle')}
            </h2>
          </div>

          <p className={`text-[#52514a] text-base mb-8 leading-relaxed transition-all duration-700 ease-out delay-150 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
          }`}>
            {t('features.intro')}
          </p>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className={`group bg-white border border-gray-200 p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-700 ease-out cursor-pointer ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                  }`}
                  style={{
                    transitionDelay: isVisible ? `${300 + (index * 150)}ms` : '0ms'
                  }}
                >
                  {/* Icon Container */}
                  <div className="w-16 h-16 mb-4 bg-[#0f8abe]/10 rounded-xl flex items-center justify-center transition-transform duration-300">
                    <Icon className="w-8 h-8 text-[#0f8abe]" />
                  </div>

                  <h3 className="text-[#52514a] text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-[#52514a] text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Side */}
        <div className={`flex-1 mt-0 lg:mt-[5%] transition-all duration-700 ease-out ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
        }`} style={{ transitionDelay: isVisible ? '900ms' : '0ms' }}>
          <div className="bg-[#fafafb] rounded-xl shadow-md p-6 flex flex-col gap-4 h-full">
            {/* Image */}
            <div className="w-full overflow-hidden rounded-xl">
              <img 
                src={Success} 
                alt={t('features.success.imageAlt')}
                className="w-full h-auto object-cover rounded-xl transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>

            {/* Content */}
            <h2 className="text-[#0f8abe] text-xl font-semibold mt-4">
              {t('features.success.title')}
            </h2>
            
            <p className="text-[#52514a] text-base leading-relaxed">
              {t('features.success.paragraph1')}
            </p>
            
            <p className="text-[#52514a] text-base leading-relaxed">
              {t('features.success.paragraph2')}
            </p>

            {/* Button */}
            <Link to="/Contact" className="mt-auto">
              <button className="px-6 py-3 bg-[#0f8abe] text-white rounded-xl font-medium transition-colors duration-300 hover:bg-[#0d7aa4]">
                {t('features.contactButton')}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}