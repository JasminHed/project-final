import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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
      title: "Intention",
      content: (
        <>
          <p>
            Visualising your dream life isn't just a pleasant daydream - it's
            essential for making effective decisions. Ask yourself: What matters
            most in your life? Your answers - whether it's family, career, or
            travel—will reveal your core values.
          </p>
          <p>
            Visualise this dream life in detail – where you live, work, and the
            relationships you value. From this, determine short-term goals like
            specialised courses or travels and long-term goals like early
            retirement or starting a meaningful project. Note these visions, as
            they will guide your journey.
          </p>
          <p>
            The idea is that visions and goals can apply to all areas of your
            life—whether it's a career change, creating your dream lifestyle,
            improving your physical health, or anything else that matters to
            you.
          </p>
        </>
      ),
    },
    {
      title: "SMART goals",
      content: (
        <>
          <p>
            A well-crafted action plan is what stands between you and your
            dreams and it all starts with setting clear goals.
          </p>
          <p>
            Hitting a goal will ignite a blaze of possibilities, fuelling your
            ambitions. You're in control of your dreams, and there's no "wrong
            time" to set new goals. As long as you're determined and
            disciplined, you're set for success. Goals turn aspirations into
            focused targets, guiding your actions with purpose. By setting
            goals, you can track your progress. Ticking off achieved goals
            boosts excitement and motivates you to accomplish more.
          </p>
        </>
      ),
    },
    {
      title: "SMART goals details",
      content: (
        <div>
          <p>
            <strong>Specific</strong> - Instead of vague goals like "be
            healthier," be specific. Break improvement into concrete, actionable
            steps like "exercise 3 times a week." For even more precision,
            specify "walk 10,000 steps daily".
          </p>
          <p>
            <strong>Measurable</strong> - To track progress clearly, make your
            goal measurable. For example, if you want to find your first role in
            a new career, set a goal like "apply to 5 positions each month."
            Measure your progress by counting applications sent.
          </p>
          <p>
            <strong>Achievable</strong> - Achieve breakthroughs by taking
            realistic steps. Avoid setting unrealistic expectations that can
            demotivate you. If you want to start meditating, aim for 5 minutes a
            day at first instead of an hour immediately.
          </p>
          <p>
            <strong>Realistic</strong> - Challenge yourself, but don't set
            impossible missions. For instance, if you want to run a marathon,
            don't expect to do it next month if you're just starting. If you
            want to find your first job, don't expect to land your dream role
            immediately. Instead set attainable steps toward it.
          </p>
          <p>
            <strong>Time-bound</strong> Set deadlines to encourage focus and
            urgency. For example, decide to finish an online coding course
            within three months. Time-sensitive goals help keep you on track and
            motivated.
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
      <h1>Onboarding</h1>

      <ModuleContainer>
        <Img src="/assets/9.png" alt="Graphic image showing a thinking mind" />
        <h2>{currentModule.title}</h2>
        <Content>{currentModule.content}</Content>
      </ModuleContainer>

      <ButtonContainer>
        {showPreviousButton && (
          <button onClick={handlePrevious}>Previous</button>
        )}
        <button onClick={handleNext}>{buttonText}</button>
      </ButtonContainer>

      {showError && <ErrorMessage>{showError}</ErrorMessage>}
    </Container>
  );
};

export default Onboarding;
