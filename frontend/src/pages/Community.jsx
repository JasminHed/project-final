import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Container = styled.div`
  padding: 80px 20px 100px;
  max-width: 100%;
  margin: 0 auto;

  @media (min-width: 669px) {
    max-width: 800px;
  }
`;

const Title = styled.h1`
  text-align: center;
  margin-bottom: 30px;
`;

const PostContainer = styled.div`
  border: 2px solid var(--color-focus);
  border-radius: 15px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const PostTitle = styled.h3`
  margin-bottom: 15px;
`;

const PostDetail = styled.p`
  margin-bottom: 8px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

//Display a single community post and manages local like count state
const CommunityPost = ({ post, onLike, onCommentClick }) => {
  const [likes, setLikes] = useState(post.likes || 0);

  //Incrementing local likes immediately
  const handleLike = () => {
    onLike(post._id);
    setLikes(likes + 1);
  };

  return (
    <PostContainer key={post._id}>
      <PostTitle>My intention is: {post.intention}</PostTitle>
      <PostDetail>
        <strong>User:</strong> {post.userName}
      </PostDetail>
      <PostDetail>
        <strong>Specific:</strong> {post.specific}
      </PostDetail>
      <PostDetail>
        <strong>Measurable:</strong> {post.measurable}
      </PostDetail>
      <PostDetail>
        <strong>Achievable:</strong> {post.achievable}
      </PostDetail>
      <PostDetail>
        <strong>Relevant:</strong> {post.relevant}
      </PostDetail>
      <PostDetail>
        <strong>Time-bound:</strong> {post.timebound}
      </PostDetail>
      <ButtonContainer>
        <button onClick={handleLike}>❤️ Like {likes}</button>
        <button
          onClick={() => onCommentClick(post._id)}
          aria-label="Comment on post"
        >
          💬 Comment
        </button>
      </ButtonContainer>
    </PostContainer>
  );
};

//Component that holds and manages the list of posts
const Community = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  //Fetches the list of community posts from the backend API
  useEffect(() => {
    fetch("http://localhost:8080/community-posts")
      .then((res) => res.json())
      .then(setPosts);
  }, []);

  const handleLike = (postId) => {
    // Fetch post to like the post
    fetch(`http://localhost:8080/community-posts/${postId}/like`, {
      method: "POST",
    }).then(() => {
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

  return (
    <Container>
      <Title>Community</Title>
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
