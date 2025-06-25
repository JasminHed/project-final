import React, { useEffect, useState } from "react";
import { EditText } from "react-edit-text";

import "react-edit-text/dist/index.css";

const Dashboard = () => {
  const savedGoal = JSON.parse(localStorage.getItem("goalSetup")) || {
    specific: "",
    measurable: "",
    achievable: "",
    relevant: "",
    timebound: "",
  };

  const [goal, setGoal] = useState(savedGoal);
  const [completed, setCompleted] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [points, setPoints] = useState(0);

  const user = { name: "Jane Doe", email: "jane@example.com" };

  const onSave = ({ name, value }) => {
    setGoal((prev) => ({ ...prev, [name]: value }));
    localStorage.setItem(
      "goalSetup",
      JSON.stringify({ ...goal, [name]: value })
    );
  };

  const toggleComplete = () => {
    setCompleted(!completed);
    setPoints((prev) => (completed ? prev - 10 : prev + 10));
  };

  const togglePublic = () => {
    setIsPublic(!isPublic);
  };

  return (
    <div>
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>

      <h2>Your Intention + Goal</h2>
      <div>
        {["specific", "measurable", "achievable", "relevant", "timebound"].map(
          (field) => (
            <div key={field}>
              <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
              <EditText name={field} value={goal[field]} onSave={onSave} />
            </div>
          )
        )}

        <button onClick={toggleComplete}>
          {completed ? "Mark as Incomplete" : "Mark as Complete"}
        </button>

        <button onClick={togglePublic}>
          {isPublic ? "Make Private" : "Make Public"}
        </button>

        <p>Status: {completed ? "Completed 🏆" : "In Progress ⏳"}</p>
        <p>Visibility: {isPublic ? "Public 📢" : "Private 🔒"}</p>
      </div>

      <h3>Tracking & Gamification</h3>
      <p>Points earned: {points}</p>
    </div>
  );
};

export default Dashboard;
