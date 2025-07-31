import React from "react";
import styled from "styled-components";

// Colors
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

// Font family
const fontFamily = "Montserrat, sans-serif";

// Styled components
const Container = styled.div`
  min-height: 100vh;
  background-color: ${colors.gray100};
  font-family: ${fontFamily};
`;

const MainContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem 1rem;

  @media (min-width: 640px) {
    padding: 2rem 1.5rem;
  }

  @media (min-width: 1024px) {
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

  @media (min-width: 640px) {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  svg {
    width: 36px;
    height: 36px;

    @media (min-width: 640px) {
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

  @media (min-width: 640px) {
    font-size: 1.75rem;
  }

  @media (min-width: 768px) {
    font-size: 2rem;
  }

  @media (min-width: 1024px) {
    font-size: 2.25rem;
  }
`;

const Subtitle = styled.p`
  font-size: 0.9375rem;
  color: ${colors.gray600};
  max-width: 42rem;
  margin: 0 auto;
  line-height: 1.5;

  @media (min-width: 640px) {
    font-size: 1rem;
  }

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

  @media (min-width: 640px) {
    padding: 2.5rem 1.5rem;
  }

  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }

  @media (min-width: 1024px) {
    padding: 4rem 2rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  line-height: 1.3;

  @media (min-width: 640px) {
    font-size: 1.375rem;
  }

  @media (min-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.75rem;
  }
`;

const HeroText = styled.p`
  font-size: 0.9375rem;
  max-width: 56rem;
  margin: 0 auto;
  line-height: 1.5;

  @media (min-width: 640px) {
    font-size: 1rem;
  }

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

  @media (min-width: 1024px) {
    padding: 3rem;
    gap: 3rem;
  }
`;

const Column = styled.div``;

const BenefitsList = styled.ul`
  display: grid;
  gap: 1rem;

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

    @media (min-width: 640px) {
      width: 20px;
      height: 20px;
    }

    @media (min-width: 768px) {
      width: 24px;
      height: 24px;
    }
  }
`;

const BenefitContent = styled.div``;

const BenefitTitle = styled.h4`
  font-size: 0.9375rem;
  font-weight: 500;
  color: ${colors.gray800};
  line-height: 1.3;

  @media (min-width: 640px) {
    font-size: 1rem;
  }
`;

const BenefitDescription = styled.p`
  font-size: 0.8125rem;
  color: ${colors.gray600};
  margin-top: 0.25rem;
  line-height: 1.5;

  @media (min-width: 640px) {
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
  gap: 1rem;

  @media (min-width: 768px) {
    gap: 1.5rem;
  }
`;

const ProcessItem = styled.div`
  display: flex;
`;

const ProcessStep = styled.div`
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
  font-size: 0.875rem;

  @media (min-width: 640px) {
    height: 2.25rem;
    width: 2.25rem;
    font-size: 1rem;
  }

  @media (min-width: 768px) {
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

  @media (min-width: 640px) {
    padding: 2.5rem 1.5rem;
  }

  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }

  @media (min-width: 1024px) {
    padding: 4rem 2rem;
  }
`;

const Button = styled.button`
  padding: 0.625rem 1.5rem;
  font-weight: 700;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  font-size: 0.8125rem;

  @media (min-width: 640px) {
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
  }
`;

const PrimaryButton = styled(Button)`
  cursor: pointer;
  border: none;
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
  gap: 0.75rem;
  justify-content: center;
  margin-top: 1.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    gap: 1rem;
    margin-top: 2rem;
  }
`;

const RemoteTroubleshooting = () => {
  return (
    <Container>
      <MainContent>
        <Header>
          <IconWrapper>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke={colors.primary}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </IconWrapper>
          <Title>Remote Troubleshooting</Title>
          <Subtitle>
            Fast and efficient remote support to resolve issues without on-site
            visits
          </Subtitle>
        </Header>

        <MainCard>
          <HeroSection>
            <SectionTitle>Expert Remote Support</SectionTitle>
            <HeroText>
              We offer fast and efficient remote troubleshooting via TeamViewer
              to resolve software issues without on-site visits, ensuring
              minimal downtime for your business.
            </HeroText>
          </HeroSection>

          <ContentGrid>
            <Column>
              <SectionTitle
                style={{ color: colors.gray800, marginBottom: "1.25rem" }}
              >
                Our Remote Advantages
              </SectionTitle>
              <BenefitsList>
                <BenefitItem>
                  <BenefitIcon>
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke={colors.primary}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </BenefitIcon>
                  <BenefitContent>
                    <BenefitTitle>Rapid Response</BenefitTitle>
                    <BenefitDescription>
                      Immediate assistance with average response times under 15
                      minutes
                    </BenefitDescription>
                  </BenefitContent>
                </BenefitItem>
                <BenefitItem>
                  <BenefitIcon>
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke={colors.primary}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </BenefitIcon>
                  <BenefitContent>
                    <BenefitTitle>Secure Connection</BenefitTitle>
                    <BenefitDescription>
                      End-to-end encrypted sessions with full privacy protection
                    </BenefitDescription>
                  </BenefitContent>
                </BenefitItem>
                <BenefitItem>
                  <BenefitIcon>
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke={colors.primary}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2"
                      />
                    </svg>
                  </BenefitIcon>
                  <BenefitContent>
                    <BenefitTitle>Multi-Platform Support</BenefitTitle>
                    <BenefitDescription>
                      Windows, macOS, and Linux compatibility
                    </BenefitDescription>
                  </BenefitContent>
                </BenefitItem>
              </BenefitsList>
            </Column>

            <Column>
              <ProcessCard>
                <SectionTitle
                  style={{ color: colors.gray800, marginBottom: "1.25rem" }}
                >
                  How Remote Sessions Work
                </SectionTitle>
                <ProcessList>
                  <ProcessItem>
                    <ProcessStep>1</ProcessStep>
                    <BenefitContent>
                      <BenefitTitle>Initiate Session</BenefitTitle>
                      <BenefitDescription>
                        Contact us and provide brief details about your issue
                      </BenefitDescription>
                    </BenefitContent>
                  </ProcessItem>
                  <ProcessItem>
                    <ProcessStep>2</ProcessStep>
                    <BenefitContent>
                      <BenefitTitle>Share Access</BenefitTitle>
                      <BenefitDescription>
                        Run TeamViewer and share your session ID with our
                        technician
                      </BenefitDescription>
                    </BenefitContent>
                  </ProcessItem>
                  <ProcessItem>
                    <ProcessStep>3</ProcessStep>
                    <BenefitContent>
                      <BenefitTitle>Real-Time Resolution</BenefitTitle>
                      <BenefitDescription>
                        Our expert diagnoses and fixes the issue while you watch
                      </BenefitDescription>
                    </BenefitContent>
                  </ProcessItem>
                  <ProcessItem>
                    <ProcessStep>4</ProcessStep>
                    <BenefitContent>
                      <BenefitTitle>Verification</BenefitTitle>
                      <BenefitDescription>
                        We confirm the solution and provide prevention tips
                      </BenefitDescription>
                    </BenefitContent>
                  </ProcessItem>
                </ProcessList>
              </ProcessCard>
            </Column>
          </ContentGrid>

          <CTASection>
            <SectionTitle>Ready for Instant Support?</SectionTitle>
            <HeroText style={{ marginBottom: "1.5rem" }}>
              Minimize downtime with our expert remote troubleshooting services.
            </HeroText>
            <ButtonGroup>
              <PrimaryButton
                as="a"
                href="https://www.teamviewer.com/en-au/download/free-download-with-license-options/?utm_source=google&utm_medium=cpc&utm_campaign=au%7Cb%7Cpr%7C22%7Cjun%7Ctv-core-brand-only-exact-sn%7Cfree%7Ct0%7C0&utm_content=Exact&utm_term=teamviewer"
                target="_blank"
              >
                Start Remote Session
              </PrimaryButton>
              <SecondaryButton
                as="a"
                href="https://www.teamviewer.com/en-au/enterprise/?utm_source=google&utm_medium=cpc&utm_campaign=au%7Cb%7Cpr%7C22%7Cjun%7Ctv-core-brand-only-exact-sn%7Cfree%7Ct0%7C0&utm_content=Exact&utm_term=teamviewer"
                target="_blank"
              >
                Learn More About TeamViewer
              </SecondaryButton>
            </ButtonGroup>
          </CTASection>
        </MainCard>
      </MainContent>
    </Container>
  );
};

export default RemoteTroubleshooting;