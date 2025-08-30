import React from "react";
import styled from "styled-components";

const HeroContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 0;
  padding: 40px 0;
  padding: 0;
  width: 100%;

  @media (min-width: 1024px) {
    flex-direction: row;
    align-items: stretch;
    gap: 60px;
    padding: 80px 32px;
  }
`;

const HeroImage = styled.img`
  width: 100%;
  height: auto;
  object-fit: cover;
  display: block;
  margin: 20px 0;
  aspect-ratio: 412/470;

  @media (min-width: 1024px) {
    width: 50%;
    height: auto;
    order: 2;
    margin: 0;
    //aspect-ratio: 412/470;
    aspect-ratio: auto;
    object-fit: contain;
  }
`;

const MainSection = styled.section`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  width: 100%;
  margin: 20px 0;

  @media (min-width: 1024px) {
    align-items: flex-start;
    width: 50%;
    order: 1;
    padding: 32px;
  }
`;

const FeatureList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 0;
  list-style: none;

  @media (min-width: 668px) {
    gap: 24px;
  }

  @media (min-width: 1024px) {
    gap: 32px;
  }
`;

const Tagline = styled.li`
  text-align: left;
  font-size: 18px;
  font-weight: 600px;
  transition: transform 0.2s ease, color 0.2s ease;
  cursor: pointer;

  &:hover {
    color: var(--color-accent);
    transform: translateX(5px);
  }

  @media (min-width: 668px) {
    font-size: 20px;
  }

  @media (min-width: 1024px) {
    text-align: left;
    font-size: 22px;
  }
`;

const Description = styled.p`
  text-align: center;
  max-width: 600px;
  margin-top: 20px;
  margin: 20px 0;

  @media (min-width: 1024px) {
    text-align: left;
  }
`;

const Hero = () => {
  return (
    <HeroContainer>
      <HeroImage
        src="/assets/test.jpg"
        alt="Woman form reaching for the stars"
        loading="lazy"
      />

      <MainSection>
        <FeatureList role="list">
          <Tagline>
            <strong>LEARN about </strong> intentions and SMART goals to get you
            started with confidence today.
          </Tagline>

          <Tagline>
            <strong>ACESS your dashboard </strong> that contains your intention
            and goals and progress chart with tracking.
          </Tagline>

          <Tagline>
            <strong> GET access to your AI Assistant </strong> for support on
            your journey.
          </Tagline>

          <Tagline>
            <strong> CREATE and set up </strong> your intentions and goals —
            Build habits that last with clear structure and purpose.
          </Tagline>

          <Tagline>
            <strong> JOIN the community </strong> where posts on users
            intentions and goals are shared for further support and
            accountability.
          </Tagline>

          <Tagline>
            <strong> SIGN UP </strong> to get clear, focused and support.
            Welcome to Intention Hub.
          </Tagline>
        </FeatureList>

        <Description>
          The Intention Hub is a digital space and personal growth tool designed
          to help you slow down, reflect, set intentions, define doable goals
        </Description>
      </MainSection>
    </HeroContainer>
  );
};

export default Hero;
