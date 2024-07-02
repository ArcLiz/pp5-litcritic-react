import React, { useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col, Accordion, Card, Dropdown } from "react-bootstrap";
import { useParams } from "react-router-dom";
import StarRating from "../../components/StarRating";
import Avatar from "../../components/Avatar";
import LikeButton from "../../components/LikeButton";
import CreateReviewForm from "../reviews/CreateReviewForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import styles from "../../styles/BookDetails.module.css";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchBookAndReviews = async () => {
      try {
        const [bookResponse, reviewsResponse] = await Promise.all([
          axios.get(`/books/${id}/`),
          axios.get(`/reviews/?book=${id}`),
        ]);

        setBook(bookResponse.data);
        setReviews(reviewsResponse.data.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching book or reviews:", error);
        setLoading(false);
      }
    };

    fetchBookAndReviews();
  }, [id]);

  const handleShowReviewModal = () => setShowReviewModal(true);
  const handleCloseReviewModal = () => {
    setEditReviewId(null);
    setShowReviewModal(false);
  };

  const handleEditReview = (reviewId) => {
    setEditReviewId(reviewId);
    handleShowReviewModal();
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

  const hasUserReviewedBook = reviews.some((review) => review.owner === currentUser?.username);
  const userReview = reviews.find((review) => review.owner === currentUser?.username);

  const updateReview = (updatedReview) => {
    const updatedReviews = reviews.map((review) =>
      review.id === updatedReview.id ? updatedReview : review
    );
    setReviews(updatedReviews);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      <Row className={`${styles.mainContainer} text-center justify-content-center`}>
        <Col md={10}>
          <h1>{book.title}</h1>
          <p>By {book.author}</p>
          <hr />
          {book.series && (
          <p className="mb-0 small">{book.series} #{book.series_number}</p>
        )}
        <div className="d-flex justify-content-center mb-0">
          {book.genres && book.genres.map((genre, index) => (
            <p key={index} className={`${styles.genreTag} mx-1 p-1`}>#{genre}</p>
          ))}
        </div>

        </Col>
      </Row>
      <Row className="my-4 justify-content-around d-flex">
        <Col md={2}>
          <img src={book.cover_image} alt={book.title} width={150} />
        </Col>
        <Col md={10}>
          <Card>
            <Card.Body>
              <h4>Description</h4>
              <p>{book.description}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className={styles.mainContainer}>
        <Col>
        {currentUser && (
            <div className={`${styles.reviewBtn} mt-2 d-flex justify-content-between`}>
              <h3 className="mb-4">Reviews</h3>
              {hasUserReviewedBook ? (
                <span onClick={handleShowReviewModal}>
                  <i className="fa-solid fa-feather"></i>
                  <i className="fa-solid fa-user-plus"></i>
                </span>
              ) : (
                <span onClick={handleShowReviewModal} className="text-muted small">
                  Add <i className="fa-solid fa-feather"></i>
                </span>
              )}
            </div>
          )}
          <Accordion>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <Card key={review.id}>
                  <Accordion.Toggle as={Card.Header} eventKey={index.toString()}>
                    <Row className="align-items-center">
                      <Col sm={4}>
                        <StarRating rating={review.rating} />
                      </Col>
                      <Col sm={5}>{review.owner}</Col>
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
                          <Avatar src={review.owner_avatar} height={60} />
                        </Col>
                        <Col sm={9}>
                          <p>{review.comment}</p>
                        </Col>
                        <Col sm={1} className="d-flex flex-column align-items-end mb-auto">
                          {currentUser?.username === review.owner && (
                            <Dropdown className="mt-auto">
                              <Dropdown.Toggle
                                variant="secondary"
                                id="dropdown-basic"
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
                        <Col sm={12} className="text-end">
                          <LikeButton review={review} updateReview={updateReview} />
                        </Col>
                      </Row>
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              ))
            ) : (
              <p>No reviews yet.</p>
            )}
          </Accordion>
        </Col>
      </Row>

      <CreateReviewForm
        bookId={book.id}
        show={showReviewModal}
        handleClose={handleCloseReviewModal}
        initialReview={userReview}
      />
    </Container>
  );
};

export default BookDetails;
