import React from 'react';
import './WhoWeAre.css';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const WhoWeAre = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="who-wrapper">
      <div className="hero-banner">
        <div className="hero-text">
          <h1>{t('whoWeArePage.hero.title')}</h1>
          <p>{t('whoWeArePage.hero.subtitle')}</p>
        </div>
      </div>

      <div className="who-section">
        <div className="section-block">
          <h2>{t('whoWeArePage.vision.title')}</h2>
          <p>{t('whoWeArePage.vision.description')}</p>
        </div>

        <div className="section-block">
          <h2>{t('whoWeArePage.mission.title')}</h2>
          <p>{t('whoWeArePage.mission.description')}</p>
        </div>

        <div className="section-block">
          <h2>{t('whoWeArePage.coreValues.title')}</h2>
          <ul>
            <li><strong>{t('whoWeArePage.coreValues.curiosity.title')}:</strong> {t('whoWeArePage.coreValues.curiosity.description')}</li>
            <li><strong>{t('whoWeArePage.coreValues.integrity.title')}:</strong> {t('whoWeArePage.coreValues.integrity.description')}</li>
            <li><strong>{t('whoWeArePage.coreValues.collaboration.title')}:</strong> {t('whoWeArePage.coreValues.collaboration.description')}</li>
            <li><strong>{t('whoWeArePage.coreValues.excellence.title')}:</strong> {t('whoWeArePage.coreValues.excellence.description')}</li>
            <li><strong>{t('whoWeArePage.coreValues.empathy.title')}:</strong> {t('whoWeArePage.coreValues.empathy.description')}</li>
          </ul>
        </div>

        <div className="section-block">
          <h2>{t('whoWeArePage.culture.title')}</h2>
          <p>{t('whoWeArePage.culture.description')}</p>
        </div>

        <div className="cta-block">
          <h2>{t('whoWeArePage.cta.title')}</h2>
          <p>{t('whoWeArePage.cta.description')}</p>
          <a onClick={() => navigate("/contact")} className="cta-button" role="button" tabIndex={0}>
            {t('whoWeArePage.cta.buttonText')}
          </a>
        </div>
      </div>
    </section>
  );
};

export default WhoWeAre;