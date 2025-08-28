import styled from "styled-components";

//This is base styling for setup, dashboard and community

export const FormCard = styled.div`
  background: var(--color-card-background);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.4);
  padding: 32px;
  margin: 0 auto 20px auto;
  margin-bottom: 20px;
  min-height: 200px;
  width: 100%;
  max-width: 290px;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.05),
    0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(
      90deg,
      var(--color-focus),
      var(--color-chart-active),
      var(--color-success)
    );
    border-radius: 24px 24px 0 0;
    opacity: 0.2;
  }

  @media (min-width: 668px) {
    max-width: 700px;
    padding: 40px;
    margin: 0 auto 20px auto;
  }

  @media (min-width: 1024px) {
    max-width: 900px;
    padding: 48px;
    margin: 0 auto 20px auto;
  }

  &:hover {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08),
      0 0 20px rgba(78, 205, 196, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.2) inset;

    &::before {
      height: 4px;
      opacity: 0.2;
      background: linear-gradient(
        90deg,
        var(--color-focus),
        var(--color-chart-active),
        var(--color-success)
      );
    }
  }

  ul {
    margin-top: 24px;
    margin-bottom: 32px;
    padding-left: 0;
    list-style: none;
  }

  li {
    margin-bottom: 16px;
    padding-left: 24px;
    position: relative;
    color: var(--color-text-primary);

    &::before {
      content: "•";
      position: absolute;
      left: 0;
      opacity: 0.3;
      color: var(--color-chart-active);
    }
  }
`;

export const Textarea = styled.textarea`
  width: 100%;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  background: var(--color-card-background);
  backdrop-filter: blur(5px);
  padding: 20px;
  margin: 16px 0;
  resize: none;
  box-sizing: border-box;
  font-family: inherit;
  font-size: 16px;
  line-height: 1.6;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
  color: var(--color-text-primary);

  &::placeholder {
    color: rgba(0, 0, 0, 0.5);
    font-style: italic;
  }

  .dark & {
    border: 1px solid rgba(255, 255, 255, 0.2);

    &::placeholder {
      color: rgba(255, 255, 255, 0.5);
    }
  }

  &:focus {
    outline: none;
    background: var(--color-card-background);
    border-color: var(--color-focus);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.08),
      0 0 0 3px rgba(20, 184, 166, 0.2);
    transform: scale(1.01);
  }

  &:invalid {
    border-color: var(--color-error);
    box-shadow: 0 0 0 3px rgba(255, 138, 128, 0.1);
  }
`;
