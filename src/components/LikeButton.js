// src/components/LikeButton.js
import React from "react";
import axios from "axios";
import styles from "../styles/LikeButton.module.css";

const LikeButton = ({ review, setReviews }) => {

  const handleLike = async (reviewId) => {
    try {
      const { data } = await axios.post("/likes/", { review: reviewId });

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? { ...review, likes_count: review.likes_count + 1, like_id: data.id }
            : review
        )
      );
    } catch (err) {
      console.error("Error liking review:", err);
    }
  };

  const handleUnlike = async (reviewId, likeId) => {
    try {
      await axios.delete(`/likes/${likeId}`);

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? { ...review, likes_count: review.likes_count - 1, like_id: null }
            : review
        )
      );
    } catch (err) {
      console.error("Error unliking review:", err.response);
    }
  };

  return (
    <span className="text-end">
      {review.like_id ? (
        <span className="text-success me-2" onClick={() => handleUnlike(review.id, review.like_id)}>
          <i className={`fa-solid fa-thumbs-up ${styles.likedHeart}`} />
        </span>
      ) : (
        <span className="text-primary me-2" onClick={() => handleLike(review.id)}>
          <i className={`fa-regular fa-thumbs-up ${styles.unlikedHeart}`} />
        </span>
      )}
      <span className="text-muted">{review.likes_count}</span>
    </span>
  );
};

export default LikeButton;
