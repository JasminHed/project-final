import React from "react";
import styled from "styled-components";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

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

const GoalChart = ({ incompleteCount, completedCount }) => {
  const chartData = {
    labels: ["Active Goals", "Completed"],
    datasets: [
      {
        data: [incompleteCount, completedCount],
        backgroundColor: ["#004d40", "#e47885"],
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
        aria-label={`Goal progress: ${incompleteCount} active, ${completedCount} completed`}
      >
        <Doughnut data={chartData} options={chartOptions} />
      </ChartContainer>
      <ChartStats>
        Active: {incompleteCount} | Completed: {completedCount}
      </ChartStats>
    </>
  );
};

export default GoalChart;
