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

  @media (min-width: 669px) {
    margin-top: 15px;
  }
`;

export const Container = styled.div`
  background: rgba(var(--color-background-rgb), 0.85);
  border: 1px solid var(--color-focus);
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  padding: 16px;
  width: 100%;
  max-width: 280px;
  transition: transform 0.25s ease, opacity 0.25s ease;

  @media (min-width: 669px) {
    max-width: 600px;
    padding: 20px;
    border-radius: 16px;
  }

  @media (min-width: 1024px) {
    max-width: 800px;
    height: 450px;
    font-size: 18px;
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 6px;
  margin-top: 20px;
  color: var(--color-text-primary);

  @media (min-width: 669px) {
    margin-top: 20px;
  }
`;

export const Input = styled.input`
  width: 100%;
  padding: 10px 12px;
  margin-bottom: 12px;
  border-radius: 8px;
  border: 1px solid var(--color-text-primary);
  background-color: rgba(var(--color-background-rgb), 0.6);
  color: var(--color-text-primary);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  @media (min-width: 669px) {
    margin-bottom: 15px;
    border-radius: 12px;
  }

  &:focus {
    border-color: var(--color-focus);
    box-shadow: 0 0 0 3px rgba(var(--color-focus-rgb), 0.3);
    outline: none;
  }
`;

export const ErrorDiv = styled.div`
  color: var(--color-error);
  margin-bottom: 8px;
  min-height: 20px;
  margin-top: 4px;
  font-size: 14px;
`;

export const RegisterLink = styled.p`
  font-size: 14px;
  margin-top: 12px;
  text-align: center;
`;

export const LinkSpan = styled.span`
  color: var(color-text-primary);
  cursor: pointer;
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }

  @media (min-width: 1024px) {
    font-size: 16px;
  }
`;
