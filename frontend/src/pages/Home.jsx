import React, { useEffect, useState } from "react";
import styled from "styled-components";

import AuthForm from "../components/AuthForm";
import Onboarding from "../sections/Onboarding.jsx";
import Setup from "../sections/Setup.jsx";

const SignUpButton = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-left: auto;
`;
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
  margin-top: 20px;
  margin-bottom: 20px;
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
  const [isOpen, setIsOpen] = useState(false);

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
        <p>
          The Intention Hub is a digital space and personal growth tool —
          designed to help you slow down, reflect, set intentions, define doable
          goals and actually follow through. All supported by SMART goals, an AI
          helper, a clear progress dashboard and an encouraging community.
        </p>

        <p>
          Whether you're building better habits, navigating change, or simply
          looking to live with more clarity, The Intention Hub gives you
          structure without pressure, and support without overwhelm. It turns
          your everyday reflections into real momentum — one step, one intention
          at a time.
        </p>

        <p>
          Use it to create mindful morning routines, stay on track with personal
          projects, set boundaries, break old patterns, or commit to long-term
          goals. Whether it's wellness, creativity, relationships or work-life
          balance — The Intention Hub meets you where you are and grows with
          you.
        </p>

        <p>Stay with it. See what shifts.</p>

        <p>
          I'm Jasmin Hedlund — the creator behind this site. I’ve always been
          passionate about personal and professional growth, both in my own life
          and in others. I regularly use tools like this myself and know how
          powerful it can be to reflect, set clear intentions, and actually
          follow through. With The Intention Hub, I wanted to create a space
          that makes that process feel simple, supported, and meaningful — a
          space where more people can discover their potential and learn how to
          turn it into real, lasting action.
        </p>
        <p>
          <strong>
            To get started, sign up or log in to create goals, access your
            dashboard, and join the community.
          </strong>
          "Learn about Intention and SMART goals" is free to explore without an
          account.
        </p>
        <SignUpButton>
          <button onClick={() => setIsOpen(true)}>Sign Up</button>
        </SignUpButton>
      </Description>
      <hr />
      <AuthForm
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <MainBox>
        <Box onClick={handleOnboardingClick}>
          <img
            src="/assets/9.png"
            alt="An graphic image showing a thinking mind"
          />
          Learn about Intention & SMART goals
        </Box>
        <Box onClick={handleSetupClick}>
          <img
            src="/assets/10.png"
            alt="A graphic image showing a a thinking mind in creativity mode"
          />
          Set your intention and goals with clarity and purpose
        </Box>
        <Box onClick={handleDashboardClick}>
          <img
            src="/assets/12.png"
            alt="A graphic image showing a thinking mind working"
          />
          Track your journey
        </Box>
      </MainBox>
      <hr />
      {showError && <ErrorMessage>{showError}</ErrorMessage>}

      {currentStep === "onboarding" && <Onboarding goBack={handleGoBack} />}
    </main>
  );
};

export default WelcomeScreen;
