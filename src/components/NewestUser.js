import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Col, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import Avatar from "./Avatar";
import { useSetProfileData } from "../contexts/ProfileDataContext";
import { useCurrentUser } from "../contexts/CurrentUserContext";
import styles from "../styles/NewestUser.module.css";

const NewestUser = () => {
  const [newestUsers, setNewestUsers] = useState([]);
  const { handleFollow, handleUnfollow } = useSetProfileData();
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchNewestUsers = async () => {
      try {
        const response = await axios.get("/profiles/?ordering=-date_joined");
        const newestUsersData = response.data.results.slice(0, 3);
        setNewestUsers(newestUsersData);
      } catch (error) {
        console.error("Error fetching newest users:", error);
      }
    };

    fetchNewestUsers();
  }, []);

  const handleFollowProfile = async (user) => {
    try {
      await handleFollow(user);
      // Update the followed user status in the state
      setNewestUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? { ...u, following_id: true } : u))
      );
    } catch (error) {
      console.error("Error following profile:", error);
    }
  };

  const handleUnfollowProfile = async (user) => {
    try {
      await handleUnfollow(user);
      // Update the unfollowed user status in the state
      setNewestUsers((prevUsers) =>
        prevUsers.map((u) => (u.id === user.id ? { ...u, following_id: null } : u))
      );
    } catch (error) {
      console.error("Error unfollowing profile:", error);
    }
  };

  if (newestUsers.length === 0) return <div>Loading...</div>;

  return (
    <Card>
      <Card.Body>
        <Card.Title>Newest Users</Card.Title>
        <hr />
        {newestUsers.map((user) => (
          <Link key={user.id} to={`/readers/${user.id}`} className={`${styles.newUser} text-decoration-none mb-3`}>
            <Row className="mb-2 align-items-center">
              <Col xs={2} className="text-right">
                <Avatar src={user.image} height={40} />
              </Col>
              <Col xs={6}>
                <div>@{user.owner}</div>
                <small className="text-muted">Joined on: {new Date(user.created_at).toLocaleDateString()}</small>
              </Col>
              <Col xs={4} className="text-end">
                {user.following_id ? (
                  <i
                    className={`fas fa-heart ${styles.unfollowHeart}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleUnfollowProfile(user);
                    }}
                  />
                ) : (
                  <i
                    className={`far fa-heart ${styles.followHeart}`}
                    onClick={(e) => {
                      e.preventDefault();
                      handleFollowProfile(user);
                    }}
                  />
                )}
              </Col>
            </Row>
          </Link>
        ))}
      </Card.Body>
    </Card>
  );
};

export default NewestUser;
