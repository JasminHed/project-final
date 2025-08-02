import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import useClickOutside from "../components/useClickOutside";

const API_BASE_URL = "https://project-final-ualo.onrender.com";

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
  const [motivation, setMotivation] = useState("");
  const [motivationMessage, setMotivationMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/weekly-motivation`, {
      headers: {
        Authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.motivation) {
          setMotivation(data.motivation);
          setIsOpen(true);
        } else if (data.message) {
          setMotivationMessage(data.message);
        }
      })
      .catch((error) => {
        setMotivationMessage("Failed to load motivation.");
        console.error(error);
      });
  }, []);

  // Hook to close when click outside
  useClickOutside(ref, () => setIsOpen(false));

  if (!isOpen) return null;

  return (
    <ChatbotWindow ref={ref}>
      <Section>
        <h4>Hey you!</h4>
        {motivation ? (
          <p>{motivation}</p>
        ) : (
          <p>{motivationMessage || "Loading..."}</p>
        )}
      </Section>
    </ChatbotWindow>
  );
};

export default AIbot;
