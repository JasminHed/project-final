import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

//from accessibility project, style more
const SkipLink = styled.a`
  position: absolute;
  top: -2.5rem;
  left: 0;
  padding: 8px;
  z-index: 100;
  transition: top 0.3s;
  text-decoration: none;

  &:focus {
    top: 0;
    outline-offset: 2px;
  }

  &:focus-visible {
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken"); //saves token locally until user log out or close browser
    setIsLoggedIn(!!token); //!! converts to boolean, can be both true/false
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("accesstoken");
    setIsLoggedIn(false);
    navigate("/"); //after clicked log out user back to homepage
  };
  return (
    <>
      <SkipLink href="#main-content" className="skip-link">
        Skip to main content
      </SkipLink>

      <header>
        {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
        <div>
          <h4>Clarity.Consistency.Community.</h4>
          <h1>TheIntentionApp</h1>
        </div>

        <button onClick={toggleMenu} aria-label="Toggle the menu">
          ☰
        </button>

        {/*Desktop- change links*/}
        <nav>
          <a to="/">About</a>
          <a to="/dashboard">Dashboard</a>
          <a to="/community">Community</a>
        </nav>

        {/* Mobile -change links*/}
        {menuOpen && (
          <nav>
            <a to="/" onClick={closeMenu}>
              About
            </a>
            <a to="/dashboard" onClick={closeMenu}>
              Dashboard
            </a>
            <a to="/community" onClick={closeMenu}>
              Community
            </a>
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
