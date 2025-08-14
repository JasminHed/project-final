import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import AuthForm from "../components/AuthForm";
import Taglines from "../components/Tagline.jsx";
import Onboarding from "../sections/Onboarding.jsx";
import { useUserStore } from "../store/UserStore.jsx";
import { Message } from "../styling/LoadingMessage.jsx";

//arialabels check + semantic html
//box 2 and 3 should be clickable when logged in

const MainBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 0 20px;
  margin-top: 60px;
  margin-bottom: 60px;
`;

const Box = styled.div`
  padding: 40px;
  margin-top: 20px;
  margin-bottom: 20px;
  border: 2px solid #ddd;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;

  ${(props) =>
    props.disabled &&
    `
    pointer-events: none;
    opacity: 0.5;
    cursor: not-allowed;
  `}

  img {
    width: 100%;
    max-width: 300px;
    height: auto;
    margin: 0 auto;
    display: block;
    object-fit: contain;
  }

  @media (min-width: 668px) {
    img {
      max-width: 500px;
    }
  }

  &:hover {
    background: var(--color-button-hover);
  }
`;

const SignUpButton = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-left: auto;
  margin-top: 15px;

  button {
    width: 100%;
    max-width: 300px;
    padding: 20px 40px;
    font-size: 16px;
  }
`;

const ErrorMessage = styled.p`
  color: var(--color-error);
  font-size: 14px;
  margin-bottom: 4px;
  margin-top: 4px;
  margin-left: 18px;
`;

// Local state to track if user is logged in (why not global, because only affects this components behavior)
const WelcomeScreen = () => {
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const setIsLoggedIn = useUserStore((state) => state.setIsLoggedIn);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [AutoStartLearn, setAutoStartLearn] = useState(false);

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

  //State to hold error messages
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
    setShowError("");
  };

  const handleDashboardClick = () => {
    if (!isLoggedIn) {
      setShowError("You must be logged in and finish the setup section");
      return;
    }
    setShowError("");
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
      <section role="region" aria-labelledby="about-intention-hub">
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
        onSignUpSuccess={handleSignUpSuccess}
      />
      <section role="region" aria-label="Choose your next step"></section>
      <MainBox>
        <Box
          role="button"
          tabIndex={0}
          onClick={handleOnboardingClick}
          aria-label="Learn about Intention and SMART goals here"
          onKeyDown={(e) => e.key === "Enter" && handleOnboardingClick()} //user can use enter
        >
          <img
            src="/assets/9.png"
            alt="An graphic image showing a thinking mind"
          />
          Learn about Intention & SMART goals
        </Box>
        <Box
          role="button"
          aria-disabled={!isLoggedIn}
          tabIndex={isLoggedIn ? 0 : -1} //tab when logged in
          disabled={!isLoggedIn}
          onClick={handleSetupClick}
          aria-label="Set your intention and goals with clarity and purpose here"
          onKeyDown={(e) => e.key === "Enter" && handleSetupClick()}
        >
          <img
            src="/assets/10.png"
            alt="A graphic image showing a a thinking mind in creativity mode"
          />
          Set your intention and goals with clarity and purpose
        </Box>
        <Box
          role="button"
          aria-disabled={!isLoggedIn}
          tabIndex={isLoggedIn ? 0 : -1} //tab when logged in
          disabled={!isLoggedIn}
          onClick={handleDashboardClick}
          aria-label="Track your journey here"
          onKeyDown={(e) => e.key === "Enter" && handleDashboardClick()}
        >
          <img
            src="/assets/12.png"
            alt="A graphic image showing a thinking mind working"
          />
          Track your journey
        </Box>
      </MainBox>

      {showError && <ErrorMessage role="polite">{showError}</ErrorMessage>}
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
