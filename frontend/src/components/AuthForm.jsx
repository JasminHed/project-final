import { useRef, useState } from "react";

import { Container, PopUp } from "../styling/FormStyling.jsx";
import LogIn from "./LogIn";
import SignUp from "./SignUp";

//aria labels + semantic html added. Should you have escape for screenreaders?

// Update here: Added isOpen and setIsOpen as props to control popup visibility from parent
const AuthForm = ({
  isLoggedIn,
  setIsLoggedIn,
  isOpen,
  setIsOpen,
  onSignUpSuccess,
}) => {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {isOpen && (
        <PopUp role="dialog" aria-modal="true" aria-label="Log In or Sign Up">
          <Container tabIndex="-1">
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
