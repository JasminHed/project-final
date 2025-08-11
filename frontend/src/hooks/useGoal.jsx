import { useState, useEffect } from "react";

const API_BASE_URL = "https://project-final-ualo.onrender.com";

const useGoals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchGoals = () => {
    const token = localStorage.getItem("accessToken");
    fetch(`${API_BASE_URL}/goals`, {
      headers: { Authorization: token },
    })
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
  };

  const updateGoal = (goalId, goalData) => {
    const token = localStorage.getItem("accessToken");
    fetch(`${API_BASE_URL}/goals/${goalId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(goalData),
    })
      .then(() => {
        setSuccessMessage("Goal saved successfully!");
        setTimeout(() => setSuccessMessage(""), 4000);
      })
      .catch((error) => {
        console.error("Error saving goal:", error);
      });
  };

  const completeGoal = (goalId) => {
    const token = localStorage.getItem("accessToken");
    setGoals((prevGoals) => prevGoals.filter((goal) => goal._id !== goalId));

    fetch(`${API_BASE_URL}/goals/${goalId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ completed: true }),
    }).catch((error) => console.error("Error updating completion:", error));
  };

  const updateGoalField = (goalId, field, value) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal._id === goalId ? { ...goal, [field]: value } : goal
      )
    );
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return {
    goals,
    loading,
    successMessage,
    updateGoal,
    completeGoal,
    updateGoalField,
  };
};

export default useGoals;
