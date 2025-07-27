import React, { useEffect, useState } from "react";
import styled from "styled-components";

import AuthForm from "../components/AuthForm";
import Onboarding from "../sections/Onboarding.jsx";
import Setup from "../sections/Setup.jsx";

//i need to add another external library
const Description = styled.p`
  text-align: left;
  margin: 20px auto;
  padding: 0 20px;
  max-width: 90%;

  @media (min-width: 668px) {
    max-width: 700px;
    margin-bottom: 50px;
    margin-top: 50px;
  }

  @media (min-width: 1024px) {
    max-width: 900px;
    margin-bottom: 80px;
    margin-top: 80px;
  }
`;

const MainBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 0 20px;
`;

const Box = styled.div`
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  cursor: pointer;

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

const ErrorMessage = styled.p`
  color: var(--color-error);
  margin-bottom: 4px;
  margin-top: 4px;
  margin-left: 18px;
`;

// Local state to track if user is logged in (why not global, because only affects this components behavior)
const WelcomeScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //Checks if token is saved, then consider user logged in
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  //State to hold error messages
  const [showError, setShowError] = useState("");
  //State to track which step is currently shown
  const [currentStep, setCurrentStep] = useState("welcome");

  const handleOnboardingClick = () => {
    setCurrentStep("onboarding");
    setShowError("");
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

  const handleSignUpSuccess = () => setCurrentStep("onboarding");

  return (
    <main>
      <AuthForm
        setIsLoggedIn={setIsLoggedIn}
        onSignUpSuccess={handleSignUpSuccess}
      />

      <Description>
        The Intention App is a personal growth tool. You'll reflect, set
        intentions, define doable goals and follow through — all supported by
        SMART goals, AI helper, a progress dashboard and a positive community.
      </Description>

      <MainBox>
        <Box onClick={handleOnboardingClick}>
          <img
            src="/assets/9.png"
            alt="An graphic image showing a thinking mind"
          />
          Read about Intention & SMART goals
        </Box>
        <Box onClick={handleSetupClick}>
          <img
            src="/assets/10.png"
            alt="A graphic image showing a a thinking mind in creativity mode"
          />
          Create your Intention & SMART goals
        </Box>
        <Box onClick={handleDashboardClick}>
          <img
            src="/assets/12.png"
            alt="A graphic image showing a thinking mind working"
          />
          Track and stay motivated
        </Box>
      </MainBox>

      {showError && <ErrorMessage>{showError}</ErrorMessage>}

      {currentStep === "onboarding" && <Onboarding goBack={handleGoBack} />}
    </main>
  );
};

export default WelcomeScreen;
