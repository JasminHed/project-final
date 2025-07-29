import Animation from "../animations/star.json";
import Lottie from "lottie-react";
import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  max-width: 50px;
  max-height: 50px;
  display: flex;
  justify-content: center;
  margin: 0 auto;
`;

const Star = () => {
  return (
    <Wrapper>
      <Lottie animationData={Animation} loop={false} />{" "}
      {/*play once no looping*/}
    </Wrapper>
  );
};

export default Star;