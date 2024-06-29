import React from "react";
import { useProfileData } from "../contexts/ProfileDataContext";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import styles from "../styles/PopularUsers.module.css";
import FollowButton from "./FollowButton";

const PopularUsers = () => {
  const { profileData } = useProfileData();
  const { popularProfiles } = profileData;

  if (popularProfiles.results.length === 0) return <div>Loading...</div>;

  return (
    <Card className="custom-card">
      <Card.Body className="custom-card-body">
        <Card.Title className="custom-card-title">Popular Users</Card.Title>
        <hr />
        {popularProfiles.results.slice(0, 3).map((user) => (
          
            <Row key={user.id} className={`${styles.profileRow} mb-3 align-items-center`}>
              <Col xs={1} className="text-right">
              <Link key={user.id} to={`/readers/${user.id}`} className="text-decoration-none">
                <Avatar src={user.image} height={40} />
                </Link>
              </Col>
              <Col xs={3} className="align-items-center ps-4">
                <div>@{user.owner}</div>
              </Col>
              <Col xs={5} className="align-items-center">
                <div> {user.followers_count} follower, {user.reviews_count} reviews</div>
              </Col>
              <Col xs={2} className="text-end">
                <FollowButton profile={user} />
              </Col>
            </Row>
          
        ))}
      </Card.Body>
    </Card>
  );
};

export default PopularUsers;
