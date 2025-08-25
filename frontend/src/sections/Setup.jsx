import React, { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { FormCard, Textarea } from "../styling/FormCard.jsx";

// API base
const API_BASE_URL = "https://project-final-ualo.onrender.com";

const Container = styled.div`
  padding: 40px 16px 60px;
  max-width: 800px;
  margin: 0 auto;

  @media (min-width: 669px) {
    padding: 60px 32px 80px;
  }
`;

const Title = styled.h1`
  margin-bottom: 24px;

  @media (min-width: 669px) {
    margin-bottom: 40px;
  }
`;

const Fieldset = styled.fieldset`
  border: none;
  margin: 0;
  padding: 0;
  margin-bottom: 32px;

  @media (min-width: 669px) {
    margin-bottom: 40px;
  }
`;

const Legend = styled.legend`
  color: var(--color-text-primary);
  margin-top: 16px;
  margin-bottom: 12px;
  font-weight: 700;
  text-align: center;
  font-weight: 500;
  font-size: 18px;

  @media (min-width: 669px) {
    font-size: 22px;
    font-weight: 600;
    margin-top: 20px;
    margin-bottom: 16px;
  }
`;

const Label = styled.label`
  display: block;
  font-weight: 400;
  margin-bottom: 6px;
  color: var(--color-text-primary);

  @media (min-width: 669px) {
    font-weight: 500;
    margin-bottom: 8px;
  }
`;

const CharacterCount = styled.p`
  font-size: 12px;
  margin: 4px 0 0 0;

  @media (min-width: 668px) {
    font-size: 13px;
  }

  @media (min-width: 1025px) {
    font-size: 14px;
  }
`;

const ErrorWrapper = styled.div`
  min-height: 24px;
  display: flex;
  align-items: flex-start;
`;

const ErrorMessage = styled.p`
  color: var(--color-error);
  margin-bottom: 4px;
  margin-top: 4px;
  margin-right: 5px;
  font-size: 14px;
  font-weight: 400;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 24px;

  button {
    background: none;
    border: none;
    font-size: 16px;
    cursor: pointer;
    color: var(--color-text-primary);

    &:hover {
      border: 1px solid var(--color-focus);
      transform: scale(1.05);
    }
  }

  span {
    font-size: 14px;
    color: var(--color-text);
  }
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

  // Hook to navigate to another page-dashboard
  const navigate = useNavigate();

  const handleFieldChange = (field) => (e) => {
    const value = e.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
  };
  //arrow back to dashboard
  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };
  //This validates, sends data, navigates to dashboard or shows error
  const handleSubmit = (e) => {
    e.preventDefault();
    const hasEmptyFields = Object.values(values).some(
      (value) => value.trim() === ""
    );
    if (hasEmptyFields) {
      setShowError(true);
      return;
    }

    setShowError(false);

    const token = localStorage.getItem("accessToken");
    saveGoalToAPI(values, token)
      .then((res) => {
        if (res.ok) {
          localStorage.setItem("hasCompletedOnboarding", "true");
          navigate("/dashboard");
        }
      })
      .catch(() => {
        setErrorMessage("Something went wrong. Please try again.");
        setTimeout(() => setErrorMessage(""), 3000);
      });
  };

  return (
    <main id="main-content">
      <Container>
        <Title>
          Ready to set your intentions and goals? Let's make it happen!
        </Title>
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
      </Container>

      <Container>
        <form onSubmit={handleSubmit} noValidate>
          <Fieldset>
            <FormCard>
              <h2>Your Intention</h2>
              <Legend>Reflect on what lights you up?</Legend>
              <ul>
                <li>
                  What are my top priorities in life, and how can my goals help
                  me get there?
                </li>
                <li>
                  Thinking long term, where do I want to be in five years?
                </li>
                <li>
                  If I could achieve just one major milestone in the next year,
                  what would it be, and why?
                </li>
              </ul>

              <Label htmlFor="intention">
                Based on your reflections above, write your intention. It can be
                broad, you will specify how to get there in your SMART goals.
              </Label>

              <Textarea
                id="intention"
                name="intention"
                placeholder={`Examples:\nBuild a healthier lifestyle that gives me more energy and confidence\nCreate a stable financial foundation for my family's future\nDevelop my creative skills and find more fulfillment in my work`}
                value={values.intention}
                onChange={handleFieldChange("intention")}
                minLength={20}
                maxLength="150"
                required
              />

              <CharacterCount aria-live="polite">
                {values.intention.length}/150
              </CharacterCount>
            </FormCard>
          </Fieldset>
          <Fieldset>
            <FormCard>
              <Legend>
                Let's shape your SMART goals — clear, doable, and yours
              </Legend>

              <Label htmlFor="specific">Specific</Label>
              <Textarea
                id="specific"
                name="specific"
                placeholder={`Examples:\nI will meal prep healthy lunches every Sunday\nI will save SEK500 each month\nI will read 2 books per month`}
                value={values.specific}
                onChange={handleFieldChange("specific")}
                minLength={20}
                maxLength="150"
                required
              />

              <CharacterCount aria-live="polite">
                {values.specific.length}/150
              </CharacterCount>

              <Label htmlFor="measurable">Measurable</Label>
              <Textarea
                id="measurable"
                name="measurable"
                placeholder={`Examples:\nTrack workouts in fitness app and log weekly food diary\nUse journal to track reading progress\nMonitor savings with monthly budget spreadsheet`}
                value={values.measurable}
                onChange={handleFieldChange("measurable")}
                minLength={20}
                maxLength="150"
                required
              />

              <CharacterCount aria-live="polite">
                {values.measurable.length}/150
              </CharacterCount>

              <Label htmlFor="achievable">Achievable</Label>
              <Textarea
                id="achievable"
                name="achievable"
                placeholder={`Examples:\nStart with 20-minute home workouts, 3x/week\nBegin with 30 pages/day during commute\nCut dining out from 4x to 2x per week`}
                value={values.achievable}
                onChange={handleFieldChange("achievable")}
                minLength={20}
                maxLength="150"
                required
              />

              <CharacterCount aria-live="polite">
                {values.achievable.length}/150
              </CharacterCount>

              <Label htmlFor="relevant">Relevant</Label>
              <Textarea
                id="relevant"
                name="relevant"
                placeholder={`Examples:\nHealthy habits boost my energy for work and family\nReading expands my knowledge for career growth\nSavings create security and reduce stress`}
                value={values.relevant}
                onChange={handleFieldChange("relevant")}
                minLength={20}
                maxLength="150"
                required
              />

              <CharacterCount aria-live="polite">
                {values.relevant.length}/150
              </CharacterCount>

              <Label htmlFor="timebound">Timebound</Label>
              <Textarea
                id="timebound"
                name="timebound"
                placeholder={`Examples:\nEstablish routine within 6 weeks, 3rd of November 2025\nFinish 8 books by December 2025\nReach SEK6000 savings goal by December 2025`}
                value={values.timebound}
                onChange={handleFieldChange("timebound")}
                minLength={20}
                maxLength="150"
                required
              />

              <CharacterCount aria-live="polite">
                {values.timebound.length}/150
              </CharacterCount>
            </FormCard>
          </Fieldset>
          <ErrorWrapper>
            {showError && (
              <ErrorMessage role="alert">
                Please fill in all fields before moving forward
              </ErrorMessage>
            )}
          </ErrorWrapper>

          <ButtonGroup role="navigation" aria-label="Dashboard navigation">
            <button
              type="button"
              onClick={handleBackToDashboard}
              aria-label="Back to dashboard"
            >
              <FaArrowLeft /> Dashboard
            </button>

            <button
              type="submit"
              aria-label="Submit and head to your dashboard"
            >
              Submit <FaArrowRight />
            </button>
          </ButtonGroup>
        </form>
      </Container>
    </main>
  );
};
export default Setup;
