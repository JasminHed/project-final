import React, { useEffect, useState } from "react";
import styled from "styled-components";

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

// Importing components for authentication, onboarding, and setup steps
import AuthForm from "../components/AuthForm";
import Onboarding from "../components/Onboarding.jsx";
import Setup from "../components/Setup.jsx";

// Local state to track if user is logged in (why not global, because only affects this components behavior)
const WelcomeScreen = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //// Track completion status of onboarding and setup steps
  const [completed, setCompleted] = useState({
    onboarding: false,
    setup: false,
  });

  //Checks if token i saved, then consider user logged in
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  //State to hold error messages
  const [showError, setShowError] = useState("");
  //State to track which step/page is currently shown
  const [currentStep, setCurrentStep] = useState("welcome");

  //Function to handle navigation between different steps.
  const handleNavigation = (step) => {
    if (step === "onboarding") {
      setCurrentStep("onboarding");
      setShowError("");
    } else if (step === "setup") {
      if (!isLoggedIn) {
        setShowError("You must be logged in to access this section");
        return;
      }
      if (!completed.onboarding) {
        setShowError("Please complete onboarding first");
        return;
      }
      setCurrentStep("setup");
      setShowError("");
    } else if (step === "dashboard") {
      if (!isLoggedIn) {
        setShowError("You must be logged in to access this section");
        return;
      }
      if (!completed.setup) {
        setShowError("Please complete your setup first");
        return;
      }
      setCurrentStep("dashboard");
      setShowError("");
    } else {
      setShowError("");
      setCurrentStep("welcome");
    }
  };

  return (
    <main>
      <AuthForm
        setIsLoggedIn={setIsLoggedIn}
        onSignUpSuccess={() => setCurrentStep("onboarding")}
      />

      <Description>
        The Intention App is a personal growth tool. You'll reflect, set
        intentions, define doable goals and follow through — all supported by
        SMART goals, AI helper, a progress dashboard and a positive community.
      </Description>

      <MainBox>
        <Box onClick={() => handleNavigation("onboarding")}>
          <img src="/assets/9.png" alt="An image of a brain in graphics" />
          Read about Intention & SMART goals
        </Box>
        <Box onClick={() => handleNavigation("setup")}>
          <img
            src="/assets/10.png"
            alt="An image of a brain where flowers are growing"
          />
          Create your Intention & SMART goals
        </Box>
        <Box onClick={() => handleNavigation("dashboard")}>
          <img
            src="/assets/12.png"
            alt="An image of a head with starts, flowers in graphic"
          />
          Track and stay motivated
        </Box>
      </MainBox>

      {showError && <p>{showError}</p>}

      {currentStep === "onboarding" && (
        <Onboarding
          onDone={() => {
            if (isLoggedIn) {
              setCompleted((prev) => ({ ...prev, onboarding: true }));
              setCurrentStep("setup");
            } else {
              setShowError("Please log in to continue");
              setCurrentStep("welcome");
            }
          }}
          goBack={() => setCurrentStep("welcome")}
        />
      )}
      {/*Setup only if user is loggedin and done with onboarding*/}
      {currentStep === "setup" && isLoggedIn && (
        <Setup
          onDone={() => {
            setCompleted((prev) => ({ ...prev, setup: true }));
            setCurrentStep("welcome");
          }}
          goBack={() => setCurrentStep("welcome")}
        />
      )}
    </main>
  );
};

export default WelcomeScreen;
