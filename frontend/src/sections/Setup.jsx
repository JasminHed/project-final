import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

//arialabels added

import { ButtonBox, Textarea } from "../styling/BoxStyling.jsx";

// API base
const API_BASE_URL = "https://project-final-ualo.onrender.com";

const Container = styled.div`
  padding: 80px 20px 100px;
  max-width: 100%;
  margin: 0 auto;

  @media (min-width: 669px) {
    max-width: 800px;
  }
`;

const Section = styled.div`
  margin-bottom: 40px;
`;

const Img = styled.img`
  width: 100%;
  max-width: 300px;
  height: auto;
  margin: 0 auto;
  display: block;
  object-fit: contain;

  @media (min-width: 668px) {
    img {
      max-width: 500px;
    }
  }
`;

const ErrorMessage = styled.p`
  color: var(--color-error);
  margin-bottom: 4px;
  margin-top: 4px;
  margin-right: 5px;
`;

// Functions
const saveGoalToAPI = (values, token) => {
  return fetch(`${API_BASE_URL}/goals`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(values),
  });
};

// Setup component for setting intention and SMART goals
const Setup = () => {
  const [values, setValues] = useState({
    intention: "",
    specific: "",
    measurable: "",
    achievable: "",
    relevant: "",
    timebound: "",
  });
  // State to show error message if fields are not filled in
  const [showError, setShowError] = useState(false);
  // State for max goals error
  const [errorMessage, setErrorMessage] = useState("");
  // Hook to navigate to another page
  const navigate = useNavigate();

  // Save goals to backend when user clicks save button
  const handleSave = () => {
    //Check if field is empty
    const hasEmpty = Object.values(values).some((value) => value.trim() === "");
    if (hasEmpty) {
      setShowError(true);
    } else {
      const token = localStorage.getItem("accessToken");
      //Send POST request to save goal data
      saveGoalToAPI(values, token)
        .then((response) => {
          if (response.ok) {
            // Mark onboarding complete in local storage
            localStorage.setItem("hasCompletedOnboarding", "true");
            //Navigate to dahsboard page
            navigate("/dashboard");
          } else {
            setErrorMessage(
              "There is a maximum of 3 saved intention and goal cards. It's to help you stay focused and not feel overwhelmed."
            );
            setTimeout(() => setErrorMessage(""), 3000);
          }
        })
        .catch((error) => {
          console.error("Error", error);
          setErrorMessage("Something went wrong. Please try again.");
          setTimeout(() => setErrorMessage(""), 3000);
        });
    }
  };

  // Combined event handler for all fields
  const handleFieldChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }));
    setShowError(false);
  };

  return (
    <main id="main-content">
      <Container>
        <h1>Ready to set your intentions and goals? Let's make it happen!</h1>
        <p>
          This is your space to pause and get clear. Start by reflecting on what
          truly matters to you — your priorities, dreams, and the milestones you
          want to reach. Then, craft your main intention based on those
          reflections. After that, break it down into SMART goals — Specific,
          Measurable, Achievable, Relevant and Timebound, to create a clear path
          forward. When you're ready, save your work and watch your journey
          unfold in your dashboard. Take your time, and remember: every step
          counts.
        </p>

        <Img
          src="/assets/10.png"
          alt="A graphic image showing a thinking mind, a place where flowers are growing"
        />
        <Section>
          <h2 id="intention-section">Your Intention: What lights you up?</h2>
          <ButtonBox>
            <h3 id="reflection-questions">Reflect on these questions</h3>
            <ul aria-labelledby="reflection-questions">
              <li>
                What are my top priorities in life, and how can my goals help me
                get there?
              </li>
              <li>Thinking long term, where do I want to be in five years?</li>
              <li>
                If I could achieve just one major milestone in the next year,
                what would it be, and why?
              </li>
            </ul>
          </ButtonBox>

          <ButtonBox>
            <p id="intention-description">
              Write your intention. Based on your reflections above, write your
              main intention/goal. It can be broad, you will specify how to get
              there in your SMART goals.
            </p>

            <Textarea
              aria-labelledby="intention-section intention-description"
              placeholder={`Examples:\nBuild a healthier lifestyle that gives me more energy and confidence\nCreate a stable financial foundation for my family's future\nDevelop my creative skills and find more fulfillment in my work`}
              value={values.intention}
              onChange={handleFieldChange("intention")}
              maxLength="150"
            />
            <p aria-live="polite">{values.intention.length}/150</p>
          </ButtonBox>
        </Section>

        <Section>
          <h2 id="smart-goals-section">
            Let's shape your SMART goals — clear, doable, and yours
          </h2>
          <h3 id="specific-label">Specific</h3>
          <Textarea
            aria-labelledby="specific-label"
            placeholder={`Examples:\nI will meal prep healthy lunches every Sunday\nI will save SEK500 each month\nI will read 2 books per month`}
            value={values.specific}
            onChange={handleFieldChange("specific")}
          ></Textarea>
          <p aria-live="polite">{values.specific.length}/150</p>

          <h3 id="measurable-label">Measurable</h3>
          <Textarea
            aria-labelledby="measurable-label"
            placeholder={`Examples:\nTrack workouts in fitness app and log weekly food diary\nUse journal to track reading progress\nMonitor savings with monthly budget spreadsheet`}
            value={values.measurable}
            onChange={handleFieldChange("measurable")}
          ></Textarea>
          <p aria-live="polite">{values.measurable.length}/150</p>

          <h3 id="achievable-label">Achievable</h3>
          <Textarea
            aria-labelledby="achievable-label"
            placeholder={`Examples:\nStart with 20-minute home workouts, 3x/week\nBegin with 30 pages/day during commute\nCut dining out from 4x to 2x per week`}
            value={values.achievable}
            onChange={handleFieldChange("achievable")}
          ></Textarea>
          <p aria-live="polite">{values.achievable.length}/150</p>

          <h3 id="relevant-label">Relevant</h3>
          <Textarea
            aria-labelledby="relevant-label"
            placeholder={`Examples:\nHealthy habits boost my energy for work and family\nReading expands my knowledge for career growth\nSavings create security and reduce stress`}
            value={values.relevant}
            onChange={handleFieldChange("relevant")}
          ></Textarea>
          <p aria-live="polite">{values.relevant.length}/150</p>

          <h3 id="timebound-label">Timebound</h3>
          <Textarea
            aria-labelledby="timebound-label"
            placeholder={`Examples:\nEstablish routine within 6 weeks, 3rd of November 2025\nFinish 8 books by December 2025\nReach SEK6000 savings goal by December 2025`}
            value={values.timebound}
            onChange={handleFieldChange("timebound")}
          ></Textarea>
          <p aria-live="polite">{values.timebound.length}/150</p>
        </Section>

        {showError && (
          <ErrorMessage role="alert">
            Please fill in all fields before moving forward
          </ErrorMessage>
        )}

        {errorMessage && (
          <ErrorMessage role="alert">{errorMessage}</ErrorMessage>
        )}

        <button onClick={handleSave}> Save and head to your dashboard</button>
      </Container>
    </main>
  );
};

export default Setup;
