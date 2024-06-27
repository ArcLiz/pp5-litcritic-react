import React, { useState } from 'react';

const StarRatingInput = ({ initialRating, onSubmit }) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  const handleHover = (value) => {
    setHoverRating(value);
  };

  const handleClick = (value) => {
    setRating(value);
    onSubmit(value);
  };

  return (
    <div>
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <i
            key={index}
            onMouseEnter={() => handleHover(starValue)}
            onMouseLeave={() => handleHover(0)}
            onClick={() => handleClick(starValue)}
            style={{
              color: starValue <= (hoverRating || rating) ? "#FFD700" : "#E4E4E4",
            }}
            className="fa fa-star"
            
          ></i>
        );
      })}
    </div>
  );
};

export default StarRatingInput;
