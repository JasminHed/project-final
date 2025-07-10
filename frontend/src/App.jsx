import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import Onboarding from "./components/Onboarding.jsx";
import Setup from "./components/Setup.jsx";
import Community from "./pages/Community.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Home from "./pages/Home.jsx";
import GlobalStyles from "./styling/GlobalStyling.jsx";
import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

export const App = () => {
  return (
    <>
      <GlobalStyles />
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/setup" element={<Setup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/community" element={<Community />} />
      </Routes>

      <Footer />
    </>
  );
};
