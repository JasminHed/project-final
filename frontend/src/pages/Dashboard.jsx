import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useUserStore } from "../store/UserStore";

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

// Dashboard shows the user's intention and SMART goals, plus allows interaction with the goal (edit, complete, share)

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();

  // Local state to store goal details (intention + SMART fields)
  const [goal, setGoal] = useState({
    intention: "",
    specific: "",
    measurable: "",
    achievable: "",
    relevant: "",
    timebound: "", //should this be a calendar?
  });

  const [completed, setCompleted] = useState(false); //goal completion
  const [loading, setLoading] = useState(true); //loading state
  const [successMessage, setSuccessMessage] = useState(""); //sucessmessage

  // Fetch users latest goal
  useEffect(() => {
    const token = localStorage.getItem("accessToken");

    fetch("https://project-final-ualo.onrender.com/goals", {
      headers: {
        Authorization: token,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          // only most recent goal
          const latestGoal = data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
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
          setCompleted(latestGoal.completed); //Users can choose to put it as complete
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching goals:", error);
        setLoading(false);
      });
  }, []);

  //Toggles intention + ALL goal completion + updates front and backend
  const toggleComplete = () => {
    const token = localStorage.getItem("accessToken");
    const newCompleted = !completed;

    setCompleted(newCompleted);
    if (newCompleted) {
      setGoal(null); //If completed remove
    }

    fetch(`https://project-final-ualo.onrender.com/goals/${goal._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ completed: newCompleted }),
    }).catch((error) => console.error("Error updating completion:", error));
  };

  //Visible trackng of goals, donught chart
  const data = () => {
    return {
      labels: ["Completed", "Not Completed"],
      datasets: [
        {
          data: [completed ? 1 : 0, completed ? 0 : 1],
          backgroundColor: ["#4caf50", "#e0e0e0"],
        },
      ],
    };
  };

  // Create a community post to community page, using intention + goal + user info
  const shareToCommunity = () => {
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
        userName: user.name,
      }),
    })
      .then(() => {
        navigate("/community");
      })
      // Navigate user to community page after sharing
      .catch((error) => {
        console.error("Error sharing to community:", error);
      });
  };
  //save all edits funtion
  const saveAll = () => {
    const token = localStorage.getItem("accessToken");

    fetch(`https://project-final-ualo.onrender.com/goals/${goal._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(goal),
    })
      .then(() => {
        setSuccessMessage("Savings have been made!");
        setTimeout(() => setSuccessMessage(""), 3000);
      })
      .catch(() => {});
  };

  //Loading state
  if (loading) {
    return <p>Loading your goals...</p>;
  }

  return (
    <Container>
      <h1>Welcome to your dashboard</h1>
      <img src="/assets/12.png" alt="An image of a brain made of flowers" />
      <ButtonContainer>
        <button onClick={() => navigate("/setup")}>
          Add new intention and goals
        </button>
      </ButtonContainer>

      {goal && ( //only shows int+goal card if it is not complete
        <Section>
          <box>
            <h3>Your Intention</h3>
            <div>
              <textarea
                rows={2}
                maxLength={150}
                value={goal.intention}
                onChange={(e) =>
                  setGoal((prev) => ({ ...prev, intention: e.target.value }))
                }
              />
              <p>{goal.intention.length}/150</p>
            </div>
          </box>
          <box>
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
                <textarea
                  rows={2}
                  maxLength={150}
                  value={goal[field]}
                  onChange={(e) =>
                    setGoal((prev) => ({ ...prev, [field]: e.target.value }))
                  }
                />
                <p>{goal[field]?.length || 0}/150</p>
              </div>
            ))}
          </box>
          {successMessage && <p>{successMessage}</p>}
          <ButtonContainer>
            <button onClick={saveAll}>Save all edits</button>
            <button onClick={toggleComplete}>Mark as Completed 🏅 </button>
            <button onClick={shareToCommunity}>Share to Community</button>
          </ButtonContainer>
        </Section>
      )}
      <ChartContainer>
        <Doughnut data={data()} />
      </ChartContainer>
    </Container>
  );
};

export default Dashboard;
