import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useUserStore } from "../store/UserStore";

const HeaderContainer = styled.header`
  position: relative;
  padding: 80px;
  background: var(--color-background);
  z-index: 100;

  display: flex;
  align-items: center;
  justify-content: center; /* Title centered on mobile */
`;

const Title = styled.h1`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  text-align: center;
  width: 100%;
  max-width: 600px;
  z-index: 101;
`;

const DesktopNav = styled.nav`
  display: none;

  @media (min-width: 668px) {
    display: flex;
    gap: 10px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: calc(100% + -35px);
    z-index: 102;
  }

  @media (min-width: 1024px) {
    left: 50%;
    transform: translateX(-50%);
    top: calc(100% + -35px);
  }
`;

const HamburgerButton = styled.button`
  display: block;
  position: absolute;
  top: 40px;
  right: 15px;
  transform: none;

  @media (min-width: 668px) {
    display: none;
  }
`;

const MobileNav = styled.nav`
  position: absolute;
  top: ${(props) => (props.$isOpen ? "80px" : "-300px")};
  right: 40px;
  width: 200px;
  background: var(--color-background);
  padding: 20px;
  transition: top 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 102;

  button {
    margin-top: 20px;
  }

  @media (min-width: 668px) {
    display: none;
  }
`;

const LogoutMessage = styled.p`
  position: absolute;
  color: var(--color-success);
  top: 30px;
  text-align: center;
`;

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false); // Track if mobile menu is open or closed
  const [logoutMessage, setLogoutMessage] = useState(""); // To show logout confirmation
  const toggleMenu = () => setMenuOpen((prev) => !prev); // Open and close menu toggle
  const { isLoggedIn, setIsLoggedIn, logout } = useUserStore(); // Track if user is logged in
  const navigate = useNavigate(); // React-router hook to change pages

  // When user clicks logout button
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    logout();
    setLogoutMessage("You are now logged out.");
    setTimeout(() => setLogoutMessage(""), 2000);
    navigate("/"); // Redirect user to homepage after logout
  };
  // Manages dark mode state and toggles the "dark" class on the document element
  const [darkMode, setDarkMode] = useState(false);
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // Toggles the dark mode state between true and false
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const NavLinks = () => {
    return (
      <>
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>

        {isLoggedIn && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/community">Community</Link>
          </>
        )}
      </>
    );
  };

  const AuthButtons = () => {
    if (!isLoggedIn) return null;

    return (
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          handleLogout();
        }}
      >
        Logout
      </a>
    );
  };

  const LogoutText = () => {
    if (logoutMessage) {
      return <LogoutMessage>{logoutMessage}</LogoutMessage>;
    }
    return null;
  };

  const DarkModeButton = () => {
    return darkMode ? "Light mode" : "Dark mode";
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

        <DesktopNav>
          {NavLinks()}
          {AuthButtons()}
          {LogoutText()}

          <Link
            href="#!"
            onClick={(e) => {
              e.preventDefault();
              toggleDarkMode();
            }}
            aria-label="Toggle dark mode"
          >
            {DarkModeButton()}
          </Link>
        </DesktopNav>
      </HeaderContainer>

      <MobileNav $isOpen={menuOpen}>
        {NavLinks()}
        {AuthButtons()}
        {LogoutText()}
        <Link
          href="#!"
          onClick={(e) => {
            e.preventDefault();
            toggleDarkMode();
          }}
          aria-label="Toggle dark mode"
        >
          {DarkModeButton()}
        </Link>
      </MobileNav>
    </>
  );
};
export default Header;
