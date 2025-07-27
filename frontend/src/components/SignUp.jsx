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

  const handleSubmit = () => {
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
            { name: formData.name, email: formData.email },
            data.accessToken,
            data.userId
          );

          setFormData({ name: "", email: "", password: "" });

          setSuccessMessage(
            "Registration successful! You are now logged in. Redirecting to onboarding..."
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
    setFormData({ ...formData, name: e.target.value });
  };

  const handleEmail = (e) => {
    setFormData({ ...formData, email: e.target.value });
  };

  const handlePassword = (e) => {
    setFormData({ ...formData, password: e.target.value });
  };

  const handleShowLogin = () => {
    setShowLogin(true);
  };

  return (
    <>
      <Label htmlFor="name">Name</Label>
      <Input
        onChange={handleName}
        type="text"
        name="name"
        value={formData.name}
      />
      <Label htmlFor="email">Email</Label>
      <Input
        onChange={handleEmail}
        type="email"
        name="email"
        value={formData.email}
      />
      <Label htmlFor="password">Password</Label>
      <Input
        onChange={handlePassword}
        type="password"
        name="password"
        value={formData.password}
      />
      {error && <ErrorDiv>{error}</ErrorDiv>}

      {successMessage && <ErrorDiv>{successMessage}</ErrorDiv>}
      <button type="button" onClick={handleSubmit}>
        Sign up
      </button>

      <RegisterLink>
        <LinkSpan>Already a user? </LinkSpan>
        <LinkSpan onClick={handleShowLogin}>Log in here</LinkSpan>
      </RegisterLink>
    </>
  );
};

export default SignUp;
