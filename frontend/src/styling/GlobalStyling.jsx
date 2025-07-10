// globalstyles.jsx
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  /* Light mode (default) */
  :root {
  --color-text-primary: #000000;          
  --color-text-link: #70658d;             
  --color-button-bg: #0f9b8f;             
  --color-button-text: #FFFFFF;           
  --color-button-hover: #b44650;          
  --color-focus: #e47885;                 
  --color-background: #FFFFFF;            
}


  /* Dark mode overrides */
.dark {
  --color-text-primary: #FFFFFF;          
  --color-text-link: #fac04b;            
  --color-button-bg: #0f9b8f;            
  --color-button-text: #FFFFFF;           
  --color-button-hover: #e47885;        
  --color-focus: #fac04b;                 
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

  h1, h2, h3, h4 {
  color: var(--color-text-primary);
  margin-top: 24px;
  margin-bottom: 8px;
  font-weight: 700;
  line-height: 1.2;
  text-align: center;
}

h1 {
  font-size: 28px; 
}

h2 {
  font-size: 24px;
}

h3 {
  font-size: 18px;
}

h4 {
  font-size: 16px;
}


p {
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 16px;
  color: var(--color-text-primary);
  line-height: 1.6;
  text-align: left;
}


@media (min-width: 669px) {
  h1 {
    font-size: 40px;
  }
  h2 {
    font-size: 32px;
  }
  h3 {
    font-size: 24px;
  }
  h4 {
    font-size: 20px;
  }
  
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

/* Box styling */
.box {
    background: var(--color-box-bg);
    border: 1px solid var(--color-box-border);
    border-radius: 8px;
    padding: 20px;
    margin-bottom: 15px;
    box-shadow: 0 4px 8px var(--color-box-shadow);
  }

  /* Textarea styling */
  textarea {
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
  }

  textarea:focus {
    outline: 2px solid var(--color-focus);
  }



`;

export default GlobalStyles;
