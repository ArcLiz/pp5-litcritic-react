import React from "react";

const StarRating = ({ rating }) => {
  const stars = [];


  for (let i = 0; i < 5; i++) {
    if (rating >= i + 1) {
      stars.push(<i key={i} className="fas fa-star" style={{color: "#FFD700", textShadow: "1px 1px 2px #000"}} />);
    } else {
      stars.push(<i key={i} className="far fa-star" style={{color: "#7D6D08", textShadow: "1px 1px 2px #000"}} />);
    }
  }

  return <>{stars}</>;
};

export default StarRating;
