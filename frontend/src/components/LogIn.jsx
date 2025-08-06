import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUserStore } from "../store/UserStore";
import { ErrorDiv, Input, Label, LinkSpan, RegisterLink } from "../styling/FormStyling.jsx";

//aria labels added + sematic html

const LogIn = ({ setShowLogin, setIsLoggedIn, setIsOpen }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useUserStore();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in both fields");
      return;
    }

    setError("");
    // Clear any previous success messages
    setSuccessMessage("");

    fetch("https://project-final-ualo.onrender.com/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.notFound || data.error) {
          setError("Invalid email or password");
        } else {
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("accessToken", data.accessToken);
          login(
            {
              name: data.name,
              email: formData.email,
              avatar: data.avatar,
              isPublic: data.isPublic,
            },
            data.accessToken,
            data.userId
          );

          setFormData({ email: "", password: "" });

          setSuccessMessage("Login successful! Redirecting to dashboard");
          setIsLoggedIn(true);

          setTimeout(() => {
            setIsOpen(false);
            navigate("/dashboard");
          }, 1500);
        }
      })

      .catch((err) => {
        console.error("Login error:", err);
        setError("Network error. Please try again.");
      });
  };

  // Event handler functions
  const handleEmail = (e) => {
    setFormData({ ...formData, email: e.target.value });
  };

  const handlePassword = (e) => {
    setFormData({ ...formData, password: e.target.value });
  };

  const handleShowSignUp = () => {
    setShowLogin(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} noValidate>
        <Label htmlFor="login-email">Email</Label>
        <Input
          id="login-email"
          onChange={handleEmail}
          type="email"
          name="email"
          value={formData.email}
          required
          aria-describedby={error ? "login-error" : undefined}
          aria-invalid={!!error}
        />
        <Label htmlFor="login-password">Password</Label>
        <Input
          id="login-password"
          onChange={handlePassword}
          type="password"
          name="password"
          value={formData.password}
          required
          aria-describedby={error ? "login-error" : undefined}
          aria-invalid={!!error}
        />
        {error && (
          <ErrorDiv id="login-error" aria-live="polite">
            {error}
          </ErrorDiv>
        )}

        {successMessage && (
          <ErrorDiv role="status" aria-live="polite">
            {successMessage}
          </ErrorDiv>
        )}
        <button type="submit" onClick={handleSubmit}>
          Log In
        </button>

        <RegisterLink>
          <LinkSpan>New user? </LinkSpan>
          <LinkSpan
            onClick={handleShowSignUp}
            onKeyDown={(e) => e.key === "Enter" && handleShowSignUp()}
            role="button"
            tabIndex="0"
            aria-label="Go to sign up form"
          >
            Sign up here
          </LinkSpan>
        </RegisterLink>
      </form>
    </>
  );
};

export default LogIn;
