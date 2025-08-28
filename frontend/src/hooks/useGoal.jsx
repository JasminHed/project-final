import { useEffect, useState } from "react";

const API_BASE_URL = "https://project-final-ualo.onrender.com";

const useGoal = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [shareSuccessMessage, setShareSuccessMessage] = useState("");

  //fetches the user’s goals (id), filters out completed ones, sorts by newest, limits to three
  const fetchGoals = () => {
    const token = localStorage.getItem("accessToken");
    fetch(`${API_BASE_URL}/goals`, {
      headers: { Authorization: token },
    })
      .then((response) => response.json())
      .then((data) => {
        // array of data
        const goalsArray = Array.isArray(data) ? data : data.goals;
        if (!Array.isArray(goalsArray)) {
          console.error("Unexpected goals data format:", data);
          setGoals([]);
          setLoading(false);
          return;
        }

        const filteredGoals = goalsArray
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
  //removes a goal locally and marks it as completed on the server
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
  //toggles a goal’s started status
  const toggleGoalStarted = (goalId, value) => {
    // save locally for UI
    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal._id === goalId ? { ...goal, started: value } : goal
      )
    );
    // send to backend for persistent
    const goalToUpdate = goals.find((goal) => goal._id === goalId) || {};
    const updatedGoal = { ...goalToUpdate, started: value };

    const token = localStorage.getItem("accessToken");
    fetch(`${API_BASE_URL}/goals/${goalId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(updatedGoal),
    })
      .then(() => {
        setSuccessMessage("Goal updated!");
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch((err) => console.error("Error updating goal:", err));
  };

  //shares or unshares a goal to the community, updates the UI, and sends to server
  const toggleShareGoal = (goalId) => {
    const goalToUpdate = goals.find((goal) => goal._id === goalId);
    if (!goalToUpdate) return;

    const updatedShared = !goalToUpdate.shareToCommunity;

    setGoals((prevGoals) =>
      prevGoals.map((goal) =>
        goal._id === goalId
          ? { ...goal, shareToCommunity: updatedShared }
          : goal
      )
    );

    const token = localStorage.getItem("accessToken");

    fetch(`${API_BASE_URL}/goals/${goalId}/share`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({
        shareToCommunity: updatedShared,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setShareSuccessMessage(
            updatedShared
              ? "Goal shared to community!"
              : "Goal removed from community"
          );
        } else {
          setGoals((prevGoals) =>
            prevGoals.map((goal) =>
              goal._id === goalId
                ? { ...goal, shareToCommunity: !updatedShared }
                : goal
            )
          );
          setShareSuccessMessage("Failed to update goal sharing.");
        }
        setTimeout(() => setShareSuccessMessage(""), 3000);
      })
      .catch((error) => {
        console.error("Share error:", error);

        setGoals((prevGoals) =>
          prevGoals.map((goal) =>
            goal._id === goalId
              ? { ...goal, shareToCommunity: !updatedShared }
              : goal
          )
        );
        setShareSuccessMessage("Error sharing goal.");
        setTimeout(() => setShareSuccessMessage(""), 3000);
      });
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  return {
    goals,
    loading,
    successMessage,
    shareSuccessMessage,
    completeGoal,
    toggleGoalStarted,
    toggleShareGoal,
  };
};

export default useGoal;
