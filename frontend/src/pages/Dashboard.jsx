import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useUserStore } from "../store/UserStore.jsx";
import DashboardForm from "../components/DashboardForm.jsx";
import GoalChart from "../components/GoalChart.jsx";
import { Message } from "../styling/LoadingMessage.jsx";
import useGoal from "../hooks/useGoal.jsx";
import Widget from "../components/Widget.jsx";

const API_BASE_URL = "https://project-final-ualo.onrender.com";

const Container = styled.section`
  padding: 32px 16px;
  max-width: 100%;
  margin: 0 auto;

  @media (min-width: 668px) {
    padding: 64px 24px;
    max-width: 1200px;
  }

  @media (min-width: 1024px) {
    padding: 80px 32px;
    max-width: 1400px;
  }

  section[aria-label="Introduction"] {
    padding: 40px 16px 20px;
    max-width: 800px;
    margin: 0 auto;

    @media (min-width: 668px) {
      padding: 60px 32px 50px;
    }

    @media (min-width: 1024px) {
      padding: 80px 32px 60px;
    }
    p {
      margin-bottom: 10px;
    }
  }
`;

const GoalsGrid = styled.section`
  display: block; /* default for mobile */

  @media (min-width: 668px) and (max-width: 1600px) {
    display: grid;
    grid-template-columns: ${({ $count }) =>
      $count === 1 ? "1fr" : "1fr 1fr"};
    gap: 20px;
    align-items: start;
    justify-items: center;
    align-items: start;
  }

  @media (min-width: 1024px) {
    gap: 40px;
    margin-top: 40px;
    margin-bottom: 40px;
  }
`;

const ErrorMessage = styled.p`
  color: var(--color-error);
  margin-bottom: 16px;
  text-align: center;
  padding: 14px 18px;
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
    //updateGoal,
    completeGoal,
    toggleGoalStarted,
    toggleShareGoal,
  } = useGoal();

  //const incompleteGoals = goals.filter((goal) => !goal.completed);
  //const completedGoals = goals.filter((goal) => goal.completed);

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
  const handleStartToggle = (goalId) => (e) => {
    toggleGoalStarted(goalId, e.target.checked);
  };

  const handleCompleteGoal = (goalId) => () => {
    completeGoal(goalId);
  };

  //loading message
  if (loading) {
    return <Message>Loading your dashboard...</Message>;
  }

  return (
    <>
      <main id="main-content">
        <Container>
          <h1>
            Welcome to your dashboard {user?.name ? `, ${user.name}` : ""}!
          </h1>
          <section aria-label="Introduction">
            <p>
              Here you'll see your active goals, up to three at a time —
              designed to keep you focused and purposeful. You can add, edit,
              and save your goals whenever you like.Choose to make your profile
              public and your goals will be shared automatically with the
              community — so others can cheer you on, offer support, and
              celebrate your progress.
            </p>
            <p>You've got this! One clear step at a time.</p>
          </section>
        </Container>

        <Widget goals={goals} handleAddGoalClick={handleAddGoalClick} />

        <Container>
          <GoalsGrid $count={goals.length}>
            {goals.length > 0 ? (
              goals.map((goal) => (
                <DashboardForm
                  key={goal._id}
                  goal={goal}
                  onStartToggle={handleStartToggle(goal._id)}
                  onComplete={handleCompleteGoal(goal._id)}
                  onShare={() => toggleShareGoal(goal._id)}
                  onSave={() => {}}
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
    </>
  );
};

export default Dashboard;
