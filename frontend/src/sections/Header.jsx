import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

import useClickOutside from "../hooks/useClickOutside";
import { useUserStore } from "../store/UserStore";

const HeaderContainer = styled.header`
  position: relative;
  min-height: 200px;
  padding: 80px;
  background: var(--color-background);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  margin: 0;
  text-align: center;
  max-width: 600px;
  z-index: 101;
`;

const DesktopNav = styled.nav`
  display: none;
  gap: 10px;
  position: absolute;
  left: 50%;
  top: 45px;
  transform: translateX(-50%);
  z-index: 102;

  @media (min-width: 668px) {
    display: flex;
    gap: 8px;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: calc(100% + -35px);
    z-index: 102;
  }
`;

const MobileNav = styled.nav`
  display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};
  position: absolute;
  top: 80px;
  right: 40px;
  width: 200px;
  background: var(--color-background);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  flex-direction: column;
  gap: 15px;

  z-index: 102;

  @media (min-width: 668px) {
    display: none;
  }

  button {
    margin-top: 20px;
  }
`;

const HamburgerButton = styled.button`
  position: absolute;
  top: 30px;
  right: 23px;
  display: block;

  @media (min-width: 668px) {
    display: none;
  }
`;

const LogoutMessage = styled.p`
  position: fixed;
  font-size: 14px;
  top: 130px;
  left: 50%;
  transform: translateX(-50%);
  color: var(--color-success);

  @media (min-width: 668px) {
    position: absolute;
    top: 30px;
    width: 100%;
    text-align: center;
    color: var(--color-success);
  }
`;

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const { isLoggedIn, logout, user } = useUserStore();
  const navigate = useNavigate();

  //for click outisde + button open and close
  const mobileNavRef = useRef();
  const hamburgerRef = useRef();

  useClickOutside(mobileNavRef, (event) => {
    if (hamburgerRef.current && hamburgerRef.current.contains(event.target))
      return;
    setMenuOpen(false);
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    logout();
    setLogoutMessage("You are now logged out.");
    setMenuOpen(false); // close menu

    setTimeout(() => {
      navigate("/");
    }, 100);

    setTimeout(() => setLogoutMessage(""), 2000);
  };

  const NavLinks = () => (
    <>
      <Link to="/" onClick={() => setMenuOpen(false)}>
        Home
      </Link>
      <Link to="/about" onClick={() => setMenuOpen(false)}>
        About
      </Link>
      {isLoggedIn && (
        <>
          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
            Dashboard
          </Link>
          <Link to="/community" onClick={() => setMenuOpen(false)}>
            Community
          </Link>
        </>
      )}
    </>
  );

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <HeaderContainer>
        <Title>Intention Hub</Title>

        <HamburgerButton
          ref={hamburgerRef}
          onClick={toggleMenu}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
        >
          ☰
        </HamburgerButton>

        <DesktopNav>
          <NavLinks />
          <Link onClick={toggleDarkMode} aria-label="Toggle dark mode">
            {darkMode ? "Light " : "Dark "}
          </Link>
          {isLoggedIn && user?.name && <span>👤 </span>}
          {isLoggedIn ? <Link onClick={handleLogout}>Logout</Link> : null}
          {logoutMessage && <LogoutMessage>{logoutMessage}</LogoutMessage>}
        </DesktopNav>
      </HeaderContainer>

      <MobileNav ref={mobileNavRef} id="mobile-nav" $isOpen={menuOpen}>
        <NavLinks />
        <Link onClick={toggleDarkMode} aria-label="Toggle dark mode">
          {darkMode ? "Light mode" : "Dark mode"}
        </Link>
        {isLoggedIn && user?.name && <span>👤 </span>}
        {isLoggedIn ? <Link onClick={handleLogout}>Logout</Link> : null}
        {logoutMessage && <LogoutMessage>{logoutMessage}</LogoutMessage>}
      </MobileNav>
    </>
  );
};

export default Header;
