import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Widget = styled.div`
  position: absolute;
  top: 1200px;
  left: 20px;
  background: rgba(228, 120, 133, 0.1);
  color: white;
  padding: 10px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  min-width: 200px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const Count = styled.p`
  margin: 0;
  opacity: 0.9;
  font-size: 16px;
`;

const CommunityWidget = () => {
  const [communityCount, setCommunityCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // get public goals, preview
    fetch("https://project-final-ualo.onrender.com/community-posts")
      .then((res) => res.json())
      .then((data) => {
        setCommunityCount(data.length || 0);
      })
      .catch(() => {
        setCommunityCount(0);
      });
  }, []);

  const handleClick = () => {
    navigate("/community");
  };

  return (
    <Widget
      onClick={handleClick}
      role="button"
      tabIndex="0"
      aria-label="Community widget"
      aria-describedby="community-desc"
    >
      <h3>Community</h3>
      <Count id="community-desc">{communityCount} shared goals</Count>
      <Count>Click to explore →</Count>
    </Widget>
  );
};

export default CommunityWidget;
