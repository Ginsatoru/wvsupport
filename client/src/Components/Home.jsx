import React from "react";
import { useTranslation } from "react-i18next";
import "./Home.css";
import "./i18n";
import Team from "./Team";
import Gallery from "./Gallery";
import FeaturesSection from "./FeaturesSection";
import Achievements from "./Achievements";
import OurServices from "./OurServices";
import RetailManagerTroubleshooting from "./RetailManagerTroubleshooting";
import CustomerSupportExperience from "./CustomerSupportExperience";
import Partners from "./Partners";
import Hero from "./Hero";
import WelcomeMessage from "./WelcomePop";

function Home() {
  const { t } = useTranslation();
  
  return (
    <main className="main">
      <section className="team-section-wrapper">
        <Hero />
      </section>

      <section className="team-section-wrapper">
        <WelcomeMessage />
      </section>

      <section className="team-section-wrapper">
        <OurServices />
      </section>

      <section className="team-section-wrapper">
        <RetailManagerTroubleshooting />
      </section>

      <section className="team-section-wrapper">
        <CustomerSupportExperience />
      </section>

      <section className="team-section-wrapper">
        <FeaturesSection />
      </section>

      <section className="team-section-wrapper">
        <Team />
      </section>

      <section className="team-section-wrapper">
        <Partners />
      </section>

      <section className="team-section-wrapper">
        <Gallery />
      </section>

      <section className="team-section-wrapper">
        <Achievements />
      </section>
    </main>
  );
}

export default Home;