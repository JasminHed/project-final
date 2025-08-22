import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUserStore } from "../store/UserStore";
import { ErrorDiv, Input, Label, LinkSpan, RegisterLink } from "../styling/FormStyling.jsx";

const SignUp = ({
  setShowLogin,
  setIsLoggedIn,
  setIsOpen,
  onSignUpSuccess,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  // Navigate hook for routing
  const navigate = useNavigate();
  const { login } = useUserStore();
  const [fieldErrors, setFieldErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
    if (formData.password.length < 5) {
      setError("Password must be at least 5 characters");
      return;
    }

    setError("");
    setSuccessMessage("");

    fetch("https://project-final-ualo.onrender.com/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("accessToken", data.accessToken);
          login(
            { name: data.name, email: data.email },
            data.accessToken,
            data.userId
          );

          setFormData({ name: "", email: "", password: "" });

          setSuccessMessage(
            "Registration successful! Redirecting to onboarding..."
          );
          setIsLoggedIn(true);

          setTimeout(() => {
            setIsOpen(false);
            if (onSignUpSuccess) {
              onSignUpSuccess();
            }
          }, 2000);
        } else {
          setError(data.message || "Registration failed. Please try again.");
        }
      })

      .catch((err) => {
        console.error("Registration error:", err);
        setError("Network error. Please try again.");
      });
  };

  // Event handler functions
  const handleName = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, name: value });

    let error = "";
    if (value.length > 0 && value.length < 3) error = "Minimum 3 characters";
    if (value.length > 20) error = "Maximum 20 characters";

    setFieldErrors((prev) => ({ ...prev, name: error }));
  };

  const handleEmail = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, email: value });

    let error = "";
    if (value.length > 0 && !value.includes("@")) {
      error = "Must contain @";
    }

    setFieldErrors((prev) => ({ ...prev, email: error }));
  };

  //validates, checks if password is correct
  const handlePassword = (e) => {
    const value = e.target.value;
    setFormData({ ...formData, password: value });

    let error = "";
    if (value.length > 0 && value.length < 5) error = "Minimum 5 characters";

    setFieldErrors((prev) => ({ ...prev, password: error }));
  };

  const handleShowLogin = () => {
    setShowLogin(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
        <Label htmlFor="signup-name">First and Last Name</Label>
        <Input
          id="signup-name"
          onChange={handleName}
          type="text"
          name="name"
          value={formData.name}
          required
          minLength="3"
          maxLength="20"
          aria-describedby={error ? "signup-error" : undefined}
          aria-invalid={!!error}
        />
        {fieldErrors.name && (
          <ErrorDiv role="alert">{fieldErrors.name}</ErrorDiv>
        )}
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          onChange={handleEmail}
          type="email"
          name="email"
          value={formData.email}
          required
          aria-describedby={error ? "signup-error" : undefined}
          aria-invalid={!!error}
        />
        {fieldErrors.email && (
          <ErrorDiv role="alert">{fieldErrors.email}</ErrorDiv>
        )}
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          onChange={handlePassword}
          type="password"
          name="password"
          value={formData.password}
          required
          aria-describedby={error ? "signup-error" : undefined}
          aria-invalid={!!error}
        />
        {fieldErrors.password && (
          <ErrorDiv role="alert">{fieldErrors.password}</ErrorDiv>
        )}
        {error && (
          <ErrorDiv id="signup-error" aria-live="polite">
            {error}
          </ErrorDiv>
        )}

        {successMessage && (
          <ErrorDiv role="status" aria-live="polite">
            {successMessage}
          </ErrorDiv>
        )}
        <button type="submit" onClick={handleSubmit}>
          Sign up
        </button>

        <RegisterLink>
          <LinkSpan>Already a user? </LinkSpan>
          <LinkSpan
            onClick={handleShowLogin}
            onKeyDown={(e) => e.key === "Enter" && handleShowLogin()}
            role="button"
            tabIndex="0"
            aria-label="Go to log in form"
          >
            Log in here
          </LinkSpan>
        </RegisterLink>
      </form>
    </>
  );
};

export default SignUp;

/* ta bort dessa, // Ta bort dessa rader från SignUp också:
localStorage.setItem("userId", data.userId); // ❌
localStorage.setItem("accessToken", data.accessToken); // ❌
*/