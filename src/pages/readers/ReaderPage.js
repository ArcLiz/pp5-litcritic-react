import React, { useEffect, useState } from "react";
import { Col, Dropdown, Card, Accordion, Row, Container } from "react-bootstrap";
import { useParams } from "react-router";
import ReaderDetails from "./ReaderDetails";
import { useProfileData, useSetProfileData } from "../../contexts/ProfileDataContext";
import { axiosReq } from "../../api/axiosDefaults";
import Asset from "../../components/Asset";
import styles from "../../styles/ReaderPage.module.css";
import StarRating from "../../components/StarRating";
import LikeButton from "../../components/LikeButton";
import CreateReviewForm from "../reviews/CreateReviewForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import ActivityFeed from "../../components/ActivityFeed";
import NoCurrentUser from "../../components/NoCurrentUser";
import NotFound from "../../components/NotFound";

const ReaderPage = () => {
  const { id } = useParams();
  const [profileReviews, setProfileReviews] = useState({ results: [] });
  const [loading, setLoading] = useState(true);
  const [dataLoaded, setDataLoaded] = useState(false);
  const currentUser = useCurrentUser();
  const [showEditReviewModal, setShowEditReviewModal] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const [currentReview, setCurrentReview] = useState(null);
  const [error, setError] = useState(false);

  const { pageProfile } = useProfileData();
  const [profile] = pageProfile.results || [];
  const { setProfileData } = useSetProfileData();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [{ data: pageProfile }, { data: profileReviews }] = await Promise.all([
          axiosReq.get(`/profiles/${id}/`),
          axiosReq.get(`/reviews/?owner=${id}`),
        ]);
        setProfileData((prevState) => ({
          ...prevState,
          pageProfile: { results: [pageProfile] },
        }));
        setProfileReviews(profileReviews);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError(true);
        } else {
          console.error("Error fetching data:", err);
        }
      } finally {
        setLoading(false);
        setDataLoaded(true);
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
        await axiosReq.delete(`/reviews/${reviewId}/`);
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
      const response = await axiosReq.put(`/reviews/${editReviewId}/`, formData);
      const updatedReview = response.data;
      updateReview(updatedReview);
      handleCloseEditReviewModal();
    } catch (error) {
      console.error("Error updating review:", error);
    }
  };

  if (!dataLoaded) {
    return <Asset spinner />;
  }

  if (!currentUser) {
    return <NoCurrentUser />;
  }

  if (error || !profile) {
    return <NotFound />;
  }

  return (
    <Container>
      <Row className="d-flex flex-column-reverse gap-3 flex-lg-row">
        <Col>
          <ActivityFeed profile={profile} />
        </Col>
        <Col className={styles.mainContainer}>
          <ReaderDetails profile={profile} />
        </Col>
      </Row>

      <Row className="mt-4">
        <Col className={styles.mainContainer}>
          <h3 className="mb-4">My Reviews</h3>
          <Accordion>
            {profileReviews.results.map((review, index) => (
              <Card key={review.id}>
                <Accordion.Toggle as={Card.Header} eventKey={index.toString()}>
                  <Row className="align-items-center">
                    <Col sm={4} className="d-none d-md-block">
                      <StarRating rating={review.rating} />
                    </Col>
                    <Col sm={5} xs={5} md={5}>
                      <span className="d-flex align-items-center">
                        <p className="my-0 d-none d-md-block">{review.book_detail.title}</p>
                        <p className="text-muted small ms-2 my-0">(Click for details)</p>
                      </span>
                    </Col>
                    <Col sm={7} xs={7} md={3}>
                      <p className="text-muted small text-end mb-0">
                        Reviewed on: <br />
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </Col>
                  </Row>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={index.toString()}>
                  <Card.Body className="pe-0 pb-0">
                    <Row>
                      <Col xs={2} className="d-none d-md-block">
                        <img
                          src={review.book_detail.cover_image}
                          alt={`Cover for ${review.book_detail.title}`}
                          style={{ maxHeight: "150px", width: "auto" }}
                        />
                      </Col>
                      <Col xs={9}>
                        <p>{review.comment}</p>
                      </Col>
                      <Col xs={1} className="d-flex flex-column justify-content-end mb-auto">
                        {currentUser?.pk === profile.id && (
                          <Dropdown className="mt-auto ms-auto">
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
                    </Row>
                    <Row className="mt-3">
                      <Col xs={8} className="text-start d-block d-md-none">
                        <StarRating rating={review.rating} />
                      </Col>
                      <Col xs={4} md={12} className="text-end">
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