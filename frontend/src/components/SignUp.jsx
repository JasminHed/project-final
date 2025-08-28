import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useUserStore } from "../store/UserStore";
import {
  Error,
  ErrorDiv,
  Input,
  Label,
  LinkSpan,
  Loader,
  RegisterLink,
} from "../styling/FormStyling.jsx";

//signup form, including its data, errors, and loading state.
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
  const navigate = useNavigate();
  const { login } = useUserStore();
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    //signup data to the server, saves user info on success, and triggers post-signup actions
    fetch("https://project-final-ualo.onrender.com/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("accessToken", data.accessToken);
          login(
            { name: data.name, email: data.email },
            data.accessToken,
            data.userId
          );

          setFormData({ name: "", email: "", password: "" });

          setSuccessMessage("Successful! Redirecting to onboarding...");
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
        setLoading(false);
      });
  };

  // Event handler for sign up fields
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

  if (loading) {
    return (
      <Loader>
        <FaSpinner />
      </Loader>
    );
  }

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
          <Error id="signup-error" aria-live="polite">
            {error}
          </Error>
        )}

        {successMessage && (
          <Error role="status" aria-live="polite">
            {successMessage}
          </Error>
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
