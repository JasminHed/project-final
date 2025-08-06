import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import AuthForm from "../components/AuthForm";
import Onboarding from "../sections/Onboarding.jsx";
import { Message } from "../styling/LoadingMessage.jsx";

//import Setup from "../sections/Setup.jsx";

//i need to add another external library
//arialabels added

const SignUpButton = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-left: auto;
  margin-top: 15px;
`;

const Description = styled.p`
  margin: 20px auto;
  //padding: 0 20px;
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
  const [loading, setLoading] = useState(true);

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
    //updates log in status only
    setIsLoggedIn(true);
    setShowError("");
  };

  // Scroll to onboarding moduel when clicked
  useEffect(() => {
    if (currentStep === "onboarding" && onboardingRef.current) {
      onboardingRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentStep]);

  if (loading) {
    return <Message>Loading your homepage...</Message>;
  }

  return (
    <main id="main-content">
      <section role="region" aria-labelledby="about-intention-hub">
        <Description>
          <p>
            The Intention Hub is a digital space and personal growth tool —
            designed to help you slow down, reflect, set intentions, define
            doable goals and actually follow through. All supported by SMART
            goals, an AI bot, a progress dashboard and an encouraging community.
          </p>

          <p>
            Whether you're building better habits, navigating change, or simply
            looking to live with more clarity, The Intention Hub gives you
            structure without pressure, and support without overwhelm. It turns
            your everyday reflections into real momentum — one step, one
            intention at a time.
          </p>

          <p>
            Use it to create mindful morning routines, stay on track with
            personal projects, set boundaries, break old patterns, or commit to
            long-term goals. Whether it's wellness, creativity, relationships or
            work-life balance — The Intention Hub meets you where you are and
            grows with you.
          </p>

          <p>Stay with it. See what shifts.</p>

          <p>
            I'm Jasmin Hedlund — the creator behind this site. I've always been
            passionate about personal and professional growth, both in my own
            life and in others. I regularly use tools like this myself and know
            how powerful it can be to reflect, set clear intentions, and
            actually follow through. With The Intention Hub, I wanted to create
            a space that makes that process feel simple, supported, and
            meaningful — a space where more people can discover their potential
            and learn how to turn it into real, lasting action. This project is
            created with SMART goals, first introduced by George T. Doran and
            inspiration taken from Female Invest App.
          </p>
          <ul>
            To get started, sign up or log in to
            <strong>
              <li>Create and set up your intentions and goals </li>
              <li>
                Access your dashboard that contains your intention and goals,
                progress chart and journal section{" "}
              </li>
              <li>Get access to your AI bot for motivation and check-ins</li>
              <li>
                Join the community where post on users intention and goals are
                shared for further support and accountability on your journey
              </li>
            </strong>
            <br />
            The section "Learn about Intention and SMART goals" is free to
            explore without an account.
          </ul>
          <SignUpButton>
            <button
              ref={signUpRef}
              onClick={() => setIsOpen(true)}
              aria-label="Sign up to start using The Intention Hub"
            >
              Sign Up
            </button>
          </SignUpButton>
        </Description>
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
          aria-label="Learn about Intention and SMART goals"
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
          tabIndex={0}
          onClick={handleSetupClick}
          aria-label="Set your intention and goals with clarity and purpose"
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
          tabIndex={0}
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
      <hr />
      {showError && <ErrorMessage role="alert">{showError}</ErrorMessage>}

      {currentStep === "onboarding" && (
        <div ref={onboardingRef}>
          <Onboarding goBack={handleGoBack} signUpRef={signUpRef} />
        </div>
      )}
    </main>
  );
};

export default WelcomeScreen;

/*import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import AuthForm from "../components/AuthForm";
import Onboarding from "../sections/Onboarding.jsx";
import { Message } from "../styling/LoadingMessage.jsx";

//import Setup from "../sections/Setup.jsx";

//i need to add another external library
//arialabels added

const SignUpButton = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-left: auto;
  margin-top: 15px;
`;

const Description = styled.p`
  margin: 20px auto;
  //padding: 0 20px;
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
  const [loading, setLoading] = useState(true);

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

  const handleSignUpSuccess = () => setCurrentStep("onboarding");

  if (loading) {
    return <Message>Loading your homepage...</Message>;
  }

  return (
    <main id="main-content">
      <AuthForm
        setIsLoggedIn={setIsLoggedIn}
        onSignUpSuccess={handleSignUpSuccess}
      />
      <section role="region" aria-labelledby="about-intention-hub">
        <Description>
          <p>
            The Intention Hub is a digital space and personal growth tool —
            designed to help you slow down, reflect, set intentions, define
            doable goals and actually follow through. All supported by SMART
            goals, an AI bot, a progress dashboard and an encouraging community.
          </p>

          <p>
            Whether you're building better habits, navigating change, or simply
            looking to live with more clarity, The Intention Hub gives you
            structure without pressure, and support without overwhelm. It turns
            your everyday reflections into real momentum — one step, one
            intention at a time.
          </p>

          <p>
            Use it to create mindful morning routines, stay on track with
            personal projects, set boundaries, break old patterns, or commit to
            long-term goals. Whether it's wellness, creativity, relationships or
            work-life balance — The Intention Hub meets you where you are and
            grows with you.
          </p>

          <p>Stay with it. See what shifts.</p>

          <p>
            I'm Jasmin Hedlund — the creator behind this site. I've always been
            passionate about personal and professional growth, both in my own
            life and in others. I regularly use tools like this myself and know
            how powerful it can be to reflect, set clear intentions, and
            actually follow through. With The Intention Hub, I wanted to create
            a space that makes that process feel simple, supported, and
            meaningful — a space where more people can discover their potential
            and learn how to turn it into real, lasting action. This project is
            created with SMART goals, first introduced by George T. Doran and
            inspiration taken from Female Invest App.
          </p>
          <ul>
            To get started, sign up or log in to
            <strong>
              <li>Create and set up your intentions and goals </li>
              <li>
                Access your dashboard that contains your intention and goals,
                progress chart and journal section{" "}
              </li>
              <li>Get access to your AI bot for motivation and check-ins</li>
              <li>
                Join the community where post on users intention and goals are
                shared for further support and accountability on your journey
              </li>
            </strong>
            <br />
            The section "Learn about Intention and SMART goals" is free to
            explore without an account.
          </ul>
          <SignUpButton>
            <button
              ref={signUpRef}
              onClick={() => setIsOpen(true)}
              aria-label="Sign up to start using The Intention Hub"
            >
              Sign Up
            </button>
          </SignUpButton>
        </Description>
      </section>
      <AuthForm
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <section role="region" aria-label="Choose your next step"></section>
      <MainBox>
        <Box
          role="button"
          tabIndex={0}
          onClick={handleOnboardingClick}
          aria-label="Learn about Intention and SMART goals"
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
          tabIndex={0}
          onClick={handleSetupClick}
          aria-label="Set your intention and goals with clarity and purpose"
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
          tabIndex={0}
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
      <hr />
      {showError && <ErrorMessage role="alert">{showError}</ErrorMessage>}

      {currentStep === "onboarding" && (
        <div ref={onboardingRef}>
          <Onboarding goBack={handleGoBack} signUpRef={signUpRef} />
        </div>
      )}
    </main>
  );
};

export default WelcomeScreen;*/
