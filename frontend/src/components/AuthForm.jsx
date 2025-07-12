import { useRef, useState } from "react";
//import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useUserStore } from "../store/UserStore";
import { ErrorDiv, Input, Label, LinkSpan, RegisterLink } from "../styling/FormStyling.jsx";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import useClickOutside from "./useClickOutside";

//Once user is logged in, the button sign up should go away and there should be a icon avatar instead. Log out should always be present, user is not logged out until you click log out?
/*const ButtonContainer = styled.div`
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
`;*/

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
const AuthForm = ({ isLoggedIn, setIsLoggedIn, isOpen, setIsOpen }) => {
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
      {/* Knapparna för Sign Up och Logout är borttagna här, de finns nu i Header */}
      {isOpen && (
        <PopUp>
          <Form ref={ref} onClick={(e) => e.stopPropagation()}>
            {!showLogin ? (
              <SignUp
                setShowLogin={setShowLogin}
                setIsLoggedIn={setIsLoggedIn}
                setIsOpen={setIsOpen} // Allow SignUp to close popup after success
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


/*import { useRef, useState } from "react";
//import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import { useUserStore } from "../store/UserStore";
import { ErrorDiv, Input, Label, LinkSpan, RegisterLink } from "../styling/FormStyling.jsx";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import useClickOutside from "./useClickOutside";

//Once user is logged in, the button sign up should go away and there should be a icon avatar instead. Log out should always be present, user is not logged out until you click log out?
/*const ButtonContainer = styled.div`
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

const AuthForm = ({ isLoggedIn, setIsLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");
  const { logout } = useUserStore();

  const ref = useRef(null);
  useClickOutside(ref, () => {
    setIsOpen(false);
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
              />
            ) : (
              <LogIn
                setShowLogin={setShowLogin}
                setIsLoggedIn={setIsLoggedIn}
                setIsOpen={setIsOpen}
              />
            )}
          </Form>
        </PopUp>
      )}
    </>
  );
};

export default AuthForm;*/
