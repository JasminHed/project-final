import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import ProfileSetting from "../components/ProfileSetting.jsx";
import { useUserStore } from "../store/UserStore.jsx";

import GoalForm from "../components/GoalForm.jsx";
import GoalChart from "../components/GoalChart.jsx";
import { Message } from "../styling/LoadingMessage.jsx";

//varför täcker inte bakgrundsfärg hela bredden på bilden?

ChartJS.register(ArcElement, Tooltip, Legend);

const API_BASE_URL = "https://project-final-ualo.onrender.com";

const Container = styled.div`
  padding: 80px 20px 100px;
  max-width: 100%;
  margin: 0 auto;

  @media (min-width: 669px) {
    max-width: 800px;
  }
`;

const Img = styled.img`
  width: 100%;
  height: auto;
  max-height: 300px;
  margin: 0 auto;
  display: block;
  object-fit: contain;

  &:hover {
    background: var(--color-button-hover);
    max-height: 300px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin: 30px 0;
  flex-wrap: wrap;
`;

const GoalCard = styled.div`
  border: 2px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  background: #f9f9f9;
`;

const fetchGoals = (token) => {
  return fetch(`${API_BASE_URL}/goals`, {
    headers: {
      Authorization: token,
    },
  });
};

const updateGoalAPI = (goalId, goalData, token) => {
  return fetch(`${API_BASE_URL}/goals/${goalId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(goalData),
  });
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [goals, setGoals] = useState([]);

  const incompleteGoals = goals.filter((goal) => !goal.completed);
  const completedGoals = goals.filter((goal) => goal.completed);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    fetchGoals(token)
      .then((response) => response.json())
      .then((data) => {
        const filteredGoals = data
          .filter((goal) => !goal.completed)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);
        setGoals(filteredGoals);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching goals:", error);
        setLoading(false);
      });

    fetch(`${API_BASE_URL}/users/me`, {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then((userData) => setUser(userData));
  }, []);

  const handleNavigateToSetup = () => {
    navigate("/setup");
  };

  const handleIntentionChange = (goalId) => (e) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal._id === goalId ? { ...goal, intention: e.target.value } : goal
      )
    );
  };

  const handleFieldChange = (goalId, field) => (e) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal._id === goalId ? { ...goal, [field]: e.target.value } : goal
      )
    );
  };

  const handleSaveGoal = (goalId) => {
    const token = localStorage.getItem("accessToken");
    const goalToSave = goals.find((goal) => goal._id === goalId);

    updateGoalAPI(goalId, goalToSave, token)
      .then(() => {
        setSuccessMessage("Goal saved successfully!");
        setTimeout(() => setSuccessMessage(""), 4000);
      })
      .catch((error) => {
        console.error("Error saving goal:", error);
      });
  };

  const handleCompleteGoal = (goalId) => () => {
    const token = localStorage.getItem("accessToken");
    setGoals((prevGoals) => prevGoals.filter((goal) => goal._id !== goalId));
    updateGoalAPI(goalId, { completed: true }, token).catch((error) =>
      console.error("Error updating completion:", error)
    );
  };

  const handleOptionSelect = async (option) => {
    const token = localStorage.getItem("accessToken");
    const isPublic = option === "public";
    try {
      const response = await fetch(`${API_BASE_URL}/users/public-status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ isPublic }),
      });

      if (response.ok) {
        setUser({ ...user, isPublic });
      }
    } catch (error) {
      console.error("Failed to update profile status:", error);
    }
  };

  if (loading) {
    return <Message>Loading your dashboard...</Message>;
  }

  return (
    <main id="main-content">
      <Container>
        <h1>Welcome to your dashboard</h1>

        <ProfileSetting user={user} onOptionSelect={handleOptionSelect} />

        <section aria-label="Introduction">
          <p>
            Here you'll see your active goals, up to three at a time — designed
            to keep you focused and purposeful. You can add, edit, and save your
            goals whenever you like.
          </p>
          <p>
            Choose to make your profile public and your goals will be shared
            automatically with the community — so others can cheer you on, offer
            support, and celebrate your progress.
          </p>
          <p>You've got this! One clear step at a time.</p>
        </section>
      </Container>

      <Img
        src="/assets/12.png"
        alt="A graphic image showing a thinking mind with flowers around it for decoration"
      />

      <Container>
        <ButtonContainer>
          <button onClick={handleNavigateToSetup}>
            Add new intention and goals (max 3)
          </button>
        </ButtonContainer>

        {goals.length > 0 ? (
          goals.map((goal) => (
            <GoalForm
              key={goal._id}
              goal={goal}
              onIntentionChange={handleIntentionChange}
              onFieldChange={handleFieldChange}
              onSave={handleSaveGoal}
              onComplete={() => handleCompleteGoal(goal._id)()}
              successMessage={successMessage}
            />
          ))
        ) : (
          <p>No active intention and goal. Create your first!</p>
        )}

        <GoalChart
          incompleteCount={incompleteGoals.length}
          completedCount={completedGoals.length}
        />
      </Container>
    </main>
  );
};

export default Dashboard;
