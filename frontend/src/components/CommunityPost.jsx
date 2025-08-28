import moment from "moment";
import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import {
  FaChevronDown,
  FaChevronUp,
  FaHeart,
  FaLightbulb,
  FaPaperPlane,
  FaRocket,
} from "react-icons/fa";
import styled from "styled-components";

import { useClickOutside } from "../hooks/useClickOutside.jsx";
import { useUserStore } from "../store/UserStore";
import { FormCard, Textarea } from "../styling/FormCard.jsx";

const API_BASE_URL = "https://project-final-ualo.onrender.com";

const Label = styled.label`
  text-transform: capitalize;
  font-weight: bold;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  margin: 24px 0;

  @media (min-width: 668px) {
    margin: 32px 0;
  }

  @media (min-width: 1024px) {
    margin: 40px 0;
  }
`;

const CommentsSection = styled.section`
  margin-top: 24px;
  padding-top: 20px;

  @media (min-width: 668px) {
    margin-top: 32px;
  }

  @media (min-width: 1024px) {
    margin-top: 40px;
  }
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  padding: 16px;
  border-radius: 12px;
  resize: none;
  min-height: 80px;
  margin-bottom: 10px;

  &:focus {
    outline: none;
    border-color: var(--color-focus);
  }
`;

const CommentButton = styled.button`
  background-color: ${(props) => {
    if (props.$variant === "delete") return "var(--color-error)";
    if (props.$variant === "send") return "var(--color-success)";
    return "var(--color-focus)";
  }};

  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  margin-right: 8px;
  margin-top: 4px;
  margin-bottom: 15px;
  font-weight: 500;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-1px);
  }
`;

const CommentItem = styled.div`
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 10px;
  p {
    margin-bottom: 8px;
  }

  small {
    font-size: 12px;
  }
`;

const LikeButton = styled.button`
  background: none;
  border: 2px solid var(--color-focus);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 18px;
  color: var(--color-text-primary);
  transition: transform 0.2s ease;

  svg {
    color: #e53e3e;
  }

  &:hover {
    transform: scale(1.1);
  }

  &:focus {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }
`;

const Name = styled.p`
  text-align: center;
  font-style: italic;
`;

const Icon = styled.span`
  display: inline-flex;
  align-items: center;
  margin-right: 6px;
  font-size: 18px;
  color: ${(props) => props.color || "currentColor"};
`;

const ToggleButton = styled.button`
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  background: none;
  border: none;
  cursor: pointer;
  color: inherit;
  font: inherit;

  &:focus {
    outline: 2px solid var(--color-focus);
    outline-offset: 2px;
  }

  @media (min-width: 668px) {
    gap: 8px;
    margin-bottom: 16px;
  }

  @media (min-width: 1024px) {
    gap: 10px;
    margin-bottom: 20px;
  }
`;

const SmartSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  @media (min-width: 668px) {
    gap: 12px;
  }

  @media (min-width: 1024px) {
    gap: 16px;
  }
`;

//Community → fetches all posts →
//loops through posts and passes each post to CommunityPost
//CommunityPost renders a "card" with like/comment functionality
//Delete button only for user who made the comment
const SMART_FIELDS = [
  "specific",
  "measurable",
  "achievable",
  "relevant",
  "timebound",
];

const CommunityPost = ({ post }) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const { user: currentUser } = useUserStore();
  const [showComments, setShowComments] = useState(false);
  const [showSMART, setShowSMART] = useState(true);

  const handleLike = () => {
    fetch(`${API_BASE_URL}/community-posts/${post._id}/like`, {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setLikes(data.response.likes);
        }
      });
  };

  const handleAddComment = (e) => {
    e.preventDefault();

    if (!newComment.trim()) return;

    fetch(`${API_BASE_URL}/community-posts/${post._id}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("accessToken"),
      },
      body: JSON.stringify({ text: newComment }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const added = {
            _id: data.response._id,
            text: data.response.text,
            createdAt: data.response.createdAt,
            userName: data.response.userName || "Anonymous",
          };
          setComments([...comments, added]);
          setNewComment("");
        }
      });
  };

  const handleDeleteComment = (commentId) => {
    fetch(`${API_BASE_URL}/messages/${commentId}`, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("accessToken"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setComments((prev) =>
            prev.filter((comment) => comment._id !== commentId)
          );
        }
      })
      .catch((err) => console.error("Delete failed", err));
  };

  return (
    <FormCard>
      <h2>
        {" "}
        <Icon color="#6c63ff">
          <FaLightbulb />
        </Icon>
        My Intention{" "}
      </h2>

      <Name>{post.userName || "Anonymous"}</Name>

      <label htmlFor={`intention-${post._id}`} className="sr-only"></label>
      <Textarea
        id={`intention-${post._id}`}
        rows={2}
        value={post.intention}
        readOnly
        aria-label="Intention"
      />

      <ToggleButton
        onClick={() => setShowSMART((prev) => !prev)}
        aria-expanded={showSMART}
        aria-controls={`smart-section-${post._id}`}
      >
        <span className="sr-only">
          {showSMART ? "Hide Detailed Goals" : "Show Detailed Goals"}
        </span>
        {showSMART ? <FaChevronUp /> : <FaChevronDown />}
      </ToggleButton>

      {showSMART && (
        <SmartSection id={`smart-section-${post._id}`}>
          <h2>
            <Icon color="#ff6584">
              <FaRocket />
            </Icon>
            My detailed goals
          </h2>
          {SMART_FIELDS.map((field) => (
            <div key={field}>
              <Label htmlFor={`${field}-${post._id}`} className="sr-only">
                {field}
              </Label>
              <Textarea
                id={`${field}-${post._id}`}
                rows={2}
                value={post[field]}
                readOnly
                aria-label={field.charAt(0).toUpperCase() + field.slice(1)}
              />
            </div>
          ))}
        </SmartSection>
      )}

      <ButtonContainer>
        <LikeButton
          onClick={handleLike}
          aria-label={`Like this post, currently has ${likes} likes`}
        >
          <FaHeart /> {likes}
        </LikeButton>
      </ButtonContainer>

      <CommentsSection
        role="region"
        aria-live="polite"
        aria-label="Comments section"
      >
        <CommentButton
          type="button"
          onClick={() => setShowComments((prev) => !prev)}
        >
          Comment on this post
        </CommentButton>

        {showComments && (
          <form onSubmit={handleAddComment}>
            <CommentTextarea
              aria-label="Write your comment here"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write your comment here"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment(e);
                }
              }}
            />

            <CommentButton
              type="submit"
              $variant="send"
              aria-label="Send comment"
            >
              <FaPaperPlane />
            </CommentButton>

            <div role="log" aria-live="polite" aria-label="Comments list">
              {comments.map((comment) => (
                <CommentItem key={comment._id}>
                  <p>{comment.text}</p>
                  <small>{moment(comment.createdAt).fromNow()}</small>
                  {comment.userName && (
                    <p>
                      <strong>{comment.userName}</strong>
                    </p>
                  )}
                  {comment.userName === currentUser.name && (
                    <CommentButton
                      type="button"
                      $variant="delete"
                      onClick={() => handleDeleteComment(comment._id)}
                      aria-label={`Delete comment by ${comment.userName}`}
                    >
                      <FaTrash />
                    </CommentButton>
                  )}
                </CommentItem>
              ))}
            </div>
          </form>
        )}
      </CommentsSection>
    </FormCard>
  );
};
export default CommunityPost;
