import React, { useState } from 'react';
import styled from 'styled-components';
import { useTranslation } from 'react-i18next';

// Styled Components
const FAQPage = styled.div`
  font-family: 'Montserrat', sans-serif;
  padding: 60px 20px;
  // background-color: #f9f9f9;
  color: #333;
  width: 80%;
  margin: 0 auto;
  max-width: 1200px;

  @media (max-width: 768px) {
    width: 95%; // On mobile devices, use 95% width
    padding: 40px 15px; // Adjust padding for smaller screens
  }
`;

const FAQSection = styled.div`
  background-color: #0f8abe;
  padding: 60px 20px;
  text-align: center;
  color: white;
  border-radius: 10px;
  margin-bottom: 60px;

  @media (max-width: 768px) {
    padding: 40px 15px; // Adjust padding for mobile
  }
`;

const SectionTitle = styled.h1`
font-weight:bold;
  font-size: 2.5rem;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 1.8rem; // Smaller font size for mobile
  }
`;

const SectionDescription = styled.p`
  font-size: 1.1rem;
  max-width: 700px;
  margin: 0 auto;

  @media (max-width: 768px) {
    font-size: 1rem; // Smaller font size for mobile
  }
`;

const FAQList = styled.div`
  margin-top: 40px;
`;

const FAQItem = styled.div`

  background: #fff;
  padding: 20px;
  margin: 10px 0;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 15px; // Adjust padding for mobile
  }
`;

const Question = styled.h3`
font-weight:bold;
  font-size: 1.2rem;
  color: #0f8abe;

  @media (max-width: 768px) {
    font-size: 1.1rem; // Smaller font size for mobile
  }
`;

const Answer = styled.p`
  font-size: 1.1rem;
  margin-top: 15px;
  display: ${props => (props.isActive ? 'block' : 'none')};

  @media (max-width: 768px) {
    font-size: 1rem; // Smaller font size for mobile
  }
`;

const FAQ = () => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleQuestion = (index) => {
    if (index === activeIndex) {
      setActiveIndex(null); // Close the active question
    } else {
      setActiveIndex(index); // Open the clicked question
    }
  };

  const faqData = [
    { 
      question: t('faqPage.questions.whatIsService.question'), 
      answer: t('faqPage.questions.whatIsService.answer')
    },
    { 
      question: t('faqPage.questions.contactSupport.question'), 
      answer: t('faqPage.questions.contactSupport.answer')
    },
    { 
      question: t('faqPage.questions.discounts.question'), 
      answer: t('faqPage.questions.discounts.answer')
    },
    { 
      question: t('faqPage.questions.refundPolicy.question'), 
      answer: t('faqPage.questions.refundPolicy.answer')
    },
    { 
      question: t('faqPage.questions.freeTrial.question'), 
      answer: t('faqPage.questions.freeTrial.answer')
    },
  ];

  return (
    <FAQPage>
      <FAQSection>
        <SectionTitle>{t('faqPage.hero.title')}</SectionTitle>
        <SectionDescription>
          {t('faqPage.hero.description')}
        </SectionDescription>
      </FAQSection>

      <FAQList>
        {faqData.map((item, index) => (
          <FAQItem key={index} onClick={() => toggleQuestion(index)}>
            <Question>{item.question}</Question>
            <Answer isActive={index === activeIndex}>{item.answer}</Answer>
          </FAQItem>
        ))}
      </FAQList>
    </FAQPage>
  );
};

export default FAQ;
