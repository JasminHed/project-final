import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUserStore } from "../store/UserStore.jsx";

const API_BASE_URL = "https://project-final-ualo.onrender.com";

const createCommunityPost = (postData, token) => {
  return fetch(`${API_BASE_URL}/community-posts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(postData),
  });
};

const ShareCommunity = ({ goal }) => {
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [confirming, setConfirming] = useState(false);

  const handleClick = () => {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    const token = localStorage.getItem("accessToken");

    const postData = {
      intention: goal.intention,
      specific: goal.specific,
      measurable: goal.measurable,
      achievable: goal.achievable,
      relevant: goal.relevant,
      timebound: goal.timebound,
      userName: user?.name,
    };

    createCommunityPost(postData, token)
      .then(() => navigate("/community"))
      .catch((error) => {
        console.error("Error posting to community:", error);
      });
  };

  return (
    <>
      <button onClick={handleClick}>
        {confirming ? "Click again to confirm share" : "Share to community"}
      </button>
      {confirming && (
        <div>
          <p>
            By sharing, your name, intention and goals will be public. Anyone in
            the community can see, like, and comment on your post.
          </p>
        </div>
      )}
    </>
  );
};

export default ShareCommunity;
