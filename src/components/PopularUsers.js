import React from "react";
import { useProfileData, useSetProfileData } from "../contexts/ProfileDataContext";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import styles from "../styles/PopularUsers.module.css";

const PopularUsers = () => {
  const { profileData } = useProfileData();
  const { handleFollow, handleUnfollow } = useSetProfileData();
  const { popularProfiles } = profileData;

  if (popularProfiles.results.length === 0) return <div>Loading...</div>;

  return (
    <Card className="custom-card">
      <Card.Body className="custom-card-body">
        <Card.Title className="custom-card-title">Popular Users</Card.Title>
        <hr />
        {popularProfiles.results.slice(0, 3).map((user) => (
          <Link key={user.id} to={`/readers/${user.id}`} className="text-decoration-none">
            <Row key={user.id} className={`${styles.profileRow} mb-3 align-items-center`}>
              <Col xs={1} className="text-right">
                <Avatar src={user.image} height={40} />
              </Col>
              <Col xs={3} className="align-items-center ps-4">
                <div>@{user.owner}</div>
              </Col>
              <Col xs={5} className="align-items-center">
                <div> {user.followers_count} follower, {user.reviews_count} reviews</div>
              </Col>
              <Col xs={2} className="text-end">
              {user.following_id ? 
                  <i className={`${styles.unfollowHeart} fas fa-heart`} onClick={(e) => { e.preventDefault(); handleUnfollow(user); }} /> :
                  <i className={`${styles.followHeart} far fa-heart`} onClick={(e) => { e.preventDefault(); handleFollow(user); }} />
                }
              </Col>
            </Row>
          </Link>
        ))}
      </Card.Body>
    </Card>
  );
};

export default PopularUsers;
