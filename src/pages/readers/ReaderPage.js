import React, { useEffect, useState, useRef } from "react";
import { Col, Dropdown, Card, Accordion, Row, Container } from "react-bootstrap";
import { useParams } from "react-router";
import ReaderDetails from "./ReaderDetails";
import { useProfileData, useSetProfileData } from "../../contexts/ProfileDataContext";
import { axiosReq } from "../../api/axiosDefaults";
import Asset from "../../components/Asset";
import styles from "../../styles/ReaderPage.module.css"
import StarRating from "../../components/StarRating";
import LikeButton from "../../components/LikeButton";
import CreateReviewForm from "../reviews/CreateReviewForm"
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import axios from "axios";
import ActivityFeed from "../../components/ActivityFeed";


const ReaderPage = () => {
  const { id } = useParams();
  const [profileReviews, setProfileReviews] = useState({ results: [] });
  const [loading, setLoading] = useState(true);
  const currentUser = useCurrentUser();
  const [showEditReviewModal, setShowEditReviewModal] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const [currentReview, setCurrentReview] = useState(null);
  const contentRef = useRef(null);

  const { pageProfile } = useProfileData();
  const [profile] = pageProfile.results;
  const { setProfileData } = useSetProfileData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: pageProfile }, { data: profileReviews }] =
          await Promise.all([
            axiosReq.get(`/profiles/${id}/`),
            axiosReq.get(`/reviews/?owner=${id}`),
          ]);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] },
        }));
        setProfileReviews(profileReviews);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, setProfileData]);

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
    setEditReviewId(null);
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

  return (
    <Container>
      {loading ? (
        <Asset spinner />
      ) : (
        <>
        <Row>
          <Col sm={5}><ActivityFeed profile={profile}/></Col>
          <ReaderDetails profile={profile} />
          </Row>

          <Row className="mt-4">
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
        </>
      )}
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