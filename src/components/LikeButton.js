import React from "react";
import axios from "axios";
import styles from "../styles/LikeButton.module.css";

const LikeButton = ({ review, updateReview }) => {
  const handleLike = async (reviewId) => {
    try {
      const { data } = await axios.post("/likes/", { review: reviewId });

      updateReview({
        ...review,
        likes_count: review.likes_count + 1,
        like_id: data.id,
      });
    } catch (err) {
      console.error("Error liking review:", err);
    }
  };

  const handleUnlike = async (reviewId, likeId) => {
    try {
      if (!likeId) {
        console.error("No like_id available for unliking.");
        return;
      }

      await axios.delete(`/likes/${likeId}`);

      updateReview({
        ...review,
        likes_count: review.likes_count - 1,
        like_id: null,
      });
    } catch (err) {
      console.error("Error unliking review:", err.response);
    }
  };

  return (
    <span className="text-end">
      {review.like_id ? (
        <span
          className="text-success me-2"
          onClick={() => handleUnlike(review.id, review.like_id)}
        >
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
