import styled from "styled-components";

//this is styling for the login/sign up form

export const PopUp = styled.div`
  margin-top: 15px;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  z-index: 2000;
`;

export const Container = styled.div`
  background: var(--color-background);
  border: 2px solid var(--color-focus);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 320px;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  margin-top: 25px;
  font-size: 14px;
  color: var(--color-text-primary);
`;

export const Input = styled.input`
  width: 280px;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 4px;
  box-sizing: border-box;
  border: 1px solid var(--color-text-primary);
  background-color: var(--color-background);
  color: var(--color-text-primary);
`;

export const ErrorDiv = styled.div`
  color: var(--color-error);
  margin-bottom: 8px;
  margin-top: 4px;
`;

export const RegisterLink = styled.p`
  font-size: 12px;
  margin-top: 10px;
`;

export const LinkSpan = styled.span`
  color: #4a9eff;
  cursor: pointer;
`;
