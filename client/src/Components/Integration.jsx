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

// Breakpoints
const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
};

// Styled components
const Container = styled.div`
  min-height: 100vh;
  background-color: ${colors.gray100};
  font-family: ${fontFamily};
`;

const MainContent = styled.div`
  width: 100%;
  margin: 0 auto;
  padding: 1.5rem 1rem;

  @media (min-width: ${breakpoints.sm}) {
    padding: 2rem 1.5rem;
  }

  @media (min-width: ${breakpoints.md}) {
    padding: 3rem 2rem;
    max-width: 1200px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;

  @media (min-width: ${breakpoints.md}) {
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

  @media (min-width: ${breakpoints.md}) {
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  svg {
    width: 32px;
    height: 32px;

    @media (min-width: ${breakpoints.md}) {
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
  line-height: 1.2;

  @media (min-width: ${breakpoints.sm}) {
    font-size: 1.75rem;
  }

  @media (min-width: ${breakpoints.md}) {
    font-size: 2rem;
    margin-bottom: 0.75rem;
  }
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: ${colors.gray600};
  max-width: 42rem;
  margin: 0 auto;
  line-height: 1.5;

  @media (min-width: ${breakpoints.sm}) {
    font-size: 1rem;
  }

  @media (min-width: ${breakpoints.md}) {
    font-size: 1.125rem;
  }
`;

const MainCard = styled.div`
  background-color: ${colors.white};
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 2rem;

  @media (min-width: ${breakpoints.md}) {
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

  @media (min-width: ${breakpoints.md}) {
    padding: 3rem 2rem;
  }

  @media (min-width: ${breakpoints.lg}) {
    padding: 4rem 2rem;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  line-height: 1.3;

  @media (min-width: ${breakpoints.sm}) {
    font-size: 1.5rem;
  }

  @media (min-width: ${breakpoints.md}) {
    font-size: 1.75rem;
    margin-bottom: 1rem;
  }
`;

const HeroText = styled.p`
  font-size: 0.875rem;
  max-width: 56rem;
  margin: 0 auto;
  line-height: 1.5;

  @media (min-width: ${breakpoints.sm}) {
    font-size: 1rem;
  }

  @media (min-width: ${breakpoints.md}) {
    font-size: 1.125rem;
  }
`;

const ContentGrid = styled.div`
  padding: 1.5rem;
  display: grid;
  gap: 1.5rem;

  @media (min-width: ${breakpoints.md}) {
    padding: 2rem;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  @media (min-width: ${breakpoints.lg}) {
    padding: 3rem;
    gap: 3rem;
  }
`;

const Column = styled.div``;

const BenefitsList = styled.ul`
  display: grid;
  gap: 1.25rem;

  @media (min-width: ${breakpoints.md}) {
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
    width: 16px;
    height: 16px;

    @media (min-width: ${breakpoints.sm}) {
      width: 20px;
      height: 20px;
    }

    @media (min-width: ${breakpoints.md}) {
      width: 24px;
      height: 24px;
    }
  }
`;

const BenefitContent = styled.div``;

const BenefitTitle = styled.h4`
  font-weight: 500;
  font-size: 0.875rem;
  color: ${colors.gray800};
  line-height: 1.4;

  @media (min-width: ${breakpoints.sm}) {
    font-size: 1rem;
  }
`;

const BenefitDescription = styled.p`
  font-size: 0.75rem;
  color: ${colors.gray600};
  margin-top: 0.25rem;
  line-height: 1.4;

  @media (min-width: ${breakpoints.sm}) {
    font-size: 0.875rem;
  }
`;

const ProcessCard = styled.div`
  background-color: ${colors.gray100};
  padding: 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid ${colors.gray200};

  @media (min-width: ${breakpoints.md}) {
    padding: 1.5rem;
    border-radius: 0.75rem;
  }
`;

const ProcessList = styled.div`
  display: grid;
  gap: 1.25rem;

  @media (min-width: ${breakpoints.md}) {
    gap: 1.5rem;
  }
`;

const ProcessItem = styled.div`
  display: flex;
`;

const ProcessStep = styled.div`
  font-size: 0.75rem;
  flex-shrink: 0;
  color: ${colors.white};
  font-weight: 700;
  border-radius: 9999px;
  height: 1.75rem;
  width: 1.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.75rem;
  background-color: ${colors.primary};

  @media (min-width: ${breakpoints.sm}) {
    height: 2rem;
    width: 2rem;
    font-size: 0.875rem;
  }

  @media (min-width: ${breakpoints.md}) {
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

  @media (min-width: ${breakpoints.md}) {
    padding: 3rem 2rem;
  }

  @media (min-width: ${breakpoints.lg}) {
    padding: 4rem 2rem;
  }
`;

const Button = styled.button`
  font-size: 0.75rem;
  padding: 0.5rem 1.25rem;
  font-weight: 700;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  line-height: 1.5;

  @media (min-width: ${breakpoints.sm}) {
    font-size: 0.875rem;
    padding: 0.75rem 1.5rem;
  }

  @media (min-width: ${breakpoints.md}) {
    padding: 0.75rem 2rem;
    border-radius: 0.5rem;
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
  gap: 0.75rem;
  justify-content: center;

  @media (min-width: ${breakpoints.sm}) {
    flex-direction: row;
    gap: 1rem;
  }
`;

const ThirdPartyIntegrations = () => {
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
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
              />
            </svg>
          </IconWrapper>
          <Title>Third-Party Integrations</Title>
          <Subtitle>
            Enhance your RetailManager POS with powerful third-party connections
          </Subtitle>
        </Header>

        <MainCard>
          <HeroSection>
            <SectionTitle>Expand Your System's Capabilities</SectionTitle>
            <HeroText>
              Need additional features? We assist with third-party app integrations 
              for online stores and other business solutions to enhance your 
              RetailManager POS experience.
            </HeroText>
          </HeroSection>

          <ContentGrid>
            <Column>
              <SectionTitle style={{ color: colors.gray800, marginBottom: "1.25rem" }}>
                Popular Integrations
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
                        d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
                      />
                    </svg>
                  </BenefitIcon>
                  <BenefitContent>
                    <BenefitTitle>E-Commerce Platforms</BenefitTitle>
                    <BenefitDescription>
                      Connect with Shopify, WooCommerce, and other online stores
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </BenefitIcon>
                  <BenefitContent>
                    <BenefitTitle>Payment Processors</BenefitTitle>
                    <BenefitDescription>
                      Integrate with Stripe, PayPal, and local payment gateways
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
                    <BenefitTitle>Accounting Software</BenefitTitle>
                    <BenefitDescription>
                      Sync with QuickBooks, Xero, and other accounting systems
                    </BenefitDescription>
                  </BenefitContent>
                </BenefitItem>
              </BenefitsList>
            </Column>

            <Column>
              <ProcessCard>
                <SectionTitle style={{ color: colors.gray800, marginBottom: "1.25rem" }}>
                  Integration Process
                </SectionTitle>
                <ProcessList>
                  <ProcessItem>
                    <ProcessStep>1</ProcessStep>
                    <BenefitContent>
                      <BenefitTitle>Requirement Analysis</BenefitTitle>
                      <BenefitDescription>
                        We assess your business needs and recommend solutions
                      </BenefitDescription>
                    </BenefitContent>
                  </ProcessItem>
                  <ProcessItem>
                    <ProcessStep>2</ProcessStep>
                    <BenefitContent>
                      <BenefitTitle>API Configuration</BenefitTitle>
                      <BenefitDescription>
                        Our team handles the technical connection setup
                      </BenefitDescription>
                    </BenefitContent>
                  </ProcessItem>
                  <ProcessItem>
                    <ProcessStep>3</ProcessStep>
                    <BenefitContent>
                      <BenefitTitle>Testing & Validation</BenefitTitle>
                      <BenefitDescription>
                        We ensure seamless data flow between systems
                      </BenefitDescription>
                    </BenefitContent>
                  </ProcessItem>
                  <ProcessItem>
                    <ProcessStep>4</ProcessStep>
                    <BenefitContent>
                      <BenefitTitle>Training & Handover</BenefitTitle>
                      <BenefitDescription>
                        Your team learns how to use the new integrated features
                      </BenefitDescription>
                    </BenefitContent>
                  </ProcessItem>
                </ProcessList>
              </ProcessCard>
            </Column>
          </ContentGrid>

          <CTASection>
            <SectionTitle>Ready to Enhance Your POS?</SectionTitle>
            <HeroText style={{ marginBottom: "1.5rem" }}>
              Connect your RetailManager POS with the tools that power your business.
            </HeroText>
            <ButtonGroup>
              <PrimaryButton onClick={() => (window.location.href = "/Contact")}>
                Request Integration
              </PrimaryButton>
              <SecondaryButton as="a"
                href="https://www.aaapos.com/"
                target="_blank">
                View Available Integrations
              </SecondaryButton>
            </ButtonGroup>
          </CTASection>
        </MainCard>
      </MainContent>
    </Container>
  );
};

export default ThirdPartyIntegrations;