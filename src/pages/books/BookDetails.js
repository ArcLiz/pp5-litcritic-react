import React, { useEffect, useState } from "react";
import { Container, Row, Col, Accordion, Card, Dropdown, Image } from "react-bootstrap";
import { useParams, useHistory } from "react-router-dom";
import StarRating from "../../components/StarRating";
import Avatar from "../../components/Avatar";
import LikeButton from "../../components/LikeButton";
import CreateReviewForm from "../reviews/CreateReviewForm";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import styles from "../../styles/BookDetails.module.css";
import PopularBooks from "../../components/PopularBooks";
import bgImage from "../../assets/book-details-bg.png";
import NoCurrentUser from "../../components/NoCurrentUser";
import { axiosReq, axiosRes } from "../../api/axiosDefaults";
import NotFound from "../../components/NotFound";
import Asset from "../../components/Asset";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editReviewId, setEditReviewId] = useState(null);
  const currentUser = useCurrentUser();
  const history = useHistory();
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBookAndReviews = async () => {
      try {
        const [bookResponse, reviewsResponse] = await Promise.all([
          axiosRes.get(`/books/${id}/`),
          axiosRes.get(`/reviews/?book=${id}`),
        ]);

        setBook(bookResponse.data);
        setReviews(reviewsResponse.data.results);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching book or reviews:", error);
        setLoading(false);
        setError(true);
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
        await axiosReq.delete(`/reviews/${reviewId}/`);

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

  if (loading) {
    return <Asset />;
  }

  if (error || !book ) {
    return <NotFound />;
  }

  return (
    <Container>
      {currentUser ? (
        <>
          <Row className="d-flex text-center justify-content-center">
            <Col lg={6} className="d-none d-lg-block text-start">
              <PopularBooks />
            </Col>
            <Col lg={6} className={`d-flex flex-column mb-3 justify-content-between ${styles.mainContainer}`}>
              <div>
                <h1>{book.title}</h1>
                <p>By {book.author}</p>
                <hr />
                {book.series && (
                  <p className="mb-0 small">{book.series} #{book.series_number}</p>
                )}
                <div className="d-flex justify-content-center">
                  {book.genres && book.genres.map((genre, index) => (
                    <p key={index} className={`${styles.genreTag} mx-1 p-1`}>#{genre}</p>
                  ))}
                </div>
              </div>
              <div className="w-100 d-flex justify-content-center">
                <img className={`mb-0 w-100 ${styles.backImg}`} src={bgImage} alt='stephen king quote' />
              </div>
              <div className="ms-auto">
              {currentUser.is_admin && 
                <span onClick={() => history.push(`/admin/books/edit/${id}`)} className={`${styles.editBtn}`}>
                  <i className="fa-solid fa-wrench text-end"></i>
                </span>}
              </div>
            </Col>
          </Row>

          <Row className={`${styles.plainContainer} d-flex flex-column flex-lg-row justify-content-center justify-content-lg-between my-3`}>
            <Col lg={2} md={12} className="text-center">
              <Image className={styles.coverImage} src={book.cover_image} />
              <hr className="d-block d-lg-none" />
            </Col>
            <Col lg={9} md={12} sm={12} className="me-3">
              <h4>Description</h4>
              <p>{book.description}</p>
            </Col>
          </Row>

          <Row className={styles.mainContainer}>
            <Col>
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
              <Accordion>
                {reviews.length > 0 ? (
                  reviews.map((review, index) => (
                    <Card key={review.id}>
                      <Accordion.Toggle as={Card.Header} eventKey={index.toString()}>
                        <Row className="align-items-center">
                          <Col md={4} className="d-none d-md-block">
                            <StarRating rating={review.rating} />
                          </Col>
                          <Col sm={5} xs={5} md={5}>
                          <span className="d-flex align-items-center">
                            <p className="my-0 d-none d-md-block">{review.owner}</p>
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
                          <Row >
                            <Col xs={2} className="d-none d-sm-block">
                              <Avatar src={review.owner_avatar} height={60} />
                            </Col>
                            <Col xs={9}>
                              <p>{review.comment}</p>
                            </Col>
                            <Col xs={1} className="d-flex flex-column justify-content-end mb-auto">
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
        </>
      ) : (
        <NoCurrentUser />
      )}
    </Container>
  );
};

export default BookDetails;