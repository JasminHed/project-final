import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUserStore } from "../store/UserStore";
import { ErrorDiv, Input, Label, LinkSpan, RegisterLink } from "../styling/FormStyling.jsx";

//Once user is logged in, the button sign up should go away and there should be a icon avatar instead. Log out should always be present, user is not logged out until you click log out?

const LogIn = ({ setShowLogin, setIsLoggedIn, setIsOpen }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useUserStore();

  const handleSubmit = () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in both fields");
      return;
    }

    setError("");
    setFormData({ email: "", password: "" });

    fetch("https://project-final-ualo.onrender.com/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.notFound) {
          setError("Invalid email or password");
        } else {
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("accessToken", data.accessToken);
          login(data.user, data.accessToken, data.userId);
          setError("Login successful!");
          setTimeout(() => {
            setError("");
            setIsOpen(false);
          }, 3000);

          setIsLoggedIn(true);

          if (localStorage.getItem("hasCompletedOnboarding")) {
            navigate("/dashboard");
          }
        }
      });
  };

  return (
    <>
      <Label htmlFor="email">Email</Label>
      <Input
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        type="text"
        name="email"
        value={formData.email}
      />
      <Label htmlFor="password">Password</Label>
      <Input
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
        type="password"
        name="password"
        value={formData.password}
      />
      {error && <ErrorDiv>{error}</ErrorDiv>}
      <button type="button" onClick={handleSubmit}>
        Log In
      </button>

      <RegisterLink>
        <LinkSpan>New user? </LinkSpan>
        <LinkSpan onClick={() => setShowLogin(false)}>Sign up here</LinkSpan>
      </RegisterLink>
    </>
  );
};

export default LogIn;
