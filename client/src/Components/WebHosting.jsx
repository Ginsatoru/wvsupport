import React from "react";
import styled from "styled-components";
import {
  FiServer,
  FiZap,
  FiCloud,
  FiShield,
  FiCheckCircle,
} from "react-icons/fi";
import HostingImage from './Images/Hosting.png';

const WebHostingPage = () => {
  return (
    <HostingPageContainer>
      {/* Hero Section */}
      <HostingHero>
        <HeroContent>
          <HeroTitle>Web Hosting Solutions</HeroTitle>
          <HeroSubtitle>
            Reliable, secure, and high-performance hosting tailored to your
            business needs
          </HeroSubtitle>
          <HostingBenefits>
            <BenefitItem>
              <FiCheckCircle /> 99.99% Uptime Guarantee
            </BenefitItem>
            <BenefitItem>
              <FiCheckCircle /> 24/7 Server Monitoring
            </BenefitItem>
            <BenefitItem>
              <FiCheckCircle /> Free SSL Certificates
            </BenefitItem>
          </HostingBenefits>
        </HeroContent>
        <HostingIllustration>
          <img src={HostingImage} alt="Hosting Illustration" className="hosting-mockup" />
        </HostingIllustration>
      </HostingHero>

      {/* Packages Section */}
      <PackagesSection>
        <SectionTitle>Hosting Implementation Packages</SectionTitle>
        <SectionSubtitle>
          Choose the perfect hosting solution for your website or application
        </SectionSubtitle>

        <PackagesGrid>
          {/* Starter Hosting */}
         <PackagesGrid>
  {/* Starter Hosting */}
  <HostingPackage>
    <PackageHeader>
      <PackageIcon>
        <FiServer />
      </PackageIcon>
      <PackageName>Starter Hosting</PackageName>
      <PackagePrice>$9.99<small>/month</small></PackagePrice>
      <PackageDescription>
        Perfect for small websites and personal blogs
      </PackageDescription>
    </PackageHeader>
    <PackageFeatures>
      <li><FiCheckCircle /> 1 Website</li>
      <li><FiCheckCircle /> 10 GB SSD Storage</li>
      <li><FiCheckCircle /> Free SSL Certificate</li>
      <li><FiCheckCircle /> 5 Email Accounts</li>
      <li><FiCheckCircle /> cPanel Access</li>
      <li><FiCheckCircle /> 24/7 Support</li>
    </PackageFeatures>
    <PackageButton>Get Started</PackageButton>
  </HostingPackage>

  {/* Advanced Hosting */}
  <HostingPackage highlighted>
    <PopularBadge>Most Popular</PopularBadge>
    <PackageHeader>
      <PackageIcon>
        <FiZap />
      </PackageIcon>
      <PackageName>Advanced Hosting</PackageName>
      <PackagePrice>$24.99<small>/month</small></PackagePrice>
      <PackageDescription>Optimized VPS for growing businesses</PackageDescription>
    </PackageHeader>
    <PackageFeatures>
      <li><FiCheckCircle /> Up to 5 Websites</li>
      <li><FiCheckCircle /> 50 GB SSD Storage</li>
      <li><FiCheckCircle /> Free Domain (1st year)</li>
      <li><FiCheckCircle /> Managed VPS Environment</li>
      <li><FiCheckCircle /> Daily Backups</li>
      <li><FiCheckCircle /> Enhanced Security & Firewall</li>
    </PackageFeatures>
    <PackageButton>Get Started</PackageButton>
  </HostingPackage>

  {/* Enterprise Hosting */}
  <HostingPackage>
    <PackageHeader>
      <PackageIcon>
        <FiCloud />
      </PackageIcon>
      <PackageName>Enterprise Hosting</PackageName>
      <PackagePrice>$59.99<small>/month</small></PackagePrice>
      <PackageDescription>
        Enterprise-grade cloud hosting with maximum scalability
      </PackageDescription>
    </PackageHeader>
    <PackageFeatures>
      <li><FiCheckCircle /> Unlimited Websites</li>
      <li><FiCheckCircle /> 200 GB NVMe Storage</li>
      <li><FiCheckCircle /> Priority Support</li>
      <li><FiCheckCircle /> Load Balancing & Auto Scaling</li>
      <li><FiCheckCircle /> Dedicated IP & Resources</li>
      <li><FiCheckCircle /> 99.99% Uptime SLA</li>
    </PackageFeatures>
    <PackageButton>Get Started</PackageButton>
  </HostingPackage>
</PackagesGrid>

        </PackagesGrid>

        {/* Ongoing Support */}
        <SupportOption>
          <SupportIcon>
            <FiShield />
          </SupportIcon>
          <SupportContent>
            <SupportTitle>
              Ongoing Support: 15–30% of project cost per year
            </SupportTitle>
            <SupportDescription>
              Includes server monitoring, updates, backups, and technical
              support to keep your hosting environment running smoothly
            </SupportDescription>
          </SupportContent>
        </SupportOption>
      </PackagesSection>

      {/* Features Section */}
      <FeaturesSection>
  <SectionTitle>Our Hosting Features</SectionTitle>
  <SectionSubtitle>
    Powerful tools and support built to grow your website
  </SectionSubtitle>

  <FeaturesGrid>
    <FeatureCard>
      <FeatureIcon>
        <FiCheckCircle />
      </FeatureIcon>
      <FeatureTitle>Ultra-Fast Performance</FeatureTitle>
      <FeatureDesc>
        NVMe SSD storage and global CDN ensure your website loads instantly.
      </FeatureDesc>
    </FeatureCard>

    <FeatureCard>
      <FeatureIcon>
        <FiCheckCircle />
      </FeatureIcon>
      <FeatureTitle>Advanced Security</FeatureTitle>
      <FeatureDesc>
        Daily malware scans, free SSL, DDoS protection, and firewalls included.
      </FeatureDesc>
    </FeatureCard>

    <FeatureCard>
      <FeatureIcon>
        <FiCheckCircle />
      </FeatureIcon>
      <FeatureTitle>One-Click Scalability</FeatureTitle>
      <FeatureDesc>
        Upgrade CPU, RAM, and bandwidth instantly as your site grows.
      </FeatureDesc>
    </FeatureCard>

    <FeatureCard>
      <FeatureIcon>
        <FiCheckCircle />
      </FeatureIcon>
      <FeatureTitle>24/7 Expert Support</FeatureTitle>
      <FeatureDesc>
        Friendly, fast, and knowledgeable tech support available anytime.
      </FeatureDesc>
    </FeatureCard>
  </FeaturesGrid>
</FeaturesSection>


      {/* CTA Section */}
      <HostingCta>
        <CtaContent>
          <CtaTitle>Need Help Choosing a Hosting Solution?</CtaTitle>
          <CtaSubtitle>
            Our hosting experts will analyze your needs and recommend the
            perfect setup
          </CtaSubtitle>
          <CtaButton onClick={() => window.location.href = '/contact'}>Get a Free Hosting Consultation</CtaButton>
        </CtaContent>
      </HostingCta>
    </HostingPageContainer>
  );
};

// Styled Components
const HostingPageContainer = styled.div`
  font-family: "Montserrat", sans-serif;
  color: #1a1a2e;
  line-height: 1.6;
  margin: 0 auto;
`;

const HostingHero = styled.section`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5rem 0;
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

const HostingBenefits = styled.div`
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

const HostingIllustration = styled.div`
  position: relative;
  width: 50%;
  padding: 2rem;

  .hosting-mockup {
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

const PackagesSection = styled.section`
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
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const PackagesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const HostingPackage = styled.div`
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

const PackageHeader = styled.div`
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e4e8eb;
  text-align: center;
`;

const PackageIcon = styled.div`
display:flex;
align-items:center;
justify-content:center;
  font-size: 2.5rem;
  color: #0f8abe;
  margin-bottom: 0.5rem;
`;

const PackageName = styled.h3`
font-weight:bold;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #1a1a2e;
`;

const PackagePrice = styled.div`
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

const PackageDescription = styled.p`
  color: #52514a;
  font-size: 0.9rem;
`;

const PackageFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 1rem 0;
  text-align: left;
  flex-grow: 1;

  li {
    padding: 0.4rem 0;
    display: flex;
    align-items: center;
    color: #52514a;
    gap: 0.5rem;
  }

  svg {
    color: #0f8abe;
  }
`;

const PackageButton = styled.button`
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

const SupportOption = styled.div`
  max-width: 800px;
  margin: 3rem auto 0;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  background: rgba(15, 138, 190, 0.05);
  border: 1px solid rgba(15, 138, 190, 0.2);
  border-radius: 12px;
  padding: 2rem;
  text-align: left;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const SupportIcon = styled.div`
  font-size: 2.5rem;
  color: #0f8abe;
  flex-shrink: 0;

  @media (max-width: 768px) {
    margin-bottom: 1rem;
  }
`;

const SupportContent = styled.div`
  flex-grow: 1;
`;

const SupportTitle = styled.h3`
font-weight:bold;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: #1a1a2e;
`;

const SupportDescription = styled.p`
  color: #52514a;
  margin-bottom: 0;
`;

const FeaturesSection = styled.section`
  padding: 4rem 1rem;
  text-align: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 3rem auto 0;
`;

const FeatureCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  color: #0f8abe;
  margin-bottom: 1rem;
  display:flex;
  justify-content:center;
`;

const FeatureTitle = styled.h3`
  font-size: 1.3rem;
  margin-bottom: 0.8rem;
  color: #1a1a2e;
  font-weight:bold;
`;

const FeatureDesc = styled.p`
  color: #52514a;
  margin-bottom: 0;
  font-size:1.2rem;
`;

const HostingCta = styled.section`
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

export default WebHostingPage;