import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

//arialabels added + semantic html
//<dl> (definition list) for the SMART goals breakdown because you're literally defining terms
//<dt> = definition term (like "Specific")
//<dd> = definition description (the explanation)

const Container = styled.section`
  padding: 80px 20px 100px;
  max-width: 100%;
  margin: 0 auto;

  @media (min-width: 669px) {
    max-width: 800px;
  }
`;

const ModuleContainer = styled.article`
  margin-bottom: 40px;
`;

const Img = styled.img`
  width: 100%;
  max-width: 300px;
  height: auto;
  margin: 0 auto;
  display: block;
  object-fit: contain;

  @media (min-width: 668px) {
    max-width: 500px;
  }
`;

const Content = styled.div`
  text-align: left;
  line-height: 1.6;

  p {
    margin: 10px 0 25px 0;
  }

  strong {
    font-weight: bold;
  }
`;

const ButtonContainer = styled.nav`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
`;

const ErrorMessage = styled.p`
  color: var(--color-error);
  margin-bottom: 4px;
  margin-top: 4px;
  margin-right: 5px;
  font-size: 14px;
`;

//Track module to know where user is, to show next slide
const Onboarding = ({ goBack, signUpRef, autoStart = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showError, setShowError] = useState("");
  useEffect(() => {
    if (autoStart) {
      setCurrentSlide(0);
    }
  }, [autoStart]);
  const navigate = useNavigate();

  //List of onboarding modules
  const modules = [
    {
      title: "Setting your intention",
      content: (
        <>
          <article>
            <p>
              Visualizing your dream life is a powerful tool for making clear,
              meaningful decisions. Ask yourself: What matters most in your
              life? Whether it’s family, career, travel, or something else, your
              answers reveal your core values.
            </p>
            <p>
              Picture this dream life in detail. Where you live, what you do,
              and who you share it with. From there, set short-term goals like
              taking a course or planning a trip, and long-term goals like early
              retirement or launching a passion project. Keep these visions
              close, they will guide your journey.
            </p>
          </article>
        </>
      ),
    },
    {
      title: "Making goals SMART",
      content: (
        <>
          <article>
            <p>
              A clear, well-crafted action plan is what bridges the gap between
              dreaming and doing and it all starts with setting focused goals.
            </p>
            <p>
              There is never a “wrong time” to set new goals. With determination
              and discipline, success is possible. Tracking progress and ticking
              off completed goals builds momentum and keeps your motivation
              alive.
            </p>
          </article>
        </>
      ),
    },
    {
      title: "Breaking down SMART goals",
      content: (
        <article>
          <dl>
            <dt>
              <strong>Specific</strong>
            </dt>
            <dd>
              Avoid vague goals like “be healthier.” Instead, break them into
              concrete, actionable steps. For example, “exercise 3 times a week”
              or “walk 10,000 steps daily” offers clear direction.
            </dd>
            <dt>
              <strong>Measurable</strong>
            </dt>
            <dd>
              To track progress clearly, make your goal measurable. If you’re
              aiming for a new career, try “apply to 5 positions each month.”
              Measuring progress helps you stay on course.
            </dd>
            <dt>
              <strong>Achievable</strong>
            </dt>
            <dd>
              Set realistic, manageable steps to keep motivated. For example,
              start meditating for 5 minutes a day rather than an hour right
              away.
            </dd>
            <dt>
              <strong>Relevent</strong>
            </dt>
            <dd>
              Challenge yourself but keep goals attainable. Don’t expect to run
              a marathon next month if you’re just starting out — instead, build
              toward it step by step.
            </dd>
            <dt>
              <strong>Time-bound</strong>
            </dt>
            <dd>
              Deadlines encourage focus and urgency. Decide to complete that
              coding course in three months to stay motivated and on track.
            </dd>
          </dl>
        </article>
      ),
    },
  ];

  const currentModule = modules[currentSlide];

  const buttonText =
    currentSlide < modules.length - 1
      ? `Next (${currentSlide + 1} of ${modules.length})`
      : "Next - Set up";

  const showPreviousButton = currentSlide > 0;

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleNext = () => {
    if (currentSlide < modules.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      handleOnboardingComplete();
    }
  };

  const handleOnboardingComplete = () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      navigate("/setup");
    } else {
      setShowError(
        "You need to be logged in to continue. Scrolling to Sign Up button"
      );
      setTimeout(() => {
        if (signUpRef.current) {
          signUpRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
        goBack();
      }, 2000);
    }
  };

  return (
    <Container>
      <h1>Start your journey</h1>

      <ModuleContainer
        role="region"
        aria-labelledby="module-title"
        aria-describedby="module-content"
      >
        <Img src="/assets/9.png" alt="Graphic image showing a thinking mind" />
        <h2 id="module-title">{currentModule.title}</h2>
        <Content id="module-content">{currentModule.content}</Content>
      </ModuleContainer>

      <ButtonContainer role="navigation" aria-label="Onboarding navigation">
        {showPreviousButton && (
          <button onClick={handlePrevious}>Previous</button>
        )}
        <button onClick={handleNext}>{buttonText}</button>
      </ButtonContainer>

      {showError && <ErrorMessage role="alert">{showError}</ErrorMessage>}
    </Container>
  );
};

export default Onboarding;
