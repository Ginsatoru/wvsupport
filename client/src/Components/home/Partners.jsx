import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { getPartners } from "../../services/partnerApi";

// Used until the CMS answers (or if it can't be reached)
const FALLBACK_LOGOS = [
  { name: "Tyro", image: "https://upload.wikimedia.org/wikipedia/en/1/15/Tyro_Payments_Logo.png" },
  { name: "Linkly", image: "https://www.medianara.com.au/wp-content/uploads/2018/09/linkly_cloud.png" },
  { name: "Microsoft", image: "https://www.alfalak.com/wp-content/uploads/Products-Distribution/Logos/MSFT_logo_rgb_C-Gray1.png" },
  { name: "Stripe", image: "https://vikwp.com/images/plugins/stripe.png" },
  { name: "MYOB", image: "https://phoenixconsultancy.com.au/wp-content/uploads/myob-logo.png" },
  { name: "Epson", image: "https://logolook.net/wp-content/uploads/2023/12/Epson-Logo.png" },
  { name: "Xero", image: "https://images.icon-icons.com/2699/PNG/512/xero_logo_icon_167949.png" },
  { name: "cPanel", image: "https://www.hostcoding.com/wp-content/uploads/2020/10/cpanel-final.png" },
];

const Partners = () => {
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
  const [logos, setLogos] = useState([]); // filled once the CMS answers (no double download)

  // Logos managed in the admin (Content › Home › Partner Logos); built-in list only if none are saved
  useEffect(() => {
    getPartners()
      .then((res) => setLogos(res.data?.length ? res.data : FALLBACK_LOGOS))
      .catch(() => setLogos(FALLBACK_LOGOS));
  }, []);

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
        .partners-track img {
          -webkit-user-drag: none;
          user-select: none;
          pointer-events: none;
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

      {/* Small top space on phones (the hero already ends with padding); desktop unchanged */}
      <section className="pt-2 pb-0 sm:pt-8 md:pt-20 bg-white text-center overflow-hidden">
        <div
          ref={ref}
          className={`partners-wrap relative w-full max-w-[1500px] mx-auto${inView ? " in-view" : ""}`}
        >
          {/* Left fade */}
          <div className="absolute left-0 top-0 bottom-0 w-12 md:w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
          {/* Right fade */}
          <div className="absolute right-0 top-0 bottom-0 w-12 md:w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

          <div className="overflow-hidden min-h-[4rem] sm:min-h-[5rem] md:min-h-[7rem]">
            {/* List shown twice so the scroll loops seamlessly */}
            <div className="partners-track">
              {[...logos, ...logos].map((logo, index) => (
                <div
                  key={`logo-${index}`}
                  className="flex-shrink-0 px-3 py-4 flex items-center justify-center h-16 sm:px-4 sm:py-6 sm:h-20 md:px-6 md:py-8 md:h-28"
                >
                  <div className="scale-75 sm:scale-90 md:scale-100">
                    <img src={logo.image} alt={logo.name} className="h-8 w-auto md:h-12" draggable="false" />
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