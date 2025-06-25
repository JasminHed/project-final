import React, { useState } from "react";

import Onboarding from "../components/Onboarding.jsx";
import Setup from "../components/Setup.jsx";

const WelcomeScreen = () => {
  // For now: hardcoded logged-in status
  const isLoggedIn = false;

  const [completed, setCompleted] = useState({
    onboarding: false,
    setup: false,
  });

  const [showError, setShowError] = useState("");
  const [currentStep, setCurrentStep] = useState("welcome");

  const handleNavigation = (step) => {
    if (step === "onboarding") {
      setCurrentStep("onboarding");
      setShowError("");
    } else if (step === "setup") {
      if (!isLoggedIn) {
        setShowError("You must be logged in to access your creation");
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
        setShowError("You must be logged in to access your dashboard");
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
      <button onClick={() => console.log("Redirect to sign up / login")}>
        Get Started
      </button>

      <img src="" alt="" />
      <p>
        The Intention App is a personal growth tool. You'll reflect, set
        intentions, define doable goals, and follow through — all supported by
        SMART goals, AI coach, a progress dashboard, and a positive community.
      </p>

      <nav>
        <div onClick={() => handleNavigation("onboarding")}>
          Read about Intention & SMART goals here
        </div>
        <div onClick={() => handleNavigation("setup")}>
          Create your Intention & SMART goal here
        </div>
        <div onClick={() => handleNavigation("dashboard")}>
          Track and stay motivated here
        </div>
      </nav>

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
