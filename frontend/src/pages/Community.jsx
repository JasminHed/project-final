import moment from "moment";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { Message } from "../styling/LoadingMessage.jsx";

//the old post must be able to be deleted somehow, chek on that

const API_BASE_URL = "https://project-final-ualo.onrender.com";

const Container = styled.div`
  padding: 80px 20px 100px;
  max-width: 100%;
  margin: 0 auto;

  @media (min-width: 669px) {
    max-width: 1200px;
  }

  @media (min-width: 1025px) {
    max-width: 1400px;
  }
`;

const HeaderSection = styled.div`
  margin-bottom: 40px;
`;

const PostsGrid = styled.div`
  @media (min-width: 669px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  @media (min-width: 1025px) {
    gap: 20px;
  }
`;

const PostContainer = styled.article`
  border: 2px solid var(--color-focus);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid #ddd;
  background: var(--color-card-background);

  p {
    margin-top: 15px;
    margin-bottom: 15px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const CommentsSection = styled.section`
  margin-top: 15px;
  border-top: 1px solid #ddd;
  padding-top: 15px;
`;

const CommentTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  resize: none;
  min-height: 80px;
  margin-bottom: 10px;
`;

const CommentButton = styled.button`
  background-color: var(--color-focus);
  border: none;
  border-radius: 5px;
  padding: 8px 10px;
  cursor: pointer;
  margin-right: 10px;
  margin-top: 5px;
  margin-bottom: 5px;

  &:hover {
    opacity: 0.8;
  }
`;

const CommentItem = styled.div`
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 10px;
  margin-bottom: 10px;
`;

const Img = styled.img`
  width: 100%;
  height: auto;
  max-height: 300px;
  margin: 0 auto;
  display: block;
  object-fit: cover;
`;
//Community → fetches all posts →
//loops through posts and passes each post to CommunityPost
//CommunityPost renders a "card" with like/comment functionality

const CommunityPost = ({ post }) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);

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
              <CommentButton onClick={() => handleDeleteComment(comment._id)}>
                Delete comment
              </CommentButton>
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
            journey. We're here to cheer each other on, offer support, and share
            in the ups and downs.{" "}
          </p>

          <p>
            Jump in, join the energy, and remember — you're never alone on your
            path.
          </p>

          <Img
            src="/assets/13.png"
            alt="A graphic image showing two hearts hugging"
          />
        </HeaderSection>
        <PostsGrid>
          {posts.map((post) => (
            <CommunityPost key={post._id} post={post} />
          ))}
        </PostsGrid>
      </main>
    </Container>
  );
};

export default Community;
