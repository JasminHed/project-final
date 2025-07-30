import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useUserStore } from "../store/UserStore.jsx";
import { Box, Textarea } from "../styling/BoxStyling.jsx";

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

const Message = styled.p`
  color: var(--color-success);
  margin-bottom: 10px;
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

  //Public profile
  const [isPublic, setIsPublic] = useState(user?.isPublic || false);

  const updatePublicStatus = (newStatus) => {
    const token = localStorage.getItem("accessToken");

    fetch(`${API_BASE_URL}/users/public-status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ isPublic: newStatus }),
    })
      .then((res) => res.json())
      .then(() => {
        setIsPublic(newStatus);
        setSuccessMessage(
          "Your profile is now public. This means all users can see your name, intention and goals in the Community. They disappear when marked as complete."
        );
        setTimeout(() => setSuccessMessage(""), 5000);
      })
      .catch((err) => console.error("Failed to update public status", err));
  };

  // State
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  // Values for chart.js
  const incompleteGoals = goals.filter((goal) => !goal.completed);
  const chartData = {
    labels: ["Active Goals", "Completed"],
    datasets: [
      {
        data: [incompleteGoals.length, 0],
        backgroundColor: ["#659767", "#e0e0e0"],
      },
    ],
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

  const handleSaveGoal = (goalId) => () => {
    const token = localStorage.getItem("accessToken");
    const goalToSave = goals.find((goal) => goal._id === goalId);

    const updatedGoal = {
      ...goalToSave,
      isPublic: isPublic,
    };

    updateGoalAPI(goalId, updatedGoal, token)
      .then(() => {
        if (isPublic) {
          setSuccessMessage(
            "Goal saved and shared publicly! Other users can now see your name, intention, and goal in the community."
          );
        } else {
          setSuccessMessage("Goal saved successfully!");
        }
        setTimeout(() => {
          setSuccessMessage("");
        }, 4000);
      })
      .catch((error) => {
        console.error("Error saving goal:", error);
      });
  };

  const handleCompleteGoal = (goalId) => () => {
    const token = localStorage.getItem("accessToken");

    // Remove from frontend
    setGoals((prevGoals) => prevGoals.filter((goal) => goal._id !== goalId));

    // Update backend
    updateGoalAPI(goalId, { completed: true }, token).catch((error) =>
      console.error("Error updating completion:", error)
    );
  };

  if (loading) {
    return <p>Loading your goals...</p>;
  }

  return (
    <Container>
      <h1>Welcome to your dashboard</h1>
      <p>
        Here you’ll see your active goals, up to three at a time — designed to
        keep you focused and purposeful. You can add, edit, and save your goals
        whenever you like.{" "}
      </p>

      <p>
        Choose to make your profile public and your goals will be shared
        automatically with the community — so others can cheer you on, offer
        support, and celebrate your progress. Motivation grows when we grow
        together. When a goal is complete, simply check it off — it disappears,
        clearing the way for your next achievement.{" "}
      </p>

      <p>You’ve got this! One clear step at a time.</p>

      <label>
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => updatePublicStatus(e.target.checked)}
        />
        Make my profile public
      </label>
      <hr />

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
              <Box>
                <h3>Your Intention</h3>
                <div>
                  <Textarea
                    rows={2}
                    maxLength={150}
                    value={goal.intention || ""}
                    onChange={handleIntentionChange(goal._id)}
                  />
                  <p>{(goal.intention || "").length}/150</p>
                </div>
              </Box>
              <Box>
                <h3>Your detailed goals</h3>
                {SMART_FIELDS.map((field) => (
                  <div key={field}>
                    <strong>
                      {field.charAt(0).toUpperCase() + field.slice(1)}:
                    </strong>
                    <Textarea
                      rows={2}
                      maxLength={150}
                      value={goal[field] || ""}
                      onChange={handleFieldChange(goal._id, field)}
                    />
                    <p>{(goal[field] || "").length}/150</p>
                  </div>
                ))}
              </Box>

              <ButtonContainer>
                <button onClick={handleSaveGoal(goal._id)}>
                  Save this goal
                </button>
                <button onClick={handleCompleteGoal(goal._id)}>
                  Mark as completed
                </button>
              </ButtonContainer>
            </Section>
          </GoalCard>
        ))
      ) : (
        <p>No active goals. Create your first goal!</p>
      )}

      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}

      <ChartContainer>
        <Doughnut data={chartData} />
      </ChartContainer>
    </Container>
  );
};

export default Dashboard;
