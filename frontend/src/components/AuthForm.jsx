import { useRef, useState } from "react";

import useClickOutside from "../hooks/useClickOutside";
import { Container, PopUp } from "../styling/FormStyling.jsx";
import LogIn from "./LogIn";
import SignUp from "./SignUp";

// creates a login/signup form
const AuthForm = ({
  isLoggedIn,
  setIsLoggedIn,
  isOpen,
  setIsOpen,
  buttonRef,
  onSignUpSuccess,
}) => {
  const [showLogin, setShowLogin] = useState(false);
  const formRef = useRef();

  useClickOutside(formRef, (event) => {
    if (buttonRef?.current && buttonRef.current.contains(event.target)) return;
    setIsOpen(false);
  });

  return (
    <>
      {isOpen && (
        <PopUp
          as="div"
          role="dialog"
          ref={formRef}
          aria-modal="true"
          aria-label="Log In or Sign Up"
          onKeyDown={(e) => e.key === "Escape" && setIsOpen(false)} //when user click esc pop up close
        >
          <Container>
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
          </Container>
        </PopUp>
      )}
    </>
  );
};

export default AuthForm;
