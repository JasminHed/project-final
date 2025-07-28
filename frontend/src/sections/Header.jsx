import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import styled from "styled-components";

import AuthForm from "../components/AuthForm";
import { useUserStore } from "../store/UserStore";

const HeaderContainer = styled.header`
  position: relative;
  padding: 40px;
  background: var(--color-background);
  z-index: 100;

  @media (min-width: 669px) {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`;

const Title = styled.h1`
  text-align: center;
`;

const HamburgerButton = styled.button`
  display: block;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: 80px;

  @media (min-width: 669px) {
    display: none;
  }
`;

const DesktopNav = styled.nav`
  display: none;
  gap: 20px;

  @media (min-width: 669px) {
    display: flex;
    gap: 10px;
  }
`;

const MobileNav = styled.nav`
  position: relative;
  top: ${(props) => (props.$isOpen ? "40px" : "-300px")};
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  background: var(--color-background);
  padding: 20px;
  transition: top 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  button {
    margin-top: 20px;
  }

  @media (min-width: 669px) {
    display: none;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
`;

const LogoutMessage = styled.p`
  position: absolute;
  color: var(--color-text-primary);
  bottom: 60px;
  left: 110px;
`;

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false); // Track if mobile menu is open or closed
  const [isOpen, setIsOpen] = useState(false); // Controls AuthForm popup open state
  const [logoutMessage, setLogoutMessage] = useState(""); // To show logout confirmation

  const toggleMenu = () => setMenuOpen((prev) => !prev); // Open and close menu toggle

  const { isLoggedIn, setIsLoggedIn, logout } = useUserStore(); // Track if user is logged in

  const navigate = useNavigate(); // React-router hook to change pages

  // Check if user has a saved token to know if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token); // Convert token to true/false (boolean)
  }, []);

  // When user clicks logout button
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    logout();
    setLogoutMessage("You are now logged out.");
    setTimeout(() => setLogoutMessage(""), 2000);
    setIsLoggedIn(false);
    navigate("/"); // Redirect user to homepage after logout
  };

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleSignUpClick = () => setIsOpen(true);

  // Links in navbar (conditional)
  const renderNavLinks = () => {
    if (isLoggedIn) {
      return (
        <>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/community">Community</Link>
        </>
      );
    } else {
      return <Link to="/">Home</Link>;
    }
  };

  const renderAuthButtons = () => {
    return (
      <>
        {!isLoggedIn && <button onClick={handleSignUpClick}>Sign Up</button>}
        {isLoggedIn && (
          <button type="button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </>
    );
  };

  const renderLogoutMessage = () => {
    if (logoutMessage) {
      return <LogoutMessage>{logoutMessage}</LogoutMessage>;
    }
    return null;
  };

  const getDarkModeButtonText = () => {
    return darkMode ? "Light" : "Dark";
  };

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <HeaderContainer>
        <Title>Intention Hub</Title>

        <HamburgerButton onClick={toggleMenu} aria-label="Toggle the menu">
          ☰
        </HamburgerButton>

        {/* Desktop */}
        <DesktopNav>
          {renderNavLinks()}
          <ButtonContainer>{renderAuthButtons()}</ButtonContainer>
          {renderLogoutMessage()}
          <button onClick={toggleDarkMode} aria-label="Toggle dark mode">
            {getDarkModeButtonText()}
          </button>
        </DesktopNav>
      </HeaderContainer>

      {/* Mobile */}
      <MobileNav $isOpen={menuOpen}>
        {renderNavLinks()}
        <ButtonContainer>{renderAuthButtons()}</ButtonContainer>
        {renderLogoutMessage()}
        <button onClick={toggleDarkMode} aria-label="Toggle dark mode">
          {getDarkModeButtonText()}
        </button>
      </MobileNav>

      {/* AuthForm popup */}
      <AuthForm
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
};

export default Header;
