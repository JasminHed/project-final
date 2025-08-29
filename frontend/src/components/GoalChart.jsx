import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { FaMedal } from "react-icons/fa";
import styled from "styled-components";

import { Message } from "../styling/LoadingMessage.jsx";

ChartJS.register(ArcElement, Tooltip, Legend);

const API_BASE_URL = "https://project-final-ualo.onrender.com";

const ChartContainer = styled.div`
  width: 150px;
  height: 150px;
  margin: 20px auto;

  @media (min-width: 668px) {
    width: 200px;
    height: 200px;
  }
`;

const ChartStats = styled.p`
  text-align: center;
  margin-top: 13px;
  color: var(--color-text-primary);
`;

const Medal = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15px;
  font-size: 20px;
  color: #0891b2;
`;

const MedalIcon = styled(FaMedal)`
  font-size: 40px;
  color: var(--color-button-bg);
`;

const GoalChart = () => {
  const [stats, setStats] = useState({
    started: 0,
    notStarted: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = () => {
      const token = localStorage.getItem("accessToken");
      fetch(`${API_BASE_URL}/goals/stats`, {
        headers: { Authorization: token },
      })
        .then((response) => response.json())
        .then((data) => {
          setStats(data);
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching goal stats:", error);
          setLoading(false);
        });
    };

    fetchStats(); // Initial fetch
    const interval = setInterval(fetchStats, 5000); // Every 5 seconds

    return () => clearInterval(interval); // Cleanup
  }, []);

  if (loading) return <Message>Loading chart...</Message>;

  const chartData = {
    labels: ["Started", "Not Started"],
    datasets: [
      {
        data: [stats.started, stats.notStarted],
        backgroundColor: ["#1e293b", "#d1d5db"],
      },
    ],
  };

  const chartOptions = {
    plugins: {
      legend: {
        labels: {
          color: "#3750be",
          font: { size: 13 },
        },
      },
    },
  };

  return (
    <>
      <ChartContainer
        role="progressbar"
        aria-valuenow={Number(stats.started) || 0}
        aria-valuemin={0}
        aria-valuemax={
          (Number(stats.started) || 0) + (Number(stats.notStarted) || 0)
        }
        aria-label="Goal progress"
      >
        <Doughnut data={chartData} options={chartOptions} />
      </ChartContainer>

      <Medal>
        <MedalIcon aria-label="Completed goals medal" />
        {stats.completed} Completed
      </Medal>
      <ChartStats>
        Started: {stats.started} | Not Started: {stats.notStarted}
      </ChartStats>
    </>
  );
};

export default GoalChart;
