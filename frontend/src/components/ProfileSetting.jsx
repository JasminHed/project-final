import React, { useState } from "react";
import styled from "styled-components";

const ProfileSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  padding: 20px;
  margin: 20px 0;
  border: none;
  backdrop-filter: blur(12px);
  border-radius: 16px;
  transition: all 0.3s ease;
`;

const AvatarContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const AvatarButton = styled.button`
  width: 160px;
  height: 100px;
  border-radius: 30%;
  margin-bottom: 10px;

  padding: 0;
  background: none;
  display: block;
  transition: all 0.3s ease;
  position: relative;

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
  font-style: italic;
`;

const StatusCard = styled.div`
  padding: 15px 20px;
  border-radius: 8px;
  margin-bottom: 15px;
  border: 2px solid var(--color-text-link);
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 300px;
`;

const StatusTitle = styled.div`
  font-weight: 600;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const StatusDescription = styled.div`
  opacity: 0.9;
`;

const ToggleButton = styled.button`
  background: ${({ $isPublic }) =>
    $isPublic ? "var(--color-text-link)" : "var(--color-button-bg)"};
  color: var(--color-button-text);
  border: 2px solid
    ${({ $isPublic }) =>
      $isPublic ? "var(--color-text-link)" : "var(--color-button-bg)"};
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 10px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    background: var(--color-focus);
    border-color: var(--color-focus);
  }
`;

const DisclaimerText = styled.div`
  border: 2px solid var(--color-success);
  border-radius: 6px;
  padding: 12px;
  font-style: italic;
  text-align: center;
  margin-top: 10px;
  max-width: 300px;
  color: var(--color-text-primary);
  animation: slideIn 0.3s ease;

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Hint = styled.p`
  font-style: italic;
  color: var(--color-text-link);
  margin: 5px 0;
`;

const ProfileSetting = ({ user, onOptionSelect }) => {
  const [isPublic, setIsPublic] = useState(user?.isPublic || false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  const handleToggle = () => {
    const newIsPublic = !isPublic;
    setIsPublic(newIsPublic);
    onOptionSelect(newIsPublic ? "public" : "private");

    // Show confirmation message
    setShowDisclaimer(true);
    setTimeout(() => setShowDisclaimer(false), 6000);
  };

  return (
    <ProfileSection $isPublic={isPublic}>
      <AvatarContainer>
        <AvatarButton $isPublic={isPublic} aria-label="User profile picture">
          <img src={user?.avatar || "/assets/avatar.png"} alt="User avatar" />
        </AvatarButton>
        <Hint>Profile visibility settings</Hint>
      </AvatarContainer>

      <UserInfo>
        <UserName>{user?.name || "User"}</UserName>
        <UserEmail>{user?.email || "user@example.com"}</UserEmail>
      </UserInfo>

      <StatusCard $isPublic={isPublic} role="status">
        <StatusTitle>
          {isPublic ? "🌍 Public Profile" : "🔒 Private Profile"}
        </StatusTitle>
        <StatusDescription>
          {isPublic
            ? "Your goals are visible to the community and can be shared"
            : "Your goals are private and only visible to you"}
        </StatusDescription>
      </StatusCard>

      <ToggleButton
        $isPublic={isPublic}
        onClick={handleToggle}
        aria-label={`Switch to ${isPublic ? "private" : "public"} profile`}
      >
        {isPublic ? " Make Private" : " Make Public"}
      </ToggleButton>

      {showDisclaimer && (
        <DisclaimerText role="status" aria-live="polite">
          Profile updated!{" "}
          {isPublic
            ? "Your goals can now be shared with the community when you click 'Share to Community'"
            : "Your goals are now private and any shared goals have been removed from the community"}
        </DisclaimerText>
      )}
    </ProfileSection>
  );
};

export default ProfileSetting;

/*import React, { useState } from "react";
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

export default ProfileSetting;*/
