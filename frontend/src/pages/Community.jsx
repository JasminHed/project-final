import React, { useEffect, useState } from "react";
import styled from "styled-components";

import CommunityPost from "../components/CommunityPost.jsx";
import { Message } from "../styling/LoadingMessage.jsx";

const API_BASE_URL = "https://project-final-ualo.onrender.com";

const Container = styled.div`
  padding: 32px 16px;
  max-width: 100%;
  margin: 0 auto;

  @media (min-width: 668px) {
    padding: 64px 24px;
    max-width: 1200px;
  }

  @media (min-width: 1024px) {
    padding: 80px 32px;
    max-width: 1400px;
  }
`;

const HeaderSection = styled.div`
  padding: 40px 16px 60px;
  max-width: 800px;
  margin: 0 auto;

  @media (min-width: 668px) {
    padding: 60px 32px 80px;
  }

  @media (min-width: 1024px) {
    padding: 80px 32px 100px;
  }
`;

const PostsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 24px;
  margin-bottom: 24px;

  @media (min-width: 668px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
    margin-top: 32px;
    margin-bottom: 32px;
  }

  @media (min-width: 1024px) {
    gap: 40px;
    margin-top: 40px;
    margin-bottom: 40px;
  }
`;
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
      <Container>
        <main id="main-content">
          <HeaderSection>
            <header>
              <h1>Welcome to the Community</h1>
            </header>
            <p>
              All posts you see here are public, meaning every user can view,
              like, and comment on your intentions and goals. The purpose of
              this community is to build connection along the journey. We're
              here to cheer each other on, offer support, and share in the ups
              and downs. Jump in, join the energy, and remember — you're never
              alone on your path.
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
