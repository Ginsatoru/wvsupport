import React from 'react';
import styled, { keyframes } from 'styled-components';
import headerImage from './Images/header.png';

// ================ ANIMATIONS ================
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// ================ STYLED COMPONENTS ================
const MainContainer = styled.div`
  font-family: 'Montserrat', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  overflow-x: hidden;

  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  @media (max-width: 576px) {
    padding: 1rem;
  }
`;

const SupportHeader = styled.header`
  text-align: center;
  padding: 3.9rem 2rem;
  background: linear-gradient(135deg, rgba(15, 138, 190, 0.9), rgba(15, 138, 190, 0.95)), 
              url(${headerImage}) center/cover no-repeat;
  color: white;
  position: relative;
  overflow: hidden;
  margin-bottom: 4rem;

  h1 {
    font-weight: 700;
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    animation: ${fadeIn} 0.8s ease-out;
    text-shadow: 0 2px 4px rgba(0,0,0,0.1);

    @media (max-width: 768px) {
      font-size: 2rem;
    }

    @media (max-width: 576px) {
      font-size: 1.8rem;
    }
  }

  p {
    font-size: 1.2rem;
    line-height: 1.6;
    max-width: 700px;
    margin: 0 auto;
    animation: ${fadeIn} 0.8s ease-out 0.2s both;
    opacity: 0.9;

    @media (max-width: 768px) {
      font-size: 1rem;
    }

    @media (max-width: 576px) {
      font-size: 0.9rem;
    }
  }
`;

const SectionTitle = styled.h2`
  color: #0f8abe;
  font-size: 2.2rem;
  text-align: center;
  margin-bottom: 3rem;
  font-weight: 700;
  position: relative;
  padding-bottom: 1rem;
  animation: ${fadeIn} 0.8s ease-out;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }

  @media (max-width: 576px) {
    font-size: 1.6rem;
  }
`;

// ===== MODERN CARD SECTION =====
const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 3rem 0;
`;

const ServiceCard = styled.div`
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  animation: ${fadeIn} 0.8s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;
  position: relative;
  z-index: 1;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);
    
    &::before {
      opacity: 1;
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(15, 138, 190, 0.05), rgba(15, 138, 190, 0.02));
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }
`;

const CardImage = styled.div`
  height: 200px;
  overflow: hidden;
  position: relative;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  ${ServiceCard}:hover & img {
    transform: scale(1.05);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 40%;
    background: linear-gradient(to top, rgba(0,0,0,0.5), transparent);
  }
`;

const CardContent = styled.div`
  padding: 1.5rem;

  h3 {
    color: #0f8abe;
    font-size: 1.4rem;
    margin-top: 0;
    margin-bottom: 1rem;
    position: relative;
    display: inline-block;
  }

  p {
    color: #52514a;
    font-size: 1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1.5rem 0 0;

  li {
    position: relative;
    padding-left: 1.5rem;
    margin-bottom: 0.8rem;
    color: #52514a;
    font-size: 0.95rem;

    &::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #0f8abe;
      font-weight: bold;
    }
  }
`;

// ===== STATS SECTION =====
const StatsContainer = styled.div`
  background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
  border-radius: 20px;
  padding: 4rem 2rem;
  margin: 5rem 0;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.8s ease-out;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 8px;
    height: 100%;
    background: linear-gradient(to bottom, #0f8abe, #4fc3f7);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
`;

const StatCard = styled.div`
  text-align: center;
  padding: 2rem 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  animation: ${fadeIn} 0.8s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  h3 {
    color: #0f8abe;
    font-size: 2.2rem;
    margin: 0;
    font-weight: 700;
    background: linear-gradient(135deg, #0f8abe, #4fc3f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  p {
    color: #52514a;
    font-size: 1.1rem;
    margin: 0.5rem 0 0;
  }
`;

// ===== PROCESS SECTION =====
const ProcessContainer = styled.div`
  margin: 5rem 0;
  animation: ${fadeIn} 0.8s ease-out;
`;

const ProcessStep = styled.div`
  display: flex;
  margin-bottom: 3rem;
  position: relative;
  animation: ${fadeIn} 0.8s ease-out;
  animation-delay: ${props => props.delay || '0s'};
  animation-fill-mode: both;

  &::before {
    content: '';
    position: absolute;
    left: 30px;
    top: 50px;
    bottom: -3rem;
    width: 2px;
    background: linear-gradient(to bottom, #0f8abe, transparent);
    z-index: 0;
  }

  &:last-child::before {
    display: none;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    
    &::before {
      left: 20px;
      top: 40px;
    }
  }
`;

const StepNumber = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0f8abe, #4fc3f7);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.5rem;
  flex-shrink: 0;
  margin-right: 2rem;
  position: relative;
  z-index: 1;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    margin-right: 0;
    margin-bottom: 1.5rem;
  }
`;

const StepContent = styled.div`
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  flex-grow: 1;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  h4 {
    color: #0f8abe;
    margin-top: 0;
    margin-bottom: 0.8rem;
    font-size: 1.3rem;
  }

  p {
    color: #52514a;
    margin: 0;
    line-height: 1.6;
  }
`;

// ================ COMPONENT ================
const Support = () => {
  return (
    <>
      <SupportHeader>
        <h1>Premium Support Services</h1>
        <p>
          Expert technical assistance tailored to your RetailManager ecosystem, ensuring seamless operations and maximum uptime.
        </p>
      </SupportHeader>
      
      <MainContainer>
        {/* SERVICES SECTION */}
        <SectionTitle>Our Comprehensive Support</SectionTitle>
        <ServicesGrid>
          <ServiceCard delay="0.2s">
            <CardImage>
              <img 
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Remote support" 
              />
            </CardImage>
            <CardContent>
              <h3>Remote Troubleshooting</h3>
              <p>Immediate assistance for your RetailManager system with secure remote access and real-time diagnostics.</p>
              <FeatureList>
                <li>Under 15 minute response for critical issues</li>
                <li>Military-grade encrypted connections</li>
                <li>24/7 availability for emergencies</li>
              </FeatureList>
            </CardContent>
          </ServiceCard>

          <ServiceCard delay="0.4s">
            <CardImage>
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="System optimization" 
              />
            </CardImage>
            <CardContent>
              <h3>System Optimization</h3>
              <p>Proactive maintenance and performance tuning to keep your RetailManager running at peak efficiency.</p>
              <FeatureList>
                <li>Database optimization</li>
                <li>Integration health checks</li>
                <li>Custom reporting setup</li>
              </FeatureList>
            </CardContent>
          </ServiceCard>

          <ServiceCard delay="0.6s">
            <CardImage>
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Team support" 
              />
            </CardImage>
            <CardContent>
              <h3>Dedicated Team</h3>
              <p>Our Siem Reap-based specialists combine technical expertise with deep RetailManager knowledge.</p>
              <FeatureList>
                <li>Australia-facing support</li>
                <li>Bilingual technicians</li>
                <li>Cultural understanding</li>
              </FeatureList>
            </CardContent>
          </ServiceCard>
        </ServicesGrid>

        {/* STATS SECTION */}
        <SectionTitle>Our Performance Metrics</SectionTitle>
        <StatsContainer>
          <StatsGrid>
            <StatCard>
              <h3>24/7</h3>
              <p>Availability for critical issues</p>
            </StatCard>
            <StatCard>
              <h3>98%</h3>
              <p>First-contact resolution rate</p>
            </StatCard>
            <StatCard>
              <h3>15min</h3>
              <p>Average response time</p>
            </StatCard>
            <StatCard>
              <h3>500+</h3>
              <p>Systems supported annually</p>
            </StatCard>
          </StatsGrid>
        </StatsContainer>

        {/* PROCESS SECTION */}
        <SectionTitle>Our Support Process</SectionTitle>
        <ProcessContainer>
          <ProcessStep delay="0.2s">
            <StepNumber>1</StepNumber>
            <StepContent>
              <h4>Initial Contact</h4>
              <p>Reach us via phone, email, or our support portal. Our system automatically prioritizes your request based on urgency and impact to your business operations.</p>
            </StepContent>
          </ProcessStep>

          <ProcessStep delay="0.4s">
            <StepNumber>2</StepNumber>
            <StepContent>
              <h4>Diagnostic Analysis</h4>
              <p>We perform comprehensive remote diagnostics using advanced tools to quickly identify the root cause, whether it's software, hardware, or integration related.</p>
            </StepContent>
          </ProcessStep>

          <ProcessStep delay="0.6s">
            <StepNumber>3</StepNumber>
            <StepContent>
              <h4>Solution Implementation</h4>
              <p>After your approval, we implement the solution while maintaining full communication throughout the process, with options for after-hours support when needed.</p>
            </StepContent>
          </ProcessStep>

          <ProcessStep delay="0.8s">
            <StepNumber>4</StepNumber>
            <StepContent>
              <h4>Verification & Follow-up</h4>
              <p>We confirm the resolution with you and schedule any necessary follow-up to ensure continued stability, including optional training for your staff.</p>
            </StepContent>
          </ProcessStep>
        </ProcessContainer>
      </MainContainer>
    </>
  );
};

export default Support;