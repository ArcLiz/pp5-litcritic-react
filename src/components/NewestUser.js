import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "react-bootstrap";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import styles from "../styles/NewestUser.module.css";

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

  return (
    <Card as={Link} to={`/readers/${newestUser.id}`} className={`${styles.newUser} text-decoration-none`}>
      <Card.Body>
        <Card.Text className="text-center">
        <i class="fa-solid fa-crown" style={{ color: 'gold'}}></i> Let's welcome our newest member, @{newestUser.owner}!
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

export default NewestUser;
