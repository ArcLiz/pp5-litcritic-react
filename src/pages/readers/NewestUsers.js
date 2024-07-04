import React from "react";
import { useProfileData, useSetProfileData } from "../../contexts/ProfileDataContext";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "../../components/Avatar";
import styles from "../../styles/FollowButton.module.css";
import Asset from "../../components/Asset";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const NewestUsers = () => {
  const { popularProfiles } = useProfileData();
  const { handleFollow, handleUnfollow } = useSetProfileData();
  const currentUser = useCurrentUser();

  const sortedProfiles = popularProfiles.results.sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  if (sortedProfiles.length === 0) return <Asset spinner />;

  return (
    <Card>
      <Card.Body>
        <Card.Title>Newest Users</Card.Title>
        <hr />
        {sortedProfiles.slice(0, 5).map((user) => (
          <Row key={user.id} className={`${styles.newUser} mb-2 align-items-center`}>
            <Col xs={2}>
              <Link to={`/readers/${user.id}`} className={`${styles.newUser} text-decoration-none mb-3`}>
                <Avatar src={user.image} height={40} />
              </Link>
            </Col>
            <Col xs={7}>
              <div>@{user.owner}</div>
              <small className="text-muted">Joined on: {new Date(user.created_at).toLocaleDateString()}</small>
            </Col>
            <Col xs={3} className="text-end">
              {currentUser && (
                user?.following_id ? (
                  <span
                    className={styles.followedUser}
                    onClick={() => handleUnfollow(user)}
                  >
                    <i className="fa-solid fa-heart-circle-check" />
                  </span>
                ) : (
                  <span
                    className={styles.unfollowedUser}
                    onClick={() => handleFollow(user)}
                  >
                    <i className="fa-solid fa-heart-circle-xmark" />
                  </span>
                )
              )}
            </Col>
          </Row>
        ))}
      </Card.Body>
    </Card>
  );
};

export default NewestUsers;
