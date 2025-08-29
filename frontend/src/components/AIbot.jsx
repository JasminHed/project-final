import React, { useEffect, useRef, useState } from "react";
import { FaRobot } from "react-icons/fa";
import styled from "styled-components";

import useClickOutside from "../hooks/useClickOutside";
import { useUserStore } from "../store/UserStore.jsx";

const API_BASE_URL = "https://project-final-ualo.onrender.com";

const ChatIcon = styled.button`
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  border: none;
  font-size: 28px;
  cursor: pointer;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  z-index: 9999;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 10px 24px rgba(0, 0, 0, 0.2);
    background: var(--color-button-hover);
  }
`;

const ChatContainer = styled.dialog`
  position: fixed;
  margin: 0;
  inset: auto;
  width: 280px;
  height: 360px;
  bottom: 80px;
  right: 30px;
  z-index: 9999;
  border-radius: 16px;
  overflow: hidden;
  background-color: var(--color-card-background);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: ${(props) => (props.$isOpen ? "flex" : "none")};
  flex-direction: column;
  transition: opacity 0.25s ease-in-out, transform 0.25s ease-in-out;
  color: var(--color-text-primary);

  @media (min-width: 668px) {
    width: 340px;
    height: 500px;
  }
`;

const ChatHeader = styled.header`
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  h3 {
    margin: 0 0 8px 0;
  }
`;

const MessagesList = styled.ul`
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  height: 200px;
  padding: 10px;
  gap: 6px;
  list-style: none;
  margin: 0; //removes default margin

  @media (min-width: 668px) {
    height: 400px;
  }

  @media (min-width: 1024px) {
    height: 500px;
  }
`;

const MessageItem = styled.li`
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

const ChatForm = styled.form`
  display: flex;
  gap: 8px;
  padding: 12px;
  background: var(--color-background);

  border-top: 1px solid rgba(255, 255, 255, 0.05);

  button {
    padding: 8px 12px;
    font-size: 14px;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 8px 10px;
  border-radius: 20px;
  border: 1px solid #ddd;
  outline: none;
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-primary);

  &:focus {
    border-color: var(--color-focus);
  }

  @media (min-width: 668px) {
    padding: 12px 15px;
  }

  @media (min-width: 1024px) {
    padding: 15px 20px;
  }
`;

const AIbot = () => {
  const [messages, setMessages] = useState([]); //array of chat messages
  const [input, setInput] = useState(""); //current text typed by user
  const [loading, setLoading] = useState(false); //loading "luca is typing"
  const [isOpen, setIsOpen] = useState(false); //controls chat visibility
  const chatRef = useRef(); //clickoutside
  const buttonRef = useRef(); //close/open button

  const user = useUserStore((state) => state.user);
  const isLoggedIn = useUserStore((state) => state.isLoggedIn);
  const token = useUserStore((state) => state.token);

  //clears messages and fetch
  useEffect(() => {
    setMessages([]);
    if (isLoggedIn && user.userId) {
      fetch(`${API_BASE_URL}/api/chat?userId=${user.userId}`)
        .then((res) => res.json())
        .then((data) => setMessages(data.messages || []));
    }
  }, [isLoggedIn, user.userId]);

  useClickOutside(chatRef, (event) => {
    if (buttonRef.current && buttonRef.current.contains(event.target)) return;
    setIsOpen(false);
  });

  //adds the user’s typed message to the chat, clears the input, and sets a loading state.
  const sendMessage = () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { text: input, isUser: true }];
    setMessages(newMessages);
    setLoading(true);

    const userInput = input;
    setInput("");

    //sends the user’s message to the API, updates the chat with the response
    fetch(`${API_BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(isLoggedIn && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({
        message: userInput,
        userId: isLoggedIn ? user.id : null,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setMessages((prev) => [...prev, { text: data.message, isUser: false }]);
        console.log("Updated messages state:", [
          ...messages,
          { text: data.message, isUser: false },
        ]);
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
  //prevents reload
  const handleSubmit = (e) => {
    e.preventDefault();
    sendMessage();
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      <ChatIcon
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open chat with Luca"
        aria-expanded={isOpen}
      >
        <FaRobot size={28} />
      </ChatIcon>

      <ChatContainer ref={chatRef} $isOpen={isOpen} as="dialog">
        <ChatHeader>
          <h3>Luca</h3>
          <hr />
        </ChatHeader>
        <MessagesList role="log" aria-live="polite" aria-label="Chat messages">
          {messages.map((msg, index) => (
            <MessageItem key={index} $isUser={msg.isUser}>
              <strong>{msg.isUser ? "You" : "Luca"}:</strong> {msg.text}
            </MessageItem>
          ))}
          {loading && <MessageItem>Luca is typing...</MessageItem>}
        </MessagesList>

        <ChatForm onSubmit={handleSubmit}>
          <Input
            aria-label="Type your message"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Welcome to The Intention Hub..."
          />
          <button type="submit" disabled={loading}>
            Send message
          </button>
        </ChatForm>
      </ChatContainer>
    </>
  );
};

export default AIbot;
