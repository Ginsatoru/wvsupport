import React from "react";
import styled from "styled-components";
import {
  FiShield,
  FiZap,
  FiClock,
  FiStar,
  FiCheckCircle,
} from "react-icons/fi";
import WordPress from './Images/WordPressback.png'

const WordPressServicesPage = () => {
  return (
    <WordPressPageContainer>
      {/* Hero Section */}
      <WordPressHero>
        <HeroContent>
          <HeroTitle>WordPress Services</HeroTitle>
          <HeroSubtitle>
            Professional WordPress solutions to keep your site secure, fast, and
            always available
          </HeroSubtitle>
          <WordPressBenefits>
            <BenefitItem>
              <FiCheckCircle /> 99.9% Uptime Guarantee
            </BenefitItem>
            <BenefitItem>
              <FiCheckCircle /> Expert WordPress Developers
            </BenefitItem>
            <BenefitItem>
              <FiCheckCircle /> 24/7 Emergency Support
            </BenefitItem>
          </WordPressBenefits>
        </HeroContent>
        <WordPressIllustration>
          <img src={WordPress} alt="Design Mockup" className="design-mockup" />
        </WordPressIllustration>
      </WordPressHero>

      {/* Services Section */}
      <ServicesSection>
        <SectionTitle>WordPress Support Plans</SectionTitle>
        <SectionSubtitle>
          Choose the perfect level of support for your WordPress website
        </SectionSubtitle>

        <ServicesGrid>
          {/* Basic Maintenance */}
          <ServiceCard>
            <ServiceHeader>
              <ServiceIcon>
                {/* <FiClock /> */}
              </ServiceIcon>
              <ServiceName>Basic Maintenance</ServiceName>
              <ServicePrice>
                $99<small>/month</small>
              </ServicePrice>
              <ServiceDescription>
                Essential upkeep for your WordPress site
              </ServiceDescription>
            </ServiceHeader>
            <ServiceFeatures>
              <li>
                <FiCheckCircle /> Updates & maintenance
              </li>
              <li>
                <FiCheckCircle /> Daily backups
              </li>
              <li>
                <FiCheckCircle /> 2 hours support
              </li>
              <li>
                <FiCheckCircle /> Uptime monitoring
              </li>
              <li>
                <FiCheckCircle /> Basic security checks
              </li>
            </ServiceFeatures>
            <ServiceButton>Get Started</ServiceButton>
          </ServiceCard>

          {/* Performance Plan */}
          <ServiceCard highlighted>
            <PopularBadge>Recommended</PopularBadge>
            <ServiceHeader>
              <ServiceIcon>
                {/* <FiZap /> */}
              </ServiceIcon>
              <ServiceName>Performance Plan</ServiceName>
              <ServicePrice>
                $199<small>/month</small>
              </ServicePrice>
              <ServiceDescription>
                Optimized speed and efficiency
              </ServiceDescription>
            </ServiceHeader>
            <ServiceFeatures>
              <li>
                <FiCheckCircle /> Everything in Basic
              </li>
              <li>
                <FiCheckCircle /> Site optimization
              </li>
              <li>
                <FiCheckCircle /> Image compression
              </li>
              <li>
                <FiCheckCircle /> Database optimization
              </li>
              <li>
                <FiCheckCircle /> 4 hours support
              </li>
            </ServiceFeatures>
            <ServiceButton>Get Started</ServiceButton>
          </ServiceCard>

          {/* Security Plan */}
          <ServiceCard>
            <ServiceHeader>
              <ServiceIcon>
                {/* <FiShield /> */}
              </ServiceIcon>
              <ServiceName>Security Plan</ServiceName>
              <ServicePrice>
                $299<small>/month</small>
              </ServicePrice>
              <ServiceDescription>
                Complete protection for your site
              </ServiceDescription>
            </ServiceHeader>
            <ServiceFeatures>
              <li>
                <FiCheckCircle /> Performance Toolkit
              </li>
              <li>
                <FiCheckCircle /> Security monitoring
              </li>
              <li>
                <FiCheckCircle /> Malware protection


              </li>
              <li>
                <FiCheckCircle /> Firewall protection
              </li>
              <li>
                <FiCheckCircle /> 8 hours support
              </li>
            </ServiceFeatures>
            <ServiceButton>Get Started</ServiceButton>
          </ServiceCard>

          {/* VIP Plan */}
          <ServiceCard>
            <ServiceHeader>
              <ServiceIcon>
                {/* <FiStar /> */}
              </ServiceIcon>
              <ServiceName>VIP Plan</ServiceName>
              <ServicePrice>
                $499<small>/month</small>
              </ServicePrice>
              <ServiceDescription>
                White-glove WordPress service
              </ServiceDescription>
            </ServiceHeader>
            <ServiceFeatures>
              <li>
                <FiCheckCircle /> Everything in Security
              </li>
              <li>
                <FiCheckCircle /> 24/7 priority support
              </li>
              <li>
                <FiCheckCircle /> Emergency fixes
              </li>
              <li>
                <FiCheckCircle /> Account manager
              </li>
              <li>
                <FiCheckCircle /> Unlimited support hours
              </li>
            </ServiceFeatures>
            <ServiceButton>Subscribe now</ServiceButton>
          </ServiceCard>
        </ServicesGrid>
      </ServicesSection>

      {/* Additional Services Section */}
      <AdditionalServices>
        <SectionTitle>Additional WordPress Services</SectionTitle>
        <SectionSubtitle>
          Custom solutions for your specific WordPress needs
        </SectionSubtitle>

        <ServiceList>
          <ServiceListItem>
            <ServiceListIcon>
              <FiCheckCircle />
            </ServiceListIcon>
            <div>
              <ServiceListTitle>Custom Theme Development</ServiceListTitle>
              <ServiceListDesc>
                Tailored WordPress themes built to your exact specifications
              </ServiceListDesc>
            </div>
          </ServiceListItem>
          <ServiceListItem>
            <ServiceListIcon>
              <FiCheckCircle />
            </ServiceListIcon>
            <div>
              <ServiceListTitle>Plugin Development</ServiceListTitle>
              <ServiceListDesc>
                Custom functionality through bespoke WordPress plugins
              </ServiceListDesc>
            </div>
          </ServiceListItem>
          <ServiceListItem>
            <ServiceListIcon>
              <FiCheckCircle />
            </ServiceListIcon>
            <div>
              <ServiceListTitle>WooCommerce Solutions</ServiceListTitle>
              <ServiceListDesc>
                Optimized online stores with WordPress and WooCommerce
              </ServiceListDesc>
            </div>
          </ServiceListItem>
          <ServiceListItem>
            <ServiceListIcon>
              <FiCheckCircle />
            </ServiceListIcon>
            <div>
              <ServiceListTitle>WordPress Migrations</ServiceListTitle>
              <ServiceListDesc>
                Seamless transfers to new hosts with zero downtime
              </ServiceListDesc>
            </div>
          </ServiceListItem>
        </ServiceList>
      </AdditionalServices>

      {/* CTA Section */}
      <WordPressCta>
        <CtaContent>
          <CtaTitle>Need Expert WordPress Help?</CtaTitle>
          <CtaSubtitle>
            Our WordPress specialists are ready to assist you with any challenge
          </CtaSubtitle>
          <CtaButton onClick={() => (window.location.href = "/contact")}>
            Get a Free WordPress Audit
          </CtaButton>
        </CtaContent>
      </WordPressCta>
    </WordPressPageContainer>
  );
};

// Styled Components
const WordPressPageContainer = styled.div`
  font-family: "Montserrat", sans-serif;
  color: #1a1a2e;
  line-height: 1.6;
  margin: 0 auto;
`;

const WordPressHero = styled.section`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4rem 0;
  gap: 3rem;
  border-radius: 0 0 20px 20px;
  margin-bottom: 3rem;

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  max-width: 600px;
  padding: 0 2rem;

  @media (max-width: 1024px) {
    max-width: 100%;
    padding: 0 1rem;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  color: #0f8abe;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  color: #52514a;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const WordPressBenefits = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;

  @media (max-width: 1024px) {
    justify-content: center;
  }
`;

const BenefitItem = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(15, 138, 190, 0.1);
  color: #0f8abe;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;

  svg {
    font-size: 1rem;
  }
`;

const WordPressIllustration = styled.div`
  position: relative;
  width: 50%;
  padding: 2rem;

  .design-mockup {
    width: 100%;
    height: auto;
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    position: relative;
    overflow: hidden;
    border: 1px solid #e4e8eb;
  }

  @media (max-width: 1024px) {
    width: 100%;
    padding: 0 2rem 2rem;
  }
`;

const ServicesSection = styled.section`
  padding: 4rem 1rem;
  text-align: center;
  background: white;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  color: #0f8abe;
  margin-bottom: 1rem;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  font-size: 1.25rem;
  color: #52514a;
  max-width: 700px;
  margin: 0 auto 3rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const ServiceCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  position: relative;
  transition: transform 0.3s ease;
  border: 1px solid #e4e8eb;
  display: flex;
  flex-direction: column;

  ${({ highlighted }) =>
    highlighted &&
    `
    border: 2px solid #0f8abe;
    transform: scale(1.02);
  `}

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -12px;
  right: 20px;
  background: #0f8abe;
  color: white;
  padding: 0.3rem 1.2rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: bold;
`;

const ServiceHeader = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e4e8eb;
  text-align: center;
`;

const ServiceIcon = styled.div`
  font-size: 2.5rem;
  color: #0f8abe;
  margin-bottom: 1rem;
`;

const ServiceName = styled.h3`
font-weight:600;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #1a1a2e;
`;

const ServicePrice = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin: 0.5rem 0;
  color: #0f8abe;

  small {
    font-size: 1rem;
    color: #52514a;
    font-weight: normal;
  }
`;

const ServiceDescription = styled.p`
  color: #52514a;
  font-size: 0.9rem;
`;

const ServiceFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
  text-align: left;
  flex-grow: 1;

  li {
    padding: 0.5rem 0;
    display: flex;
    align-items: center;
    color: #52514a;
    gap: 0.5rem;
  }

  svg {
    color: #0f8abe;
  }
`;

const ServiceButton = styled.button`
  width: 100%;
  padding: 0.85rem;
  border: none;
  background: #0f8abe;
  color: white;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
  margin-top: auto;
  font-size:1.2rem;

  &:hover {
    background: #0c6f99;
  }
`;

const AdditionalServices = styled.section`
  padding: 4rem 1rem;
  text-align: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
`;

const ServiceList = styled.div`
  max-width: 800px;
  margin: 0 auto;
  text-align: left;
`;

const ServiceListItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid #e4e8eb;
  align-items: flex-start;

  &:last-child {
    border-bottom: none;
  }
`;

const ServiceListIcon = styled.div`
  font-size: 1.5rem;
  color: #0f8abe;
  margin-top: 0.2rem;
`;

const ServiceListTitle = styled.h4`
font-weight:bold;
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
  color: #1a1a2e;
`;

const ServiceListDesc = styled.p`
  color: #52514a;
  margin-bottom: 0;
`;

const WordPressCta = styled.section`
  border-radius: 12px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem;
  background: #0f8abe;
  color: white;
  text-align: center;
  margin-bottom: 5rem;
  margin-top: 5rem;
`;

const CtaContent = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const CtaTitle = styled.h2`
  font-size: 2.2rem;
  margin-bottom: 1rem;
  font-weight: 700;
  color: white;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const CtaSubtitle = styled.p`
  font-size: 1.15rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const CtaButton = styled.button`
  padding: 1rem 2.5rem;
  background: white;
  color: #0f8abe;
  border: none;
  font-weight: 600;
  border-radius: 50px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

export default WordPressServicesPage;
