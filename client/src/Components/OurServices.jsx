import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";

// Import images
import posImage from "./Images/pos1.webp";
import webstoreImage from "./Images/webstore1.webp";
import multistoreImage from "./Images/ms.webp";
import emailImage from "./Images/email.webp";
import supportImage from "./Images/tech.webp";
import integrationImage from "./Images/integration1.webp";

// Image object
const mockImages = {
  pos: posImage,
  webstore: webstoreImage,
  multistore: multistoreImage,
  email: emailImage,
  support: supportImage,
  integration: integrationImage,
};

const OurServices = () => {
  const { t } = useTranslation();
  const [hasScrolled, setHasScrolled] = useState(false);
  
  // Track if user has scrolled at all
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setHasScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Header animations with scroll trigger - only start after user scrolls
  const [headerRef, headerInView] = useInView({
    triggerOnce: true,
    threshold: 0.3,
    skip: !hasScrolled, // Don't trigger until user has scrolled
  });

  const services = [
    {
      title: t('services.pos.title'),
      description: t('services.pos.description'),
      image: mockImages.pos,
    },
    {
      title: t('services.webstore.title'),
      description: t('services.webstore.description'),
      image: mockImages.webstore,
    },
    {
      title: t('services.multistore.title'),
      description: t('services.multistore.description'),
      image: mockImages.multistore,
    },
    {
      title: t('services.hosting.title'),
      description: t('services.hosting.description'),
      image: mockImages.email,
    },
    {
      title: t('services.support.title'),
      description: t('services.support.description'),
      image: mockImages.support,
    },
    {
      title: t('services.integration.title'),
      description: t('services.integration.description'),
      image: mockImages.integration,
    },
  ];

  return (
    <section className="w-full min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div ref={headerRef} className="max-w-[1480px] mx-auto text-center mb-12">
        <h2 
          className={`text-slate-600 text-xs sm:text-sm md:text-sm font-medium tracking-wide uppercase mb-2 transition-all duration-700 ${
            headerInView && hasScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {t('services.header.subtitle')}
        </h2>
        <h2
          className={`text-2xl sm:text-3xl md:text-[1.9rem] xl:text-[2rem] font-bold mb-4 transition-all duration-700 delay-150 ${
            headerInView && hasScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
          style={{ color: "#0f8abe" }}
        >
          {t('services.header.title')}
        </h2>
        <p 
          className={`text-slate-600 text-sm sm:text-base md:text-[1rem] xl:text-[1.05rem] max-w-3xl mx-auto leading-relaxed transition-all duration-700 delay-300 ${
            headerInView && hasScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {t('services.header.description')}
        </p>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto">
        <div
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 lg:gap-6 justify-items-center max-w-full lg:max-w-[85%] xl:max-w-[85%] 2xl:max-w-[1100px] [@media(min-width:1700px)]:max-w-[1500px] mx-auto"
        >
          {services.map((service, index) => {
            const [ref, inView] = useInView({
              triggerOnce: true,
              threshold: 0.2,
              skip: !hasScrolled, // Don't trigger until user has scrolled
            });

            return (
              <div
                key={index}
                ref={ref}
                className={`
                  group relative bg-white rounded-xl shadow-md border border-slate-200
                  transition-all duration-700 ease-out hover:shadow-lg
                  ${inView && hasScrolled ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}
                  w-full max-w-[420px]
                `}
                style={{
                  transitionDelay: inView && hasScrolled ? `${index * 150}ms` : '0ms',
                }}
              >
                {/* Image */}
                <div className="relative overflow-hidden rounded-t-xl">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-40 sm:h-44 md:h-40 lg:h-44 object-cover transition-all duration-500 ease-out group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-800 mb-3 transition-all duration-500 ease-out group-hover:text-[#0f8abe]">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 text-sm sm:text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default OurServices;