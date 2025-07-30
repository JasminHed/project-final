import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

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
const Setup = ({ goBack }) => {
  // Local state to store all goal fields
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
            console.error("Failed to save goal. Try again");
          }
        })
        .catch((error) => {
          console.error("Error", error);
        });
    }
  };

  // Event handler functions
  const handleIntentionChange = (e) => {
    setValues((prev) => ({ ...prev, intention: e.target.value }));
    setShowError(false);
  };

  const handleSpecificChange = (e) => {
    setValues((prev) => ({ ...prev, specific: e.target.value }));
    setShowError(false);
  };

  const handleMeasurableChange = (e) => {
    setValues((prev) => ({ ...prev, measurable: e.target.value }));
    setShowError(false);
  };

  const handleAchievableChange = (e) => {
    setValues((prev) => ({ ...prev, achievable: e.target.value }));
    setShowError(false);
  };

  const handleRelevantChange = (e) => {
    setValues((prev) => ({ ...prev, relevant: e.target.value }));
    setShowError(false);
  };

  const handleTimeboundChange = (e) => {
    setValues((prev) => ({ ...prev, timebound: e.target.value }));
    setShowError(false);
  };

  return (
    <main id="main-content">
      <Container>
        <h1>Ready to set your intentions and goals? Let’s make it happen!</h1>
        <p>
          This is your space to pause and get clear. Start by reflecting on what
          truly matters to you — your priorities, dreams, and the milestones you
          want to reach. Then, craft your main intention based on those
          reflections. After that, break it down into SMART goals — Specific,
          Measurable, Achievable, Relevant and Timebound, to create a clear path
          forward. When you’re ready, save your work and watch your journey
          unfold in your dashboard. Take your time, and remember: every step
          counts.
        </p>

        <Img
          src="/assets/10.png"
          alt="A graphic image showing a thinking mind, a place where flowers are growing"
        />
        <Section>
          <h2>Your Intention: What lights you up?</h2>
          <ButtonBox>
            <h3>Reflect on these questions</h3>
            <ul>
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
            <p>
              Write your intention. Based on your reflections above, write your
              main intention/goal. It can be broad, you will specify how to get
              there in your SMART goals."
            </p>
            <Textarea
              placeholder="Write your intention here"
              value={values.intention}
              onChange={handleIntentionChange}
              maxLength="150"
            />
            <p>{values.intention.length}/150</p>

            {showError && <p>Please fill in your intention</p>}
          </ButtonBox>
        </Section>

        <Section>
          <h2>Let’s shape your SMART goals — clear, doable, and yours</h2>
          <h3>Specific</h3>
          <Textarea
            placeholder="E.g., I will run 3 times a week."
            value={values.specific}
            onChange={handleSpecificChange}
          ></Textarea>
          <p>{values.specific.length}/150</p>

          <h3>Measurable</h3>
          <Textarea
            placeholder="E.g., Track progress using a running app."
            value={values.measurable}
            onChange={handleMeasurableChange}
          ></Textarea>
          <p>{values.measurable.length}/150</p>

          <h3>Achievable</h3>
          <Textarea
            placeholder="E.g., Start with 1 mile and build up gradually."
            value={values.achievable}
            onChange={handleAchievableChange}
          ></Textarea>
          <p>{values.achievable.length}/150</p>

          <h3>Relevant</h3>
          <Textarea
            placeholder="E.g., Running improves my health and energy."
            value={values.relevant}
            onChange={handleRelevantChange}
          ></Textarea>
          <p>{values.relevant.length}/150</p>

          <h3>Timebound</h3>
          <Textarea
            placeholder="E.g., Achieve this within 3 months."
            value={values.timebound}
            onChange={handleTimeboundChange}
          ></Textarea>
          <p>{values.timebound.length}/150</p>
        </Section>

        {showError && (
          <ErrorMessage>
            Please fill in all fields before moving forward
          </ErrorMessage>
        )}

        <button onClick={handleSave}> Save and head to your dashboard</button>
      </Container>
    </main>
  );
};

export default Setup;
