import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

//Add journal section?
//Add vision board-using another library snce edit-text did not work.

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

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  background-color: var(--color-focus);
  border: none;
  border-radius: 8px;
  padding: 8px 8px;
  margin-top: 18px;
  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }
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
  padding: 8px 15px;
  cursor: pointer;
  margin-right: 10px;

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

//Display a single community post and manages local like count state
const CommunityPost = ({ post, onLike, onCommentClick }) => {
  const [likes, setLikes] = useState(post.likes || 0);
  // Sow/hide comments
  const [showComments, setShowComments] = useState(false);
  // New comment
  const [newComment, setNewComment] = useState("");
  // All comments on post
  const [comments, setComments] = useState(post.comments || []);

  //Incrementing local likes immediately
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
      const comment = {
        id: Date.now(),
        text: newComment,
        timestamp: new Date().toLocaleString(),
      };
      setComments([...comments, comment]);
      setNewComment("");
    }
  };

  // Function handle comment, delete or remove or cancel
  const handleCancelComment = () => {
    setNewComment("");
    setShowComments(false);
  };

  return (
    <PostContainer>
      <h3>My intention is: {post.intention}</h3>

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
              onChange={(e) => setNewComment(e.target.value)}
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

//Component that holds and manages the list of posts
const Community = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  //Fetches the list of community posts from the backend API
  useEffect(() => {
    fetch("https://project-final-ualo.onrender.com/community-posts")
      .then((res) => res.json())
      .then(setPosts);
  }, []);

  const handleLike = (postId) => {
    // Fetch post to like the post
    fetch(
      `https://project-final-ualo.onrender.com/community-posts/${postId}/like`,
      {
        method: "POST",
      }
    ).then(() => {
      // Update local likes count after successful like
      setPosts((posts) =>
        posts.map((post) =>
          post._id === postId ? { ...post, likes: (post.likes || 0) + 1 } : post
        )
      );
    });
  };

  //this needs to be built further. How do we show the comments, thread or a textbox?
  const handleCommentClick = (postId) => {
    console.log("Show comments for post", postId);
  };

  // Navigate to dahsboard
  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <Container>
      <HeaderContainer>
        <h2>Community</h2>
        <BackButton onClick={handleBackToDashboard}>
          ← Back to dahsboard
        </BackButton>
      </HeaderContainer>

      {posts.map((post) => (
        <CommunityPost
          key={post._id}
          post={post}
          onLike={handleLike}
          onCommentClick={handleCommentClick}
        />
      ))}
    </Container>
  );
};

export default Community;
