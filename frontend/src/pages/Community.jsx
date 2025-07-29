import React, { useEffect, useState } from "react";
import styled from "styled-components";

// comments and likes must go to backend and fecth from there. right now they go away.
// API base
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
  max-width: 300px;
  height: auto;
  margin: 0 auto;
  display: block;
  object-fit: contain;

  @media (min-width: 668px) {
    img {
      max-width: 500px;
    }
  }
`;

// Display a single community post and manages local like count state
const CommunityPost = ({ post, onLike, onCommentClick }) => {
  const [likes, setLikes] = useState(post.likes || 0);
  // Show/hide comments
  const [showComments, setShowComments] = useState(false);
  // New comment
  const [newComment, setNewComment] = useState("");
  // All comments on post
  const [comments, setComments] = useState(post.comments || []);

  const createComment = (text) => {
    return {
      id: Date.now(),
      text: text,
      timestamp: new Date().toLocaleString(),
    };
  };

  // Likes
  const handleLike = () => {
    onLike(post._id);
    setLikes(likes + 1);
  };

  // Function handle comment click
  const handleCommentClick = () => {
    setShowComments(!showComments);
    onCommentClick(post._id);
  };

  // Function adding comment
  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = createComment(newComment);
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  // Function handle comment cancelation, like you regret, dont want to write
  const handleCancelComment = () => {
    setNewComment("");
    setShowComments(false);
  };

  const handleTextareaChange = (e) => {
    setNewComment(e.target.value);
  };

  return (
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

          {comments.map((comment) => (
            <CommentItem key={comment.id}>
              <p>{comment.text}</p>
              <small>{comment.timestamp}</small>
            </CommentItem>
          ))}
        </CommentsContainer>
      )}
    </PostContainer>
  );
};

// Component that holds and manages the list of posts
const Community = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = () => {
      return fetch(`${API_BASE_URL}/community-posts`).then((res) => res.json());
    };

    fetchPosts().then(setPosts);
  }, []);

  const handleLike = (postId) => {
    const likePostAPI = (postId) => {
      return fetch(`${API_BASE_URL}/community-posts/${postId}/like`, {
        method: "POST",
      });
    };

    likePostAPI(postId).then(() => {
      setPosts((posts) =>
        posts.map((post) =>
          post._id === postId ? { ...post, likes: (post.likes || 0) + 1 } : post
        )
      );
    });
  };

  return (
    <Container>
      <h2>Welcome to the Community</h2>
      <Img
        src="/assets/13.png"
        alt="A graphic image showing two hearts hugging"
      />
      {posts.map((post) => (
        <CommunityPost
          key={post._id}
          post={post}
          onLike={handleLike}
          onCommentClick={() => {}}
        />
      ))}
    </Container>
  );
};

export default Community;
