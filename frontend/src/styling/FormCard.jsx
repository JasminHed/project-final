import styled from "styled-components";

//This is styling for setup

export const FormCard = styled.div`
  border-radius: 20px;
  padding: 24px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid #dddddd;
  margin-bottom: 15px;
  min-height: 200px;
  width: 100%;
  max-width: 280px;

  @media (min-width: 668px) {
    max-width: 700px;
    padding: 30px;
  }

  @media (min-width: 1024px) {
    max-width: 900px;
    padding: 40px;
  }

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
  }

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
  border: 1px solid var(--color-focus);
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
    outline: 1px solid var(--color-focus);
  }
  //this is to remove the default styling of the textbox
  &:invalid {
    border-color: var(--color-focus);
    box-shadow: none;
  }
`;
