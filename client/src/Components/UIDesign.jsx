import React from "react";
import styled from "styled-components";
import {
  FiRefreshCw,
  FiLayers,
  FiCode,
  FiUsers,
  FiCheckCircle,
} from "react-icons/fi";
import Design from "./Images/Design.png";

const UIDesignPage = () => {
  return (
    <DesignPageContainer>
      {/* Hero Section */}
      <DesignHero>
        <HeroContent>
          <HeroTitle>UI/UX Design Services</HeroTitle>
          <HeroSubtitle>
            Beautiful, intuitive interfaces that delight users and drive
            engagement
          </HeroSubtitle>
          <DesignBenefits>
            <BenefitItem>
              <FiCheckCircle /> User-Centered Approach
            </BenefitItem>
            <BenefitItem>
              <FiCheckCircle /> Pixel-Perfect Designs
            </BenefitItem>
            <BenefitItem>
              <FiCheckCircle /> Proven Conversion Boosters
            </BenefitItem>
          </DesignBenefits>
        </HeroContent>
        <DesignIllustration>
          <img src={Design} alt="Design Mockup" className="design-mockup" />
        </DesignIllustration>
      </DesignHero>

      {/* Services Section */}
      <ServicesSection>
        <SectionTitle>Our Design Services</SectionTitle>
        <SectionSubtitle>
          Custom solutions tailored to your specific needs and budget
        </SectionSubtitle>

        <ServicesGrid>
          {/* Basic Redesign */}
          <ServiceCard>
            <ServiceHeader>
              <ServiceIcon>{/* <FiRefreshCw /> */}</ServiceIcon>
              <ServiceName>Basic Redesign</ServiceName>
              <ServicePrice>$2,500</ServicePrice>
              <ServiceDescription>
                Existing app/website UI refresh
              </ServiceDescription>
            </ServiceHeader>
            <ServiceFeatures>
              <li>
                <FiCheckCircle /> Visual style update
              </li>
              <li>
                <FiCheckCircle /> Improved layouts
              </li>
              <li>
                <FiCheckCircle /> Color scheme refresh
              </li>
              <li>
                <FiCheckCircle /> 2 weeks turnaround
              </li>
              <li>
                <FiCheckCircle /> 1 round of revisions
              </li>
            </ServiceFeatures>
            <ServiceButton>Get Started</ServiceButton>
          </ServiceCard>

          {/* Complete UX Overhaul */}
          <ServiceCard highlighted>
            <PopularBadge>Most Popular</PopularBadge>
            <ServiceHeader>
              <ServiceIcon>{/* <FiLayers /> */}</ServiceIcon>
              <ServiceName>Complete UX Overhaul</ServiceName>
              <ServicePrice>$7,500</ServicePrice>
              <ServiceDescription>
                User research, wireframes, prototypes
              </ServiceDescription>
            </ServiceHeader>
            <ServiceFeatures>
              <li>
                <FiCheckCircle /> User research & testing
              </li>
              <li>
                <FiCheckCircle /> Information architecture
              </li>
              <li>
                <FiCheckCircle /> Interactive prototypes
              </li>
              <li>
                <FiCheckCircle /> 4-6 weeks project
              </li>
              <li>
                <FiCheckCircle /> 3 rounds of revisions
              </li>
            </ServiceFeatures>
            <ServiceButton>Get Started</ServiceButton>
          </ServiceCard>

          {/* Ongoing Design Support */}
          <ServiceCard>
            <ServiceHeader>
              <ServiceIcon>{/* <FiCode /> */}</ServiceIcon>
              <ServiceName>Design Support</ServiceName>
              <ServicePrice>
                $1,500<small>/month</small>
              </ServicePrice>
              <ServiceDescription>Design system maintenance</ServiceDescription>
            </ServiceHeader>
            <ServiceFeatures>
              <li>
                <FiCheckCircle /> Design system updates
              </li>
              <li>
                <FiCheckCircle /> UI Upgrades Monthly
              </li>
              <li>
                <FiCheckCircle /> Component library
              </li>
              <li>
                <FiCheckCircle /> Style guide maintenance
              </li>
              <li>
                <FiCheckCircle /> Priority support
              </li>
            </ServiceFeatures>
            <ServiceButton>Subscribe</ServiceButton>
          </ServiceCard>
        </ServicesGrid>
      </ServicesSection>

      {/* Process Section */}
      <ProcessSection>
        <SectionTitle>Our Design Process</SectionTitle>
        <SectionSubtitle>
          A structured approach to creating exceptional user experiences
        </SectionSubtitle>
        <ProcessSteps>
          <ProcessStep>
            <StepNumber>1</StepNumber>
            <StepIcon>
              <FiUsers />
            </StepIcon>
            <StepTitle>Research</StepTitle>
            <StepDescription>
              Understand user needs, behaviors, and pain points through
              interviews and analytics
            </StepDescription>
          </ProcessStep>
          <ProcessStep>
            <StepNumber>2</StepNumber>
            <StepIcon>
              <FiLayers />
            </StepIcon>
            <StepTitle>Wireframing</StepTitle>
            <StepDescription>
              Create low-fidelity layouts to establish information hierarchy and
              flow
            </StepDescription>
          </ProcessStep>
          <ProcessStep>
            <StepNumber>3</StepNumber>
            <StepIcon>
              <FiRefreshCw />
            </StepIcon>
            <StepTitle>Prototyping</StepTitle>
            <StepDescription>
              Develop interactive prototypes to test and refine the user
              experience
            </StepDescription>
          </ProcessStep>
          <ProcessStep>
            <StepNumber>4</StepNumber>
            <StepIcon>
              <FiCheckCircle />
            </StepIcon>
            <StepTitle>Implementation</StepTitle>
            <StepDescription>
              Deliver production-ready designs with detailed specifications
            </StepDescription>
          </ProcessStep>
        </ProcessSteps>
        {/* CTA Section */}
        <DesignCta>
          <CtaContent>
            <CtaTitle>Ready to Elevate Your User Experience?</CtaTitle>
            <CtaSubtitle>
              Let's create something beautiful and functional together
            </CtaSubtitle>
            <CtaButton onClick={() => (window.location.href = "/contact")}>
              Get a Free Design Consultation
            </CtaButton>
          </CtaContent>
        </DesignCta>
      </ProcessSection>
    </DesignPageContainer>
  );
};

// Styled Components
const DesignPageContainer = styled.div`
  font-family: "Montserrat", sans-serif;
  color: #1a1a2e;
  line-height: 1.6;
  margin: 0 auto;
`;

const DesignHero = styled.section`
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

const DesignBenefits = styled.div`
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

const DesignIllustration = styled.div`
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
  font-weight: 600;
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
  font-size: 1.2rem;

  &:hover {
    background: #0c6f99;
  }
`;

const ProcessSection = styled.section`
  padding: 4rem 1rem;
  text-align: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
`;

const ProcessSteps = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 3rem auto 0;
`;

const ProcessStep = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const StepNumber = styled.div`
  width: 40px;
  height: 40px;
  background: #0f8abe;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  font-weight: bold;
  margin: 0 auto 1rem;
`;

const StepIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #0f8abe;
  margin-bottom: 1rem;
`;

const StepTitle = styled.h3`
font-weight:600;
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  color: #1a1a2e;
`;

const StepDescription = styled.p`
font-size:1.1rem;
  color: #52514a;
  margin-bottom: 0;
`;

const DesignCta = styled.section`
  border-radius: 12px;
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem 2rem;
  background: #0f8abe;
  color: white;
  text-align: center;
  margin-bottom: 3rem;
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

export default UIDesignPage;
