import moment from "moment";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { useUserStore } from "../store/UserStore";
import { Message } from "../styling/LoadingMessage.jsx";

//the old post must be able to be deleted somehow, chek on that

const API_BASE_URL = "https://project-final-ualo.onrender.com";

const Container = styled.div`
  padding: 24px 16px 32px;
  max-width: 100%;
  margin: 0 auto;

  @media (min-width: 669px) {
    padding: 48px 24px 64px;
    max-width: 1200px;
  }

  @media (min-width: 1025px) {
    padding: 64px 32px 80px;
    max-width: 1400px;
  }
`;

const HeaderSection = styled.div`
  margin-bottom: 32px;
  text-align: center;

  @media (min-width: 669px) {
    margin-bottom: 48px;
  }
`;

const PostsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (min-width: 669px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 28px;
  }

  @media (min-width: 1025px) {
    gap: 32px;
  }
`;

const PostContainer = styled.article`
  border: 2px solid var(--color-focus);
  border-radius: 20px;
  padding: 24px 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-2px);
  }

  header h2 {
    margin-bottom: 12px;

    p {
      font-style: italic;
      font-size: 14px;
      font-weight: normal;
    }
  }

  p {
    margin-top: 8px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 20px;
`;

const CommentsSection = styled.section`
  margin-top: 20px;
  padding-top: 20px;
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
  background-color: var(--color-focus);
  border: none;
  border-radius: 8px;
  padding: 10px 16px;
  cursor: pointer;
  margin-right: 8px;
  margin-top: 4px;
  margin-bottom: 4px;
  font-weight: 500;

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
const Img = styled.img`
  width: 95%;
  max-height: 400px;
  margin: 32px auto;
  display: block;
  object-fit: cover;
  border-radius: 16px;

  @media (min-width: 669px) {
    width: 100%;
    max-height: 400px;
    margin: 48px auto;
  }
`;
//Community → fetches all posts →
//loops through posts and passes each post to CommunityPost
//CommunityPost renders a "card" with like/comment functionality
//Delete button only for user who made the comment

const CommunityPost = ({ post }) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const { user: currentUser } = useUserStore();

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
    <PostContainer>
      <header>
        <h2>
          My intention is: <p>{post.intention}</p>
        </h2>
      </header>
      <p>
        <strong>Posted by:</strong> {post.userName || "Anonymous"}
      </p>
      <p>
        <strong>Specific:</strong> {post.specific}
      </p>
      <p>
        <strong>Measurable:</strong> {post.measurable}
      </p>
      <p>
        <strong>Achievable:</strong> {post.achievable}
      </p>
      <p>
        <strong>Relevant:</strong> {post.relevant}
      </p>
      <p>
        <strong>Time-bound: </strong>
        {post.timebound}
      </p>

      <ButtonContainer>
        <button
          onClick={handleLike}
          aria-label={`Like this post, currently has ${likes} likes`}
        >
          ❤️ Like {likes}
        </button>
      </ButtonContainer>

      <CommentsSection
        role="region"
        aria-live="polite"
        aria-label="Comments section"
      >
        <form onSubmit={handleAddComment}>
          <CommentTextarea
            aria-label="Write your comment here"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write your comment here"
          />
          <div>
            <CommentButton type="submit">Send comment</CommentButton>
          </div>
        </form>

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
                <CommentButton onClick={() => handleDeleteComment(comment._id)}>
                  Delete comment
                </CommentButton>
              )}
            </CommentItem>
          ))}
        </div>
      </CommentsSection>
    </PostContainer>
  );
};

//Show the first part of community page, header intro + delegates a post to postcommunity
const Community = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/community-posts`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Message>Loading your community board...</Message>;
  }

  return (
    <>
      <Img src="/assets/Dashboard.jpg" alt="Hand with flowers" />
      <Container>
        <main id="main-content">
          <HeaderSection>
            <header>
              <h1>Welcome to the Community</h1>
            </header>
            <p>
              All posts you see here are public, meaning every user can view,
              like, and comment on your intentions and goals.{" "}
            </p>

            <p>
              The purpose of this community is to build connection along the
              journey. We're here to cheer each other on, offer support, and
              share in the ups and downs.{" "}
            </p>

            <p>
              Jump in, join the energy, and remember — you're never alone on
              your path.
            </p>
          </HeaderSection>

          <PostsGrid>
            {posts.map((post) => (
              <CommunityPost key={post._id} post={post} />
            ))}
          </PostsGrid>
        </main>
      </Container>
    </>
  );
};

export default Community;
