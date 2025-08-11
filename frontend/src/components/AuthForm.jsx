import { useRef, useState } from "react";
import { PopUp, Container } from "../styling/FormStyling.jsx";
import LogIn from "./LogIn";
import SignUp from "./SignUp";
import useClickOutside from "../hooks/useClickOutside.jsx";

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

  const ref = useRef(null);
  useClickOutside(ref, () => {
    setIsOpen(false); // Close popup when clicking outside
  });

  return (
    <>
      {isOpen && (
        <PopUp role="dialog" aria-modal="true" aria-label="Log In och Sign Up">
          <Container
            ref={ref}
            onClick={(e) => e.stopPropagation()}
            tabIndex="-1"
          >
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
