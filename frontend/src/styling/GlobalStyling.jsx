// globalstyles.jsx
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  /* Light mode (default) */
  :root {
  --color-text-primary: #000000;          
  --color-text-link: #70658d;             
  --color-button-bg: #004d40;            
  --color-button-text: #FFFFFF;           
  --color-button-hover: #aa6670;       
  --color-focus: #e47885;                 
  --color-background: #FFFFFF;  
  --color-error: #1565C0;    
  --color-success: #0D6EFD; 
  --color-chart-active: #004d40;    
  --color-chart-completed: #e47885;  
  --color-card-background: #f9f9f9; 
  
   
}


  /* Dark mode overrides */
.dark {
  --color-text-primary: #FFFFFF;          
  --color-text-link: #fac04b;            
  --color-button-bg: #004d40;           
  --color-button-text: #FFFFFF;           
  --color-button-hover: #e47885;        
  --color-focus: #fac04b;                 
  --color-background: #000000;  
  --color-error: #74b3ff;   
  --color-success: #4da6ff;  
  --color-chart-active: #004d40;
  --color-chart-completed: #fac04b;
  --color-card-background: #121212;
       
}



  /* Base reset and theme */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

body {
    color: var(--color-text-primary);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Inter", sans-serif;
    transition: background-color 0.3s ease, color 0.3s ease;
    letter-spacing: -0.005em;
  }

  h1, h2, h3, h4 {
    color: var(--color-text-primary);
    margin-top: 24px;
    margin-bottom: 8px;
    font-weight: 600;
    text-align: center;
    font-family: 'Poppins', 'Inter', sans-serif;
    letter-spacing: -0.015em;
  }

  h1 {
    font-size: 28px; 
    font-weight: 700;
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

  h5 {
    font-size: 14px;
  }

  h6 {
    font-size: 12px;
  }

  p {
    font-size: 16px;
    margin-top: 0;
    margin-bottom: 16px;
    color: var(--color-text-primary);
    line-height: 1.7;
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
    h5 {
      font-size: 18px;
    }
    h6 {
      font-size: 14px;
    }
    p {
      font-size: 18px;
    }
  }

  @media (min-width: 1024px) {
    p {
      font-size: 20px;
    }
  }

  
  a {
    color: var(--color-text-link);
    text-decoration: none;
    transition: all 0.2s ease;
  }

  a:hover {
    text-decoration: underline;
    opacity: 0.8;
  }

 
  button {
    background-color: var(--color-button-bg);
    color: var(--color-button-text);
    font-size: 15px;
    font-weight: 500;
    gap: 6px;
    border: none;
    border-radius: 8px;
    padding: 12px 20px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-family: 'Poppins', sans-serif;
    letter-spacing: 0.005em;
  }

  button:hover {
    background-color: var(--color-button-hover);
    transform: translateY(-1px);
  }

  button:focus {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }

  /* Accessibility Skip Link */
  .skip-link {
    position: fixed;
    top: -2.5rem;  
    left: 0;
    padding: 8px;
    z-index: 9999;
    background-color: var(--color-button-bg);
    color: var(--color-button-text);
    text-decoration: none;
    transition: top 0.3s;
    border-radius: 4px;
    font-family: 'Poppins', sans-serif;
  }

  .skip-link:focus,
  .skip-link:focus-visible {
    top: 0;   
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }
`;

export default GlobalStyles;
