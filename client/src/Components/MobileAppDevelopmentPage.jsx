import React from "react";
import styled from "styled-components";
import phoneGif from "./Images/phone.gif";
import {
  FiCheck,
  FiSmartphone,
  FiCode,
  FiLayers,
  FiServer,
  FiDatabase,
} from "react-icons/fi";

const MobileAppDevelopmentPage = () => {
  return (
    <PageContainer>
      {/* Hero Section */}
      <HeroSection>
        <HeroContent>
          <HeroTitle>Mobile App Development</HeroTitle>
          <HeroSubtitle>
            Transform your ideas into powerful mobile experiences
          </HeroSubtitle>
          <TechStack>
            <TechPill>React Native</TechPill>
            <TechPill>Flutter</TechPill>
            <TechPill>Swift</TechPill>
            <TechPill>Kotlin</TechPill>
            <TechPill>Firebase</TechPill>
          </TechStack>
        </HeroContent>
        <PhoneImage>
          <img src={phoneGif} alt="IT Support Services in Cambodia" />
        </PhoneImage>
        {/* <PhoneIllustration>
          <PhoneScreen></PhoneScreen>
          <PhoneNotch></PhoneNotch>
        </PhoneIllustration> */}
      </HeroSection>

      {/* Value Propositions */}
      <ValueSection>
        <ValueCard>
          <FiSmartphone size={32} />
          <h3>Native Performance</h3>
          <p>Buttery smooth animations and optimal performance</p>
        </ValueCard>
        <ValueCard>
          <FiLayers size={32} />
          <h3>Cross-Platform</h3>
          <p>Single codebase for iOS and Android</p>
        </ValueCard>
        <ValueCard>
          <FiServer size={32} />
          <h3>Backend Integration</h3>
          <p>Seamless API and database connections</p>
        </ValueCard>
        <ValueCard>
          <FiDatabase size={32} />
          <h3>Cloud Ready</h3>
          <p>Scalable cloud infrastructure included</p>
        </ValueCard>
      </ValueSection>

      {/* Pricing Section */}
      <PricingSection>
        <SectionTitle>Development Packages</SectionTitle>
        <SectionSubtitle>
          Tailored solutions for every business need
        </SectionSubtitle>

        <PricingGrid>
          {/* MVP Development */}
          <PricingCard>
            <PricingHeader>
              <h3>MVP Build</h3>
              <Price>$15,000</Price>
              <PriceDescription>Validate your idea quickly</PriceDescription>
            </PricingHeader>
            <FeaturesList>
              <li>
                <FiCheck /> Basic feature set
              </li>
              <li>
                <FiCheck /> iOS or Android
              </li>
              <li>
                <FiCheck /> Simple backend
              </li>
              <li>
                <FiCheck /> 3 months support
              </li>
              <li>
                <FiCheck /> Basic analytics
              </li>
              <li>
                <FiCheck /> 2 revision rounds
              </li>
            </FeaturesList>
            <PricingButton>Get Started</PricingButton>
          </PricingCard>

          {/* Standard App */}
          <PricingCard popular>
            <PopularBadge>Most Popular</PopularBadge>
            <PricingHeader>
              <h3>Standard App</h3>
              <Price>$30,000</Price>
              <PriceDescription>Full-featured mobile solution</PriceDescription>
            </PricingHeader>
            <FeaturesList>
              <li>
                <FiCheck /> Complete set
              </li>
              <li>
                <FiCheck /> iOS or Android
              </li>
              <li>
                <FiCheck /> Custom backend
              </li>
              <li>
                <FiCheck /> 6 months support
              </li>
              <li>
                <FiCheck /> Advanced analytics
              </li>
              <li>
                <FiCheck /> 2 revision rounds
              </li>
            </FeaturesList>
            <PricingButton>Get Started</PricingButton>
          </PricingCard>

          {/* Cross-Platform App */}
          <PricingCard>
            <PricingHeader>
              <h3>All-Platform App</h3>
              <Price>$45,000</Price>
              <PriceDescription>
                Reach both iOS and Android users
              </PriceDescription>
            </PricingHeader>
            <FeaturesList>
              <li>
                <FiCheck /> Complete set
              </li>
              <li>
                <FiCheck /> iOS + Android
              </li>
              <li>
                <FiCheck /> Custom backend
              </li>
              <li>
                <FiCheck /> 9 months support
              </li>
              <li>
                <FiCheck /> Push notifications
              </li>
              <li>
                <FiCheck /> Unlimited revisions
              </li>
            </FeaturesList>
            <PricingButton>Get Started</PricingButton>
          </PricingCard>

          {/* Enterprise App */}
          <PricingCard enterprise>
            <PricingHeader>
              <h3>Pro Solution</h3>
              <Custom>Custom</Custom>
              <PriceDescription>For large-scale applications</PriceDescription>
            </PricingHeader>
            <FeaturesCustom>
              <li>
                <FiCheck /> Advanced features
              </li>
              <li>
                <FiCheck /> iOS • Android • Web
              </li>
              <li>
                <FiCheck /> Complex backend
              </li>
              <li>
                <FiCheck /> Ongoing support
              </li>
              <li>
                <FiCheck /> Enterprise security
              </li>
              <li>
                <FiCheck /> Dedicated team
              </li>
            </FeaturesCustom>
            <PricingButton>Contact Us</PricingButton>
          </PricingCard>
        </PricingGrid>
      </PricingSection>

      {/* Process Section */}
      <ProcessSection>
        <SectionTitle>Our Development Process</SectionTitle>
        <ProcessSteps>
          <Step>
            <StepNumber>1</StepNumber>
            <h3>Strategy</h3>
            <p>Define goals and requirements</p>
          </Step>
          <Step>
            <StepNumber>2</StepNumber>
            <h3>Design</h3>
            <p>Create UI/UX prototypes</p>
          </Step>
          <Step>
            <StepNumber>3</StepNumber>
            <h3>Development</h3>
            <p>Build and test the application</p>
          </Step>
          <Step>
            <StepNumber>4</StepNumber>
            <h3>Launch</h3>
            <p>Deploy to app stores</p>
          </Step>
        </ProcessSteps>
      </ProcessSection>

      {/* CTA Section */}
      <CtaSection>
        <h2>Ready to Build Your Mobile App?</h2>
        <p>Get a free consultation with our mobile experts</p>
        <PrimaryButton onClick={() => (window.location.href = "/contact")}>
          Schedule a Call
        </PrimaryButton>
      </CtaSection>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  font-family: "Montserrat", sans-serif;
  color: #1a1a2e;
  line-height: 1.6;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const HeroSection = styled.section`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4rem 0;
  gap: 3rem;

  @media (max-width: 1024px) {
    flex-direction: column;
    text-align: center;
  }
`;

const HeroContent = styled.div`
  max-width: 600px;

  @media (max-width: 1024px) {
    max-width: 100%;
  }
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  background-color: #0f8abe;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.2rem;
  color: #4a5568;
  margin-bottom: 2rem;
`;

const TechStack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 2rem;

  @media (max-width: 1024px) {
    justify-content: center;
  }
`;

const TechPill = styled.span`
  background: #edf2f7;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const PhoneImage = styled.div`
  position: relative;
  width: 300px;
  height: 600px;
  // background: #fff;
  // border-radius: 40px;
  // box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  // border: 10px solid #1a1a2e;

  img {
    width: 100%;
    height: auto;
    display: block;
  }

  @media (max-width: 1024px) {
    margin-top: 2rem;
  }
`;

const PhoneIllustration = styled.div`
  position: relative;
  width: 300px;
  height: 600px;
  background: #fff;
  border-radius: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  border: 10px solid #1a1a2e;

  @media (max-width: 1024px) {
    margin-top: 2rem;
  }
`;
const PhoneScreen = styled.div`
  position: absolute;
  top: 50px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 30px;
  overflow: hidden;
`;

const PhoneNotch = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 120px;
  height: 20px;
  background: #1a1a2e;
  border-radius: 0 0 10px 10px;
`;

const ValueSection = styled.section`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin: 4rem 0;
`;

const ValueCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  svg {
    color: #0f8abe;
    font-size: 2rem;
    margin-bottom: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  h3 {
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
    font-weight: 700; /* Added bold font weight */
  }

  p{
  font-size:1.2rem;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }
`;
const PricingSection = styled.section`
  margin: 6rem 0;
  text-align: center;
`;

const SectionTitle = styled.h2`
  color: #0f8abe;
  font-weight:600;
  font-size: 2.5rem;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const SectionSubtitle = styled.p`
  color: #52514a;
  margin-bottom: 3rem;
  font-size: 1.1rem;
`;

const PricingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PricingCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  position: relative;
  transition: transform 0.3s ease;
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;

  ${({ popular }) =>
    popular &&
    `
    border: 2px solid #0f8abe;
    position: relative;
  `}

  ${({ enterprise }) =>
    enterprise &&
    `
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    color: white;
    
    h3, div, p, li {
      color: white;
    }
  `}

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
`;

const PopularBadge = styled.div`
  position: absolute;
  top: -18px;
  right: 18px;
  background: #0f8abe;
  color: #fff;
  font-size: 0.95rem;
  font-weight: 700;
  padding: 6px 18px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(15, 138, 190, 0.1);
  letter-spacing: 0.03em;
  z-index: 2;
`;

const PricingHeader = styled.div`
font-weight:600;
  margin-bottom: 1.5rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e2e8f0;

  ${PricingCard}.enterprise & {
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }
`;

const Custom = styled.div`
  color: #0f8abe !important;
  font-size: 2.5rem;
  font-weight: 700;
`;

const Price = styled.div`
  color: #0f8abe;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0.5rem 0;
`;

const PriceDescription = styled.p`
  color: #52514a;
  font-size: 0.9rem;

  ${PricingCard}.enterprise & {
    color: white !important;
    font-weight: 500;
  }
`;

const FeaturesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  text-align: left;
  flex-grow: 1;

  li {
    padding: 0.3rem 0;
    display: flex;
    align-items: center;
    color: #52514a;
  }

  svg {
    margin-right: 0.7rem;
    color: #0f8abe;
  }

  ${PricingCard}.enterprise & li {
    color: white !important;
    font-weight: 500;
  }
`;

const FeaturesCustom = styled.ul`
  list-style: none;
  padding: 0;
  margin: 2rem 0;
  text-align: left;
  flex-grow: 1;

  li {
    padding: 0.3rem 0;
    display: flex;
    align-items: center;
    color: white;
  }

  svg {
    margin-right: 0.7rem;
    color: #0f8abe;
  }

  ${PricingCard}.enterprise & li {
    color: white !important;
    font-weight: 500;
  }
`;

const PricingButton = styled.button`
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
  font-size:1rem !important;

  &:hover {
    background: #0c6f99;
  }

  ${PricingCard}.enterprise & {
    background: white;
    color: #0f8abe;

    &:hover {
      background: #e2e8f0;
    }
  }
`;

const ProcessSection = styled.section`
  margin: 6rem 0;
  text-align: center;
`;

const ProcessSteps = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Step = styled.div`
  position: relative;
  padding: 2rem 1.5rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);

  h3{
  font-weight:600;
  }

  p{
  font-size:1.2rem;
  }
`;

const StepNumber = styled.div`
  width: 50px;
  height: 50px;
  background: #0f8abe;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  margin: 0 auto 1.5rem;
`;

const CtaSection = styled.section`
  text-align: center;
  padding: 4rem 2rem;
  background-color: #0f8abe;
  color: white;
  border-radius: 12px;
  margin: 4rem 0;

  h2 {
  font-weight:600;
    font-size: 2.2rem;
    margin-bottom: 1rem;
  }

  p {
    color: white !important;
    font-size: 1.1rem;
    margin-bottom: 2rem;
    opacity: 0.9;
  }
`;

const PrimaryButton = styled.button`
  padding: 1rem 2.5rem;
  background: white;
  color: #0f8abe;
  border: none;
  font-weight: 600;
  border-radius: 50px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

export default MobileAppDevelopmentPage;
