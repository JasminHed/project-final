import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import useClickOutside from "../components/useClickOutside";

const API_BASE_URL = "https://project-final-ualo.onrender.com";

const ChatbotIcon = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background: var(--primary-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 999;
`;

const ChatbotWindow = styled.div`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 320px;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 1000;
`;

const Section = styled.section`
  margin-bottom: 15px;
`;

const AIbot = () => {
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/weekly-messages`, {
      headers: {
        Authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          setMessage(data.message);
          setMessageType(data.type);
          setIsOpen(true);
        }
      })
      .catch((error) => {
        setMessage("Failed to load message.");
        console.error(error);
      });
  }, []);

  // Hook to close when click outside
  useClickOutside(ref, () => setIsOpen(false));

  //if (!isOpen) return null;

  return (
    <>
      <ChatbotIcon onClick={() => setIsOpen(!isOpen)}>🤖</ChatbotIcon>
      {isOpen && (
        <ChatbotWindow ref={ref}>
          <Section>
            <h4>
              {messageType === "checkin" ? "How are you doing?" : "Hey you!"}
            </h4>
            <p>{message}</p>
          </Section>
        </ChatbotWindow>
      )}
    </>
  );
};
export default AIbot;
