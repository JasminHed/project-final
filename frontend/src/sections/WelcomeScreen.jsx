import React, { useState } from "react";

function WelcomeScreen() {
  const [completed, setCompleted] = useState({
    onboarding: false,
    setup: false,
  });
  const [showError, setShowError] = useState("");

  const handleBoxClick = (step) => {
    if (step === "onboarding") {
      // Always allowed - navigate to onboarding
      console.log("Go to onboarding");
    } else if (step === "setup" && completed.onboarding) {
      // Only if onboarding done - navigate to setup
      console.log("Go to setup");
    } else if (step === "dashboard" && completed.setup) {
      // Only if setup done - navigate to dashboard
      console.log("Go to dashboard");
    } else {
      setShowError("Please complete the previous step first");
    }
  };

  return (
    <main>
      <button>Get Started (to sign up/log in)</button>
      <img src="" alt="" />
      <p>
        The Intention App is a personal growth tool You'll reflect, set
        intentions, define doable goals, and follow through — all supported by
        SMART goals, AI coach, a progress dashboard, and a positive community.
      </p>

      <div>
        <div onClick={() => handleBoxClick("onboarding")}>
          Read about Intention & SMART GOAL
        </div>
        <div onClick={() => handleBoxClick("setup")}>
          Create your Intention & SMART goal
        </div>
        <div onClick={() => handleBoxClick("dashboard")}>
          Track and stay motivated
        </div>
      </div>

      {showError && <p>{showError}</p>}
    </main>
  );
}

export default WelcomeScreen;
