import React, { useRef, useState } from "react";
import styled from "styled-components";

import useClickOutside from "../hooks/useClickOutside.jsx";

const API_BASE_URL = "https://project-final-ualo.onrender.com";

const ChatIcon = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  background: var(--color-button-bh);
  color: var(--color-button-text);
  font-size: 28px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
    background: var(--color-button-hover);
  }
`;

const ChatContainer = styled.div`
  position: fixed;
  bottom: 100px;
  right: 30px;
  width: 340px;
  background: rgba(var(--color-background-rgb), 0.85);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  flex-direction: column;
  transition: opacity 0.25s ease, transform 0.25s ease;
  color: var(--color-text-primary);
`;

const MessagesContainer = styled.div`
  flex: 1;
  height: 250px;
  overflow-y: auto;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Message = styled.div`
  align-self: ${(props) => (props.$isUser ? "flex-end" : "flex-start")};
  max-width: 80%;
  padding: 10px 14px;
  border-radius: 16px;
  background-color: ${(props) =>
    props.$isUser ? "var(--color-text-link)" : "var(--color-card-background)"};
  color: ${(props) =>
    props.$isUser ? "var(--color-button-text)" : "var(--color-text-primary)"};
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  animation: fadeIn 0.2s ease forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const InputContainer = styled.div`
  display: flex;
  gap: 8px;
  padding: 12px;
  background: var(--color-background);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
`;

const Input = styled.input`
  flex: 1;
  padding: 10px;
  border-radius: 20px;
  border: 1px solid #ddd;
  outline: none;
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);

  &:focus {
    border-color: var(--color-focus);
  }
`;

const AIbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const chatRef = useRef();

  // Close chat when clicking outside
  useClickOutside(chatRef, () => setIsOpen(false));

  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, isUser: true }];
    setMessages(newMessages);
    setLoading(true);

    const userInput = input;
    setInput("");
    //fetching from backend
    fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({ message: userInput }),
    })
      .then((response) => response.json())
      .then((data) => {
        const aiResponse =
          data.choices?.[0]?.message?.content || "Sorry, I couldn't respond.";
        setMessages([...newMessages, { text: aiResponse, isUser: false }]);
      })
      .catch(() => {
        setMessages([
          ...newMessages,
          { text: "Error: Could not get response.", isUser: false },
        ]);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  //users can press enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      <ChatIcon onClick={() => setIsOpen(!isOpen)}></ChatIcon>

      <ChatContainer ref={chatRef} $isOpen={isOpen}>
        <h3>AI Assistant</h3>

        <MessagesContainer>
          {messages.map((msg, index) => (
            <Message key={index} $isUser={msg.isUser}>
              <strong>{msg.isUser ? "You" : "AI"}:</strong> {msg.text}
            </Message>
          ))}
          {loading && <Message>AI is typing...</Message>}
        </MessagesContainer>

        <InputContainer>
          <Input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything..."
          />
          <button onClick={sendMessage} disabled={loading}>
            Send message
          </button>
        </InputContainer>
      </ChatContainer>
    </>
  );
};

export default AIbot;
