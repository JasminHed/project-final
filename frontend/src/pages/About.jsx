import React from "react";
import styled from "styled-components";

import { HeroImage } from "../styling/HeroImage.jsx";

const Description = styled.div`
  margin: 20px auto;
  max-width: 90%;

  @media (min-width: 668px) {
    margin-bottom: 60px;
    margin-top: 60px;
  }

  @media (min-width: 1024px) {
    margin-bottom: 96px;
    margin-top: 96px;
  }
`;

const GridWrapper = styled.div`
  display: grid;
  gap: 24px;
  margin-bottom: 24px;

  @media (min-width: 668px) {
    grid-template-columns: repeat(2, 1fr);
    width: 700px;
    margin-bottom: 48px;
    padding: 16px 20px;
    margin-right: 30px;
    gap: 28px;
  }

  @media (min-width: 1024px) {
    margin: 0 auto;
    grid-template-columns: repeat(2, 1fr);
    width: 1000px;
    margin-bottom: 80px;
    gap: 32px;
  }
`;

const GridBox = styled.div`
  border: 1px solid rgba(221, 221, 221, 0.3);
  border-radius: 16px;
  padding: 24px 20px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const About = () => {
  return (
    <>
      <HeroImage
        src="/assets/Dashboard.jpg"
        alt="Woman sitting with the stars"
      />
      <Description>
        <h1>About The Intention Hub</h1>
        <GridWrapper>
          <GridBox>
            <p>
              The Intention Hub is a digital space and personal growth tool
              designed to help you slow down, reflect, set intentions, define
              doable goals and actually follow through. All supported by SMART
              goals, an AI bot, a progress dashboard and an encouraging
              community.
            </p>
          </GridBox>

          <GridBox>
            <p>
              Whether you're building better habits, navigating change, or
              simply looking to live with more clarity, The Intention Hub gives
              you structure without pressure, and support without overwhelm. It
              turns your everyday reflections into real momentum, one step, one
              intention at a time.
            </p>
          </GridBox>

          <GridBox>
            <p>
              Use it to create mindful morning routines, stay on track with
              personal projects, set boundaries, break old patterns, or commit
              to long-term goals. Whether it's wellness, creativity,
              relationships or work-life balance. We hope that the The Intention
              Hub meets you where you are and grows with you. Stay with it. See
              what shifts.
            </p>
          </GridBox>
          <GridBox>
            <p>
              I'm Jasmin Hedlund, the creator behind this site. I've always been
              passionate about personal and professional growth, both in my own
              life and in others. I regularly use tools like this myself and
              know how powerful it can be to reflect, set clear intentions, and
              actually follow through.{" "}
            </p>
            <p>
              With The Intention Hub, I wanted to create a platform that makes
              that process feel simple, supported and meaningful, a space where
              more people can discover their potential and learn how to turn it
              into real, lasting action.
            </p>
          </GridBox>
        </GridWrapper>
      </Description>
    </>
  );
};

export default About;
