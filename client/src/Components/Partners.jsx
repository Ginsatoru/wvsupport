import React from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

// Partner logos components
const TyroLogo = () => (
  <img
    src="https://upload.wikimedia.org/wikipedia/en/1/15/Tyro_Payments_Logo.png"
    alt="TYRO"
    className="h-8 w-auto md:h-12"
  />
);
const LinklyLogo = () => (
  <img
    src="https://www.medianara.com.au/wp-content/uploads/2018/09/linkly_cloud.png"
    alt="Linkly"
    className="h-8 w-auto md:h-12"
  />
);
const MicrosoftLogo = () => (
  <img
    src="https://www.alfalak.com/wp-content/uploads/Products-Distribution/Logos/MSFT_logo_rgb_C-Gray1.png"
    alt="microsoft"
    className="h-8 w-auto md:h-12"
  />
);
const XeroLogo = () => (
  <img
    src="https://images.icon-icons.com/2699/PNG/512/xero_logo_icon_167949.png"
    alt="firebase"
    className="h-8 w-auto md:h-12"
  />
);
const StripeLogo = () => (
  <img
    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Stripe_Logo%2C_revised_2016.svg/1200px-Stripe_Logo%2C_revised_2016.svg.png"
    alt="stripe"
    className="h-8 w-auto md:h-12"
  />
);
const MYOBLogo = () => (
  <img
    src="https://phoenixconsultancy.com.au/wp-content/uploads/myob-logo.png"
    alt="myob"
    className="h-8 w-auto md:h-12"
  />
);
const EpsonLogo = () => (
  <img
    src="https://logolook.net/wp-content/uploads/2023/12/Epson-Logo.png"
    alt="cloudflare"
    className="h-8 w-auto md:h-12"
  />
);
const CpanelLogo = () => (
  <img
    src="https://www.webhostingworld.net/img/pages/cpanel-logo.png"
    alt="cloudflare"
    className="h-8 w-auto md:h-12"
  />
);

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const Partners = () => {
  const { t } = useTranslation();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  // Array of partner logos for easier duplication
  const partnerLogos = [
    <TyroLogo key="tyro" />,
    <LinklyLogo key="linkly" />,
    <MicrosoftLogo key="microsoft" />,
    <StripeLogo key="stripe" />,
    <MYOBLogo key="myob" />,
    <EpsonLogo key="cloudflare" />,
    <XeroLogo key="xero" />,
    <CpanelLogo key="cpanel" />,
  ];

  return (
    <section className="py-12 px-2 bg-white text-center md:py-20 md:px-8 overflow-hidden sm:px-4 sm:py-16">
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        className="max-w-4xl mx-auto mb-8 md:mb-16 px-2 sm:px-4"
      >
        <motion.h2
          variants={fadeUp}
          className="text-2xl font-bold mb-4 font-[Montserrat] sm:text-3xl md:text-4xl sm:mb-6"
          style={{ color: "#0f8abe" }}
        >
          {t("partners.title")}
        </motion.h2>
        <motion.p
          variants={fadeUp}
          className="text-sm text-gray-600 leading-relaxed font-[Montserrat] sm:text-base md:text-lg px-2"
        >
          {t("partners.subtitle")}
        </motion.p>
      </motion.div>

      <div className="relative w-full max-w-6xl mx-auto">
        {/* Fade effect on left side - reduced width on mobile */}
        <div className="absolute left-0 top-0 bottom-0 w-12 md:w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>

        {/* Fade effect on right side - reduced width on mobile */}
        <div className="absolute right-0 top-0 bottom-0 w-12 md:w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className="relative overflow-hidden"
        >
          <motion.div
            variants={fadeUp}
            className="flex animate-scroll-continuous hover:animation-paused"
          >
            {/* Double the logos for seamless looping */}
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
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;