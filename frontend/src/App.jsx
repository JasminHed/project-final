import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";

import AIbot from "./components/AIbot.jsx";
import About from "./pages/About.jsx";
import Community from "./pages/Community.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Home from "./pages/Home.jsx";
import Footer from "./sections/Footer.jsx";
import Header from "./sections/Header.jsx";
import Setup from "./sections/Setup.jsx";
import GlobalStyles from "./styling/GlobalStyling.jsx";

const NotFound = () => <h2>404 - Page Not Found</h2>;

export const App = () => {
  const location = useLocation();
  //forces page to start from top everytime
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <GlobalStyles />

      <Header />

      <AIbot />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/setup" element={<Setup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/community" element={<Community />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
};
