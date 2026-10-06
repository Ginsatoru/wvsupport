import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowUpRight } from "lucide-react";
import teamImg from "../Images/team.webp";
import techImg from "../Images/tech-guy.webp";
import integrationIcon from "../Images/integration.gif";
import reportIcon from "../Images/report.gif";
import { getActiveAbout } from "../../services/aboutApi";

// Built-in wording/images (used until edited in Content › Home › About)
const DEFAULT_CARDS = {
  en: [
    { title: "Point of Sale & Inventory", description: "Process sales, manage stock levels, and track inventory across every register in real time." },
    {
      title: "Sales Reporting & Analytics",
      description: "Track sales activity, monitor stock movement, and generate detailed reports to guide business decisions.",
      buttonText: "Learn More",
    },
    { title: "Xero & MYOB Integration", description: "Sync sales and financial data directly with Xero and MYOB, keeping your books accurate automatically." },
    { title: "EFTPOS & Payment Integration", description: "Accept payments seamlessly with integrated EFTPOS support from Tyro and Linkly, right at the counter." },
  ],
  km: [
    { title: "ចំណុចលក់ និងស្តុកទំនិញ", description: "ដំណើរការការលក់ គ្រប់គ្រងស្តុក និងតាមដានទំនិញគ្រប់ម៉ាស៊ីនលក់ជាក់ស្តែង។" },
    {
      title: "របាយការណ៍ និងការវិភាគលក់",
      description: "តាមដានប្រតិបត្តិការលក់ តាមដានស្តុក និងបង្កើតរបាយការណ៍លម្អិតដើម្បីជួយសម្រេចចិត្តអាជីវកម្ម។",
      buttonText: "ស្វែងយល់បន្ថែម",
    },
    { title: "ការតភ្ជាប់ជាមួយ Xero និង MYOB", description: "ធ្វើសមកាលកម្មទិន្នន័យលក់ និងហិរញ្ញវត្ថុដោយផ្ទាល់ជាមួយ Xero និង MYOB ដើម្បីរក្សាបញ្ជីគណនេយ្យឲ្យត្រឹមត្រូវដោយស្វ័យប្រវត្តិ។" },
    { title: "ការទូទាត់ EFTPOS", description: "ទទួលការទូទាត់យ៉ាងរលូនជាមួយ EFTPOS ដែលភ្ជាប់ជាមួយ Tyro និង Linkly នៅចំណុចលក់។" },
  ],
};
const DEFAULT_IMAGES = [teamImg, reportIcon, integrationIcon, techImg];
const DEFAULT_LINK = "https://www.aaapos.com/";

/* ── Shared variants ── */
const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94], delay },
  },
});

const scaleIn = (delay = 0) => ({
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.34, 1.06, 0.64, 1], delay },
  },
});

/* Card entrance wrapper */
const HoverCard = ({
  children,
  className,
  style,
  delay = 0,
  inView,
  scaleVariant = false,
}) => (
  <motion.div
    className={className}
    style={style}
    initial="hidden"
    animate={inView ? "visible" : "hidden"}
    variants={scaleVariant ? scaleIn(delay) : fadeUp(delay)}
  >
    {children}
  </motion.div>
);

const About = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.12 });
  const isKm = i18n.language === "km";
  const lang = isKm ? "km" : "en";

  // Saved content (empty fields keep the built-in wording/images)
  const [saved, setSaved] = useState(null);
  const [ready, setReady] = useState(false); // images wait for this (no double download)
  useEffect(() => {
    getActiveAbout(lang)
      .then((res) => setSaved(res.data))
      .catch(() => setSaved(null))
      .finally(() => setReady(true));
  }, [lang]);

  const title = saved?.title || t("retailManager.subtitle");
  const cards = DEFAULT_CARDS[lang].map((d, i) => {
    const card = saved?.cards?.[i];
    return {
      title: card?.title || d.title,
      description: card?.description || d.description,
      image: ready ? card?.image || DEFAULT_IMAGES[i] : null,
      buttonText: card?.buttonText || d.buttonText,
      buttonLink: card?.buttonLink || DEFAULT_LINK,
    };
  });

  return (
    <section ref={ref} className="w-full bg-white py-12 md:py-20">
      {/* Global container — same breakpoints as the navbar / .fs-container (Work) */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-0 lg:w-[88%] xl:w-[83%] 2xl:max-w-[1400px] [@media(min-width:1700px)]:max-w-[1500px]">
      {/* ── Header ── */}
      <motion.div
        className="text-center mb-8 md:mb-14 max-w-2xl mx-auto"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp(0)}
      >
        <h2 className="text-2xl sm:text-3xl md:text-[42px] font-extrabold leading-[1.15] tracking-tight" style={{ color: "#000000" }}>
          {title}
        </h2>
      </motion.div>

      {/* ── Bento Grid ── */}
      <div className="w-full flex flex-col gap-3 md:gap-4">
        {/* Row 1 */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          {/* Card 1 — Large image card */}
          <HoverCard
            className="relative rounded-2xl overflow-hidden h-[220px] md:h-[360px] md:flex-[5]"
            delay={0.1}
            inView={inView}
          >
            {cards[0].image && <motion.img
              src={cards[0].image}
              alt={cards[0].title}
              className="w-full h-full object-cover"
              initial={{ scale: 1.08 }}
              animate={inView ? { scale: 1 } : { scale: 1.08 }}
              transition={{
                duration: 1.1,
                ease: [0.25, 0.46, 0.45, 0.94],
                delay: 0.1,
              }}
            />}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Text slides up from bottom */}
            <motion.div
              className="absolute bottom-0 left-0 p-4 md:p-6"
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
            >
              <h3 className="text-white text-base md:text-xl font-bold leading-snug">
                {cards[0].title}
              </h3>
              <p className="text-white/70 text-xs md:text-sm mt-1 max-w-[240px]">
                {cards[0].description}
              </p>
            </motion.div>
          </HoverCard>

          {/* Card 2 — Text card */}
          <HoverCard
            className="relative rounded-2xl overflow-hidden md:h-[360px] md:flex-[2] flex flex-col justify-between p-5 md:p-7"
            style={{ background: "#f1f5f9" }}
            delay={0.2}
            inView={inView}
            scaleVariant
          >
            <div className="relative z-10">
              {cards[1].image ? <img src={cards[1].image} alt="" className="w-10 h-10 mb-3 object-contain" /> : <div className="w-10 h-10 mb-3" />}
              <h3 className="text-lg md:text-2xl font-bold leading-snug mb-2 md:mb-3" style={{ color: "#000000" }}>
                {cards[1].title}
              </h3>
              <p className="text-xs md:text-sm leading-relaxed" style={{ color: "#000000" }}>
                {cards[1].description}
              </p>
            </div>

            <motion.a
              href={cards[1].buttonLink}
              className="relative z-10 self-start inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-black text-white rounded-full text-xs md:text-sm font-semibold hover:bg-gray-800 transition-colors duration-200 group mt-4 md:mt-0"
            >
              {cards[1].buttonText}
              <ArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.a>
          </HoverCard>
        </div>

        {/* Row 2 */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">
          {/* Card 3 — Text card */}
          <HoverCard
            className="relative rounded-2xl overflow-hidden md:h-[300px] md:flex-[2] flex flex-col justify-end p-5 md:p-7"
            style={{ background: "#f1f5f9" }}
            delay={0.3}
            inView={inView}
            scaleVariant
          >
            <div className="relative z-10 py-4 md:py-0">
              {cards[2].image ? <img src={cards[2].image} alt="" className="w-10 h-10 mb-3 object-contain" /> : <div className="w-10 h-10 mb-3" />}
              <h3 className="text-lg md:text-xl font-bold mb-2" style={{ color: "#000000" }}>
                {cards[2].title}
              </h3>
              <p className="text-xs md:text-sm leading-relaxed" style={{ color: "#000000" }}>
                {cards[2].description}
              </p>
            </div>
          </HoverCard>

          {/* Card 4 — Dark card with person image */}
          <HoverCard
            className="relative rounded-2xl overflow-hidden h-[220px] md:h-[300px] md:flex-[5] flex flex-col justify-end p-5 md:p-7"
            style={{ background: "#000000" }}
            delay={0.4}
            inView={inView}
          >
            {cards[3].image && <motion.img
              src={cards[3].image}
              alt={cards[3].title}
              className="absolute bottom-0 right-0 h-full w-auto object-contain object-bottom pointer-events-none select-none"
              style={{ maxWidth: "260px" }}
              initial={{ opacity: 0, x: 30, scale: 1.05 }}
              animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{
                duration: 0.85,
                delay: 0.55,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            />}

            <motion.div
              className="relative z-10 max-w-[60%] md:max-w-[55%]"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
            >
              <h3 className="text-white text-base md:text-xl font-bold leading-snug mb-1 md:mb-2">
                {cards[3].title}
              </h3>
              <p className="text-white/65 text-xs md:text-sm leading-relaxed">
                {cards[3].description}
              </p>
            </motion.div>
          </HoverCard>
        </div>
      </div>
      </div>
    </section>
  );
};

export default About;