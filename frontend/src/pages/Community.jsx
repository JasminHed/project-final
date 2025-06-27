import React, { useEffect, useState } from "react";

//this is missing comments and likes

const Community = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Fetch community posts
    fetch("http://localhost:8080/community-posts")
      .then((res) => res.json())
      .then(setPosts);
  }, []);

  return (
    <div>
      <h1>Community</h1>
      {posts.map((post) => (
        <div key={post._id}>
          <h3>
            My intention is:
            {post.intention}
          </h3>

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
        </div>
      ))}
    </div>
  );
};

export default Community;
