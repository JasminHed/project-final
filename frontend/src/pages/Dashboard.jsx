import React, { useEffect, useState } from "react";
import { EditText } from "react-edit-text";

//todo: should the mark complee complete all, just one goal at a time not the whole main goal. Where is the intention? Cannot edit at the momen

const Dashboard = () => {
  const [goal, setGoal] = useState({
    intention: "",
    specific: "",
    measurable: "",
    achievable: "",
    relevant: "",
    timebound: "", //should this be a calendar?
  });

  const [completed, setCompleted] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [points, setPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({ name: "", email: "" }); //usign name + emial of user dynamically

  // Fetch user data separately
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const userId = localStorage.getItem("userId");

    if (userId && token) {
      fetch(`http://localhost:8080/users/${userId}`, {
        headers: { Authorization: token },
      })
        .then((res) => res.json())
        .then((userData) => {
          setUser({ name: userData.name, email: userData.email });
        });
    }
  }, []);

  // Fetch goals from backend
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    fetch("http://localhost:8080/goals", {
      headers: {
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const latestGoal = data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt) //only show latest int+goal
          )[0];
          setGoal({
            _id: latestGoal._id,
            intention: latestGoal.intention || "",
            specific: latestGoal.specific,
            measurable: latestGoal.measurable,
            achievable: latestGoal.achievable,
            relevant: latestGoal.relevant,
            timebound: latestGoal.timebound,
          });
          setCompleted(latestGoal.completed); //users can choose to put it as complete or public
          setIsPublic(latestGoal.isPublic);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching goals:", error);
        setLoading(false);
      });
  }, []);

  const onSave = ({ name, value }) => {
    const token = localStorage.getItem("accessToken");

    setGoal((prev) => ({ ...prev, [name]: value }));

    // Update backend instead of localStorage when edited
    fetch(`http://localhost:8080/goals/${goal._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ [name]: value }),
    }).catch((error) => console.error("Error updating goal:", error));
  };

  const toggleComplete = () => {
    const token = localStorage.getItem("accessToken");
    const newCompleted = !completed;

    setCompleted(newCompleted);
    setPoints((prev) => (completed ? prev - 10 : prev + 10));

    // Update backend with goals
    fetch(`http://localhost:8080/goals/${goal._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ completed: newCompleted }),
    }).catch((error) => console.error("Error updating completion:", error));
  };

  const togglePublic = () => {
    const token = localStorage.getItem("accessToken");
    const newIsPublic = !isPublic;

    setIsPublic(newIsPublic);

    // Update backend
    fetch(`http://localhost:8080/goals/${goal._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ isPublic: newIsPublic }),
    }).catch((error) => console.error("Error updating visibility:", error));
  };

  if (loading) {
    return <div>Loading your goals...</div>;
  }

  //this is function to the share to community button
  const shareToCommunity = () => {
    const token = localStorage.getItem("accessToken");

    fetch("http://localhost:8080/community-posts", {
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
        userName: user.name,
      }),
    });
  };

  return (
    <div>
      <h1>Your Intention and Goals</h1>
      <p>Welcome, {user.name}</p>
      <p>Email: {user.email}</p>

      <div>
        <h3>Your Intention</h3>
        <div>
          <EditText
            name="intention"
            value={goal.intention || "No intention set"}
            onSave={onSave}
          />
        </div>
        <h3>Your detailed goals</h3>
        {["specific", "measurable", "achievable", "relevant", "timebound"].map(
          (field) => (
            <div key={field}>
              <strong>{field.charAt(0).toUpperCase() + field.slice(1)}:</strong>
              <EditText name={field} value={goal[field]} onSave={onSave} />
            </div>
          )
        )}

        <button onClick={shareToCommunity}>Share to Community</button>
      </div>

      <h3>Tracking & Gamification</h3>

      <p>Points earned: {points}</p>
    </div>
  );
};

export default Dashboard;
