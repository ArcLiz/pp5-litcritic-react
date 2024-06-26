import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

const NewestUser = () => {
  const [newestUser, setNewestUser] = useState(null);

  useEffect(() => {
    const fetchNewestUser = async () => {
      try {
        const response = await axios.get("/profiles/?ordering=-date_joined&limit=1");
        setNewestUser(response.data.results[0]);
      } catch (error) {
        console.error("Error fetching newest user:", error);
      }
    };

    fetchNewestUser();
  }, []);

  if (!newestUser) return <div>Loading...</div>;
  console.log(newestUser)

  const reviewMessage = newestUser.reviews_count > 0 
    ? `has already contributed with ${newestUser.reviews_count} reviews!` 
    : "unfortunately hasn't reviewed anything yet.";

  return (
    <Card>
      <Card.Body>
        <Card.Title>Welcome @{newestUser.owner}</Card.Title>
        <Card.Text>
          Our newest literary critic {reviewMessage}<br/>
          Let's all make sure they feel welcomed by giving them a follow!
        </Card.Text>
        <Button variant="success" as={Link} to={`/readers/${newestUser.id}`}>Visit Profile</Button>
      </Card.Body>
    </Card>
  );
};

export default NewestUser;
