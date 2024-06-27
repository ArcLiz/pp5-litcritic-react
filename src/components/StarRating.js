import React from "react";

const StarRating = ({ rating }) => {
  const stars = [];


  for (let i = 0; i < 5; i++) {
    if (rating >= i + 1) {
      stars.push(<i key={i} className="fa fa-star" style={{color: "#FFD700", fontSize: "110%"}} />);
    } else {
      stars.push(<i key={i} className="fa fa-star" style={{color: "#E4E4E4", fontSize: "110%"}} />);
    }
  }

  return <>{stars}</>;
};

export default StarRating;
