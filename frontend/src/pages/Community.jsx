import React, { useEffect, useState } from "react";
import styled from "styled-components";

//add delete instead of cancel, more user friendly i think

const API_BASE_URL = "https://project-final-ualo.onrender.com";

const Container = styled.div`
  padding: 80px 20px 100px;
  max-width: 100%;
  margin: 0 auto;

  @media (min-width: 669px) {
    max-width: 800px;
  }
`;

const PostContainer = styled.div`
  border: 2px solid var(--color-focus);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const CommentsContainer = styled.div`
  margin-top: 15px;
  border-top: 1px solid #ddd;
  padding-top: 15px;
`;

const CommentForm = styled.div`
  margin-bottom: 15px;
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
  max-width: 500px;
  height: auto;
  margin: 0 auto;
  display: block;
  object-fit: contain;

  @media (min-width: 668px) {
    img {
      max-width: 700px;
    }
  }
`;

const CommunityPost = ({ post }) => {
  const [likes, setLikes] = useState(post.likes || 0);
  const [showComments, setShowComments] = useState(false);
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

  const handleCommentClick = () => {
    setShowComments(!showComments);
  };

  const handleAddComment = () => {
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
            text: data.response.text,
            createdAt: data.response.createdAt,
            userName: data.response.userName || "Anonymous",
          };
          setComments([...comments, added]);
          setNewComment("");
        }
      });
  };

  const handleCancelComment = () => {
    setNewComment("");
    setShowComments(false);
  };

  const handleTextareaChange = (e) => {
    setNewComment(e.target.value);
  };

  return (
    <main id="main-content">
      <PostContainer>
        <h3>My intention is: {post.intention}</h3>
        <h4>Posted by: {post.userName || "Anonymous"}</h4>

        <p>Specific: {post.specific}</p>
        <p>Measurable: {post.measurable}</p>
        <p>Achievable: {post.achievable}</p>
        <p>Relevant: {post.relevant}</p>
        <p>Time-bound: {post.timebound}</p>

        <ButtonContainer>
          <button onClick={handleLike} aria-label="Like post">
            ❤️ Like {likes}
          </button>
          <button onClick={handleCommentClick} aria-label="Comment on post">
            💬 Comment ({comments.length})
          </button>
        </ButtonContainer>

        {showComments && (
          <CommentsContainer>
            <CommentForm>
              <CommentTextarea
                aria-label="Write your comment here"
                value={newComment}
                onChange={handleTextareaChange}
                placeholder="Write your comment here"
              />
              <div>
                <CommentButton onClick={handleAddComment}>
                  Send comment
                </CommentButton>
                <CommentButton onClick={handleCancelComment}>
                  Cancel comment
                </CommentButton>
              </div>
            </CommentForm>

            {comments.map((comment, index) => (
              <CommentItem key={index}>
                <p>{comment.text}</p>
                <small>
                  {comment.timestamp ||
                    new Date(comment.createdAt).toLocaleString()}
                </small>
                {comment.userName && (
                  <p>
                    <strong>{comment.userName}</strong>
                  </p>
                )}
              </CommentItem>
            ))}
          </CommentsContainer>
        )}
      </PostContainer>
    </main>
  );
};

const Community = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(`${API_BASE_URL}/community-posts`)
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
      });
  }, []);

  return (
    <Container>
      <h1>Welcome to the Community</h1>
      <p>
        All posts you see here are public, meaning every user can view, like,
        and comment on your intentions and goals.{" "}
      </p>

      <p>
        The purpose of this community is to build connection along the journey.
        We’re here to cheer each other on, offer support, and share in the ups
        and downs.{" "}
      </p>

      <p>
        Jump in, join the energy, and remember — you’re never alone on your
        path.
      </p>
      <hr />
      <Img
        src="/assets/13.png"
        alt="A graphic image showing two hearts hugging"
      />

      {posts.map((post) => (
        <CommunityPost key={post._id} post={post} />
      ))}
    </Container>
  );
};

export default Community;
