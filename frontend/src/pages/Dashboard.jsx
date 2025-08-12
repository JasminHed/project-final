import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import ProfileSetting from "../components/ProfileSetting.jsx";
import { useUserStore } from "../store/UserStore.jsx";
import GoalForm from "../components/GoalForm.jsx";
import GoalChart from "../components/GoalChart.jsx";
import { Message } from "../styling/LoadingMessage.jsx";
import useGoal from "../hooks/useGoal.jsx";

//check bakcend, i think its better that when you set public profiel discliamer comes and everything but it should not happen automatically, rather there should be a button on the save, complete and share to community so that the user can actually do this activley or?

const API_BASE_URL = "https://project-final-ualo.onrender.com";

const Container = styled.div`
  padding: 80px 20px 100px;
  max-width: 100%;
  margin: 0 auto;

  @media (min-width: 669px) {
    max-width: 1200px;
  }

  @media (min-width: 1025px) {
    max-width: 1400px;
  }
`;

const GoalsGrid = styled.div`
  display: block; /* default for mobile */

  @media (min-width: 669px) and (max-width: 1600px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: start;
  }
`;

const Img = styled.img`
  width: 100%;
  height: auto;
  max-height: 300px;
  margin: 0 auto;
  display: block;
  object-fit: cover;

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

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();

  const {
    goals,
    loading,
    successMessage,
    updateGoal,
    completeGoal,
    updateGoalField,
  } = useGoal();

  const incompleteGoals = goals.filter((goal) => !goal.completed);
  const completedGoals = goals.filter((goal) => goal.completed);

  // user-fetching
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    fetch(`${API_BASE_URL}/users/me`, {
      headers: { Authorization: token },
    })
      .then((res) => res.json())
      .then((userData) => setUser(userData));
  }, []);

  const handleNavigateToSetup = () => {
    navigate("/setup");
  };

  //handlers
  const handleIntentionChange = (goalId) => (e) => {
    updateGoalField(goalId, "intention", e.target.value);
  };

  const handleFieldChange = (goalId, field) => (e) => {
    updateGoalField(goalId, field, e.target.value);
  };

  const handleSaveGoal = (goalId) => {
    const goalToSave = goals.find((goal) => goal._id === goalId);
    updateGoal(goalId, goalToSave);
  };

  const handleCompleteGoal = (goalId) => () => {
    completeGoal(goalId);
  };

  const handleUserStatus = (option) => {
    const token = localStorage.getItem("accessToken");
    const isPublic = option === "public";

    fetch(`${API_BASE_URL}/users/public-status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ isPublic }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to update profile status");
        }
        return response.json();
      })
      .then(() => {
        setUser({ ...user, isPublic });
      })
      .catch((error) => {
        console.error("Failed to update profile status:", error);
      });
  };

  //loading message
  if (loading) {
    return <Message>Loading your dashboard...</Message>;
  }

  return (
    <main id="main-content">
      <Container>
        <h1>Welcome to your dashboard</h1>

        <ProfileSetting user={user} onOptionSelect={handleUserStatus} />

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
        <GoalsGrid>
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
        </GoalsGrid>
        <GoalChart
          incompleteCount={incompleteGoals.length}
          completedCount={completedGoals.length}
        />
      </Container>
    </main>
  );
};

export default Dashboard;
