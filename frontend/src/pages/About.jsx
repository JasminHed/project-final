import React from "react";
import styled from "styled-components";

//style with grid on tablet + desktop

const Description = styled.div`
  margin: 20px auto;
  max-width: 90%;

  @media (min-width: 668px) {
    margin-bottom: 50px;
    margin-top: 50px;
  }

  @media (min-width: 1024px) {
    margin-bottom: 80px;
    margin-top: 80px;
  }
`;

const Img = styled.img`
  width: 100%;
  height: auto;
  max-height: 300px;
  margin: 0 auto;
  display: block;
  object-fit: cover;
`;

const GridWrapper = styled.div`
  display: grid;
  gap: 20px;

  @media (min-width: 668px) {
    grid-template-columns: repeat(3, 1fr);
    width: 700px;
    margin-bottom: 40px;
    padding: 10px 16px;
    margin-right: 30px;
  }

  @media (min-width: 1024px) {
    margin: 0 auto;
    grid-template-columns: repeat(3, 1fr);
    width: 1000px;
    margin-bottom: 70px;
  }
`;

const About = () => {
  return (
    <Description>
      <Img
        src="/assets/About.png"
        alt="A graphic image showing a heart writing notes on a desk"
      />
      <GridWrapper>
        <p>
          The Intention Hub is a digital space and personal growth tool designed
          to help you slow down, reflect, set intentions, define doable goals
          and actually follow through. All supported by SMART goals, an AI bot,
          a progress dashboard and an encouraging community.
        </p>

        <p>
          Whether you're building better habits, navigating change, or simply
          looking to live with more clarity, The Intention Hub gives you
          structure without pressure, and support without overwhelm. It turns
          your everyday reflections into real momentum, one step, one intention
          at a time.
        </p>

        <p>
          Use it to create mindful morning routines, stay on track with personal
          projects, set boundaries, break old patterns, or commit to long-term
          goals. Whether it's wellness, creativity, relationships or work-life
          balance. We hope that the The Intention Hub meets you where you are
          and grows with you.Stay with it. See what shifts.
        </p>
      </GridWrapper>
      <p>
        I'm Jasmin Hedlund — the creator behind this site. I've always been
        passionate about personal and professional growth, both in my own life
        and in others. I regularly use tools like this myself and know how
        powerful it can be to reflect, set clear intentions, and actually follow
        through. With The Intention Hub, I wanted to create a platform that
        makes that process feel simple, supported and meaningful, a space where
        more people can discover their potential and learn how to turn it into
        real, lasting action.
      </p>
    </Description>
  );
};

export default About;
