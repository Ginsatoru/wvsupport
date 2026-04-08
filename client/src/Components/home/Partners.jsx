import React from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";

const TyroLogo = () => (
  <img src="https://upload.wikimedia.org/wikipedia/en/1/15/Tyro_Payments_Logo.png" alt="TYRO" className="h-8 w-auto md:h-12" />
);
const LinklyLogo = () => (
  <img src="https://www.medianara.com.au/wp-content/uploads/2018/09/linkly_cloud.png" alt="Linkly" className="h-8 w-auto md:h-12" />
);
const MicrosoftLogo = () => (
  <img src="https://www.alfalak.com/wp-content/uploads/Products-Distribution/Logos/MSFT_logo_rgb_C-Gray1.png" alt="Microsoft" className="h-8 w-auto md:h-12" />
);
const XeroLogo = () => (
  <img src="https://images.icon-icons.com/2699/PNG/512/xero_logo_icon_167949.png" alt="Xero" className="h-8 w-auto md:h-12" />
);
const StripeLogo = () => (
  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/1200px-Stripe_Logo%2C_revised_2016.svg.png" alt="Stripe" className="h-8 w-auto md:h-12" />
);
const MYOBLogo = () => (
  <img src="https://phoenixconsultancy.com.au/wp-content/uploads/myob-logo.png" alt="MYOB" className="h-8 w-auto md:h-12" />
);
const EpsonLogo = () => (
  <img src="https://logolook.net/wp-content/uploads/2023/12/Epson-Logo.png" alt="Epson" className="h-8 w-auto md:h-12" />
);
const CpanelLogo = () => (
  <img src="https://www.hostcoding.com/wp-content/uploads/2020/10/cpanel-final.png" alt="cPanel" className="h-8 w-auto md:h-12" />
);

const Partners = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  const partnerLogos = [
    <TyroLogo key="tyro" />,
    <LinklyLogo key="linkly" />,
    <MicrosoftLogo key="microsoft" />,
    <StripeLogo key="stripe" />,
    <MYOBLogo key="myob" />,
    <EpsonLogo key="epson" />,
    <XeroLogo key="xero" />,
    <CpanelLogo key="cpanel" />,
  ];

  return (
    <>
      <style>{`
        @keyframes partners-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .partners-track {
          display: flex;
          width: max-content;
          animation: partners-scroll 35s linear infinite;
        }
        .partners-track:hover {
          animation-play-state: paused;
        }
        .partners-wrap {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .partners-wrap.in-view {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <section className="pt-16 pb-0 md:pt-20 bg-white text-center overflow-hidden">
        <div
          ref={ref}
          className={`partners-wrap relative w-full max-w-[1500px] mx-auto${inView ? " in-view" : ""}`}
        >
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="overflow-hidden">
            <div className="partners-track">
              {[...partnerLogos, ...partnerLogos].map((logo, index) => (
                <div
                  key={`logo-${index}`}
                  className="flex-shrink-0 px-3 py-4 flex items-center justify-center h-16 transition-all duration-300 group sm:px-4 sm:py-6 sm:h-20 md:px-6 md:py-8 md:h-28"
                >
                  <div className="grayscale opacity-80 transition-all duration-300 group-hover:grayscale-0 group-hover:opacity-100 scale-75 sm:scale-90 md:scale-100">
                    {logo}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Partners;