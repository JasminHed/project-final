import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import IntentionSetup from "./IntentionSetup.jsx";
import WelcomeScreen from "./WelcomeScreen.jsx";

export const App = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <>
      <button onClick={toggleDarkMode}>
        Switch to {darkMode ? "Light" : "Dark"} Mode
      </button>

      <h1>Welcome to Final Project!</h1>
      <WelcomeScreen />
      <IntentionSetup />
    </>
  );
};
