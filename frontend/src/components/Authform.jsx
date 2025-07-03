import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  display: flex;
  gap: 10px;
`;

const LogoutMessage = styled.p`
  position: absolute;
  color: var(--color-text-primary);
  bottom: 60px;
  left: 110px;
`;

const PopUp = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  z-index: 2000;
`;

const Form = styled.form`
  background-color: #2a2a2a;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  border: 2px solid #444;
  padding: 20px;
  border-radius: 8px;
  width: 100%;
  max-width: 320px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  margin-top: 25px;
  font-size: 14px;
`;

const Input = styled.input`
  width: 280px;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
`;

const ErrorDiv = styled.div`
  color: white;
`;

const RegisterLink = styled.p`
  font-size: 12px;
  margin-top: 10px;
`;

const LinkSpan = styled.span`
  color: #4a9eff;
  cursor: pointer;
`;

// Register Component
const Register = ({ setShowLogin, setIsLoggedIn, setIsOpen }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }
    if (formData.password.length < 5) {
      setError("Password must be at least 5 characters");
      return;
    }

    fetch("http://localhost:8080/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("accessToken", data.accessToken);
          setIsLoggedIn(true);

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

const LoginForm = ({ setShowLogin, setIsLoggedIn, setIsOpen }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!formData.email || !formData.password) {
      setError("Please fill in both fields");
      return;
    }

    setError("");
    setFormData({ email: "", password: "" });

    fetch("http://localhost:8080/sessions", {
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

const Login = ({ setIsLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setLogoutMessage("You are now logged out.");
    setTimeout(() => setLogoutMessage(""), 2000);
  };

  return (
    <>
      <ButtonContainer>
        <button onClick={() => setIsOpen(true)}>Sign Up</button>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </ButtonContainer>
      {logoutMessage && <LogoutMessage>{logoutMessage}</LogoutMessage>}
      {isOpen && (
        <PopUp onClick={() => setIsOpen(false)}>
          {" "}
          {/*Click outside of pop up, it closes*/}
          <Form onClick={(e) => e.stopPropagation()}>
            {" "}
            {/*Hinders  closing of form, when clicks are made inside inside*/}
            {!showLogin ? (
              <Register
                setShowLogin={setShowLogin}
                setIsLoggedIn={setIsLoggedIn}
                setIsOpen={setIsOpen}
              />
            ) : (
              <LoginForm
                setShowLogin={setShowLogin}
                setIsLoggedIn={setIsLoggedIn}
                setIsOpen={setIsOpen}
              />
            )}
          </Form>
        </PopUp>
      )}
    </>
  );
};

export default Login;
