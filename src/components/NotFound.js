import React from "react";
import NoResults from "../assets/no-results.png";
import Asset from "./Asset";

const NotFound = () => {
  return (
    <div className="d-flex justify-content-center">
      <Asset src={NoResults} message="Sorry, the page you're looking for does not exist."/>
    </div>
  );
};

export default NotFound;