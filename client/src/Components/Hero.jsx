import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../Components/i18n";
import heroBg from "./Images/hero.webp";

const HeroComponent = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Optimized Background Image */}
      <div className="absolute inset-0 bg-gray-900 z-0">
        <img
          src={heroBg}
          alt="IT Support Services"
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            imageLoaded ? "opacity-90" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center max-w-full lg:max-w-[85%] xl:max-w-[84%] 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">
        <div className="max-w-2xl text-white px-4 sm:px-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 animate-slide-up">
            <span className="text-[#0f8abe]">WV Support</span>
            <br />
            Services Cambodia
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 animate-slide-up delay-100">
            {t("subtitle")}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-slide-up delay-200">
            <button
              onClick={() => navigate("/Services")}
              className="cta-primary px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
            >
              {t("LearnMore")}
            </button>
            <button
              onClick={() => navigate("/contact")}
              className="cta-secondary px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
            >
              {t("get")}
            </button>
          </div>
        </div>
      </div>

      {/* Fixed style component */}
      <style global="true">{`
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        .fade-in-image {
          animation: fadeIn 1s ease-in forwards;
        }
        .shine-effect {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0) 45%,
            rgba(255, 255, 255, 0.15) 50%,
            rgba(255, 255, 255, 0) 55%
          );
          transform: rotate(30deg);
          animation: shine 5s infinite;
        }
        @keyframes shine {
          0% { transform: rotate(30deg) translate(-30%, -30%); }
          100% { transform: rotate(30deg) translate(30%, 30%); }
        }
        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out forwards;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .cta-primary {
          background: #0f8abe;
          color: white;
          border-radius: 0.375rem;
          font-weight: 600;
          transition: all 0.3s ease;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          white-space: nowrap;
        }
        .cta-primary:hover {
          background: #0d79a8;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
        }
        .cta-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border-radius: 0.375rem;
          font-weight: 600;
          transition: all 0.3s ease;
          backdrop-filter: blur(4px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          white-space: nowrap;
        }
        .cta-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }
        @media (max-width: 640px) {
          .cta-primary,
          .cta-secondary {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default HeroComponent;