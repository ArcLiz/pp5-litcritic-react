import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import styles from "../styles/PopularUsers.module.css"

const PopularUsers = () => {
  const [popularUsers, setPopularUsers] = useState([]);

  useEffect(() => {
    const fetchPopularUsers = async () => {
      try {
        const response = await axios.get("/profiles/?ordering=-followers_count");
        setPopularUsers(response.data.results.slice(0, 3));
      } catch (error) {
        console.error("Error fetching popular users:", error);
      }
    };

    fetchPopularUsers();
  }, []);

  if (popularUsers.length === 0) return <div>Loading...</div>;

  return (
    <Card>
      <Card.Body>
        <Card.Title>Popular Users</Card.Title>
        <hr />
        {popularUsers.map((user) => (
          <Link key={user.id} to={`/profiles/${user.id}`} className="text-decoration-none">
          <Row key={user.id} className={`${styles.profileRow} mb-3 align-items-center`}>
            <Col xs={2} className="text-right">
              <Avatar src={user.image} height={40} />
            </Col>
            <Col xs={10} className="align-items-center">
              <div>@{user.owner} ({user.followers_count} follower)</div>
            </Col>
            
          </Row>
          </Link>
        ))}
      </Card.Body>
    </Card>
  );
};

export default PopularUsers;
