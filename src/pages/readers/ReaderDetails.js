import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useProfileData, useSetProfileData } from "../../contexts/ProfileDataContext";
import axios from "axios";
import Reviews from "../../components/Reviews";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const ReaderDetails = () => {
  const { id } = useParams();
  const { fetchProfileById } = useProfileData();
  const { handleFollow, handleUnfollow } = useSetProfileData();
  const [profile, setProfile] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useCurrentUser(); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileData = await fetchProfileById(id);
        setProfile(profileData);

        const reviewsResponse = await axios.get(`/profiles/${id}/reviews/`);
        
        const reviewsWithBooks = await Promise.all(
          reviewsResponse.data.results.map(async (review) => {
            const bookResponse = await axios.get(`/books/${review.book}`);
            return {...review, book: bookResponse.data};
          })
        );
        setReviews(reviewsWithBooks);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile or reviews:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, [id, fetchProfileById]);

  const isCurrentUserProfile = currentUser?.pk === profile.id;

  const handleFollowProfile = async () => {
    try {
      await handleFollow(profile);
    } catch (error) {
      console.error("Error following profile:", error);
    }
  };

  const handleUnfollowProfile = async () => {
    try {
      await handleUnfollow(profile);
    } catch (error) {
      console.error("Error unfollowing profile:", error);
    }
  };

  const isFollowing = profile.following_id !== null;

  if (loading) return <div>Loading...</div>;

  return (
    <Container className="profile-details">
      {console.log("Is current profile:", profile)}
      {console.log("Is current user:", currentUser)}
      {console.log("Are they the same?", isCurrentUserProfile)}
      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>{profile.name}'s Profile</Card.Title>
              <Card.Text>{profile.content}</Card.Text>
              {/* Visa edit profile-knapp endast om profilen tillhör den inloggade användaren */}
              {isCurrentUserProfile && <Button>Placeholder edit</Button>}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Img variant="top" src={profile.image} alt={`${profile.owner}'s profile`} />
            <Card.Body>
              <Card.Title>@{profile.owner}</Card.Title>
              <p>Total reviews: {profile.reviews_count}</p>
              {/* Visa follow/unfollow-knapp beroende på om den inloggade användaren redan följer profilen */}
              {!isCurrentUserProfile && (isFollowing ? 
                <Button onClick={handleUnfollowProfile}>Unfollow</Button> :
                <Button onClick={handleFollowProfile}>Follow</Button>
              )}
              {!currentUser}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <h3 className="mb-4">Recent Reviews</h3>
          {reviews.length > 0 ? (
            reviews.map((review) => <Reviews key={review.id} review={review} />)
          ) : (
            <p>No reviews yet.</p>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ReaderDetails;
