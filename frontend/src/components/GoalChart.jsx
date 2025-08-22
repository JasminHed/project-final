import { ArcElement, Chart as ChartJS, Legend, Tooltip } from "chart.js";
import React from "react";
import { Doughnut } from "react-chartjs-2";
import styled from "styled-components";

ChartJS.register(ArcElement, Tooltip, Legend);

const ChartContainer = styled.div`
  width: 150px;
  height: 150px;
  margin: 20px auto;

  @media (min-width: 669px) {
    width: 200px;
    height: 200px;
  }
`;

const ChartStats = styled.p`
  text-align: center;
  margin-top: 13px;
  color: var(--color-text-primary);
`;

const GoalChart = ({ goals }) => {
  const startedGoals = goals.filter((goal) => goal.started).length;
  const notStartedGoals = goals.length - startedGoals;

  const chartData = {
    labels: ["Started", "Not Started"],
    datasets: [
      {
        data: [startedGoals, notStartedGoals],
        backgroundColor: ["#008080", "#e48b9e"],
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
        aria-valuenow={startedGoals}
        aria-valuemin={0}
        aria-valuemax={goals.length}
        aria-label="Goal progress"
      >
        <Doughnut data={chartData} options={chartOptions} />
      </ChartContainer>
      <ChartStats>
        Started: {startedGoals} | Not Started: {notStartedGoals}
      </ChartStats>
    </>
  );
};

export default GoalChart;
