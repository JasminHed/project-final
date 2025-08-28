import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import AuthForm from "../components/AuthForm";
import Taglines from "../sections/Hero.jsx";
import Onboarding from "../sections/Onboarding.jsx";
import { useUserStore } from "../store/UserStore.jsx";
import { Message } from "../styling/LoadingMessage.jsx";

const MainBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0 16px;
  width: 100%;
  max-width: 320px;
  margin: 40px auto;

  @media (min-width: 668px) and (max-width: 1023px) {
    max-width: 800px;
  }

  @media (min-width: 1024px) {
    max-width: 1200px;
    flex-direction: column;
    align-items: center;
    gap: 32px;
  }
`;

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 200px;
  width: 100%;
  border: 1px solid var(--color-focus);
  border-radius: 16px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 16px auto;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }

  ${(props) =>
    props.disabled &&
    `
      background-color: #FFFFFF;
      color: #475569;
      border-color: #475569;
      cursor: not-allowed;
      box-shadow: none;
      transform: none;
    `}

  @media (min-width: 668px) and (max-width: 1023px) {
    width: 80%;
  }

  @media (min-width: 1024px) {
    width: 95%;
    height: 250px;
  }
`;

const SignUpButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 24px auto;
  width: 100%;

  button {
    width: 100%;
    max-width: 280px;
    padding: 16px 32px;
    font-size: 17px;
    font-weight: 500;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  @media (min-width: 668px) {
    button {
      max-width: 320px;
      padding: 20px 36px;
    }
  }

  @media (min-width: 1024px) {
    button {
      max-width: 360px;
      padding: 24px 48px;
    }
  }
`;

const ErrorWrapper = styled.div`
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorMessage = styled.p`
  color: var(--color-error);
  font-size: 15px;
  font-weight: 400;
  margin-left: 8px;
`;

const WelcomeScreen = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useUserStore((state) => state.setIsLoggedIn);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [AutoStartLearn, setAutoStartLearn] = useState(false);
  const navigate = useNavigate();

  // Ref for onboarding and signup
  const onboardingRef = useRef(null);
  const signUpRef = useRef(null);

  //Checks if token is saved, then consider user logged in
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
    }

    setLoading(false);
  }, []);

  //makes sure onboarding slides go away when logged out
  useEffect(() => {
    if (!isLoggedIn) {
      setCurrentStep("welcome");
      setShowError("");
    }
  }, [isLoggedIn]);

  const [showError, setShowError] = useState("");
  //State to track which step is currently shown
  const [currentStep, setCurrentStep] = useState("welcome");

  const handleOnboardingClick = () => {
    setCurrentStep("onboarding");
    setShowError("");

    // Scroll to onboarding section
    setTimeout(() => {
      if (onboardingRef.current) {
        onboardingRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  const handleSetupClick = () => {
    if (!isLoggedIn) {
      setShowError("You must be logged in and finish the onboarding section");
      return;
    }
    navigate("/setup");
  };

  const handleDashboardClick = () => {
    if (!isLoggedIn) {
      setShowError("You must be logged in and finish the setup section");
      return;
    }
    navigate("/dashboard");
  };

  const handleGoBack = () => {
    setCurrentStep("welcome");
    setShowError("");
  };

  const handleSignUpSuccess = () => {
    setIsLoggedIn(true);
    setShowError("");
    setIsOpen(false);

    setTimeout(() => {
      setCurrentStep("onboarding");
      setAutoStartLearn(true); // This will auto-start the first slide

      setTimeout(() => {
        if (onboardingRef.current) {
          onboardingRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }, 300);
  };

  if (loading) {
    return <Message>Loading your homepage...</Message>;
  }

  return (
    <main id="main-content">
      <section aria-labelledby="about-intention-hub">
        <Taglines />

        <SignUpButton>
          <button
            ref={signUpRef}
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label="Sign up to start using The Intention Hub"
          >
            Sign Up/Log In
          </button>
        </SignUpButton>
      </section>

      <AuthForm
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        buttonRef={signUpRef}
        onSignUpSuccess={handleSignUpSuccess}
      />

      <MainBox>
        <Box
          role="button"
          tabIndex={0}
          disabled={!isLoggedIn}
          onClick={() => {
            if (!isLoggedIn) {
              setShowError("You need to be logged in to access  this content");
              return;
            }
            handleOnboardingClick();
          }}
          aria-label="Learn about Intention and SMART goals here"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (!isLoggedIn) {
                setShowError("You need to be logged in to access this content");
                return;
              }
              handleOnboardingClick();
            }
          }}
        >
          Learn about Intention & SMART goals
        </Box>
        <Box
          role="button"
          tabIndex={0}
          disabled={!isLoggedIn}
          aria-disabled={!isLoggedIn}
          aria-label="Set your intention and goals with clarity and purpose here"
          onClick={() => {
            if (!isLoggedIn) {
              setShowError("You need to be logged in to access this content");
              return;
            }
            handleSetupClick();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (!isLoggedIn) {
                setShowError("You need to be logged in to access this content");
                return;
              }
              handleSetupClick();
            }
          }}
        >
          Set your intention and goals with clarity and purpose
        </Box>
        <Box
          role="button"
          tabIndex={0}
          disabled={!isLoggedIn}
          aria-disabled={!isLoggedIn}
          aria-label="Track your journey here"
          onClick={() => {
            if (!isLoggedIn) {
              setShowError("You need to be logged in to access this content");
              return;
            }
            handleDashboardClick();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (!isLoggedIn) {
                setShowError("You need to be logged in to access this content");
                return;
              }
              handleDashboardClick();
            }
          }}
        >
          Track your journey
        </Box>
      </MainBox>

      <ErrorWrapper>
        {showError && <ErrorMessage role="polite">{showError}</ErrorMessage>}
      </ErrorWrapper>
      {currentStep === "onboarding" && (
        <div ref={onboardingRef}>
          <Onboarding
            goBack={handleGoBack}
            signUpRef={signUpRef}
            autoStart={AutoStartLearn}
          />
        </div>
      )}
    </main>
  );
};

export default WelcomeScreen;
