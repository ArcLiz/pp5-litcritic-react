import React from "react";
import { useProfileData } from "../../contexts/ProfileDataContext";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import styles from "../../styles/NewestUser.module.css";
import FollowButton from "../../components/FollowButton";
import Asset from "../../components/Asset"; // Import the Asset component

const NewestUser = () => {
  const { popularProfiles } = useProfileData();

  const sortedProfiles = popularProfiles.results.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  if (sortedProfiles.length === 0) return <Asset spinner />; // Use Asset component for loading indicator

  return (
    <Card className="custom-card">
      <Card.Body className="custom-card-body">
        <Card.Title className="custom-card-title">Newest Users</Card.Title>
        <hr />
        {sortedProfiles.slice(0, 5).map((user) => (
          <Row key={user.id} className={`${styles.newUser} mb-2 align-items-center`}>
            <Col xs={2} className="text-right">
              <Link to={`/readers/${user.id}`} className={`${styles.newUser} text-decoration-none mb-3`}>
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
