import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { useUserStore } from "../store/UserStore";

const HeaderContainer = styled.header`
  position: relative;
  //top: 10;
  //left: 0;
  //right: 0;
  padding: 10px;
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
  //margin: 0;
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

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false); //Track if mobile menu is open or closed

  const toggleMenu = () => setMenuOpen((prev) => !prev); //Open and close menu toogle
  const closeMenu = () => setMenuOpen(false); //Close menu

  const { isLoggedIn, setIsLoggedIn, logout } = useUserStore(); //Track if user is logged in

  const navigate = useNavigate(); // React-router hook to change pages

  //Check if user has a saved token to know if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token); // Convert token to true/false (boolean)
  }, []);

  // When user clicks logout button
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    logout();
    navigate("/"); //Redirect user to homepage after logout
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
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <HeaderContainer>
        <Title>TheIntentionApp</Title>

        <HamburgerButton onClick={toggleMenu} aria-label="Toggle the menu">
          ☰
        </HamburgerButton>

        {/*Desktop- change links*/}
        <DesktopNav>
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/community">Community</Link>
          <button onClick={toggleDarkMode} aria-label="Toggle dark mode">
            {darkMode ? "Light" : "Dark"}
          </button>
        </DesktopNav>
      </HeaderContainer>

      {/* Mobile -change links*/}
      <MobileNav $isOpen={menuOpen}>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/community">Community</Link>
        <button onClick={toggleDarkMode} aria-label="Toggle dark mode">
          {darkMode ? "Light" : "Dark"}
        </button>
      </MobileNav>
    </>
  );
};

export default Header;
