import { useState } from "react";
import styled from "styled-components";

const LoginButton = styled.button`
  position: fixed;
  top: 10px;
  left: 10px;
  padding: 8px 16px;
  background: #3a3f6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover,
  &:focus {
    background-color: #2b2f5c;
    outline: 2px solid white;
  }
`;

const LogoutButton = styled.button`
  position: fixed;
  top: 10px;
  left: 110px;
  padding: 8px 16px;
  background: #3a3f6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover,
  &:focus {
    background-color: #2b2f5c;
    outline: 2px solid white;
  }
`;

const LogoutMessage = styled.p`
  position: absolute;
  color: white;
  top: 30px;
  left: 110px;
`;

const CloseButton = styled.button`
  position: fixed;
  top: 10px;
  left: 10px;
  padding: 8px 16px;
  background: #3a3f6b;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover,
  &:focus {
    background-color: #2b2f5c;
    outline: 2px solid white;
  }
`;

const PopUp = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
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

const BackButton = styled.button`
  margin-top: 10px;
  margin-left: 15px;
`;

// Register Component
const Register = ({ setShowRegister }) => {
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
          localStorage.setItem("accessToken", data.accessToken);
          localStorage.setItem("userId", data.id);
          setFormData({ name: "", email: "", password: "" });
          setError("Registration successful! Please log in"); //should this not be a error sucess message?
          setTimeout(() => setError(""), 3000);
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
      <BackButton
        type="button"
        onClick={() => {
          setFormData({ name: "", email: "", password: "" });
          setShowRegister(false);
        }}
      >
        Back to Login
      </BackButton>
    </>
  );
};

// Main Login Component
const Login = ({ setIsLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

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
        console.log("log in");
        if (data.notFound) {
          setError("Invalid email or password");
        } else {
          localStorage.setItem("userId", data.userId);
          localStorage.setItem("accessToken", data.accessToken);
          setError("Login successful!"); //same here!
          setTimeout(() => setError(""), 3000);
          setIsLoggedIn(true);
        }
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setLogoutMessage("You are now logged out.");
    setTimeout(() => setLogoutMessage(""), 3000);
  };

  return (
    <>
      <LoginButton onClick={() => setIsOpen(true)}>Log In</LoginButton>
      <LogoutButton type="button" onClick={handleLogout}>
        Logout
      </LogoutButton>
      {logoutMessage && <LogoutMessage>{logoutMessage}</LogoutMessage>}
      {isOpen && (
        <PopUp onClick={() => setIsOpen(false)}>
          <Form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
            {!showRegister ? (
              <>
                <Label htmlFor="email">Email</Label>
                <Input
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  type="text"
                  name="email"
                  value={formData.email}
                />
                <Label htmlFor="password">Password</Label>
                <Input
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  type="password"
                  name="password"
                  value={formData.password}
                />
                {error && <ErrorDiv>{error}</ErrorDiv>}
                <button type="submit">Log In</button>

                <RegisterLink>
                  No account?{" "}
                  <LinkSpan
                    onClick={() => {
                      setFormData({ email: "", password: "" });
                      setShowRegister(true);
                    }}
                  >
                    Register here
                  </LinkSpan>
                </RegisterLink>
                <CloseButton type="button" onClick={() => setIsOpen(false)}>
                  Close
                </CloseButton>
              </>
            ) : (
              <Register setShowRegister={setShowRegister} />
            )}
          </Form>
        </PopUp>
      )}
    </>
  );
};

export default Login;
