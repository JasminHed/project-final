import React, { useState } from "react";

const Community = () => {
  const [filter, setFilter] = useState("Everyone");

  // Example data (replace with real data later)
  const goals = [
    {
      id: 1,
      intention: "Improve health",
      areaOfLife: "Health",
      goalType: "Public",
      comments: 5,
      likes: 10,
      heja: 3,
    },
    {
      id: 2,
      intention: "Learn React",
      areaOfLife: "Career",
      goalType: "Private",
      comments: 2,
      likes: 4,
      heja: 1,
    },
  ];

  // Filter goals based on toggle
  const filteredGoals = goals.filter((goal) => {
    if (filter === "Everyone") return goal.goalType === "Public";
    return true;
  });

  return (
    <div>
      <h1>Community</h1>
      <label>
        Show me:{" "}
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>Everyone</option>
        </select>
      </label>

      {filteredGoals.map((goal) => (
        <div key={goal.id}>
          <h2>{goal.intention}</h2>
          <h4>{goal.areaOfLife}</h4>
          <p>Type: {goal.goalType}</p>
          <p>
            💬 {goal.comments} | ❤️ {goal.likes}
          </p>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default Community;
