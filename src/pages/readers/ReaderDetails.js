import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Row, Col, Card, Button, Dropdown, Accordion } from "react-bootstrap";
import StarRating from "../../components/StarRating";
import CreateReviewForm from "../reviews/CreateReviewForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const ReaderDetails = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showEditProfileForm, setShowEditProfileForm] = useState(false);
  const [showEditReviewModal, setShowEditReviewModal] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const [currentReview, setCurrentReview] = useState(null);
  const currentUser = useCurrentUser();
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await axios.get(`/profiles/${id}/`);
        setProfile(profileResponse.data);

        const reviewsResponse = await axios.get(`/reviews/?owner=${id}`);
        setReviews(reviewsResponse.data.results);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile or reviews:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleShowEditReviewModal = (reviewId) => {
    setEditReviewId(reviewId);
    setShowEditReviewModal(true);
  };

  const handleCloseEditReviewModal = () => {
    setEditReviewId(null);
    setShowEditReviewModal(false);
  };

  const handleEditReview = (reviewId) => {
    setCurrentReview(reviews.find((review) => review.id === reviewId));
    handleShowEditReviewModal(reviewId);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this review?");
      if (confirmed) {
        await axios.delete(`/reviews/${reviewId}/`);

        const updatedReviews = reviews.filter((review) => review.id !== reviewId);
        setReviews(updatedReviews);
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleUpdateReview = async (formData) => {
    try {
      const response = await axios.put(`/reviews/${editReviewId}/`, formData);
      const updatedReview = response.data;
      const updatedReviews = reviews.map((review) =>
        review.id === updatedReview.id ? updatedReview : review
      );
      setReviews(updatedReviews);
      handleCloseEditReviewModal();
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const isCurrentUserProfile = currentUser?.pk === profile.id;

  if (loading) return <div>Loading...</div>;

  return (
    <Container className="profile-details">
      <Row className="mb-4">
        <Col md={8}>
          <Card>
            <Card.Body>
              <Card.Title>{profile.name}'s Profile</Card.Title>
              <Card.Text>{profile.content}</Card.Text>
              {isCurrentUserProfile && (
                <>
                  <Button onClick={() => setShowEditProfileForm(true)}>Edit Profile</Button>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Img variant="top" src={profile.image} alt={`${profile.owner}'s profile`} />
            <Card.Body className="d-flex flex-column">
              <Card.Title>@{profile.owner}</Card.Title>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p>Reviews: {profile.reviews_count}</p>
                </div>
                <div>
                  <p>Following: {profile.following_count}</p>
                </div>
                <div>
                  <p>Followers: {profile.followers_count}</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <h3 className="mb-4">Recent Reviews</h3>
          <Accordion>
            {reviews.map((review, index) => (
              <Card key={review.id}>
                <Accordion.Toggle as={Card.Header} eventKey={index.toString()}>
                  <Row className="align-items-center">
                    <Col sm={4}><StarRating rating={review.rating} /></Col>
                    <Col sm={5}>{review.book_detail.title}</Col>
                    <Col sm={3}><p class="text-muted small text-end mb-0">Reviewed on: <br />{new Date(review.created_at).toLocaleDateString()}</p></Col>
                  </Row>
                   
                  
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={index.toString()}>
                  <Card.Body>
                    <Row>
                    <Col sm={2}>
                        <img
                          src={review.book_detail.cover_image}
                          alt={`Cover for ${review.book_detail.title}`}
                          style={{ maxHeight: "150px", width: "auto" }}
                        />
                        
                      </Col>
                      <Col sm={8}>
                        <div ref={contentRef}>
                          <p>{review.comment}</p>
                          
                        </div>
                      </Col>
                      <Col sm={1} className="ms-auto">
                        {isCurrentUserProfile && (
                          <Dropdown className="mt-auto">
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="customDropDown">
                              <i class="fa-solid fa-gear"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleEditReview(review.id)}>Edit</Dropdown.Item>
                              <Dropdown.Item onClick={() => handleDeleteReview(review.id)}>Delete</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                      </Col>
                    </Row>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            ))}
          </Accordion>
          {reviews.length === 0 && <p>No reviews yet.</p>}
        </Col>
      </Row>

      <CreateReviewForm
        show={showEditReviewModal}
        handleClose={handleCloseEditReviewModal}
        handleSubmit={handleUpdateReview}
        initialReview={currentReview}
        bookId={currentReview?.book_detail?.id}
      />
    </Container>
  );
};

export default ReaderDetails;
