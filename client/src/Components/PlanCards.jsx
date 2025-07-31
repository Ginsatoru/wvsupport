import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import AOS from "aos";
import "aos/dist/aos.css";
import Plans from "./Plans"; // Assuming PlanCards is in the same directory

const MainSection = styled.div`
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  animation: fadeIn 2s ease-in-out;
  background-color: #fafafb;
  color: #52514a;
  padding: 5rem 0;
`;

const ServiceDetailsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  color: #52514a; /* Ensure text color is #52514a */
`;

const SectionTitle = styled.h2`
font-weight:bold;
  color: #0f8abe;
  font-size: 2rem;
  @media (max-width: 600px) {
    font-size: 1.3rem;
  }
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
`;

const FeatureCard = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  h3 {
  font-weight:bold;
    color: #0f8abe;
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    @media (max-width: 600px) {
      font-size: 1rem;
    }
  }

  p {
    font-size: 1rem;
    color: #52514a;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 12px rgba(0, 0, 0, 0.1);
  }
`;

const Button = styled.button`
  background: #fff;
  color: #0f8abe;
  border: none;
  padding: 0.8rem 1rem;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  width: 20%;
  min-width: 140px;
  transition: background 0.3s ease;
  font-size: 0.8rem;

  &:hover {
    background: #e6e6e6;
  }

  @media (max-width: 600px) {
    width: 100%;
    font-size: 0.98rem;
    padding: 1rem;
    min-width: unset;
    margin-top: 1rem;
  }
`;

const FaqItem = styled.div`
  margin-bottom: 2.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #52514a;

  h3 {
  font-weight:bold;
    font-size: 1.5rem;
    color: #52514a;
    margin-bottom: 0.5rem;
    @media (max-width: 600px) {
      font-size: 1.1rem;
    }
  }

  p {
    color: #52514a;
  }
`;

const FaqSectionTitle = styled(SectionTitle)`
  margin-bottom: 2.5rem;
  color: #0f8abe;
  font-size: 1.7rem;
  @media (max-width: 600px) {
    font-size: 1.5rem;
  }
`;

const ServiceCta = styled.section`
  text-align: center;
  padding: 3rem;
  background: #0f8abe;
  color: white;
  border-radius: 10px;
  margin-top: 2rem;

  h2 {
  font-weight:bold;
    font-size: 2rem;
    margin-bottom: 1.2rem;
    color: white;
    @media (max-width: 600px) {
      font-size: 1.2rem;
    }
  }

  p {
    margin-bottom: 1.2rem;
    color: white;
    @media (max-width: 600px) {
      font-size: 0.95rem;
    }
  }
`;

const ITSupportPage = () => {
  useEffect(() => {
    AOS.init({ duration: 700, once: true, easing: "ease-in-out" });
  }, []);

  return (
    <MainSection>
      <ServiceDetailsContainer>
        {/* Features Section */}
        <section className="service-features">
          <SectionTitle data-aos="fade-up">What We Offer</SectionTitle>
          <FeaturesGrid>
            <FeatureCard data-aos="fade-up" data-aos-delay="0">
              <h3>Remote Support</h3>
              <p>Immediate assistance for urgent technical issues</p>
            </FeatureCard>
            <FeatureCard data-aos="fade-up" data-aos-delay="100">
              <h3>System Monitoring</h3>
              <p>24/7 monitoring of your critical infrastructure</p>
            </FeatureCard>
            <FeatureCard data-aos="fade-up" data-aos-delay="200">
              <h3>Preventive Maintenance</h3>
              <p>Regular checkups to prevent issues before they occur</p>
            </FeatureCard>
            <FeatureCard data-aos="fade-up" data-aos-delay="300">
              <h3>Hardware Support</h3>
              <p>Diagnosis and repair of physical equipment</p>
            </FeatureCard>
            <FeatureCard data-aos="fade-up" data-aos-delay="400">
              <h3>Network Security</h3>
              <p>
                Protect your business with firewall setup and threat monitoring
              </p>
            </FeatureCard>
            <FeatureCard data-aos="fade-up" data-aos-delay="500">
              <h3>Data Backup & Recovery</h3>
              <p>Automated backups and fast recovery to keep your data safe</p>
            </FeatureCard>
          </FeaturesGrid>
        </section>

        <div data-aos="fade-up" data-aos-delay="200">
          <Plans />
        </div>

        {/* FAQ Section */}
        <section className="service-faq">
          <FaqSectionTitle data-aos="fade-up">Frequently Asked Questions</FaqSectionTitle>
          <FaqItem data-aos="fade-up" data-aos-delay="0">
            <h3>What's your response time for critical issues?</h3>
            <p>
              For Professional and Enterprise plans, we guarantee a response
              within 1 hour for critical issues.
            </p>
          </FaqItem>
          <FaqItem data-aos="fade-up" data-aos-delay="100">
            <h3>Do you provide hardware replacement?</h3>
            <p>
              We can diagnose hardware issues and recommend replacements, but
              hardware costs are billed separately.
            </p>
          </FaqItem>
        </section>

        {/* CTA Section */}
        <ServiceCta data-aos="fade-up" data-aos-delay="200">
          <h2>Ready to secure your IT infrastructure?</h2>
          <p>Contact us for a free consultation to assess your needs.</p>
          <Button onClick={() => (window.location.href = "/contact")}>
            Get a Free Consultation
          </Button>
        </ServiceCta>
      </ServiceDetailsContainer>
    </MainSection>
  );
};

export default ITSupportPage;
