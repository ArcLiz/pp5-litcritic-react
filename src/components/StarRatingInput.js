import React, { useState } from 'react';
import styles from '../styles/StarRatingInput.module.css';

const StarRatingInput = ({ initialRating, onSubmit }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleHover = (value) => {
    setHoverRating(value);
  };

  const handleClick = (value) => {
    setRating(value);
    onSubmit(value); // Här skickar vi med funktionen onSubmit istället för värdet av rating
  };

  return (
    <div className={styles.starRatingInput}>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <i
            key={index}
            onMouseEnter={() => handleHover(starValue)}
            onMouseLeave={() => handleHover(0)}
            onClick={() => handleClick(starValue)}
            className={`fa-star ${styles.star} ${starValue <= (hoverRating || rating) ? 'fas' : 'far'}`}
          ></i>
        );
      })}
    </div>
  );
};

export default StarRatingInput;
