import styled from "styled-components";

//This is styling for setup and dashboard

/* Box styling */
export const Box = styled.div`
  background: var(--color-box-bg);
  border: 1px solid var(--color-box-border);
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px var(--color-box-shadow);
`;

/* Textarea styling */
export const Textarea = styled.textarea`
  width: 100%;
  border: 2px solid var(--color-focus);
  border-radius: 15px;
  padding: 20px;
  margin-top: 15px;
  margin-bottom: 15px;
  resize: none;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 1rem;
  box-shadow: 0 4px 8px var(--color-box-shadow);
  transition: outline 0.3s ease;

  &:focus {
    outline: 2px solid var(--color-focus);
  }
`;
