import React, { useEffect, useState } from "react";

// Importing components for authentication, onboarding, and setup steps
import Authform from "../components/Authform.jsx";
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
      <Authform setIsLoggedIn={setIsLoggedIn} />

      <img src="" alt="" />
      <p>
        The Intention App is a personal growth tool. You'll reflect, set
        intentions, define doable goals and follow through — all supported by
        SMART goals, AI helper, a progress dashboard and a positive community.
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
