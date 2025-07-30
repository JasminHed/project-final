import Lottie from "lottie-react";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  width: 100px;
  height: 100px;
  position: fixed;
  top: 100px;
  left: 80px;
  overflow: visible;
`;

const Star = () => {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/public/animation/star.json")
      .then((res) => res.json())
      .then(setAnimationData);
  }, []);

  if (!animationData) return null;

  return (
    <Wrapper>
      <Lottie animationData={animationData} loop={false} />
    </Wrapper>
  );
};

export default Star;
