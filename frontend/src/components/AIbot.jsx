import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import useClickOutside from "../components/useClickOutside";

const API_BASE_URL = "https://project-final-ualo.onrender.com";

const ChatbotIcon = styled.div`
  position: fixed;
  bottom: 50px;
  right: 50px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  cursor: pointer;

  z-index: 999;
`;

const Img = styled.img`
  width: 60px;
  height: 60px;
  object-fit: contain;
`;

const ChatbotWindow = styled.div`
  position: fixed;
  background: linear-gradient(135deg, var(--bg-primary), var(--bg-secondary));
  bottom: 80px;
  right: 20px;
  width: 280px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  padding: 15px;
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

  //this fecthes all messages
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

  return (
    <>
      <ChatbotIcon onClick={() => setIsOpen(!isOpen)}>
        <Img src="/assets/chat.png" alt="A blue and pink speach bubble" />
      </ChatbotIcon>
      {isOpen && (
        <ChatbotWindow ref={ref}>
          <Section>
            <h4>
              {messageType === "checkin" ? "How are you doing?" : "Hello!"}
            </h4>
            <p>{message}</p>
          </Section>
        </ChatbotWindow>
      )}
    </>
  );
};
export default AIbot;
