import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

//Display a single community post and manages local like count state
const CommunityPost = ({ post, onLike, onCommentClick }) => {
  const [likes, setLikes] = useState(post.likes || 0);

  //Incrementing local likes immediately
  const handleLike = () => {
    onLike(post._id);
    setLikes(likes + 1);
  };

  return (
    <div key={post._id}>
      <h3>My intention is: {post.intention}</h3>
      <p>
        <strong>User:</strong> {post.userName}
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
        <strong>Time-bound:</strong> {post.timebound}
      </p>

      <button onClick={handleLike}>❤️ Like {likes}</button>
      <button
        onClick={() => onCommentClick(post._id)}
        aria-label="Comment on post"
      >
        💬 Comment
      </button>
    </div>
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
    <div>
      <h1>Community</h1>
      <button onClick={() => navigate("/dashboard")}>Back to dashboard</button>
      {posts.map((post) => (
        <CommunityPost
          key={post._id}
          post={post}
          onLike={handleLike}
          onCommentClick={handleCommentClick}
        />
      ))}
    </div>
  );
};

export default Community;
