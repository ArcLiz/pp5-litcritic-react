import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Container, Row, Col, Accordion, Card, Dropdown, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import StarRating from "../../components/StarRating";
import LikeButton from "../../components/LikeButton";
import CreateReviewForm from "../reviews/CreateReviewForm";
import ReaderDetails from "./ReaderDetails";
import styles from "../../styles/ReaderPage.module.css";

const ReaderPage = () => {
  const { id } = useParams();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [profileReviews, setProfileReviews] = useState({ results: [] });
  const [showEditReviewModal, setShowEditReviewModal] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const [currentReview, setCurrentReview] = useState(null);
  const contentRef = useRef(null);

  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileResponse = await axios.get(`/profiles/${id}/`);
        const reviewsResponse = await axios.get(`/reviews/?owner=${id}`);

        setProfile(profileResponse.data);
        setProfileReviews(reviewsResponse.data);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile or reviews:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const updateReview = (updatedReview) => {
    setProfileReviews((prevReviews) => ({
      results: prevReviews.results.map((review) =>
        review.id === updatedReview.id ? updatedReview : review
      ),
    }));
  };

  const handleShowEditReviewModal = (reviewId) => {
    const reviewToEdit = profileReviews.results.find((review) => review.id === reviewId);
    setCurrentReview(reviewToEdit);
    setEditReviewId(reviewId);
    setShowEditReviewModal(true);
  };

  const handleCloseEditReviewModal = () => {
    setShowEditReviewModal(false);
    setCurrentReview(null);
    setEditReviewId(null); // Reset editReviewId when closing modal
  };

  const handleEditReview = (reviewId) => {
    handleShowEditReviewModal(reviewId);
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this review?");
      if (confirmed) {
        await axios.delete(`/reviews/${reviewId}/`);

        setProfileReviews((prevReviews) => ({
          results: prevReviews.results.filter((review) => review.id !== reviewId),
        }));
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleUpdateReview = async (formData) => {
    try {
      const response = await axios.put(`/reviews/${editReviewId}/`, formData);
      const updatedReview = response.data;

      updateReview(updatedReview);
      handleCloseEditReviewModal();
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      <Row className="mb-4 justify-content-between flex-column-reverse flex-md-row">
        <Col md={3}>
          <h3>Log book</h3>
          <hr />
          <p>Books may well be the only true magic. </p>
          <p>-Alice Hoffman</p>
        </Col>
        <ReaderDetails profile={profile} currentUser={currentUser} />
      </Row>
      <Row>
        <Col className={styles.mainContainer}>
          <h3 className="mb-4">My Reviews</h3>
          <Accordion>
            {profileReviews.results.map((review, index) => (
              <Card key={review.id}>
                <Accordion.Toggle as={Card.Header} eventKey={index.toString()}>
                  <Row className="align-items-center">
                    <Col sm={4}>
                      <StarRating rating={review.rating} />
                    </Col>
                    <Col sm={5}>{review.book_detail.title}</Col>
                    <Col sm={3}>
                      <p className="text-muted small text-end mb-0">
                        Reviewed on: <br />
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </Col>
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
                        {currentUser?.pk === profile.id && (
                          <Dropdown className="mt-auto">
                            <Dropdown.Toggle
                              variant="secondary"
                              id={`dropdown-${review.id}`}
                              className="customDropDown"
                            >
                              <i className="fa-solid fa-gear"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleEditReview(review.id)}>
                                Edit
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handleDeleteReview(review.id)}>
                                Delete
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                      </Col>
                      <Col sm={12} className="text-end">
                        <LikeButton review={review} updateReview={updateReview} />
                      </Col>
                    </Row>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            ))}
          </Accordion>
          {profileReviews.results.length === 0 && <p>No reviews yet.</p>}
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

export default ReaderPage;
