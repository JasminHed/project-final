import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const WidgetGrid = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  gap: 20px;
  margin: 40px 0;
  padding: 10px;

  @media (min-width: 668px) {
    grid-template-columns: repeat(2, minmax(200px, 300px));
    justify-content: center;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, minmax(200px, 300px));
    justify-content: center;
  }
`;

const Widget = styled.div`
  background: var(--card-color-bg);
  color: var(--color-text-primary);
  padding: 16px;
  border-radius: 12px;
  width: 260px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1); /* lite lyft-effekt */
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: ${(props) => (props.disabled ? "none" : "translateY(-3px)")};
    box-shadow: ${(props) =>
      props.disabled
        ? "0 4px 10px rgba(0,0,0,0.1)"
        : "0 8px 16px rgba(0,0,0,0.15)"};
  }

  h3 {
    margin-bottom: 8px;
  }
`;

const Count = styled.p`
  margin: 4px 0;
  opacity: 0.9;
  font-weight: 500;
`;

const ErrorMessage = styled.p`
  min-height: 24px;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
  color: var(--color-error);
`;

const Widgets = ({ goals, handleAddGoalClick }) => {
  const [communityCount, setCommunityCount] = useState(0);
  const [showMaxMessage, setShowMaxMessage] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("https://project-final-ualo.onrender.com/community-posts")
      .then((res) => res.json())
      .then((data) => setCommunityCount(data.length || 0))
      .catch(() => setCommunityCount(0));
  }, []);

  const handleAddClick = () => {
    if (goals.length >= 3) {
      setShowMaxMessage(true);
      setTimeout(() => setShowMaxMessage(false), 3000);
    } else {
      handleAddGoalClick();
    }
  };

  return (
    <>
      <WidgetGrid>
        <Widget
          role="button"
          tabIndex={0}
          onClick={() => navigate("/community")}
          onKeyPress={(e) => {
            if (e.key === "Enter" || e.key === " ") navigate("/community");
          }}
          aria-label="Go to community page"
        >
          <h3>To Community</h3>
          <Count>{communityCount} shared goals</Count>
          <Count>
            Click to explore <span aria-hidden="true">→</span>
          </Count>
        </Widget>

        <Widget
          role="button"
          tabIndex={0}
          onClick={handleAddClick}
          onKeyPress={(e) => {
            if (e.key === "Enter" || e.key === " ") handleAddClick();
          }}
          aria-label={
            goals.length >= 3
              ? "Maximum of 3 goals reached"
              : "Add new intention and goals"
          }
          aria-disabled={goals.length >= 3}
        >
          <h3>Add new</h3>
          <Count>Intentions & Goals here</Count>
          <Count>
            Click to start <span aria-hidden="true">→</span>{" "}
          </Count>
        </Widget>
      </WidgetGrid>

      {showMaxMessage && (
        <ErrorMessage role="alert">
          There is a maximum of 3 saved intention and goal cards. It's to help
          you stay focused and not feel overwhelmed.
        </ErrorMessage>
      )}
    </>
  );
};

export default Widgets;
