// globalstyles.jsx
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  /* Light mode (default) */
  :root {
    --color-text-primary: #000000;
    --color-text-link: #005FCC;
    --color-button-bg: #007ACC;
    --color-button-text: #FFFFFF;
    --color-button-hover: #005FCC;
    --color-focus: #1ABC9C;
    --color-background: #FFFFFF;
  }

  /* Dark mode overrides */
  .dark {
    --color-text-primary: #FFFFFF;
    --color-text-link: #66AFFF;
    --color-button-bg: #3399FF;
    --color-button-text: #000000;
    --color-button-hover: #66AFFF;
    --color-focus: #1ABC9C;
    --color-background: #000000;
  }

  /* Base reset and theme */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: var(--color-background);
    color: var(--color-text-primary);
    font-family: system-ui, sans-serif;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  a {
    color: var(--color-text-link);
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }

  button {
    background-color: var(--color-button-bg);
    color: var(--color-button-text);
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: var(--color-button-hover);
  }

  button:focus {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }

  /* Accessibility Skip Link */
 .skip-link {
  position: absolute;
  top: -2.5rem;
  left: 0;
  padding: 8px;
  z-index: 100;
  background-color: var(--color-button-bg); 
  color: var(--color-button-text);          
  text-decoration: none;
  transition: top 0.3s;
}

.skip-link:focus,
.skip-link:focus-visible {
  top: 0;
  outline: 2px solid var(--color-focus);  
  outline-offset: 2px;
  border-radius: 2px;
}

`;

export default GlobalStyles;
