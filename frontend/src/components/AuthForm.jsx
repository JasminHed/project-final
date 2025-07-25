import { useRef, useState } from "react";
import styled from "styled-components";

import { useUserStore } from "../store/UserStore";
import { ErrorDiv, Input, Label, LinkSpan, RegisterLink } from "../styling/FormStyling.jsx";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import useClickOutside from "./useClickOutside";

const PopUp = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  z-index: 2000;
`;

const Form = styled.form`
  background-color: #2a2a2a;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  border: 2px solid #444;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 320px;
`;

// Update here: Added isOpen and setIsOpen as props to control popup visibility from parent
const AuthForm = ({
  isLoggedIn,
  setIsLoggedIn,
  isOpen,
  setIsOpen,
  onSignUpSuccess,
}) => {
  const [showLogin, setShowLogin] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");
  const { logout } = useUserStore();

  const ref = useRef(null);
  useClickOutside(ref, () => {
    setIsOpen(false); // Close popup when clicking outside
  });

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    logout();
    setLogoutMessage("You are now logged out.");
    setTimeout(() => setLogoutMessage(""), 2000);
    setIsLoggedIn(false);
  };

  return (
    <>
      {isOpen && (
        <PopUp>
          <Form ref={ref} onClick={(e) => e.stopPropagation()}>
            {!showLogin ? (
             <SignUp
             setShowLogin={setShowLogin}
             setIsLoggedIn={setIsLoggedIn}
             setIsOpen={setIsOpen}
             onSignUpSuccess={onSignUpSuccess}
           />
            ) : (
              <LogIn
                setShowLogin={setShowLogin}
                setIsLoggedIn={setIsLoggedIn}
                setIsOpen={setIsOpen} // Allow LogIn to close popup after success
              />
            )}
          </Form>
        </PopUp>
      )}
    </>
  );
};

export default AuthForm;
