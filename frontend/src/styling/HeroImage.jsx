import styled from "styled-components";

export const HeroImage = styled.img`
  width: 100%;
  max-height: 400px;
  margin: 32px auto;
  display: block;
  object-fit: cover;
  border-radius: 16px;

  @media (min-width: 669px) {
    width: 100%;
    max-height: 400px;
    margin: 48px auto;
  }
`;
