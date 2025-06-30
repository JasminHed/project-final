import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false); //Track if mobile menu is open or closed

  const toggleMenu = () => setMenuOpen((prev) => !prev); //Open and close menu toogle
  const closeMenu = () => setMenuOpen(false); //Close menu

  const [isLoggedIn, setIsLoggedIn] = useState(false); //Track if user is logged in

  const navigate = useNavigate(); // React-router hook to change pages

  //Check if user has a saved token to know if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token); // Convert token to true/false (boolean)
  }, []);

  // When user clicks logout button
  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("accesstoken");
    setIsLoggedIn(false); //update state to logged out
    navigate("/"); //Redirect user to homepage after logout
  };
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header>
        {/* Show logout button only if logged in */}
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
