import { useState } from "react";
import { FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import { useUserStore } from "../store/UserStore";
import {
  Error,
  Input,
  Label,
  LinkSpan,
  Loader,
  RegisterLink,
} from "../styling/FormStyling.jsx";

//handles log in form, validation + submission
const LogIn = ({ setShowLogin, setIsLoggedIn, setIsOpen }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();
  const { login } = useUserStore();
  const [loading, setLoading] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Please fill in both fields");
      return;
    }

    setError("");
    setSuccessMessage("");
    setLoading(true);

    //sends login data to the server, saves user info on success, and redirects to the dashboard.
    fetch("https://project-final-ualo.onrender.com/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
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

          setSuccessMessage("Success! Redirecting to dashboard");
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
        setLoading(false);
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
          <Error id="login-error" aria-live="polite">
            {error}
          </Error>
        )}

        {successMessage && (
          <Error role="status" aria-live="polite">
            {successMessage}
          </Error>
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
