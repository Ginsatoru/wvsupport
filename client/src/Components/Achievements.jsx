import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import styled, { keyframes } from "styled-components";

const slideUp = keyframes`
  from { 
    opacity: 0; 
    transform: translateY(50px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const AchievementContainer = styled.section`
  padding: 90px 20px;
  text-align: center;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 10s ease infinite;
  overflow: hidden;
`;

const Title = styled.h2`
  font-size: 2.2rem;
  margin-bottom: 1rem;
  color: #0f8abe;
  font-weight: 800;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease-out;

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: #666;
  max-width: 800px;
  margin: 0 auto 30px;
  line-height: 1.6;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease-out 0.2s;

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }
`;

const AchievementsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const AchievementCard = styled.div`
  background: white;
  padding: 30px 20px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.4s ease-out;
  opacity: 0;

  &.visible {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  }

  &:nth-child(1) {
    transition-delay: 0.1s;
  }
  &:nth-child(2) {
    transition-delay: 0.2s;
  }
  &:nth-child(3) {
    transition-delay: 0.3s;
  }
  &:nth-child(4) {
    transition-delay: 0.4s;
  }
`;

const AchievementNumber = styled.div`
  font-size: 2.3rem;
  font-weight: 700;
  margin-bottom: 10px;
  background-color: #0f8abe;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const AchievementLabel = styled.p`
  font-size: 1.1rem;
  color: #7f8c8d;
  margin: 0;
`;

const AchievementsSection = () => {
  const { t } = useTranslation();
  const [counts, setCounts] = useState({
    years: 0,
    tickets: 0,
    clients: 0,
    businesses: 0,
  });

  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const cardRefs = useRef([]);

  const targetCounts = {
    years: 14,
    tickets: 4500,
    clients: 4200,
    businesses: 320,
  };

  const duration = 2000; // Animation duration in ms

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            animateCounts();

            // Add visible class to all elements
            if (titleRef.current) titleRef.current.classList.add("visible");
            if (subtitleRef.current)
              subtitleRef.current.classList.add("visible");
            cardRefs.current.forEach((card) => {
              if (card) card.classList.add("visible");
            });
          }
        });
      },
      { threshold: 0.2 } // Trigger when 20% of section is visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const animateCounts = () => {
    const startTime = Date.now();
    const endTime = startTime + duration;

    const updateCounts = () => {
      const now = Date.now();
      const progress = Math.min(1, (now - startTime) / duration);

      setCounts({
        years: Math.floor(progress * targetCounts.years),
        tickets: Math.floor(progress * targetCounts.tickets),
        clients: Math.floor(progress * targetCounts.clients),
        businesses: Math.floor(progress * targetCounts.businesses),
      });

      if (now < endTime) {
        requestAnimationFrame(updateCounts);
      } else {
        // Ensure we reach the exact target numbers
        setCounts(targetCounts);
      }
    };

    requestAnimationFrame(updateCounts);
  };

  // Function to add card refs
  const addToRefs = (el) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  return (
    <AchievementContainer ref={sectionRef}>
      <Title ref={titleRef}>{t("achievements.title")}</Title>
      <Subtitle ref={subtitleRef}>{t("achievements.subtitle")}</Subtitle>

      <AchievementsGrid>
        <AchievementCard ref={addToRefs}>
          <AchievementNumber>{counts.years}+</AchievementNumber>
          <AchievementLabel>{t("achievements.yearsLabel")}</AchievementLabel>
        </AchievementCard>

        <AchievementCard ref={addToRefs}>
          <AchievementNumber>
            {counts.tickets.toLocaleString()}
          </AchievementNumber>
          <AchievementLabel>{t("achievements.ticketsLabel")}</AchievementLabel>
        </AchievementCard>

        <AchievementCard ref={addToRefs}>
          <AchievementNumber>
            {counts.clients.toLocaleString()}+
          </AchievementNumber>
          <AchievementLabel>{t("achievements.clientsLabel")}</AchievementLabel>
        </AchievementCard>

        <AchievementCard ref={addToRefs}>
          <AchievementNumber>
            {counts.businesses.toLocaleString()}
          </AchievementNumber>
          <AchievementLabel>
            {t("achievements.businessesLabel")}
          </AchievementLabel>
        </AchievementCard>
      </AchievementsGrid>
    </AchievementContainer>
  );
};

export default AchievementsSection;
