import React, { useState } from "react";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header>
        <div>
          <h4>Clarity.Consistency.Community.</h4>
          <h1>TheIntentionApp</h1>
        </div>

        <button onClick={toggleMenu} aria-label="Toggle menu">
          ☰
        </button>

        {/*Desktop*/}
        <nav>
          <a href="#about">About</a>
          <a href="#dashboard">Dashboard</a>
          <a href="#community">Community</a>
        </nav>

        {/* Mobile */}
        {menuOpen && (
          <nav>
            <a href="#about" onClick={closeMenu}>
              About
            </a>
            <a href="#dashboard" onClick={closeMenu}>
              Dashboard
            </a>
            <a href="#community" onClick={closeMenu}>
              Community
            </a>
          </nav>
        )}
      </header>
    </>
  );
};

export default Header;
