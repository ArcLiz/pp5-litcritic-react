import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button, Container, Row, Col, Card, Dropdown, Accordion } from "react-bootstrap";
import StarRating from "../../components/StarRating";
import CreateReviewForm from "../reviews/CreateReviewForm";
import EditProfileForm from "../../components/EditProfileForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import styles from "../../styles/ReaderDetails.module.css";
import Avatar from "../../components/Avatar"

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

        setReviews((prevReviews) => prevReviews.filter((review) => review.id !== reviewId));
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    }
  };

  const handleUpdateReview = async (formData) => {
    try {
      const response = await axios.put(`/reviews/${editReviewId}/`, formData);
      const updatedReview = response.data;

      setReviews((prevReviews) =>
        prevReviews.map((review) => (review.id === updatedReview.id ? updatedReview : review))
      );
      handleCloseEditReviewModal();
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  const handleLike = async (reviewId) => {
    try {
      const { data } = await axios.post("/likes/", { review: reviewId });

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId ? { ...review, likes_count: review.likes_count + 1, like_id: data.id } : review
        )
      );
    } catch (err) {
      console.error("Error liking review:", err);
    }
  };

  const handleUnlike = async (reviewId, likeId) => {
    try {
      await axios.delete(`/likes/${likeId}`);

      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId ? { ...review, likes_count: review.likes_count - 1, like_id: null } : review
        )
      );
    } catch (err) {
      console.error("Error unliking review:", err.response);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      <Row className="mb-4 justify-content-between flex-column-reverse flex-md-row">
        <Col md={3} className={styles.mainContainer}>
        <h3>Log book</h3>
        <hr />
          {/* <p>Place holder for recent activity</p> */}
          <p>Books may well be the only true magic. </p>
          <p>-Alice Hoffman</p>
        </Col>
        <Col md={8} className={`${styles.mainContainer}`}>
        <div className="d-flex justify-content-around">
          <div className="d-none d-sm-block">
            <Avatar src={profile.image} height={130} />
          </div>
          <div>
            <h1 className="text-center">{profile.owner}</h1>
            <div className="d-flex justify-content-around">
              <p className="px-2 py-0 my-0 text-muted small">Followers</p>
              <p className="px-2 py-0 my-0 text-muted small">Following</p>
              <p className="px-2 py-0 my-0 text-muted small">Reviews</p>
            </div>
            <div className="d-flex justify-content-around">
              <p className="px-2 py-0 my-0">{profile.followers_count}</p>
              <p className="px-2 py-0 my-0">{profile.following_count}</p>
              <p className="px-2 py-0 my-0">{profile.reviews_count}</p>
            </div>
          </div>
          <div>
          {currentUser?.pk === profile.id && (
            <>
            <span onClick={() => setShowEditProfileForm(true)}><i className="fa-solid fa-bars small"></i></span>
            </>
          )}
          </div>
        </div>

          <hr />

          <Card>
            <Card.Body>
              <Card.Text>{profile.content}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col className={styles.mainContainer}>
          <h3 className="mb-4">My Reviews</h3>
          <Accordion>
            {reviews.map((review, index) => (
              <Card key={review.id}>
                <Accordion.Toggle as={Card.Header} eventKey={index.toString()}>
                  <Row className="align-items-center">
                    <Col sm={4}><StarRating rating={review.rating} /></Col>
                    <Col sm={5}>{review.book_detail.title}</Col>
                    <Col sm={3}><p className="text-muted small text-end mb-0">Reviewed on: <br />{new Date(review.created_at).toLocaleDateString()}</p></Col>
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
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic" className="customDropDown">
                              <i className="fa-solid fa-gear"></i>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => handleEditReview(review.id)}>Edit</Dropdown.Item>
                              <Dropdown.Item onClick={() => handleDeleteReview(review.id)}>Delete</Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        )}
                      </Col>
                      <Col sm={12} className="text-end">
                        {review.like_id ? (
                          <span className="text-success me-2" onClick={() => handleUnlike(review.id, review.like_id)}><i className={`fas fa-heart ${styles.likedHeart}`} /></span>
                        ) : (
                          <span className="text-primary me-2" onClick={() => handleLike(review.id)}><i className={`far fa-heart ${styles.unlikedHeart}`} /></span>
                        )}
                        <span className="text-muted">{review.likes_count}</span>
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

      <EditProfileForm
        show={showEditProfileForm}
        handleClose={() => setShowEditProfileForm(false)}
        profile={profile}
        setProfile={setProfile}
      />
    </Container>
  );
};

export default ReaderDetails;
