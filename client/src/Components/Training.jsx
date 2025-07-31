import React from "react";
import styled from "styled-components";

const colors = {
  primary: "#0f8abe",
  primaryLight: "#e6f4fa",
  primaryDark: "#0c6e95",
  white: "#ffffff",
  gray100: "#f8f9fa",
  gray200: "#e9ecef",
  gray600: "#6c757d",
  gray800: "#343a40",
  blue100: "#d1e7f7",
};

const fontFamily = "Montserrat, sans-serif";

const Container = styled.div`
  min-height: 100vh;
  background-color: ${colors.gray100};
  font-family: ${fontFamily};
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1rem;

  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    margin-bottom: 3rem;
  }
`;

const IconWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: ${colors.blue100};
  padding: 0.75rem;
  border-radius: 9999px;
  margin-bottom: 1rem;

  svg {
    width: 36px;
    height: 36px;
  }

  @media (min-width: 768px) {
    padding: 1rem;
    margin-bottom: 1.5rem;

    svg {
      width: 48px;
      height: 48px;
    }
  }
`;

const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${colors.gray800};
  margin-bottom: 0.5rem;
  line-height: 1.3;

  @media (min-width: 768px) {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }
`;

const Subtitle = styled.p`
  font-size: 0.9375rem;
  color: ${colors.gray600};
  max-width: 42rem;
  margin: 0 auto;
  line-height: 1.5;

  @media (min-width: 768px) {
    font-size: 1.125rem;
  }
`;

const MainCard = styled.div`
  background-color: ${colors.white};
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    border-radius: 1rem;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    margin-bottom: 3rem;
  }
`;

const HeroSection = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: ${colors.white};
  background-color: ${colors.primary};

  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  line-height: 1.3;

  @media (min-width: 768px) {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }
`;

const HeroText = styled.p`
  font-size: 0.9375rem;
  max-width: 56rem;
  margin: 0 auto;
  line-height: 1.5;

  @media (min-width: 768px) {
    font-size: 1.125rem;
  }
`;

const ContentGrid = styled.div`
  padding: 1.5rem;
  display: grid;
  gap: 1.5rem;

  @media (min-width: 768px) {
    padding: 2rem;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
`;

const Column = styled.div``;

const BenefitsList = styled.ul`
  display: grid;
  gap: 1.25rem;

  @media (min-width: 768px) {
    gap: 1.5rem;
  }
`;

const BenefitItem = styled.li`
  display: flex;
  align-items: flex-start;
`;

const BenefitIcon = styled.div`
  flex-shrink: 0;
  background-color: ${colors.blue100};
  padding: 0.5rem;
  border-radius: 50%;
  margin-right: 0.75rem;

  svg {
    width: 18px;
    height: 18px;
  }

  @media (min-width: 768px) {
    margin-right: 1rem;
    
    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

const BenefitContent = styled.div``;

const BenefitTitle = styled.h4`
  font-weight: 500;
  font-size: 0.9375rem;
  color: ${colors.gray800};
  line-height: 1.4;

  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const BenefitDescription = styled.p`
  font-size: 0.8125rem;
  color: ${colors.gray600};
  margin-top: 0.25rem;
  line-height: 1.5;

  @media (min-width: 768px) {
    font-size: 0.875rem;
  }
`;

const ProcessCard = styled.div`
  background-color: ${colors.gray100};
  padding: 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid ${colors.gray200};

  @media (min-width: 768px) {
    padding: 1.5rem;
    border-radius: 0.75rem;
  }
`;

const ProcessList = styled.div`
  display: grid;
  gap: 1.25rem;

  @media (min-width: 768px) {
    gap: 1.5rem;
  }
`;

const ProcessItem = styled.div`
  display: flex;
`;

const ProcessStep = styled.div`
  font-size: 0.8125rem;
  flex-shrink: 0;
  color: ${colors.white};
  font-weight: 700;
  border-radius: 9999px;
  height: 2rem;
  width: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  background-color: ${colors.primary};

  @media (min-width: 768px) {
    font-size: 0.875rem;
    height: 2.5rem;
    width: 2.5rem;
    margin-right: 1rem;
  }
`;

const CTASection = styled.div`
  padding: 2rem 1rem;
  text-align: center;
  color: ${colors.white};
  background-color: ${colors.primary};

  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }
`;

const Button = styled.button`
  font-size: 0.875rem;
  padding: 0.75rem 1.5rem;
  font-weight: 700;
  border-radius: 0.5rem;
  transition: all 0.2s ease;
  width: 100%;
  
  @media (min-width: 640px) {
    width: auto;
    padding: 0.75rem 2rem;
  }
`;

const PrimaryButton = styled(Button)`
  border: none;
  cursor: pointer;
  background-color: ${colors.white};
  color: ${colors.primary};

  &:hover {
    background-color: ${colors.gray100};
  }
`;

const SecondaryButton = styled(Button)`
  cursor: pointer;
  background-color: transparent;
  border: 2px solid ${colors.white};
  color: ${colors.white};

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: center;

  @media (min-width: 640px) {
    flex-direction: row;
  }
`;

const CustomerAssistanceTraining = () => {
  return (
    <Container>
      <MainContent>
        <Header>
          <IconWrapper>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              fill="none"
              viewBox="0 0 24 24"
              stroke={colors.primary}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </IconWrapper>
          <Title>Customer Assistance & Training</Title>
          <Subtitle>
            Expert guidance and training for your RetailManager POS system
          </Subtitle>
        </Header>

        <MainCard>
          <HeroSection>
            <SectionTitle>Local Support Expertise</SectionTitle>
            <HeroText>
              Our Siem Reap-based support staff is available to answer calls,
              provide guidance, and train your team on RetailManager POS best
              practices.
            </HeroText>
          </HeroSection>

          <ContentGrid>
            <Column>
              <SectionTitle
                style={{ color: colors.gray800, marginBottom: "1.25rem" }}
              >
                Support Services
              </SectionTitle>
              <BenefitsList>
                <BenefitItem>
                  <BenefitIcon>
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke={colors.primary}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </BenefitIcon>
                  <BenefitContent>
                    <BenefitTitle>Phone Support</BenefitTitle>
                    <BenefitDescription>
                      Immediate assistance from our local support team
                    </BenefitDescription>
                  </BenefitContent>
                </BenefitItem>
                <BenefitItem>
                  <BenefitIcon>
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke={colors.primary}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                      />
                    </svg>
                  </BenefitIcon>
                  <BenefitContent>
                    <BenefitTitle>On-Site Training</BenefitTitle>
                    <BenefitDescription>
                      Hands-on sessions at your business location
                    </BenefitDescription>
                  </BenefitContent>
                </BenefitItem>
                <BenefitItem>
                  <BenefitIcon>
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke={colors.primary}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                      />
                    </svg>
                  </BenefitIcon>
                  <BenefitContent>
                    <BenefitTitle>User Manuals</BenefitTitle>
                    <BenefitDescription>
                      Comprehensive documentation for all features
                    </BenefitDescription>
                  </BenefitContent>
                </BenefitItem>
                <BenefitItem>
                  <BenefitIcon>
                    <svg
                      width="24"
                      height="24"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke={colors.primary}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </BenefitIcon>
                  <BenefitContent>
                    <BenefitTitle>Video Tutorials</BenefitTitle>
                    <BenefitDescription>
                      Step-by-step video guides for visual learners
                    </BenefitDescription>
                  </BenefitContent>
                </BenefitItem>
              </BenefitsList>
            </Column>

            <Column>
              <SectionTitle
                style={{ color: colors.gray800, marginBottom: "1.25rem" }}
              >
                Training Process
              </SectionTitle>
              <ProcessCard>
                <ProcessList>
                  <ProcessItem>
                    <ProcessStep>1</ProcessStep>
                    <div>
                      <BenefitTitle>Initial Assessment</BenefitTitle>
                      <BenefitDescription>
                        We evaluate your team's current knowledge and needs
                      </BenefitDescription>
                    </div>
                  </ProcessItem>
                  <ProcessItem>
                    <ProcessStep>2</ProcessStep>
                    <div>
                      <BenefitTitle>Customized Training Plan</BenefitTitle>
                      <BenefitDescription>
                        Tailored sessions based on your business requirements
                      </BenefitDescription>
                    </div>
                  </ProcessItem>
                  <ProcessItem>
                    <ProcessStep>3</ProcessStep>
                    <div>
                      <BenefitTitle>Hands-on Practice</BenefitTitle>
                      <BenefitDescription>
                        Practical exercises with your actual POS setup
                      </BenefitDescription>
                    </div>
                  </ProcessItem>
                  <ProcessItem>
                    <ProcessStep>4</ProcessStep>
                    <div>
                      <BenefitTitle>Follow-up Support</BenefitTitle>
                      <BenefitDescription>
                        Additional assistance after initial training
                      </BenefitDescription>
                    </div>
                  </ProcessItem>
                </ProcessList>
              </ProcessCard>
            </Column>
          </ContentGrid>

          <CTASection>
            <SectionTitle>Ready to Get Started?</SectionTitle>
            <HeroText style={{ marginBottom: "1.5rem" }}>
              Contact our support team today to schedule your training session
            </HeroText>
            <ButtonGroup>
              <PrimaryButton
                onClick={() => (window.location.href = "/Contact")}
              >
                Call Support Team
              </PrimaryButton>
              <SecondaryButton as="a" href="mailto:wvsservicescambodia@gmail.com">
                Email Training Request
              </SecondaryButton>
            </ButtonGroup>
          </CTASection>
        </MainCard>
      </MainContent>
    </Container>
  );
};

export default CustomerAssistanceTraining;