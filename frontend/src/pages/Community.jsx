import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

//We need to make the comments work so that a user can write a comment on a post.
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
      <h4>My intention is: {post.intention}</h4>
      <p>Specific: {post.specific}</p>
      <p>Measurable: {post.measurable}</p>
      <p>Achievable: {post.achievable}</p>
      <p>Relevant: {post.relevant}</p>
      <p>Time-bound: {post.timebound}</p>
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

  return (
    <Container>
      <h1>Community</h1>
      <Img src="/assets/13.png" alt="An image of two hearts hugging" />
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
