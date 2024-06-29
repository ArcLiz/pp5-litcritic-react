import React from "react";
import { useProfileData } from "../contexts/ProfileDataContext";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import styles from "../styles/NewestUser.module.css";
import "../styles/CustomCardStyles.css";
import FollowButton from "./FollowButton";

const NewestUser = () => {
  const { profileData } = useProfileData();
  const { newestProfiles } = profileData;

  if (newestProfiles.results.length === 0) return <div>Loading...</div>;

  return (
    <Card className="custom-card">
      <Card.Body className="custom-card-body">
        <Card.Title className="custom-card-title">Newest Users</Card.Title>
        <hr />
        {newestProfiles.results.slice(0, 3).map((user) => (
          
            <Row className={`${styles.newUser} mb-2 align-items-center`}>
              <Col xs={2} className="text-right">
              <Link key={user.id} to={`/readers/${user.id}`} className={`${styles.newUser} text-decoration-none mb-3`}>
                <Avatar src={user.image} height={40} />
                </Link>
              </Col>
              <Col xs={6}>
                <div className="custom-card-text">@{user.owner}</div>
                <small className="text-muted">Joined on: {new Date(user.created_at).toLocaleDateString()}</small>
              </Col>
              <Col xs={4} className="text-end">
                <FollowButton profile={user} />
              </Col>
            </Row>
          
        ))}
      </Card.Body>
    </Card>
  );
};

export default NewestUser;
