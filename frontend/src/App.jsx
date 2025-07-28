import React, { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import Community from "./pages/Community.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Home from "./pages/Home.jsx";
import Footer from "./sections/Footer.jsx";
import Header from "./sections/Header.jsx";
import Setup from "./sections/Setup.jsx";
import GlobalStyles from "./styling/GlobalStyling.jsx";

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
