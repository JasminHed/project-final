import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
//external library for in-place editing
import { EditText } from "react-edit-text";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import "react-edit-text/dist/index.css";

ChartJS.register(ArcElement, Tooltip, Legend);

const Container = styled.div`
  padding: 80px 20px 100px;
  max-width: 100%;
  margin: 0 auto;

  @media (min-width: 669px) {
    max-width: 800px;
  }
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
`;

const UserInfo = styled.div`
  text-align: center;
  margin-bottom: 30px;

  p {
    margin-bottom: 5px;
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

const GoalBox = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
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

//Add useGoalTracker!!

// Dashboard shows the user's intention and SMART goals, plus allows interaction with the goal (edit, complete, share)

const Dashboard = () => {
  const navigate = useNavigate();
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
  const [user, setUser] = useState({ name: "", email: "" }); //user info

  // Fetch users info
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

  // Fetch users latest goal
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
          //setIsPublic(latestGoal.isPublic);
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching goals:", error);
        setLoading(false);
      });
  }, []);

  //Inline editing of goals (edittext)
  const onSave = ({ name, value }) => {
    const token = localStorage.getItem("accessToken");

    //Update local state of change so it shows directly
    setGoal((prev) => ({ ...prev, [name]: value }));

    // Sync edit change, if any, to backend
    fetch(`http://localhost:8080/goals/${goal._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ [name]: value }),
    }).catch((error) => console.error("Error updating goal:", error));
  };

  //Toggles intention + ALL goal completion + updates front and backend
  const toggleComplete = () => {
    const token = localStorage.getItem("accessToken");
    const newCompleted = !completed;

    setCompleted(newCompleted);
    if (newCompleted) {
      setGoal(null); //If completed remove
    }

    fetch(`http://localhost:8080/goals/${goal._id}`, {
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
    })
      .then(() => {
        navigate("/community");
      })
      // Navigate user to community page after sharing
      .catch((error) => {
        console.error("Error sharing to community:", error);
      });
  };

  //Loading state
  if (loading) {
    return <p>Loading your goals...</p>;
  }

  return (
    <Container>
      <Title>Welcome to your dashboard</Title>
      <ButtonContainer>
        <button onClick={() => navigate("/setup")}>
          Add new intention and goals
        </button>
      </ButtonContainer>
      <UserInfo>
        <p>Welcome, {user.name}</p>
        <p>Email: {user.email}</p>
      </UserInfo>

      {goal && ( //only shows int+goal card if it is not complete
        <Section>
          <GoalBox>
            <h3>Your Intention</h3>
            <div>
              <EditText
                name="intention"
                value={goal.intention || "No intention set"}
                onSave={onSave}
              />
            </div>
          </GoalBox>
          <GoalBox>
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

                <EditText
                  name={field}
                  value={goal[field] || ""}
                  onSave={onSave}
                />
              </div>
            ))}
          </GoalBox>
          <ButtonContainer>
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
