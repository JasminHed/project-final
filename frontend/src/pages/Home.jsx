import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import AuthForm from "../components/AuthForm";
import Taglines from "../components/Tagline.jsx";
import Onboarding from "../sections/Onboarding.jsx";
import { useUserStore } from "../store/UserStore.jsx";
import { Message } from "../styling/LoadingMessage.jsx";

//box 2 and 3 should be clickable when logged in

const MainBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0 24px;
  margin-top: 80px;
  margin-bottom: 80px;
`;

const Box = styled.div`
  //padding: 48px 32px;
  margin-top: 16px;
  margin-bottom: 16px;
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 18px;
  line-height: 1.5;
  font-weight: 500;

  ${(props) =>
    props.disabled &&
    `
    pointer-events: none;
    opacity: 0.4;
    cursor: not-allowed;
  `}

  img {
    width: 280px;
    height: 60px;
    margin: 0 auto;
    border-radius: 40px;
    object-fit: cover;
    margin-bottom: 20px;
    display: block;
    transition: opacity 0.3s ease;
    opacity: 0.8;
  }

  img:hover {
    opacity: 1;
  }

  @media (min-width: 668px) {
    img {
      margin: 0 auto;
      width: 80%;
      height: 150px;
      border-radius: 30px;
      margin-bottom: 20px;
    }
  }
`;

const Img = styled.img`
  width: 95%;
  max-height: 400px;
  margin: 32px auto;
  display: block;
  object-fit: cover;
  border-radius: 16px;

  @media (min-width: 669px) {
    width: 100%;
    max-height: 400px;
    margin: 48px auto;
  }
`;

const SignUpButton = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-left: auto;
  margin-top: 24px;

  button {
    width: 100%;
    max-width: 280px;
    padding: 24px 48px;
    font-size: 17px;
    font-weight: 500;
    border-radius: 12px;
    transition: all 0.2s ease;
  }
`;

const ErrorMessage = styled.p`
  color: var(--color-error);
  font-size: 15px;
  margin-bottom: 8px;
  margin-top: 8px;
  margin-left: 24px;
  font-weight: 400;
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
        <Img src="/assets/Dashboard.jpg" alt="Woman sitting with the stars" />
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
          tabIndex={isLoggedIn ? 0 : -1}
          disabled={!isLoggedIn}
          onClick={handleOnboardingClick}
          aria-label="Learn about Intention and SMART goals here"
          onKeyDown={(e) => e.key === "Enter" && handleOnboardingClick()} //user can use enter
        >
          <img src="/assets/Community1.jpg" alt="Hand with flowers" />
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
          <img src="/assets/Setup.jpg" alt="Abstract background in color" />
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
          <img src="/assets/Dashboard.jpg" alt="Woman sitting with stars" />
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
