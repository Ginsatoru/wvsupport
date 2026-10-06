import React, { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import "./Home.css";
import "../Components/i18n";
// import Team from "../Components/home/Team";
import Partners from "../Components/home/Partners";
import Hero from "../Components/home/Hero";
import NewsModal from "../Components/shared/NewsModal";

// Below-the-fold sections: code, API calls and images load only when scrolled near
const Gallery = lazy(() => import("../Components/home/Gallery"));
const FeaturesSection = lazy(() => import("../Components/home/Work"));
const Newsletter = lazy(() => import("../Components/home/Newsletter"));
const OurServices = lazy(() => import("../Components/home/Services"));
const RetailManagerTroubleshooting = lazy(() => import("../Components/home/About"));
const CustomerSupportExperience = lazy(() => import("../Components/home/Tech"));

// Same <section> wrapper as before; children mount once it is within 400px of the viewport
const LazySection = ({ children, minHeight = 400 }) => {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (show) return;
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [show]);

  return (
    <section
      ref={ref}
      className="team-section-wrapper"
      style={show ? undefined : { minHeight }}
    >
      {show && <Suspense fallback={null}>{children}</Suspense>}
    </section>
  );
};

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

      <LazySection>
        <OurServices />
      </LazySection>

      <LazySection>
        <RetailManagerTroubleshooting />
      </LazySection>

      <LazySection>
        <CustomerSupportExperience />
      </LazySection>

      <LazySection>
        <FeaturesSection />
      </LazySection>

      {/* <section className="team-section-wrapper">
        <Team />
      </section> */}

      <LazySection>
        <Gallery />
      </LazySection>

      <LazySection>
        <Newsletter />
      </LazySection>
    </main>
  );
}

export default Home;