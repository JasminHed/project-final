import React, { useState } from "react";
import styled from "styled-components";

//semantic + aria label added

const ProfileSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 20px;
  margin: 20px 0;
`;

const AvatarButton = styled.button`
  width: 120px;
  height: 70px;
  border-radius: 30%;
  cursor: pointer;
  margin-bottom: 10px;
  border: none;
  padding: 0;
  background: none;
  display: block;

  img {
    width: 100%;
    height: 100%;
    border-radius: 30%;
    display: block;
  }
`;

const UserInfo = styled.div`
  text-align: center;
  margin-bottom: 15px;
`;

const UserName = styled.h2`
  margin: 0 0 5px 0;
  font-size: 18px;
`;

const UserEmail = styled.p`
  margin: 0;
  font-size: 14px;
`;

const StatusNote = styled.div`
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 12px;
  margin-bottom: 10px;
  //the dollar sign makes sure it is not sent directly to DOM
  background-color: ${({ $isPublic }) =>
    $isPublic ? "var(--color-button-bg)" : "var(--color-button-hover)"};
  color: ${({ $isPublic }) =>
    $isPublic ? "var(--color-button-text)" : "var(--color-text-primary)"};
  text-align: center;
`;

const DisclaimerText = styled.p`
  font-size: 14px;
  text-align: center;
  margin: 5px 0 0 0;
  font-style: italic;
  max-width: 250px;
`;

const DropdownMenu = styled.ul`
  position: absolute;
  top: 120px;
  background: var(--color-background);
  border-radius: 4px;
  width: 160px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  z-index: 10;
  list-style: none;
`;

const MenuItem = styled.li`
  padding: 15;
`;

const MenuButton = styled.button`
  width: 100%;
  padding: 10px;
  color: var(--color-text-primary);
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  text-align: left;
`;

const Hint = styled.p`
  font-size: 13px;
  font-style: italic;
`;

const ProfileSetting = ({ user, onOptionSelect }) => {
  const [open, setOpen] = useState(false);
  const [isPublic, setIsPublic] = useState(user?.isPublic || false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const toggleDropdown = () => setOpen(!open);

  const handleOptionSelect = (action) => {
    const newIsPublic = action === "public";
    setIsPublic(newIsPublic);
    onOptionSelect(action);
    setOpen(false);

    // Show disclaimer for 3 seconds
    setShowDisclaimer(true);
    setTimeout(() => setShowDisclaimer(false), 3000);
  };

  return (
    <ProfileSection>
      <AvatarButton
        onClick={toggleDropdown}
        aria-label="Open privacy settings"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        <img src={user?.avatar || "/assets/avatar.png"} alt="User avatar" />
      </AvatarButton>
      <Hint>Click avatar to change privacy settings</Hint>
      <UserInfo>
        <UserName>{user?.name || "User"}</UserName>
        <UserEmail>{user?.email || "user@example.com"}</UserEmail>
      </UserInfo>

      <StatusNote $isPublic={isPublic} role="status">
        {isPublic ? "Your profile is public" : "Your profile is private"}
      </StatusNote>

      {showDisclaimer && (
        <DisclaimerText role="status" aria-live="polite">
          {isPublic
            ? "Your name, intention and goals are now shared with the community"
            : "Your name, intention and goals are now private and hidden from others"}
        </DisclaimerText>
      )}

      {open && (
        <DropdownMenu role="menu" aria-label="Privacy settings">
          <MenuItem role="none">
            <MenuButton
              onClick={() => handleOptionSelect("public")}
              role="menuitem"
            >
              Make my profile public
            </MenuButton>
          </MenuItem>
          <MenuItem role="none">
            <MenuButton
              onClick={() => handleOptionSelect("private")}
              role="menuitem"
            >
              Make my profile private
            </MenuButton>
          </MenuItem>
        </DropdownMenu>
      )}
    </ProfileSection>
  );
};

export default ProfileSetting;
