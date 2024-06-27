import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Accordion, Container, Row, Col, Card, Button, Dropdown } from 'react-bootstrap';
import StarRating from "../../components/StarRating";
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import CreateReviewForm from "../reviews/CreateReviewForm";
import Avatar from "../../components/Avatar";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false); 
  const [editReviewId, setEditReviewId] = useState(null); 
  const currentUser = useCurrentUser();

  useEffect(() => {
    let isMounted = true;

    const fetchBookAndReviews = async () => {
      try {
        const [bookResponse, reviewsResponse] = await Promise.all([
          axios.get(`/books/${id}/`),
          axios.get(`/reviews/?book=${id}`) 
        ]);

        if (isMounted) {
          setBook(bookResponse.data);
          setReviews(reviewsResponse.data.results); 
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching book or reviews:", error);
        setLoading(false);
      }
    };

    fetchBookAndReviews();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleShowReviewModal = () => setShowReviewModal(true);
  const handleCloseReviewModal = () => setShowReviewModal(false);

  const handleEditReview = (reviewId) => {
    setEditReviewId(reviewId); 
    handleShowReviewModal();
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      const confirmed = window.confirm("Are you sure you want to delete this review?");
      if (confirmed) {
        await axios.delete(`/reviews/${reviewId}/`);

        const updatedReviews = reviews.filter(review => review.id !== reviewId);
        setReviews(updatedReviews);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const hasUserReviewedBook = reviews.some(review => review.owner === currentUser?.username);
  const userReview = reviews.find(review => review.owner === currentUser?.username);

  if (loading) return <div>Loading...</div>;

  return (
    <Container className="book-details">
      <Row className="mb-4">
        <Col md={3}>
          <Card>
            <Card.Img variant="top" src={book.cover_image} alt={`${book.title} cover`} />
          </Card>
        </Col>
        <Col md={9}>
          <Card>
            <Card.Body>
              <Card.Title>{book.title}</Card.Title>
              <Card.Text className="ms-2">by {book.author}</Card.Text>
              <p>{book.description}</p>
              {currentUser && (
                <div>
                  {hasUserReviewedBook ? (
                    <Button variant="primary" onClick={handleShowReviewModal}>
                      Edit Review
                    </Button>
                  ) : (
                    <Button variant="primary" onClick={handleShowReviewModal}>
                      Add Review
                    </Button>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col>
          <h3 className="mb-4">Reviews</h3>
          <Accordion>
            {reviews.length > 0 ? (
              reviews.map((review, index) => (
                <Card key={review.id}>
                  <Accordion.Toggle as={Card.Header} eventKey={index.toString()}>
                    <Row className="align-items-center">
                      <Col sm={4}>
                        <StarRating rating={review.rating} />
                      </Col>
                      <Col sm={5}>
                        Review by {review.owner}
                      </Col>
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
                        <Col sm={1} className="d-flex flex-column align-items-end">
                          {currentUser?.username === review.owner && (
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
