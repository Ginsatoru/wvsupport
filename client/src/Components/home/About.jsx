import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { ArrowUpRight } from "lucide-react";
import teamImg from "../Images/team.webp";
import techImg from "../Images/tech-guy.webp";

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
const HoverCard = ({ children, className, style, delay = 0, inView, scaleVariant = false }) => (
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

  return (
    <section
      ref={ref}
      className="w-full bg-[#f5f8ff] py-12 md:py-20 px-4 md:px-[11vw]"
    >
      {/* ── Header ── */}
      <motion.div
        className="text-center mb-8 md:mb-14 max-w-2xl mx-auto"
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        variants={fadeUp(0)}
      >

        <h2 className="text-2xl sm:text-3xl md:text-[42px] font-extrabold text-gray-900 leading-[1.15] tracking-tight">
          {t("retailManager.subtitle")}
        </h2>
      </motion.div>

      {/* ── Bento Grid ── */}
      <div className="w-full md:max-w-6xl md:mx-auto flex flex-col gap-3 md:gap-4">

        {/* Row 1 */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">

          {/* Card 1 — Large image card */}
          <HoverCard
            className="relative rounded-2xl overflow-hidden h-[220px] md:h-[360px] md:flex-[5]"
            delay={0.1}
            inView={inView}
          >
            <motion.img
              src={teamImg}
              alt="Team"
              className="w-full h-full object-cover"
              initial={{ scale: 1.08 }}
              animate={inView ? { scale: 1 } : { scale: 1.08 }}
              transition={{ duration: 1.1, ease: [0.25, 0.46, 0.45, 0.94], delay: 0.1 }}

            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/80 via-[#0f172a]/20 to-transparent" />

            {/* Text slides up from bottom */}
            <motion.div
              className="absolute bottom-0 left-0 p-4 md:p-6"
              initial={{ opacity: 0, y: 18 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
            >
              <h3 className="text-white text-base md:text-xl font-bold leading-snug">
                {isKm ? "ដំណោះស្រាយបច្ចេកវិទ្យា" : "Built-In Team Support"}
              </h3>
              <p className="text-white/70 text-xs md:text-sm mt-1 max-w-[240px]">
                {isKm
                  ? "ទំនាក់ទំនងភ្លាមៗនៅក្នុងក្រុម"
                  : "Communicate instantly within your team. No app switching needed."}
              </p>
            </motion.div>
          </HoverCard>

          {/* Card 2 — Text card */}
          <HoverCard
            className="relative rounded-2xl overflow-hidden md:h-[360px] md:flex-[2] flex flex-col justify-between p-5 md:p-7"
            style={{ background: "#eef2fb" }}
            delay={0.2}
            inView={inView}
            scaleVariant
          >
            {/* Animated blobs */}
            <motion.div
              className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
              style={{
                transform: "translate(30%, -30%)",
                opacity: 0.3,
              }}
              animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.45, 0.3] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-0 left-0 w-36 h-36 rounded-full pointer-events-none"
              style={{
                transform: "translate(-30%, 30%)",
                opacity: 0.2,
              }}
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.35, 0.2] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />

            <div className="relative z-10">
              <h3 className="text-gray-900 text-lg md:text-2xl font-bold leading-snug mb-2 md:mb-3">
                {isKm ? "ការកំណត់ភារកិច្ច" : "Task Assignment"}
              </h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                {isKm
                  ? "បង្កើត កំណត់ និងតាមដានភារកិច្ចដើម្បីរក្សាគ្រប់គ្នានូវការទទួលខុសត្រូវ"
                  : "Easily create, assign, and track tasks to keep everyone aligned and accountable."}
              </p>
            </div>

            <motion.button
              onClick={() => navigate("/retailmanager")}
              className="relative z-10 self-start inline-flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-[#0f172a] text-white rounded-full text-xs md:text-sm font-semibold hover:bg-[#1e293b] transition-colors duration-200 group mt-4 md:mt-0"
            >
              {isKm ? "ស្វែងយល់បន្ថែម" : "Learn More"}
              <ArrowUpRight className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </motion.button>
          </HoverCard>

        </div>

        {/* Row 2 */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4">

          {/* Card 3 — Dot-grid text card */}
          <HoverCard
            className="relative rounded-2xl overflow-hidden md:h-[300px] md:flex-[2] flex flex-col justify-end p-5 md:p-7"
            style={{ background: "#e8f4fb" }}
            delay={0.3}
            inView={inView}
            scaleVariant
          >
            {/* Animated dot grid shimmer */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle at 2px 2px, #0f172a 1px, transparent 0)",
                backgroundSize: "28px 28px",
              }}
              animate={{ opacity: [0.08, 0.14, 0.08] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative z-10 py-4 md:py-0">
              <h3 className="text-gray-900 text-lg md:text-xl font-bold mb-2">
                {isKm ? "កាលវិភាគពេលវេលាជាក់ស្ដែង" : "Real-Time Scheduling"}
              </h3>
              <p className="text-gray-500 text-xs md:text-sm leading-relaxed">
                {isKm
                  ? "រៀបចំកិច្ចប្រជុំ កំណត់ថ្ងៃផុតកំណត់ និងធ្វើសមកាលកម្មប្រតិទិន"
                  : "Plan meetings, set deadlines, and sync calendars so your team stays on the same page."}
              </p>
            </div>
          </HoverCard>

          {/* Card 4 — Dark card with person image */}
          <HoverCard
            className="relative rounded-2xl overflow-hidden h-[220px] md:h-[300px] md:flex-[5] flex flex-col justify-end p-5 md:p-7"
            style={{ background: "#1a1a2e" }}
            delay={0.4}
            inView={inView}
          >
            <motion.img
              src={techImg}
              alt="Tech expert"
              className="absolute bottom-0 right-0 h-full w-auto object-contain object-bottom pointer-events-none select-none"
              style={{ maxWidth: "260px" }}
              initial={{ opacity: 0, x: 30, scale: 1.05 }}
              animate={inView ? { opacity: 1, x: 0, scale: 1 } : {}}
              transition={{ duration: 0.85, delay: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e] via-[#1a1a2e]/40 to-transparent" />

            <motion.div
              className="relative z-10 max-w-[60%] md:max-w-[55%]"
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
            >
              <h3 className="text-white text-base md:text-xl font-bold leading-snug mb-1 md:mb-2">
                {isKm ? "ការតាមដានការរីកចម្រើន" : "Progress Tracking"}
              </h3>
              <p className="text-white/65 text-xs md:text-sm leading-relaxed">
                {isKm
                  ? "មើលឃើញការអនុវត្តក្រុមជាមួយ dashboard"
                  : "Visualize team performance with dashboards that highlight what's done and what's next."}
              </p>
            </motion.div>
          </HoverCard>

        </div>
      </div>
    </section>
  );
};

export default About;