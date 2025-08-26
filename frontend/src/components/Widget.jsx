import React, { useEffect, useState } from "react";
import { FaHeart, FaSun } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const WidgetGrid = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  justify-items: center;
  margin: 50px 0;
  padding: 16px;
  gap: 45px;

  @media (min-width: 668px) {
    grid-template-columns: repeat(2, minmax(200px, 300px));
    justify-content: center;
    gap: 50px;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(2, minmax(200px, 300px));
    justify-content: center;
    gap: 60px;
  }
`;

const Widget = styled.div`
  padding: 16px;
  border-radius: 12px;
  width: 280px;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
  transition: transform 0.2s, box-shadow 0.2s;

  @media (min-width: 668px) {
    width: 300px;
    height: 220px;
  }

  @media (min-width: 1024px) {
    width: 320px;
    height: 240px;
  }

  &:hover {
    transform: ${(props) => (props.disabled ? "none" : "translateY(-3px)")};
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
const ErrorWrapper = styled.div`
  height: 24px;
  max-width: 300px;
  margin: 20px auto 40px;
  display: flex;
  align-items: center;
`;

const ErrorMessage = styled.p`
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
          <h2>
            <FaHeart color="#0d9488" /> Community
          </h2>
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
          <h2>
            <FaSun color="##15803d" /> Set new
          </h2>
          <Count>Intention & Goal here</Count>
          <Count>
            Click to start <span aria-hidden="true">→</span>{" "}
          </Count>
        </Widget>
      </WidgetGrid>
      <ErrorWrapper>
        {showMaxMessage && (
          <ErrorMessage role="alert">
            There is a maximum of 3 saved intention and goal cards. It's to help
            you stay focused and not feel overwhelmed.
          </ErrorMessage>
        )}
      </ErrorWrapper>
    </>
  );
};

export default Widgets;
