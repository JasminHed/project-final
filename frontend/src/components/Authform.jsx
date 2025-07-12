import { useRef, useState } from "react";
//import { useNavigate } from "react-router-dom";
import styled from "styled-components";

import LogIn from "./LogIn";
import SignUp from "./SignUp";
import useClickOutside from "./useClickOutside";

///*import { useUserStore } from "../store/UserStore";
/*import {
  ErrorDiv,
  Input,
  Label,
  LinkSpan,
  RegisterLink,
} from "../styling/FormStyling.jsx";
import LogIn from "./LogIn.jsx";
import SignUp from "./SignUp.jsx";
import useClickOutside from "./useClickOutside";*/

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  display: flex;
  gap: 10px;
`;

/*const LogoutMessage = styled.p`
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
  bottom: 0;
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

const AuthForm = ({ setIsLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  //const [logoutMessage, setLogoutMessage] = useState("");
  //const { logout } = useUserStore();

  const ref = useRef(null);
  useClickOutside(ref, () => {
    setIsOpen(false);
  });

  /*const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    logout();
    setLogoutMessage("You are now logged out.");
    setTimeout(() => setLogoutMessage(""), 2000);
  };*/

  return (
    <>
      <ButtonContainer>
        <button onClick={() => setIsOpen(true)}>Sign Up</button>
        {/*<button type="button" onClick={handleLogout}>
          Logout
        </button>*/}
      </ButtonContainer>
      {/*logoutMessage && <LogoutMessage>{logoutMessage}</LogoutMessage>*/}
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

export default AuthForm;
