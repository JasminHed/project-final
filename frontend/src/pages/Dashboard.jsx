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
import CommunityWidget from "../components/CommunityWidget.jsx";

const API_BASE_URL = "https://project-final-ualo.onrender.com";

const Container = styled.div`
  padding: 24px 16px 32px;
  max-width: 100%;
  margin: 0 auto;

  @media (min-width: 669px) {
    padding: 48px 24px 64px;
    max-width: 1200px;
  }

  @media (min-width: 1025px) {
    padding: 64px 32px 80px;
    max-width: 1400px;
  }

  section[aria-label="Introduction"] {
    text-align: center;
    margin: 32px 0;

    p {
      margin-bottom: 20px;
    }
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
  max-height: 240px;
  margin: 32px auto;
  display: block;
  object-fit: cover;
  border-radius: 16px;

  @media (min-width: 669px) {
    max-height: 300px;
    margin: 48px auto;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  margin: 32px 0;
  flex-wrap: wrap;

  @media (min-width: 669px) {
    margin: 40px 0;
  }
`;

/*const GoalCard = styled.div`
  border: 2px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  background: #f9f9f9;
`;*/

const ErrorMessage = styled.p`
  color: var(--color-error);
  margin-bottom: 16px;
  text-align: center;
  padding: 16px 20px;
  font-weight: 500;
`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();

  const {
    goals,
    loading,
    successMessage,
    shareSuccessMessage,
    updateGoal,
    completeGoal,
    updateGoalField,
    shareGoal,
  } = useGoal();

  const incompleteGoals = goals.filter((goal) => !goal.completed);
  const completedGoals = goals.filter((goal) => goal.completed);

  //Handler for max 3 int+goals at once
  const [showMaxMessage, setShowMaxMessage] = useState(false);
  const handleAddGoalClick = () => {
    if (goals.length >= 3) {
      setShowMaxMessage(true);
      setTimeout(() => setShowMaxMessage(false), 3000); // 3 sec
    } else {
      navigate("/setup");
    }
  };

  // user-fetching
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    if (!token) return;

    fetch(`${API_BASE_URL}/users/me`, {
      headers: {
        Authorization: token,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.success) setUser(data.user);
      })
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  //handlers
  const handleIntentionChange = (goalId) => (e) => {
    updateGoalField(goalId, "intention", e.target.value);
  };

  const handleFieldChange = (goalId, field) => (e) => {
    const value = field === "started" ? e.target.checked : e.target.value;
    updateGoalField(goalId, field, value);
  };

  const handleSaveGoal = (goalId) => {
    const goalToSave = goals.find((goal) => goal._id === goalId);
    updateGoal(goalId, goalToSave);
  };

  const handleCompleteGoal = (goalId) => () => {
    completeGoal(goalId);
  };

  const handleShareGoal = (goalId) => {
    shareGoal(goalId);
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
    <>
      <main id="main-content">
        <Container>
          <h1>Welcome to your dashboard</h1>

          <ProfileSetting user={user} onOptionSelect={handleUserStatus} />

          <section aria-label="Introduction">
            <p>
              Here you'll see your active goals, up to three at a time —
              designed to keep you focused and purposeful. You can add, edit,
              and save your goals whenever you like.
            </p>
            <p>
              Choose to make your profile public and your goals will be shared
              automatically with the community — so others can cheer you on,
              offer support, and celebrate your progress.
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
            <ButtonContainer>
              <button
                onClick={handleAddGoalClick}
                aria-label={
                  goals.length >= 3
                    ? "Maximum of 3 goals reached"
                    : "Add new intention and goals"
                }
              >
                Add new intention and goals here
              </button>
            </ButtonContainer>
          </ButtonContainer>
          {showMaxMessage && (
            <ErrorMessage>
              There is a maximum of 3 saved intention and goal cards. It's to
              help you stay focused and not feel overwhelmed.
            </ErrorMessage>
          )}
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
                  onShare={handleShareGoal}
                  successMessage={successMessage}
                  shareSuccessMessage={shareSuccessMessage}
                />
              ))
            ) : (
              <p>No active intention and goal. Create your first!</p>
            )}
          </GoalsGrid>
          <GoalChart goals={goals} />
        </Container>
      </main>
      <CommunityWidget />
    </>
  );
};

export default Dashboard;
