import { useUserStore } from "../stores/userStore";
import { useState } from "react";

const LogoutButton = () => {
  const { logout } = useUserStore();
  const [logoutMessage, setLogoutMessage] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("accessToken");
    logout();
    setLogoutMessage("You are now logged out.");
    setTimeout(() => setLogoutMessage(""), 2000);
  };

  return (
    <>
      <button type="button" onClick={handleLogout}>
        Logout
      </button>
      {logoutMessage && <p>{logoutMessage}</p>}
    </>
  );
};

export default LogoutButton;
