import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useUserStore } from "../store/UserStore";
import { Box, Textarea } from "../styling/BoxStyling.jsx";

//we need to be able to get to community when we click share to community.

ChartJS.register(ArcElement, Tooltip, Legend);

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

// New! Check colors!
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

  // Array of goals, new! Instead of object with 1 goal, array gives us a list!
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch 3 latest goals
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    fetch("https://project-final-ualo.onrender.com/goals", {
      headers: {
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Filter away completed goals, show latest 3
        const incompleteGoals = data
          .filter((goal) => !goal.completed)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3);

        setGoals(incompleteGoals);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching goals:", error);
        setLoading(false);
      });
  }, []);

  // Array, update list
  const updateGoal = (goalId, field, value) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal._id === goalId ? { ...goal, [field]: value } : goal
      )
    );
  };

  // Mark complete and remove from list
  const toggleComplete = (goalId) => {
    const token = localStorage.getItem("accessToken");

    // Remove from frontend
    setGoals((prevGoals) => prevGoals.filter((goal) => goal._id !== goalId));

    // Update backend
    fetch(`https://project-final-ualo.onrender.com/goals/${goalId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ completed: true }),
    }).catch((error) => console.error("Error updating completion:", error));
  };

  // Based on, completed and not completed
  const data = () => {
    const incompleteCount = goals.length;
    const totalGoals = incompleteCount > 0 ? incompleteCount : 1;

    return {
      labels: ["Active Goals", "Completed"],
      datasets: [
        {
          data: [incompleteCount, 0],
          backgroundColor: ["#4caf50", "#e0e0e0"],
        },
      ],
    };
  };

  // Share specific goal to community
  const shareToCommunity = (goal) => {
    const token = localStorage.getItem("accessToken");

    fetch("https://project-final-ualo.onrender.com/community-posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        intention: goal.intention,
        specific: goal.specific,
        measurable: goal.measurable,
        achievable: goal.achievable,
        relevant: goal.relevant,
        timebound: goal.timebound,
        userName: user?.name,
      }),
    })
      .then(() => {
        navigate("/community");
      })
      .catch((error) => {
        console.error("Error sharing to community:", error);
      });
  };

  // Save specific goal
  const saveGoal = (goalId) => {
    const token = localStorage.getItem("accessToken");
    const goalToSave = goals.find((goal) => goal._id === goalId);

    fetch(`https://project-final-ualo.onrender.com/goals/${goalId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(goalToSave),
    })
      .then(() => {
        setSuccessMessage("Goal saved successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((error) => {
        console.error("Error saving goal:", error);
      });
  };

  if (loading) {
    return <p>Loading your goals...</p>;
  }

  return (
    <Container>
      <h1>Welcome to your dashboard</h1>
      <Img src="/assets/12.png" alt="A graphic image of mind made of flowers" />
      <ButtonContainer>
        <button onClick={() => navigate("/setup")}>
          Add new intention and goals
        </button>
      </ButtonContainer>

      {/*/Loop throug goals */}
      {goals.length > 0 ? (
        goals.map((goal, index) => (
          <GoalCard key={goal._id}>
            <h2>Goal {index + 1}</h2>
            <Section>
              <Box>
                <h3>Your Intention</h3>
                <div>
                  <Textarea
                    rows={2}
                    maxLength={150}
                    value={goal.intention || ""}
                    onChange={(e) =>
                      updateGoal(goal._id, "intention", e.target.value)
                    }
                  />
                  <p>{(goal.intention || "").length}/150</p>
                </div>
              </Box>
              <Box>
                <h3>Your detailed goals</h3>
                {[
                  "specific",
                  "measurable",
                  "achievable",
                  "relevant",
                  "timebound",
                ].map((field) => (
                  <div key={field}>
                    <strong>
                      {field.charAt(0).toUpperCase() + field.slice(1)}:
                    </strong>
                    <Textarea
                      rows={2}
                      maxLength={150}
                      value={goal[field] || ""}
                      onChange={(e) =>
                        updateGoal(goal._id, field, e.target.value)
                      }
                    />
                    <p>{(goal[field] || "").length}/150</p>
                  </div>
                ))}
              </Box>

              <ButtonContainer>
                <button onClick={() => saveGoal(goal._id)}>
                  Save this goal
                </button>
                <button onClick={() => toggleComplete(goal._id)}>
                  Mark as completed
                </button>
                <button onClick={() => shareToCommunity(goal)}>
                  Share to community
                </button>
              </ButtonContainer>
            </Section>
          </GoalCard>
        ))
      ) : (
        <p>No active goals. Create your first goal!</p>
      )}

      {successMessage && <p>{successMessage}</p>}

      <ChartContainer>
        <Doughnut data={data()} />
      </ChartContainer>
    </Container>
  );
};

export default Dashboard;
