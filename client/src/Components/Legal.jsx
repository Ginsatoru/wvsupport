// LegalPage.js
import React from "react";
import "./legal.css";
import { useTranslation } from 'react-i18next';

const Legal = () => {
  const { t } = useTranslation();

  return (
    <div className="legal-container">
      <h1 className="legal-title">{t('legalPage.title')}</h1>

      <section className="legal-section">
        <h2>{t('legalPage.welcome.title')}</h2>
        <p>{t('legalPage.welcome.description')}</p>
      </section>

      <section className="legal-section">
        <h2>{t('legalPage.useOfServices.title')}</h2>
        <p>{t('legalPage.useOfServices.description')}</p>
      </section>

      <section className="legal-section">
        <h2>{t('legalPage.intellectualProperty.title')}</h2>
        <p>{t('legalPage.intellectualProperty.description')}</p>
      </section>

      <section className="legal-section">
        <h2>{t('legalPage.limitationOfLiability.title')}</h2>
        <p>{t('legalPage.limitationOfLiability.description')}</p>
      </section>

      <section className="legal-section">
        <h2>{t('legalPage.changes.title')}</h2>
        <p>{t('legalPage.changes.description')}</p>
      </section>

      <section className="legal-section">
        <h2>{t('legalPage.contactUs.title')}</h2>
        <p>{t('legalPage.contactUs.description')}</p>
      </section>
    </div>
  );
};

export default Legal;