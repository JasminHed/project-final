import React from "react";
import styled from "styled-components";

const TaglineSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem 1.2rem;
  text-align: left;
  margin: 0 auto;
  max-width: 300px;

  @media (min-width: 668px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem 3rem;
    max-width: 700px;
    padding: 3rem 2rem;
  }

  @media (min-width: 1024px) {
    max-width: 900px;
    gap: 3rem 4rem;
    padding: 4rem 2rem;
  }
`;

const Tagline = styled.li`
  position: relative;
  padding-left: 1.5rem;
  list-style: none;

  &::before {
    position: absolute;
    left: 0;
    top: 0;
  }
`;

const Taglines = () => {
  return (
    <>
      <section>
        <TaglineSection>
          <Tagline>
            <strong> 💡 Learn about </strong>
            intentions and SMART goals to get you started with confidence today.
          </Tagline>
          <Tagline>
            <strong> 💡 Access your dashboard </strong> that contains your
            intention and goals, progress chart and journal section for complete
            tracking.
          </Tagline>
          <Tagline>
            <strong> 💡 From intention to action </strong> — with tools designed
            for personal or professional growth, without the overwhelm.
          </Tagline>

          <Tagline>
            <strong> 💡 Get access to your AI Coach </strong> for motivation,
            check-ins and support on your journey.
          </Tagline>
          <Tagline>
            <strong> 💡 Create and set up your intentions and goals </strong>
            Build habits that last with clear structure and purpose.
          </Tagline>
          <Tagline>
            <strong> 💡 Join the community </strong> where posts on users
            intentions and goals are shared for further support and
            accountability.
          </Tagline>

          <Tagline>
            <strong>Sign Up </strong> to get clear, focused and support. Welcome
            to Intention Hub.
          </Tagline>
        </TaglineSection>
      </section>
    </>
  );
};

export default Taglines;
