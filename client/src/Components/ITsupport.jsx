import React from "react";
import {
  FaDesktop,
  FaDownload,
  FaTachometerAlt,
  FaNetworkWired,
  FaEnvelope,
  FaShieldAlt,
  FaDatabase,
  FaPrint,
} from "react-icons/fa";
import styled from "styled-components";
import PlanCards from "./PlanCards";

const ServicesSection = styled.section`
  padding: 4rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled.h2`
  font-size: 2.5rem;
  color: #0f8abe;
  margin-bottom: 1.8rem;
  font-weight: 700;
  position: relative;
  display: inline-block;

  &:after {
    content: "";
    position: absolute;
    width: 50%;
    height: 4px;

    bottom: -10px;
    left: 25%;
    border-radius: 2px;
  }

  @media (max-width: 768px) {
    font-size: 2rem; /* Smaller font size for tablets */
  }

  @media (max-width: 576px) {
    font-size: 1.8rem; /* Even smaller font size for mobile */
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #7f8c8d;
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ServicesGrid = styled.div`
  margin-top: -2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
`;

const ServiceCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  }
`;

const ServiceIcon = styled.div`
  font-size: 2.5rem;
  color: #3498db;
  margin-bottom: 1.5rem;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
  background: rgba(52, 152, 219, 0.1);
  border-radius: 50%;
`;

const ServiceTitle = styled.h3`
font-weight:bold;
  font-size: 1.3rem;
  color: #2c3e50;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.2rem; /* Smaller font size for tablets */
  }

  @media (max-width: 576px) {
    font-size: 1rem; /* Even smaller font size for mobile */
  }
`;

const ServiceDescription = styled.p`
  color: #7f8c8d;
  line-height: 1.6;
  font-size: 0.95rem;
`;

const ITSupport = () => {
  const services = [
    {
      icon: <FaDesktop />,
      title: "Remote troubleshooting",
      description:
        "Quick and secure remote problem resolution. Our experts can diagnose and fix issues remotely, ensuring minimal downtime for your business.",
    },
    {
      icon: <FaDownload />,
      title: "Software installation",
      description:
        "We handle updates, patch management, and software installations to keep your systems running the latest and most secure versions.",
    },
    {
      icon: <FaTachometerAlt />,
      title: "System optimization",
      description:
        "Performance tuning for your systems to ensure they operate efficiently, reducing lag and improving productivity.",
    },
    {
      icon: <FaNetworkWired />,
      title: "Network support",
      description:
        "Connectivity and configuration assistance to maintain a stable and secure network for your business operations.",
    },
    {
      icon: <FaEnvelope />,
      title: "Email systems",
      description:
        "Setup and troubleshooting for email systems, ensuring seamless communication and secure email delivery.",
    },
    {
      icon: <FaShieldAlt />,
      title: "Security checks",
      description:
        "Comprehensive antivirus and malware protection to safeguard your systems from potential threats and vulnerabilities.",
    },
    {
      icon: <FaDatabase />,
      title: "Data backup",
      description:
        "Reliable data backup and recovery solutions to protect your critical business information and ensure continuity.",
    },
    {
      icon: <FaPrint />,
      title: "Peripheral support",
      description:
        "Support for printers, scanners, and other devices to ensure smooth operation and integration with your systems.",
    },
    {
      icon: <FaNetworkWired />,
      title: "Cloud integration",
      description:
        "Seamless integration and support for cloud services, enabling secure access and collaboration from anywhere.",
    },
  ];

  return (
    <>
      <ServicesSection id="services">
        <Container>
          <Header>
            <Title>Our IT Support Services</Title>
            <Subtitle>
              We specialize in remote IT support, allowing us to quickly and
              securely access your systems, diagnose problems, and deliver fast
              solutions — no matter where you are.
            </Subtitle>
          </Header>
          <ServicesGrid>
            {services.map((service, index) => (
              <ServiceCard key={index}>
                <ServiceIcon>{service.icon}</ServiceIcon>
                <ServiceTitle>{service.title}</ServiceTitle>
                <ServiceDescription>{service.description}</ServiceDescription>
              </ServiceCard>
            ))}
          </ServicesGrid>
        </Container>
      </ServicesSection>
      <PlanCards />
    </>
  );
};

export default ITSupport;
