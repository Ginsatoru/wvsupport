import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "./FeaturesSection.css";
import Organization from "./Images/Organization.png";
import Marketing from "./Images/Marketing.png";
import Risk from "./Images/Risk.png";
import Success from "./Images/Success.png";
import Market from "./Images/Market.png";

export default function FeaturesSection() {
  const { t } = useTranslation();
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
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
  }, []);

  return (
    <div className="main-feature">
      <div
        ref={sectionRef}
        className={`features-section ${isVisible ? "fade-in" : "fade-out"}`}
      >
        {/* Left Side */}
        <div className="left-div">
          <h2>{t('features.mainTitle')}</h2>
          <p className="intro">
            {t('features.intro')}
          </p>

          <div className="card-grid">
            <div className="feature-card">
              <img
                className="card-img small"
                src={Organization}
                alt={t('features.organization.title')}
              />
              <h3>{t('features.organization.title')}</h3>
              <p>
                {t('features.organization.description')}
              </p>
            </div>
            <div className="feature-card">
              <img
                className="card-img small"
                src={Marketing}
                alt={t('features.marketing.title')}
              />
              <h3>{t('features.marketing.title')}</h3>
              <p>
                {t('features.marketing.description')}
              </p>
            </div>
            <div className="feature-card">
              <img 
                className="card-img small" 
                src={Risk} 
                alt={t('features.risk.title')} 
              />
              <h3>{t('features.risk.title')}</h3>
              <p>
                {t('features.risk.description')}
              </p>
            </div>
            <div className="feature-card">
              <img
                className="card-img small"
                src={Market}
                alt={t('features.capital.title')}
              />
              <h3>{t('features.capital.title')}</h3>
              <p>
                {t('features.capital.description')}
              </p>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="right-div">
          <img 
            className="card-img big" 
            src={Success} 
            alt={t('features.success.imageAlt')} 
          />
          <h2>{t('features.success.title')}</h2>
          <p>
            {t('features.success.paragraph1')}
          </p>
          <p>
            {t('features.success.paragraph2')}
          </p>
          <Link to="/Contact">
            <button>{t('features.contactButton')}</button>
          </Link>
        </div>
      </div>
    </div>
  );
}