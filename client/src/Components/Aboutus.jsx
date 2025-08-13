import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  FaBullseye,
  FaGlobeAsia,
  FaChartLine,
  FaHandsHelping,
  FaAward,
  FaLightbulb,
} from "react-icons/fa";
import headerImage from "./Images/header.png";
import missionImage from "./Images/mission.png";
// Import your timeline images
import timelineImage1 from "./Images/visual1.png";
import timelineImage2 from "./Images/visual2.png";
import timelineImage3 from "./Images/visual3.png";

const AboutUs = () => {
  const { t } = useTranslation();

  // Timeline images array
  const timelineImages = [timelineImage1, timelineImage2, timelineImage3];

  // Vision items data
  const visionItems = [
    {
      icon: <FaHandsHelping className="w-8 h-8" />,
      titleKey: "aboutPage.vision.items.empowerment.title",
      descriptionKey: "aboutPage.vision.items.empowerment.description",
    },
    {
      icon: <FaAward className="w-8 h-8" />,
      titleKey: "aboutPage.vision.items.excellence.title",
      descriptionKey: "aboutPage.vision.items.excellence.description",
    },
    {
      icon: <FaGlobeAsia className="w-8 h-8" />,
      titleKey: "aboutPage.vision.items.globalReach.title",
      descriptionKey: "aboutPage.vision.items.globalReach.description",
    },
    {
      icon: <FaChartLine className="w-8 h-8" />,
      titleKey: "aboutPage.vision.items.growth.title",
      descriptionKey: "aboutPage.vision.items.growth.description",
    },
    {
      icon: <FaBullseye className="w-8 h-8" />,
      titleKey: "aboutPage.vision.items.impact.title",
      descriptionKey: "aboutPage.vision.items.impact.description",
    },
    {
      icon: <FaLightbulb className="w-8 h-8" />,
      titleKey: "aboutPage.vision.items.innovation.title",
      descriptionKey: "aboutPage.vision.items.innovation.description",
    },
  ];

  // Mission benefits data
  const missionBenefits = [
    "aboutPage.mission.benefits.competitive",
    "aboutPage.mission.benefits.technology",
    "aboutPage.mission.benefits.platform",
    "aboutPage.mission.benefits.satisfaction",
  ];

  // Timeline data
  const timelineData = [
    {
      yearKey: "aboutPage.timeline.items.founded.year",
      titleKey: "aboutPage.timeline.items.founded.title",
      contentKey: "aboutPage.timeline.items.founded.content",
    },
    {
      yearKey: "aboutPage.timeline.items.expanding.year",
      titleKey: "aboutPage.timeline.items.expanding.title",
      contentKey: "aboutPage.timeline.items.expanding.content",
    },
    {
      yearKey: "aboutPage.timeline.items.future.year",
      titleKey: "aboutPage.timeline.items.future.title",
      contentKey: "aboutPage.timeline.items.future.content",
    },
  ];

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-enter");
          observer.unobserve(entry.target);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions
    );
    const elements = document.querySelectorAll(".animate-on-scroll");

    elements.forEach((el) => observer.observe(el));

    return () => {
      elements.forEach((el) => observer.unobserve(el));
    };
  }, []);

  return (
    <div className="font-montserrat text-gray-700 bg-white">
      {/* Hero Section */}
      <section className="contact-header">
        <div className="max-w-7xl mx-auto">
          <div className="animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              {t("aboutPage.hero.title")} <span className="text-[#f8f9fa]">{t("aboutPage.hero.company")}</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              {t("aboutPage.hero.subtitle")}
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-8 delay-100">
              <span className="text-[#0f8abe] font-semibold">{t("aboutPage.mission.label")}</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2 mb-6">
                {t("aboutPage.mission.title.part1")}{" "}
                <span className="text-[#0f8abe]">{t("aboutPage.mission.title.part2")}</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                {t("aboutPage.mission.description")}
              </p>
              <ul className="space-y-4 mb-8">
                {missionBenefits.map((benefitKey, index) => (
                  <li key={index} className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <div className="w-5 h-5 rounded-full bg-[#0f8abe] flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    </div>
                    <span className="ml-3 text-gray-700">{t(benefitKey)}</span>
                  </li>
                ))}
              </ul>
              <p className="text-lg text-gray-600 leading-relaxed">
                {t("aboutPage.mission.conclusion")}
              </p>
            </div>
            <div className="animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-8 delay-200">
              <div className="relative rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-3xl hover:-translate-y-1">
                <div className="aspect-w-16 aspect-h-9">
                  <img
                    src={missionImage}
                    alt={t("aboutPage.mission.imageAlt")}
                    className="object-cover w-full h-full transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-8">
                  <div className="text-white">
                    <p className="text-sm uppercase tracking-wider">
                      {t("aboutPage.mission.location")}
                    </p>
                    <h3 className="text-xl font-bold mt-1">
                      {t("aboutPage.mission.imageTitle")}
                    </h3>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-8">
            <span className="text-[#0f8abe] font-semibold">{t("aboutPage.timeline.label")}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              {t("aboutPage.timeline.title.part1")} <span className="text-[#0f8abe]">{t("aboutPage.timeline.title.part2")}</span> {t("aboutPage.timeline.title.part3")}
            </h2>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#0f8abe] to-[#1ac8db] transform -translate-x-1/2"></div>

            {timelineData.map((item, index) => (
              <div
                key={index}
                className={`relative mb-12 lg:mb-16 ${
                  index % 2 === 0 ? "lg:text-right" : "lg:text-left"
                }`}
              >
                <div
                  className={`animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-8 delay-${
                    (index + 1) * 100
                  } flex flex-col lg:flex-row items-center ${
                    index % 2 === 0 ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`lg:w-1/2 ${
                      index % 2 === 0 ? "lg:pl-12" : "lg:pr-12"
                    } mb-6 lg:mb-0`}
                  >
                    <div
                      className={`inline-block ${
                        index % 2 === 0 ? "lg:text-right" : "lg:text-left"
                      }`}
                    >
                      <div className="text-2xl font-bold text-[#0f8abe] mb-2">
                        {t(item.yearKey)}
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-3">
                        {t(item.titleKey)}
                      </h3>
                      <p className="text-gray-600">{t(item.contentKey)}</p>
                    </div>
                  </div>
                  <div className="lg:w-1/2 flex justify-center lg:justify-start">
                    <div className="relative">
                      {/* Mobile timeline dot */}
                      <div className="lg:hidden absolute -left-8 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-[#0f8abe] rounded-full border-4 border-white"></div>
                      <div
                        className={`w-64 h-48 bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 ${
                          index % 2 === 0 ? "lg:ml-auto" : "lg:mr-auto"
                        }`}
                      >
                        <img
                          src={timelineImages[index]}
                          alt={t(item.titleKey)}
                          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-8">
            <span className="text-[#0f8abe] font-semibold">{t("aboutPage.vision.label")}</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
              {t("aboutPage.vision.title.part1")} <span className="text-[#0f8abe]">{t("aboutPage.vision.title.part2")}</span> {t("aboutPage.vision.title.part3")}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mt-6">
              {t("aboutPage.vision.subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {visionItems.map((item, index) => (
              <div
                key={index}
                className="animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-8 bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="p-8">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#0f8abe] to-[#0f8abe] flex items-center justify-center text-white mb-6">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">
                    {t(item.titleKey)}
                  </h3>
                  <p className="text-gray-600 text-lg">{t(item.descriptionKey)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-on-scroll transition-all duration-700 ease-out opacity-0 translate-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f8abe] mb-6">
              {t("aboutPage.cta.title")}
            </h2>
            <p className="text-xl text-gray-900 mb-8 max-w-2xl mx-auto leading-relaxed">
              {t("aboutPage.cta.description")}
            </p>
            <button
              onClick={() => (window.location.href = "/Careers")}
              className="bg-white text-lg text-[#0f8abe] px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {t("aboutPage.cta.buttonText")}
            </button>
          </div>
        </div>
      </section>

      {/* Add these styles to your global CSS */}
      <style>{`
        .contact-header {
          background: linear-gradient(
              rgba(15, 138, 190, 0.8),
              rgba(15, 138, 190, 0.9)
            ),
            url(${headerImage}) center/cover no-repeat;
          color: white;
          padding: 3.4rem 1rem;
          text-align: center;
        }

        .animate-on-scroll {
          transition: all 0.7s ease-out;
        }

        .animate-on-scroll.animate-enter {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default AboutUs;