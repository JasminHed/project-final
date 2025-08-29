import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { useUserStore } from "../store/UserStore.jsx";

const API_BASE_URL = "https://project-final-ualo.onrender.com";

const ImpactBox = styled.section`
  background: var(--color-background);
  border: 2px solid var(--color-accent);
  border-radius: 8px;
  padding: 1.5rem;
  margin: 1rem 0;
  text-align: center;
`;

const ImpactTitle = styled.h2`
  color: var(--color-primary-text);
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
`;

const ImpactStats = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 1rem;
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  background: var(--color-accent);
  color: var(--color-primary-text);
  padding: 0.75rem;
  border-radius: 6px;
  min-width: 100px;

  strong {
    display: block;
    font-size: 1.5rem;
  }
`;
const CommunityImpact = React.forwardRef((props, ref) => {
  const { token } = useUserStore();
  const [stats, setStats] = useState({
    totalLikes: 0,
    totalComments: 0,
    recentComments: 0,
    totalPosts: 0,
  });

  const fetchStats = () => {
    if (!token) {
      return;
    }

    fetch(`${API_BASE_URL}/my-activity-stats`, {
      headers: { Authorization: token },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch community impact:", err);
      });
  };

  React.useImperativeHandle(ref, () => ({ fetchStats }));

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 3000);
    return () => clearInterval(interval);
  }, [token]);

  return (
    <ImpactBox aria-labelledby="impact-title" role="region">
      <ImpactTitle id="impact-title">Your Community Impact</ImpactTitle>
      <ImpactStats>
        <StatItem
          tabIndex="0"
          aria-label={`${stats.totalLikes} total likes received`}
        >
          <strong>{stats.totalLikes}</strong>
          Total Likes
        </StatItem>
        <StatItem
          tabIndex="0"
          aria-label={`${stats.recentComments} new comments today`}
        >
          <strong>{stats.recentComments}</strong>
          New Comments Today
        </StatItem>
        <StatItem tabIndex="0" aria-label={`${stats.totalPosts} posts created`}>
          <strong>{stats.totalPosts}</strong>
          Posts Created
        </StatItem>
      </ImpactStats>
    </ImpactBox>
  );
});

export default CommunityImpact;
