import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

//arialabels added

const Container = styled.div`
  padding: 80px 20px 100px;
  max-width: 100%;
  margin: 0 auto;

  @media (min-width: 669px) {
    max-width: 800px;
  }
`;

const ModuleContainer = styled.div`
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
    img {
      max-width: 500px;
    }
  }
`;

const Content = styled.div`
  text-align: left;
  line-height: 1.6;

  p {
    margin-bottom: 15px;
  }

  strong {
    font-weight: bold;
  }
`;

const ButtonContainer = styled.div`
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
`;

//Track module to know where user is, to show next slide
const Onboarding = ({ goBack }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showError, setShowError] = useState("");
  const navigate = useNavigate();

  //List of onboarding modules
  const modules = [
    {
      title: "Setting your intention",
      content: (
        <>
          <p>
            Visualizing your dream life isn’t just a pleasant daydream — it’s a
            powerful tool for making clear, meaningful decisions. Ask yourself:
            What matters most in your life? Whether it’s family, career, travel,
            or something else, your answers reveal your core values.
          </p>
          <p>
            Picture this dream life in detail — where you live, what you do, and
            who you share it with. From there, set short-term goals like taking
            a course or planning a trip, and long-term goals like early
            retirement or launching a passion project. Keep these visions close
            — they’ll guide your journey.
          </p>
          <p>
            Remember, these visions and goals can touch every part of your life
            — career changes, healthier habits, lifestyle upgrades, or anything
            else that matters to you.
          </p>
        </>
      ),
    },
    {
      title: "Making goals SMART",
      content: (
        <>
          <p>
            A clear, well-crafted action plan is what bridges the gap between
            dreaming and doing and it all starts with setting focused goals.
          </p>
          <p>
            Achieving a goal opens up new opportunities and increases your
            motivation. There is never a “wrong time” to set new goals. With
            determination and discipline, success is possible. Goals help turn
            big ideas into clear, focused steps that guide your actions.
            Tracking progress and ticking off completed goals builds momentum
            and keeps your motivation alive.
          </p>
        </>
      ),
    },
    {
      title: "Breaking down SMART goals",
      content: (
        <div>
          <p>
            <strong>Specific</strong> - Avoid vague goals like “be healthier.”
            Instead, break them into concrete, actionable steps. For example,
            “exercise 3 times a week” or “walk 10,000 steps daily” offers clear
            direction.
          </p>
          <p>
            <strong>Measurable</strong> - To track progress clearly, make your
            goal measurable. If you’re aiming for a new career, try “apply to 5
            positions each month.” Measuring progress helps you stay on course.
          </p>
          <p>
            <strong>Achievable</strong> - Set realistic, manageable steps to
            keep motivated. For example, start meditating for 5 minutes a day
            rather than an hour right away.
          </p>
          <p>
            <strong>Realistic</strong> - Challenge yourself but keep goals
            attainable. Don’t expect to run a marathon next month if you’re just
            starting out — instead, build toward it step by step.
          </p>
          <p>
            <strong>Time-bound</strong> - Deadlines encourage focus and urgency.
            Decide to complete that coding course in three months to stay
            motivated and on track.
          </p>
        </div>
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
        "You need to be logged in to continue. Redirecting to homepage."
      );
      setTimeout(() => {
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
