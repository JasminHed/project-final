import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

//arialabels added and html semantic form

import { FormCard, Textarea } from "../styling/FormCard.jsx";

// API base
const API_BASE_URL = "https://project-final-ualo.onrender.com";

const Container = styled.div`
  padding: 80px 20px 100px;
  width: 100%;
  margin: 0 auto;

  @media (min-width: 669px) {
    width: 800px;
  }
`;

const Fieldset = styled.fieldset`
  border: none;
  margin: 0;
  padding: 0;
  margin-bottom: 40px;
`;

const Legend = styled.legend`
  color: var(--color-text-primary);
  margin-top: 24px;
  margin-bottom: 15px;
  font-weight: 700;
  text-align: center;
  font-family: "Inter", sans-serif;
  font-weight: 600;
  font-size: 24px;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
  color: var(--color-text-primary);
`;

const Img = styled.img`
  width: 100%;
  height: auto;
  max-height: 300px;
  margin: 0 auto;
  display: block;
  object-fit: cover;
`;

const ErrorMessage = styled.p`
  color: var(--color-error);
  margin-bottom: 4px;
  margin-top: 4px;
  margin-right: 5px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
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

  // Hook to navigate to another page
  const navigate = useNavigate();

  const [errors, setErrors] = useState({
    intention: "",
    specific: "",
    measurable: "",
    achievable: "",
    relevant: "",
    timebound: "",
  });

  const validateField = (value) => {
    if (value.trim() === "") return "This field is required";
    if (value.trim().length < 20) return "Minimum 20 characters required";
    return "";
  };

  const handleFieldChange = (field) => (e) => {
    const value = e.target.value;
    setValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: validateField(value) }));
  };
  //button back to dashboard
  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.entries(values).forEach(([field, value]) => {
      newErrors[field] = validateField(value);
    });
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some((err) => err !== "");
    if (hasErrors) {
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
      </Container>

      <Img
        src="/assets/10.png"
        alt="A graphic image showing a thinking mind, a place where flowers are growing"
      />
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
                Write your intention. Based on your reflections above, write
                your main intention/goal. It can be broad, you will specify how
                to get there in your SMART goals.
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
              {errors.intention && (
                <ErrorMessage role="alert">{errors.intention}</ErrorMessage>
              )}
              <p aria-live="polite">{values.intention.length}/150</p>
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
              {errors.specific && (
                <ErrorMessage role="alert">{errors.specific}</ErrorMessage>
              )}
              <p aria-live="polite">{values.specific.length}/150</p>

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
              {errors.measurable && (
                <ErrorMessage role="alert">{errors.measurable}</ErrorMessage>
              )}
              <p aria-live="polite">{values.measurable.length}/150</p>

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
              {errors.achievable && (
                <ErrorMessage role="alert">{errors.achievable}</ErrorMessage>
              )}
              <p aria-live="polite">{values.achievable.length}/150</p>

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
              {errors.relevant && (
                <ErrorMessage role="alert">{errors.relevant}</ErrorMessage>
              )}
              <p aria-live="polite">{values.relevant.length}/150</p>

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
              {errors.timebound && (
                <ErrorMessage role="alert">{errors.timebound}</ErrorMessage>
              )}
              <p aria-live="polite">{values.timebound.length}/150</p>
            </FormCard>
          </Fieldset>

          {showError && (
            <ErrorMessage role="alert">
              Please fill in all fields before moving forward
            </ErrorMessage>
          )}

          <ButtonGroup>
            <button type="button" onClick={handleBackToDashboard}>
              Back to dashboard
            </button>
            <button type="submit">Save and head to your dashboard</button>
          </ButtonGroup>
        </form>
      </Container>
    </main>
  );
};
export default Setup;
