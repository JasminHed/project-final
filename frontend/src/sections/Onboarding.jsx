import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.section`
  //padding: 60px 16px 80px;
  padding: 60px 4px 60px;
  width: 100%;
  min-height: 80vh;
  margin: 0 auto;

  @media (min-width: 668px) {
    width: 700px;
    padding: 80px 32px 100px;
  }

  @media (min-width: 1024px) {
    width: 1000px;
    padding: 100px 32px 120px;
    margin: 0 auto;
  }
`;

const ModuleContainer = styled.article`
  margin-bottom: 40px;
  transition: height 0.5s ease;
  border-radius: 12px;
  background-color: var(--color-card-background);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  padding: 80px;

  @media (min-width: 668px) {
    margin-bottom: 60px;
    border-radius: 50%;
    padding: 120px;
  }

  @media (min-width: 1024px) {
    margin-bottom: 80px;
    border-radius: 50%;
    padding: 160px;
  }
`;

const Content = styled.div`
  text-align: left;
  opacity: 1;
  transition: opacity 0.8s ease;

  p {
    margin: 12px 0 20px 0;
    opacity: 0.9;

    @media (min-width: 668px) {
      margin: 16px 0 28px 0;
    }

    @media (min-width: 1024px) {
      margin: 20px 0 36px 0;
    }
  }

  dl {
    margin: 0;
  }

  dd {
    margin: 0 0 8px 0;
    opacity: 0.8;

    @media (min-width: 668px) {
      margin-bottom: 12px;
    }
  }
`;

const ModuleTitle = styled.h2`
  text-align: left;
`;

const ButtonContainer = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 32px;

  @media (min-width: 668px) {
    margin-top: 40px;
  }

  @media (min-width: 1024px) {
    margin-top: 48px;
  }

  button {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: var(--color-text-primary);

    &:hover {
      transform: scale(1.05);
      border: 1px solid var(--color-focus);
    }
  }

  span {
    font-size: 14px;
    color: var(--color-text);
  }
`;

const ErrorMessage = styled.p`
  color: var(--color-error);
  margin-top: 12px;
  margin-bottom: 4px;
  margin-right: 5px;
  text-align: center;
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
        <article>
          <p>
            Visualizing your dream life is a powerful tool for making clear,
            meaningful decisions. Ask yourself: What matters most in your life?
            Whether it’s family, career, travel, or something else, your answers
            reveal your core values.
          </p>
          <p>
            Picture this dream life in detail. From there, set short-term goals
            like taking a course or planning a trip, and long-term goals like
            early retirement or launching a passion project.
          </p>
        </article>
      ),
    },
    {
      title: "Making goals SMART",
      content: (
        <article>
          <p>
            A clear, well-crafted action plan is what bridges the gap between
            dreaming and doing and it all starts with setting focused goals.
          </p>
          <p>
            There is never a “wrong time” to set new goals. With determination
            and discipline, success is possible.
          </p>
        </article>
      ),
    },
    {
      title: "Specific",
      content: (
        <article>
          <dl>
            <dd>
              Avoid vague goals like “be healthier.” Instead, break them into
              concrete, actionable steps. For example, “exercise 3 times a week”
              or “walk 10,000 steps daily” offers clear direction.
            </dd>
          </dl>
        </article>
      ),
    },
    {
      title: "Measurable",
      content: (
        <article>
          <dl>
            <dd>
              To track progress clearly, make your goal measurable. If you’re
              aiming for a new career, try “apply to 5 positions each month.”
              Measuring progress helps you stay on course.
            </dd>
          </dl>
        </article>
      ),
    },
    {
      title: "Achievable",
      content: (
        <article>
          <dl>
            <dd>
              Set realistic, manageable steps to keep motivated. For example,
              start meditating for 5 minutes a day rather than an hour right
              away.
            </dd>
          </dl>
        </article>
      ),
    },
    {
      title: "Relevant",
      content: (
        <article>
          <dl>
            <dd>
              Challenge yourself but keep goals attainable. Don’t expect to run
              a marathon next month if you’re just starting out — instead, build
              toward it step by step.
            </dd>
          </dl>
        </article>
      ),
    },
    {
      title: "Time-bound",
      content: (
        <article>
          <dl>
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
        <ModuleTitle id="module-title">{currentModule.title}</ModuleTitle>
        <Content id="module-content">{currentModule.content}</Content>
      </ModuleContainer>

      <ButtonContainer role="navigation" aria-label="Onboarding navigation">
        {showPreviousButton && (
          <button onClick={handlePrevious} aria-label="Previous slide">
            <FaArrowLeft />
          </button>
        )}

        <span>
          {currentSlide + 1} / {modules.length}
        </span>

        <button
          onClick={handleNext}
          aria-label={
            currentSlide < modules.length - 1
              ? "Next slide"
              : "Finish onboarding"
          }
        >
          <FaArrowRight />
        </button>
      </ButtonContainer>

      {showError && <ErrorMessage role="alert">{showError}</ErrorMessage>}
    </Container>
  );
};

export default Onboarding;
