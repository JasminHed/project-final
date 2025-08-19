import React, { useState } from "react";
import styled from "styled-components";

const ProfileSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 20px;
  margin: 20px auto;
  border-radius: 16px;
  max-width: 340px;
  min-height: 400px;
  transition: all 0.3s ease;

  @media (min-width: 669px) {
    max-width: 400px;
    padding: 32px 24px;
    min-height: 400px;
  }
`;

const UserInfo = styled.div`
  text-align: center;
  margin-bottom: 24px;
`;

const UserName = styled.p`
  margin: 0 0 8px 0;
  color: var(--color-text-primary);
`;

const UserEmail = styled.p`
  margin: 0;
  font-style: italic;
  opacity: 0.8;
`;

const StatusCard = styled.div`
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 10px;
  background-color: ${({ $isPublic }) =>
    $isPublic ? "rgba(112, 101, 141, 0.1)" : "rgba(0, 77, 64, 0.1)"};
  border: 1px solid
    ${({ $isPublic }) =>
      $isPublic ? "var(--color-text-link)" : "var(--color-button-bg)"};
  text-align: center;
  width: 100%;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  }
`;

const StatusTitle = styled.h2`
  font-weight: 600;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  color: var(--color-text-primary);

  @media (min-width: 669px) {
    font-size: 18px;
  }
`;

const StatusDescription = styled.div`
  font-size: 14px;
  color: var(--color-text-primary);
  margin: 0;

  @media (min-width: 669px) {
    font-size: 16px;
  }
`;

const ToggleButton = styled.button`
  background-color: ${({ $isPublic }) =>
    $isPublic ? "var(--color-text-link)" : "var(--color-button-bg)"};
  color: var(--color-button-text);
  border: none;
  padding: 14px 28px;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 12px;
  min-width: 140px;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    background-color: var(--color-button-hover);
  }

  &:focus {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }

  @media (min-width: 669px) {
    padding: 16px 32px;
    font-size: 16px;
  }
`;

const DisclaimerText = styled.div`
  border-radius: 8px;
  padding: 16px;
  font-size: 14px;
  text-align: center;
  margin-top: 12px;
  width: 100%;
  color: var(--color-text-primary);
  opacity: ${({ $show }) => ($show ? 1 : 0)};
  transform: translateY(${({ $show }) => ($show ? "0" : "-10px")});
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

  @media (min-width: 669px) {
    font-size: 16px;
  }
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
      <UserInfo>
        <UserName>Name: {user?.name || "User"}</UserName>
        <UserEmail>Email: {user?.email || "user@example.com"}</UserEmail>
      </UserInfo>

      <StatusCard $isPublic={isPublic} role="status">
        <StatusTitle>
          {isPublic ? "Public Profile" : " Private Profile"}
        </StatusTitle>
        <StatusDescription>
          {isPublic
            ? "Your goals are visible to the community and can be shared"
            : "Your goals are private and only visible to you"}
        </StatusDescription>
      </StatusCard>
      <DisclaimerText $show={showDisclaimer} role="status" aria-live="polite">
        Profile updated!{" "}
        {isPublic
          ? "Your goals can now be shared with the community when you click 'Share to Community'"
          : "Your goals are now private and any shared goals have been removed from the community"}
      </DisclaimerText>

      <ToggleButton
        $isPublic={isPublic}
        onClick={handleToggle}
        aria-label={`Switch to ${isPublic ? "private" : "public"} profile`}
      >
        {isPublic ? " Make Private" : " Make Public"}
      </ToggleButton>
    </ProfileSection>
  );
};

export default ProfileSetting;

//kanske kan man ha denna på mitten men som en collapsabel, ser konstigt ut på sidan, typ i mitten fast den öppnas och stängs genom att klikca på länk namn Profile Details?
