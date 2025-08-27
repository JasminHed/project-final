// globalstyles.jsx
import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`

//happy or calm color?

 /*:root {
  --color-text-primary: #000000;          
  --color-text-link: #000000;            
  --color-button-bg: #0f766e;             
  --color-button-text: #ffffff;           
  --color-button-hover: #134e4a;          
  --color-focus: #14b8a6;                 
  --color-background: #ffffff;            
  --color-error: #ff8a80;                 
  --color-success: #81c784;               
  --color-chart-active: #4ecdc4;          
  --color-chart-completed: #e8f5e8;       
  --color-card-background: rgba(255, 255, 255, 0.8); 
  
}

.dark {
  --color-text-primary: #f7fafc;          
  --color-text-link: #cbd5e0;             
  --color-button-bg: #2d3748;            
  --color-button-text: #4ecdc4;          
  --color-button-hover: #4a5568;          
  --color-focus: #68d391;                 
  --color-background: #000000;          
  --color-error: #fc8181;                 
  --color-success: #68d391;               
  --color-chart-active: #4ecdc4;          
  --color-chart-completed: #2d3748;       
  --color-card-background: rgba(45, 55, 72, 0.8); 
}*/






 :root {
  --color-text-primary: #000000;          
  --color-text-link: #6b7280;             
  --color-button-bg: #475569;            
  --color-button-text: #FFFFFF;           
  --color-button-hover: #334155;          
  --color-focus: #64748b;                 
  --color-background: #FFFFFF;  
  --color-error: #3b82f6;                 
  --color-success: #1e40af;               
  --color-chart-active: #1e293b;          
  --color-chart-completed: #d1d5db;       
  --color-card-background: #f1f5f9;    
  --color-card-community: #e6f0fa; 
   
}

.dark {
  --color-text-primary: #FFFFFF;          
  --color-text-link: #9ca3af;             
  --color-button-bg: #e2e8f0;             
  --color-button-text: #1e293b;           
  --color-button-hover: #cbd5e1;          
  --color-focus: #94a3b8;                 
  --color-background: #000000;  
  --color-error: #60a5fa;                 
  --color-success: #3b82f6;               
  --color-chart-active: #e2e8f0;          
  --color-chart-completed: #4b5563;       
  --color-card-background: #0f172a;  
  --color-card-community: #121e33; 


   
}




  /* Base reset and theme */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

body {
    color: var(--color-text-primary);
    background-color: var(--color-background);
    transition: background-color 0.3s ease, color 0.3s ease;
    font-family: 'Bodoni Moda', serif;
    line-height: 1.6;
    min-height: 100vh; //to make sure when loading footer stays put

  }

  h1, h2, h3, h4 {
    color: var(--color-text-primary);
    margin-top: 24px;
    margin-bottom: 8px;
    font-weight: 600;
    text-align: center;
    font-family: 'Bodoni Moda', serif; 
    //letter-spacing: -0.015em;
    line-height: 1.2;
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
    margin-top: 0;
    margin-bottom: 16px;
    text-align: left;
    
  }

  @media (min-width: 668px) {
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
   
  
  }

  @media (min-width: 1600px) {
    p {
      font-size: 20px;
      
    }

    @media (min-width: 1600px) {
  p {
    font-size: 20px;
  }
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
    //background-color: var(--color-button-hover);
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
