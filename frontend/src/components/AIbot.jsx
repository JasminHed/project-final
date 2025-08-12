import React, { useRef, useState } from "react";
import styled from "styled-components";

import useClickOutside from "../hooks/useClickOutside.jsx";

const API_BASE_URL = "https://project-final-ualo.onrender.com";

const ChatIcon = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: none;
  color: var(--color-button-text);
  background-color: var(--color-button-bh);
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: var(--color-button-hover);
  }
`;

const ChatContainer = styled.div`
  position: fixed;
  bottom: 90px;
  right: 20px;
  width: 300px;
  background: var(--color-background);
  border: 2px solid var(--color-focus);
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: ${(props) => (props.$isOpen ? "block" : "none")};
  color: var(--color-text-primary);
`;

const MessagesContainer = styled.div`
  height: 200px;
  overflow-y: auto;
  margin-bottom: 15px;
  border: 1px solid #eee;
  padding: 10px;
  border-radius: 5px;
`;

const Message = styled.div`
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 5px;
  background-color: ${(props) =>
    props.isUser ? "var(--color-text-link)" : "var(--color-card-background)"};
  color: ${(props) =>
    props.isUser ? "var(--color-button-text)" : "var(--color-text-primary)"};
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
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
      <ChatIcon onClick={() => setIsOpen(!isOpen)}>💬</ChatIcon>

      <ChatContainer ref={chatRef} $isOpen={isOpen}>
        <h3>Intention Coach</h3>

        <MessagesContainer>
          {messages.map((msg, index) => (
            <Message key={index} isUser={msg.isUser}>
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
