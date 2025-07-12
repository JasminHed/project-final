import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUserStore } from "../store/UserStore";
import { ErrorDiv, Input, Label, LinkSpan, RegisterLink } from "../styling/FormStyling.jsx";

//Once user is logged in, the button sign up should go away and there should be a icon avatar instead. Log out should always be present, user is not logged out until you click log out?

// Sign Up Component
const SignUp = ({ setShowLogin, setIsLoggedIn, setIsOpen }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
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
          setError("Registration successful! You are now logged in.");
          setTimeout(() => {
            setError("");
            setIsOpen(false);
          }, 2000);
        } else {
          setError(data.message);
        }
      })
      .catch(() => {
        setError("Network error. Please try again.");
      });
  };

  return (
    <>
      <Label htmlFor="name">Name</Label>
      <Input
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        type="text"
        name="name"
        value={formData.name}
      />
      <Label htmlFor="email">Email</Label>
      <Input
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        type="email"
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
        Sign up
      </button>

      <RegisterLink>
        <LinkSpan>Already a user? </LinkSpan>
        <LinkSpan onClick={() => setShowLogin(true)}>Log in here</LinkSpan>
      </RegisterLink>
    </>
  );
};

export default SignUp;
