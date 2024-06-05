import React, {useEffect, useState} from "react";
import {useParams} from "react-router-dom";
import axios from "axios";
import {useCurrentUser} from "../../contexts/CurrentUserContext";
import Reviews from "../../components/Reviews";
import {Container, Row, Col, Card} from 'react-bootstrap';

const ReaderDetails = () => {
  const {id} = useParams();
  const [profile, setProfile] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/profiles/${id}/`);
        setProfile(response.data);

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
    fetchProfile();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  const isCurrentUserProfile = currentUser.pk === profile.id;

  return (
    <Container className="profile-details">
      <Row className="mb-4">
      <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>{profile.name}'s Profile</Card.Title>
              <Card.Text>{profile.content}</Card.Text>
              {isCurrentUserProfile && <p>Placeholder for later functions</p>}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Img variant="top" src={profile.image} alt={`${profile.owner}'s profile`} />
            <Card.Body>
              <Card.Title>@{profile.owner}</Card.Title>
              <p>Total reviews: {profile.reviews_count}</p>
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
