import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import Onboarding from "./components/Onboarding.jsx";
import Setup from "./components/Setup.jsx";
import GlobalStyles from "./GlobalStyling.jsx";
import Community from "./pages/Community.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import WelcomeScreen from "./pages/WelcomeScreen.jsx";

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
      <GlobalStyles />
      <Header />
      <button onClick={toggleDarkMode}>
        Switch to {darkMode ? "Light" : "Dark"} Mode
      </button>

      <Routes>
        <Route path="/" element={<WelcomeScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/community" element={<Community />} />
      </Routes>

      <Footer />
    </>
  );
};
