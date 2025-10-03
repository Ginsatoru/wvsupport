import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const HeroSection = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [heroData, setHeroData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // API Base URL
  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

  // Fetch active hero content with language support
  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        setLoading(true);
        
        // Get current language from i18n
        const currentLanguage = i18n.language || 'en';
        
        const response = await fetch(
          `${API_BASE_URL}/api/content/hero/active?lang=${currentLanguage}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success && result.data) {
          setHeroData(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch hero content");
        }
      } catch (err) {
        console.error("Error fetching hero content:", err);
        setError(err.message);

        // Fallback to default hero content based on language
        const defaultContent = {
          en: {
            title: "WV Support\nServices Cambodia",
            subtitle:
              "Cutting-edge IT solutions in Cambodia. We deliver premium support, network infrastructure, and software expertise to keep your business at the digital forefront from our Siem Reap headquarters.",
            primaryCtaText: "Learn More",
            primaryCtaLink: "/services",
            secondaryCtaText: "Get Started",
            secondaryCtaLink: "/contact",
          },
          km: {
            title: "សេវាកម្មគាំទ្រ WV\nកម្ពុជា",
            subtitle:
              "ដំណោះស្រាយព័ត៌មានវិទ្យាទំនើបនៅកម្ពុជា។ យើងផ្តល់សេវាគាំទ្រពិសេស រចនាសម្ព័ន្ធបណ្តាញ និងជំនាញកម្មវិធីដើម្បីរក្សាអាជីវកម្មរបស់អ្នកនៅចំណុចខាងមុខនៃបច្ចេកវិទ្យាឌីជីថលពីទីស្នាក់ការកណ្តាលរបស់យើងនៅសៀមរាប។",
            primaryCtaText: "ស្វែងយល់បន្ថែម",
            primaryCtaLink: "/services",
            secondaryCtaText: "ចាប់ផ្តើម",
            secondaryCtaLink: "/contact",
          }
        };

        const currentLang = i18n.language === 'km' ? 'km' : 'en';
        setHeroData({
          ...defaultContent[currentLang],
          backgroundImage: "/src/Components/Images/hero.webp", // Fallback image
        });
      } finally {
        setLoading(false);
      }
    };

    fetchHeroContent();
  }, [API_BASE_URL, i18n.language]); // Re-fetch when language changes

  // Handle navigation
  const handleNavigation = (link) => {
    if (link.startsWith("http") || link.startsWith("https")) {
      window.open(link, "_blank");
    } else {
      navigate(link);
    }
  };

  // Show loading state
  if (loading) {
  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="absolute inset-0 z-0">
        {/* Background skeleton with shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-[shimmer_2s_infinite]" 
             style={{
               backgroundSize: '200% 100%'
             }}
        />
      </div>
      
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Left content skeleton */}
            <div className="space-y-6">
              {/* Title skeleton */}
              <div className="space-y-3">
                <div className="h-12 bg-white/80 rounded-xl animate-pulse shadow-sm w-3/4"></div>
                <div className="h-12 bg-white/80 rounded-xl animate-pulse shadow-sm w-full"></div>
                <div className="h-12 bg-white/80 rounded-xl animate-pulse shadow-sm w-5/6"></div>
              </div>
              
              {/* Description skeleton */}
              <div className="space-y-2 pt-4">
                <div className="h-4 bg-white/70 rounded-lg animate-pulse shadow-sm w-full"></div>
                <div className="h-4 bg-white/70 rounded-lg animate-pulse shadow-sm w-11/12"></div>
                <div className="h-4 bg-white/70 rounded-lg animate-pulse shadow-sm w-4/5"></div>
              </div>
              
              {/* Button skeleton */}
              <div className="flex gap-4 pt-6">
                <div className="h-12 bg-gradient-to-r from-[#0f8abe]/30 to-[#0f8abe]/20 rounded-xl animate-pulse shadow-sm w-40"></div>
                <div className="h-12 bg-white/70 rounded-xl animate-pulse shadow-sm w-40"></div>
              </div>
            </div>
            
            {/* Right image/visual skeleton */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Main image skeleton */}
                <div className="h-96 bg-white/80 rounded-2xl animate-pulse shadow-lg"></div>
                
                {/* Floating card skeletons */}
                <div className="absolute -top-6 -left-6 w-32 h-32 bg-white/90 rounded-xl animate-pulse shadow-md"></div>
                <div className="absolute -bottom-6 -right-6 w-40 h-24 bg-white/90 rounded-xl animate-pulse shadow-md"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Optional: Loading indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex items-center gap-3 bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#0f8abe] border-t-transparent"></div>
          <p className="text-sm text-gray-700 font-medium">
            {i18n.language === 'km' ? 'កំពុងដំណើរការ...' : 'Loading...'}
          </p>
        </div>
      </div>
    </section>
  );
}

  // Show error state (with fallback content)
  if (error && !heroData) {
    return (
      <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
        <div className="absolute inset-0 bg-gray-900 z-0">
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-white text-center max-w-md">
            <p className="text-lg mb-4">
              {i18n.language === 'km' 
                ? 'មិនអាចផ្ទុកមាតិកាភាគផ្តើមបាន' 
                : 'Unable to load hero content'
              }
            </p>
            <p className="text-sm text-gray-300">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-screen min-h-[600px] overflow-hidden">
      {/* Optimized Background Image */}
      <div className="absolute inset-0 bg-gray-900 z-0">
        <img
          src={heroData.backgroundImage}
          alt="Hero Background"
          className={`w-full h-full object-cover transition-opacity duration-1000 ${
            imageLoaded ? "opacity-90" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            console.warn("Hero image failed to load, using fallback");
            e.target.src = "/src/Components/Images/hero.webp";
            setImageLoaded(true);
          }}
          loading="eager"
        />
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center max-w-full lg:max-w-[85%] xl:max-w-[84%] 2xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-2">
        <div className="max-w-2xl text-white px-4 sm:px-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 animate-slide-up">
            {heroData.title.includes("\n") ? (
              heroData.title.split("\n").map((line, index) => (
                <React.Fragment key={index}>
                  {index === 0 && (line.includes("WV Support") || line.includes("សេវាកម្មគាំទ្រ WV")) ? (
                    <span className="text-[#0f8abe]">{line}</span>
                  ) : (
                    line
                  )}
                  {index < heroData.title.split("\n").length - 1 && <br />}
                </React.Fragment>
              ))
            ) : heroData.title.includes("WV Support") ? (
              <>
                <span className="text-[#0f8abe]">WV Support</span>
                <br />
                {heroData.title.replace("WV Support", "").trim()}
              </>
            ) : heroData.title.includes("សេវាកម្មគាំទ្រ WV") ? (
              <>
                <span className="text-[#0f8abe]">សេវាកម្មគាំទ្រ WV</span>
                <br />
                {heroData.title.replace("សេវាកម្មគាំទ្រ WV", "").trim()}
              </>
            ) : (
              heroData.title
            )}
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-6 sm:mb-8 animate-slide-up delay-100">
            {heroData.subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-slide-up delay-200">
            <button
              onClick={() => handleNavigation(heroData.primaryCtaLink)}
              className="cta-primary px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
            >
              {heroData.primaryCtaText}
            </button>
            <button
              onClick={() => handleNavigation(heroData.secondaryCtaLink)}
              className="cta-secondary px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base"
            >
              {heroData.secondaryCtaText}
            </button>
          </div>
        </div>
      </div>

      {/* Fixed style component */}
      <style>{`
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
          cursor: pointer;
          border: none;
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
          cursor: pointer;
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

export default HeroSection;