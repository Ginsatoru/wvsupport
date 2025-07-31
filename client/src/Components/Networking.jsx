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
  padding: 2rem 1rem;

  @media (min-width: 768px) {
    padding: 4rem 2rem;
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
    padding: 4rem 2rem;
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
    padding: 3rem;
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
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
    padding: 4rem 2rem;
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

const NetworkingConnectivitySupport = () => {
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
                d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
              />
            </svg>
          </IconWrapper>
          <Title>Networking & Connectivity Support</Title>
          <Subtitle>
            Keep your POS system running smoothly with reliable network connections
          </Subtitle>
        </Header>

        <MainCard>
          <HeroSection>
            <SectionTitle>Stable Network Solutions</SectionTitle>
            <HeroText>
              Reliable POS operations depend on strong network connectivity. 
              We help diagnose and fix network-related issues affecting your 
              system's performance.
            </HeroText>
          </HeroSection>

          <ContentGrid>
            <Column>
              <SectionTitle style={{ color: colors.gray800, marginBottom: "1.25rem" }}>
                Our Network Services
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </BenefitIcon>
                  <BenefitContent>
                    <BenefitTitle>Network Diagnostics</BenefitTitle>
                    <BenefitDescription>
                      Comprehensive analysis of your network infrastructure
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
                        d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </BenefitIcon>
                  <BenefitContent>
                    <BenefitTitle>POS Network Optimization</BenefitTitle>
                    <BenefitDescription>
                      Configuration for optimal POS system performance
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
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </BenefitIcon>
                  <BenefitContent>
                    <BenefitTitle>Security Configuration</BenefitTitle>
                    <BenefitDescription>
                      Secure network setup to protect transaction data
                    </BenefitDescription>
                  </BenefitContent>
                </BenefitItem>
              </BenefitsList>
            </Column>

            <Column>
              <ProcessCard>
                <SectionTitle style={{ color: colors.gray800, marginBottom: "1.25rem" }}>
                  Troubleshooting Process
                </SectionTitle>
                <ProcessList>
                  <ProcessItem>
                    <ProcessStep>1</ProcessStep>
                    <BenefitContent>
                      <BenefitTitle>Issue Identification</BenefitTitle>
                      <BenefitDescription>
                        We pinpoint the exact network connectivity problem
                      </BenefitDescription>
                    </BenefitContent>
                  </ProcessItem>
                  <ProcessItem>
                    <ProcessStep>2</ProcessStep>
                    <BenefitContent>
                      <BenefitTitle>Remote Diagnostics</BenefitTitle>
                      <BenefitDescription>
                        Our team analyzes your network configuration remotely
                      </BenefitDescription>
                    </BenefitContent>
                  </ProcessItem>
                  <ProcessItem>
                    <ProcessStep>3</ProcessStep>
                    <BenefitContent>
                      <BenefitTitle>Solution Implementation</BenefitTitle>
                      <BenefitDescription>
                        We apply fixes for stable POS operations
                      </BenefitDescription>
                    </BenefitContent>
                  </ProcessItem>
                  <ProcessItem>
                    <ProcessStep>4</ProcessStep>
                    <BenefitContent>
                      <BenefitTitle>Prevention Guidance</BenefitTitle>
                      <BenefitDescription>
                        Recommendations to avoid future connectivity issues
                      </BenefitDescription>
                    </BenefitContent>
                  </ProcessItem>
                </ProcessList>
              </ProcessCard>
            </Column>
          </ContentGrid>

          <CTASection>
            <SectionTitle>Need Network Support?</SectionTitle>
            <HeroText style={{ marginBottom: "1.5rem" }}>
              Ensure uninterrupted POS operations with our connectivity expertise.
            </HeroText>
            <ButtonGroup>
              <PrimaryButton onClick={() => (window.location.href = "/Contact")}>
                Request Network Support
              </PrimaryButton>
              <SecondaryButton as="a"
                href="https://support.microsoft.com/en-au/windows/file-sharing-over-a-network-in-windows-b58704b2-f53a-4b82-7bc1-80f9994725bf"
                target="_blank">
                Learn About Network Requirements
              </SecondaryButton>
            </ButtonGroup>
          </CTASection>
        </MainCard>
      </MainContent>
    </Container>
  );
};

export default NetworkingConnectivitySupport;