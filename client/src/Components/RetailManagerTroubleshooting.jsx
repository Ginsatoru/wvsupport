import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import IT from "./Images/IT.png";

const Container = styled.section`
  display: flex;
  justify-content: center;
  min-height: 70vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8eb 100%);
  padding: 2rem 1rem;
  box-sizing: border-box;
`;

const PageSize = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 95%; /* Increased width for mobile */
  max-width: 1500px;
  margin: 0 auto;
  gap: 2rem;
  padding: 0 1rem;

  @media (min-width: 768px) {
    flex-direction: row;
    gap: 3rem;
    padding: 0;
    width: 85%; /* Default width for larger screens */
  }

  @media (max-width: 480px) {
    width: 100%; /* Increased width for smaller screens */
    padding: 0 0.5rem; /* Reduced padding for mobile */
  }
`;

const Left = styled.div`
  width: 100%;

  @media (min-width: 768px) {
    width: 50%;
  }

  @media (max-width: 480px) {
    width: 100%; /* Ensure full width for mobile */
  }
`;

const Right = styled.div`
  width: 100%;

  @media (min-width: 768px) {
    width: 50%;
    padding-left: 2rem;
  }

  @media (max-width: 480px) {
    width: 100%; /* Ensure full width for mobile */
    padding-left: 0; /* Remove padding for mobile */
  }
`;

const ImageContainer = styled.div`
  height: 400px;
  position: relative;
  width: 100%;
  max-width: 800px;
  border-radius: 8px;
  overflow: hidden;
  margin: 0 auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  aspect-ratio: 16/9;

  &:hover img {
    transform: scale(1.03);
  }

  &:hover div {
    opacity: 1;
  }

  @media (max-width: 480px) {
    aspect-ratio: 4/3;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;
`;

const HoverText = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 138, 190, 0.85);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  padding: 1.5rem;
  text-align: center;
`;

const Title = styled.h1`
  margin-bottom: 1rem;
  color: #0f8abe;
  font-size: clamp(12px, 1vw, 14px);
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-weight: 600;
`;

const Subtitle = styled.h3`
  margin-bottom: 1.5rem;
  color: #52514a;
  font-size: clamp(2px, 1vw, 2px);
  line-height: 1.3;
  font-weight: 600;

  @media (min-width: 640px) {
    font-size: clamp(30px, 4vw, 36px);
  }

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const Paragraph = styled.p`
  margin-bottom: 1.5rem;
  color: #52514a;
  font-size: clamp(16px, 2vw, 18px);
  line-height: 1.7;

  @media (min-width: 768px) and (max-width: 1024px) {
    font-size: 15px;
  }

  @media (max-width: 480px) {
    font-size: 15px;
  }
`;

const ExploreMore = styled.h2`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #0f8abe;
  font-size: clamp(16px, 2.5vw, 18px);
  cursor: pointer;
  position: relative;
  padding-bottom: 2px;
  margin-top: 1rem;
  transition: color 0.3s ease;
  font-weight: 600;

  &:hover {
    color: #0c6e94;
  }

  &::after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 1px;
    background-color: #0f8abe;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }

  .arrow {
    display: inline-block;
    transition: transform 0.3s ease;
  }

  &:hover .arrow {
    transform: translateX(5px);
  }
`;

const RetailManagerTroubleshooting = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <Container>
      <PageSize>
        <Left>
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <ImageContainer>
              <Image src={IT} alt={t('retailManager.imageAlt')} />
              <HoverText>
                <h4>{t('retailManager.hoverTitle')}</h4>
                <h5>{t('retailManager.hoverSubtitle')}</h5>
              </HoverText>
            </ImageContainer>
          </motion.div>
        </Left>

        <Right>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            <Title>{t('retailManager.title')}</Title>
            <Subtitle>{t('retailManager.subtitle')}</Subtitle>
            <Paragraph>
              {t('retailManager.description')}
            </Paragraph>
            <ExploreMore onClick={() => navigate("/retailmanager")}>
              {t('retailManager.exploreMore')} <span className="arrow">➔</span>
            </ExploreMore>
          </motion.div>
        </Right>
      </PageSize>
    </Container>
  );
};

export default RetailManagerTroubleshooting;
