import React from "react";
import { useTranslation } from "react-i18next";
import "./Home.css";
import "../Components/i18n";
import Team from "../Components/home/Team";
import Gallery from "../Components/home/Gallery";
import FeaturesSection from "../Components/home/Work";
import Newsletter from "../Components/home/Newsletter";
import OurServices from "../Components/home/Services";
import RetailManagerTroubleshooting from "../Components/home/About";
import CustomerSupportExperience from "../Components/home/Tech";
import Partners from "../Components/home/Partners";
import Hero from "../Components/home/Hero";
import NewsModal from "../Components/shared/NewsModal";

function Home() {
  const { t } = useTranslation();
  
  return (
    <main className="main">
      <section className="team-section-wrapper">
        <Hero />
      </section>

      <NewsModal />

      <section className="team-section-wrapper">
        <Partners />
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
        <Gallery />
      </section>

      <section className="team-section-wrapper">
        <Newsletter />
      </section>
    </main>
  );
}

export default Home;