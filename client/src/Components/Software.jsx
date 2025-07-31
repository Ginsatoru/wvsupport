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

const SoftwareUpdatesMaintenance = () => {
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
                d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"
              />
            </svg>
          </IconWrapper>
          <Title>Software Updates & Maintenance</Title>
          <Subtitle>
            Stay up to date with the latest features and security patches
          </Subtitle>
        </Header>

        <MainCard>
          <HeroSection>
            <SectionTitle>Seamless System Updates</SectionTitle>
            <HeroText>
              Our support team ensures smooth RetailManager POS updates and
              system maintenance, keeping your business running securely with
              the latest features.
            </HeroText>
          </HeroSection>

          <ContentGrid>
            <Column>
              <SectionTitle
                style={{ color: colors.gray800, marginBottom: "1.25rem" }}
              >
                Update Benefits
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
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </BenefitIcon>
                  <BenefitContent>
                    <BenefitTitle>Enhanced Security</BenefitTitle>
                    <BenefitDescription>
                      Regular patches protect against the latest vulnerabilities
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
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </BenefitIcon>
                  <BenefitContent>
                    <BenefitTitle>Performance Improvements</BenefitTitle>
                    <BenefitDescription>
                      Optimized code for faster operation and better efficiency
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
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </BenefitIcon>
                  <BenefitContent>
                    <BenefitTitle>New Features</BenefitTitle>
                    <BenefitDescription>
                      Access the latest tools and functionality as they're
                      released
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
                  Our Maintenance Process
                </SectionTitle>
                <ProcessList>
                  <ProcessItem>
                    <ProcessStep>1</ProcessStep>
                    <BenefitContent>
                      <BenefitTitle>Update Notification</BenefitTitle>
                      <BenefitDescription>
                        We alert you when new updates are available
                      </BenefitDescription>
                    </BenefitContent>
                  </ProcessItem>
                  <ProcessItem>
                    <ProcessStep>2</ProcessStep>
                    <BenefitContent>
                      <BenefitTitle>Scheduled Maintenance</BenefitTitle>
                      <BenefitDescription>
                        Updates are performed during low-traffic periods
                      </BenefitDescription>
                    </BenefitContent>
                  </ProcessItem>
                  <ProcessItem>
                    <ProcessStep>3</ProcessStep>
                    <BenefitContent>
                      <BenefitTitle>Automated Backups</BenefitTitle>
                      <BenefitDescription>
                        Your data is secured before any changes
                      </BenefitDescription>
                    </BenefitContent>
                  </ProcessItem>
                  <ProcessItem>
                    <ProcessStep>4</ProcessStep>
                    <BenefitContent>
                      <BenefitTitle>Verification & Testing</BenefitTitle>
                      <BenefitDescription>
                        We confirm everything works perfectly post-update
                      </BenefitDescription>
                    </BenefitContent>
                  </ProcessItem>
                </ProcessList>
              </ProcessCard>
            </Column>
          </ContentGrid>

          <CTASection>
            <SectionTitle>Keep Your System Current</SectionTitle>
            <HeroText style={{ marginBottom: "1.5rem" }}>
              Ensure optimal performance with our managed update services.
            </HeroText>
            <ButtonGroup>
              <PrimaryButton
                as="a"
                href="https://www.aaapos.com/support/"
                target="_blank"
              >
                Schedule Maintenance
              </PrimaryButton>
              <SecondaryButton
                as="a"
                href="https://www.aaapos.com/retailmanager/"
                target="_blank"
              >
                View Update Schedule
              </SecondaryButton>
            </ButtonGroup>
          </CTASection>
        </MainCard>
      </MainContent>
    </Container>
  );
};

export default SoftwareUpdatesMaintenance;