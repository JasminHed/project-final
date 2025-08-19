import styled from "styled-components";

//This is styling for setup and dashboard

export const FormCard = styled.div`
  //background: var(--color-card-background);
  border: 1px solid #dddddd;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 15px;
  box-shadow: rgba(0, 0, 0, 0.1);
  min-height: 200px;

  ul {
    margin-top: 20px;
    margin-bottom: 30px;
    padding-left: 20px;
  }

  li {
    margin-bottom: 15px;
  }
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
  //this is to remove the default styling of the textbox
  &:invalid {
    border-color: var(--color-focus);
    box-shadow: none;
  }
`;
