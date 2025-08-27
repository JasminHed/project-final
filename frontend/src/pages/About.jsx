import React from "react";
import styled from "styled-components";

const Description = styled.section`
  margin: 40px auto 60px;
  max-width: 90%;

  @media (min-width: 668px) {
    margin: 60px auto 80px;
  }

  @media (min-width: 1024px) {
    margin: 80px auto 120px;
  }
`;
const GridWrapper = styled.div`
  display: grid;
  gap: 28px;
  margin-bottom: 40px;

  @media (min-width: 668px) {
    grid-template-columns: repeat(2, 1fr);
    width: 700px;
    margin-bottom: 60px;
    padding: 16px 24px;
  }

  @media (min-width: 1024px) {
    margin: 0 auto 100px;
    grid-template-columns: 1.2fr 0.8fr;
    width: 1000px;
    margin-bottom: 80px;
    gap: 32px;
  }
`;

const GridBox = styled.div`
  background: var(--color-card-background);
  border: 1px solid rgba(221, 221, 221, 0.3);
  border-radius: 20px;
  padding: 28px 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  line-height: 1.7;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    border-radius: 20px 20px 0 0;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08);
    border-color: rgba(168, 230, 207, 0.4);
  }

  &:first-child {
    @media (min-width: 668px) {
      grid-column: 1 / -1;
      text-align: center;
      padding: 40px 32px;
      font-size: 1.1rem;
    }
  }

  &:nth-child(2),
  &:nth-child(3) {
    @media (min-width: 1024px) {
      padding: 24px 20px;
    }
  }
`;
const About = () => {
  return (
    <>
      <Description as="main" id="main-content">
        <h1>About The Intention Hub</h1>
        <GridWrapper as="section" aria-label="About sections">
          <GridBox as="article">
            <p>
              The Intention Hub is a digital space and personal growth tool
              designed to help you slow down, reflect, set intentions, define
              doable goals and actually follow through. All supported by SMART
              goals, an AI bot, a progress dashboard and an encouraging
              community.
            </p>
          </GridBox>

          <GridBox as="article">
            <strong>
              <p>Why use it</p>
            </strong>
            <p>
              Whether you're building better habits, navigating change, or
              simply looking to live with more clarity, The Intention Hub gives
              you structure without pressure, and support without overwhelm. It
              turns your everyday reflections into real momentum, one step, one
              intention at a time.
            </p>
          </GridBox>

          <GridBox as="article">
            <strong>
              <p>How to use it</p>
            </strong>
            <p>
              Use it to create mindful morning routines, stay on track with
              personal projects, set boundaries, break old patterns, or commit
              to long-term goals. Whether it's wellness, creativity,
              relationships or work-life balance. We hope that the The Intention
              Hub meets you where you are and grows with you. Stay with it. See
              what shifts.
            </p>
          </GridBox>
          <GridBox as="aside">
            <strong>
              <p>Creator</p>
            </strong>
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
