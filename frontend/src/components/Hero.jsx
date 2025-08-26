import React from "react";
import styled from "styled-components";

//image bigger? another form?
// overlay?

const HeroContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 20px;
  min-height: 600px;

  @media (max-width: 1023px) {
    flex-direction: column;
  }
`;

export const HeroImage = styled.img`
  width: 100%;
  height: 300px;
  margin: 32px auto;
  display: block;
  object-fit: cover;
  border-radius: 5px;

  @media (max-width: 1000px) {
    order: -1;
    margin: 0 -40px;
    width: calc(100% + 80px);
    border-radius: 0;
  }

  @media (min-width: 1024px) {
    width: 50%;
    height: 600px;
    margin: 0;
    margin-left: auto;
  }
`;

const MainSection = styled.section`
  flex: 1;
  padding: 32px 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @media (min-width: 668px) and (max-width: 1023px) {
    padding: 48px 40px;
    max-width: none;
  }

  @media (min-width: 1024px) {
    padding: 64px 48px;
    max-width: 50%;
  }
`;
const FeatureList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin: 0 0 40px 0;
  padding: 0;
  list-style: none;

  @media (min-width: 668px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px 48px;
    margin-bottom: 48px;
  }

  @media (min-width: 1024px) {
    gap: 48px 64px;
    margin-bottom: 56px;
  }
`;

const Tagline = styled.li`
  position: relative;
  padding-left: 24px;
  transition: transform 0.2s ease;

  @media (min-width: 668px) {
    &:hover {
      transform: translateX(4px);

      &::before {
        transform: translateX(4px);
      }
    }
  }
`;

const Description = styled.p`
  text-align: center;
  margin: 0;
  max-width: 280px;
  color: var(--color-text-primary);
  opacity: 0.9;

  @media (min-width: 668px) {
    max-width: none;
  }
`;

const Hero = () => {
  return (
    <HeroContainer>
      <MainSection>
        <FeatureList role="list">
          <Tagline>
            <strong>Learn about </strong> intentions and SMART goals to get you
            started with confidence today.
          </Tagline>

          <Tagline>
            <strong>Access your dashboard </strong> that contains your intention
            and goals, progress chart and journal section for complete tracking.
          </Tagline>

          <Tagline>
            <strong> Get access to your AI Coach </strong> for motivation,
            check-ins and support on your journey.
          </Tagline>

          <Tagline>
            <strong> Create and set up </strong> your intentions and goals —
            Build habits that last with clear structure and purpose.
          </Tagline>

          <Tagline>
            <strong> Join the community </strong> where posts on users
            intentions and goals are shared for further support and
            accountability.
          </Tagline>

          <Tagline>
            <strong> Sign Up </strong> to get clear, focused and support.
            Welcome to Intention Hub.
          </Tagline>
        </FeatureList>

        <Description>
          The Intention Hub is a digital space and personal growth tool designed
          to help you slow down, reflect, set intentions, define doable goals
        </Description>
      </MainSection>
      <HeroImage
        src="/assets/Dashboard.jpg"
        alt="Woman sitting with the stars"
      />
    </HeroContainer>
  );
};

export default Hero;
