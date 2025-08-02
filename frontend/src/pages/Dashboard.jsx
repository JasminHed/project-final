import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import ProfileSetting from "../components/ProfileSetting.jsx";
import { useUserStore } from "../store/UserStore.jsx";
import { ButtonBox, Textarea } from "../styling/BoxStyling.jsx";
import { Message } from "../styling/LoadingMessage.jsx";

ChartJS.register(ArcElement, Tooltip, Legend);

const API_BASE_URL = "https://project-final-ualo.onrender.com";
const SMART_FIELDS = [
  "specific",
  "measurable",
  "achievable",
  "relevant",
  "timebound",
];

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
  max-width: 500px;
  margin: 0 auto;
  display: block;

  @media (min-width: 668px) {
    max-width: 700px;
  }

  @media (min-width: 1024px) {
    max-width: 900px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  margin: 30px 0;
  flex-wrap: wrap;
`;

const ChartContainer = styled.div`
  width: 150px;
  height: 150px;
  margin: 20px auto;

  @media (min-width: 669px) {
    width: 200px;
    height: 200px;
  }
`;

const GoalCard = styled.div`
  border: 2px solid #ddd;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
  background: #f9f9f9;
`;

const SuccessMessage = styled.p`
  color: var(--color-success);
  margin-top: 8px;
  font-size: 14px;
`;

const ChartStats = styled.p`
  text-align: center;
  margin-top: 13px;
  color: var(--color-text-primary);
`;

// API Functions
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
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  //Chart
  const incompleteGoals = goals.filter((goal) => !goal.completed);
  const completedGoals = goals.filter((goal) => goal.completed);
  const chartData = {
    labels: ["Active Goals", "Completed"],
    datasets: [
      {
        data: [incompleteGoals.length, completedGoals.length],
        backgroundColor: ["#004d40", "#e47885"],
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#3750be",
          font: {
            size: 13,
          },
        },
      },
    },
  };

  // Fetch goals
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    fetchGoals(token)
      .then((response) => response.json())
      .then((data) => {
        // Filter and sort goals
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
    // Fetch user data
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

  // SMART fields handling
  const handleFieldChange = (goalId, field) => (e) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal._id === goalId ? { ...goal, [field]: e.target.value } : goal
      )
    );
  };

  //Handling saving of goal and update of goals
  const handleSaveGoal = (goalId) => () => {
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
  //handling completed goal
  const handleCompleteGoal = (goalId) => () => {
    const token = localStorage.getItem("accessToken");
    // Remove from frontend
    setGoals((prevGoals) => prevGoals.filter((goal) => goal._id !== goalId));
    // Update backend
    updateGoalAPI(goalId, { completed: true }, token).catch((error) =>
      console.error("Error updating completion:", error)
    );
  };

  //handles and sends users state to backend, public or private
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

  //loadingstate
  if (loading) {
    return <Message>Loading your dashboard...</Message>;
  }

  return (
    <main id="main-content">
      <Container>
        <h1>Welcome to your dashboard</h1>

        <ProfileSetting user={user} onOptionSelect={handleOptionSelect} />

        <p>
          Here you'll see your active goals, up to three at a time — designed to
          keep you focused and purposeful. You can add, edit, and save your
          goals whenever you like.
        </p>

        <p>
          Choose to make your profile public and your goals will be shared
          automatically with the community — so others can cheer you on, offer
          support, and celebrate your progress. Motivation grows when we grow
          together. When a goal is complete, simply check it off — it
          disappears, clearing the way for your next achievement.
        </p>

        <p>You've got this! One clear step at a time.</p>

        <Img
          src="/assets/12.png"
          alt="A graphic image showing a thinking mind with flowers around it for decoration"
        />

        <ButtonContainer>
          <button onClick={handleNavigateToSetup}>
            Add new intention and goals
          </button>
        </ButtonContainer>

        {/* Loop through goals */}

        {goals.length > 0 ? (
          goals.map((goal, index) => (
            <GoalCard key={goal._id}>
              <Section>
                <ButtonBox>
                  <h1>Your Intention</h1>
                  <div>
                    <label htmlFor={`intention-${goal._id}`}>
                      Your Intention
                    </label>
                    <Textarea
                      id={`intention-${goal._id}`}
                      rows={2}
                      maxLength={150}
                      value={goal.intention || ""}
                      onChange={handleIntentionChange(goal._id)}
                    />
                    <p>{(goal.intention || "").length}/150</p>
                  </div>
                </ButtonBox>
                <ButtonBox>
                  <h2>Your detailed goals</h2>
                  {SMART_FIELDS.map((field) => (
                    <div key={field}>
                      <strong>
                        {field.charAt(0).toUpperCase() + field.slice(1)}:
                      </strong>
                      <label htmlFor={`${field}-${goal._id}`}></label>
                      <Textarea
                        id={`${field}-${goal._id}`}
                        rows={2}
                        maxLength={150}
                        value={goal[field] || ""}
                        onChange={handleFieldChange(goal._id, field)}
                      />
                      <p>{(goal[field] || "").length}/150</p>
                    </div>
                  ))}
                </ButtonBox>

                <ButtonContainer>
                  <button onClick={handleSaveGoal(goal._id)}>
                    Save this goal
                  </button>
                  <button onClick={handleCompleteGoal(goal._id)}>
                    Mark goal as completed
                  </button>
                </ButtonContainer>
              </Section>
              {successMessage && (
                <SuccessMessage>{successMessage}</SuccessMessage>
              )}
            </GoalCard>
          ))
        ) : (
          <p>No active intention and goal. Create your first!</p>
        )}

        <ChartContainer
          aria-label={`Goal progress: ${incompleteGoals.length} active, ${completedGoals.length} completed`}
        >
          <Doughnut data={chartData} options={chartOptions} />
        </ChartContainer>
        <ChartStats>
          Active: {incompleteGoals.length} | Completed: {completedGoals.length}
        </ChartStats>
      </Container>
    </main>
  );
};

export default Dashboard;
