import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import reviewImage from "../../assets/reviewImage.png"
import styles from "../../styles/BookDetails.module.css"
import StarRating from "../../components/StarRating";


const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState({});
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchBookAndReviews = async () => {
      try {
        const [bookResponse, reviewsResponse] = await Promise.all([
          axios.get(`/books/${id}/`),
          axios.get(`/books/${id}/reviews/`)
        ]);

        if (isMounted) {
          console.log("Book data:", bookResponse.data);
          setBook(bookResponse.data);
          console.log("Reviews data:", reviewsResponse.data);
          setReviews(reviewsResponse.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching book or reviews:", error);
        if (isMounted) setLoading(false);
      }
    };

    fetchBookAndReviews();

    return () => {
      isMounted = false;
    };
  }, [id]);


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
            </Card.Body>
          </Card>
        </Col>
        
      </Row>

      <Row>
      <div>
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <Card key={review.id} className="mb-3">
            <Link to={`/reviews/${review.id}`} className="text-decoration-none text-dark">
              <div className="d-flex align-items-stretch">
                <div className="ms-3 d-flex align-items-center justify-content-center">
                    <img src={reviewImage} alt={book.title} className={`img-fluid ${styles.reviewImage}`} />
                </div>
                <div className="flex-grow-1 d-flex flex-column justify-content-between p-3">
                  <div>
                    <h5 className="mb-2">{review.owner}'s review of {book ? book.title : 'Loading...'}</h5>
                    <div className="d-flex align-items-center">
                      <span className="text-secondary me-2">Rating:</span>
                      <StarRating rating={review.rating} />
                    </div>
                    <p className="mt-0 mb-0">
                      {review.comment.substring(0, 150)}
                      {review.comment.length > 150 ? '...' : ''}
                    </p>
                  </div>
                  <small className="text-muted text-end">Reviewed on: {new Date(review.created_at).toLocaleDateString()}</small>
                </div>
              </div>
            </Link>
          </Card>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
    </div>
    </Row>
    </Container>
  );
};

export default BookDetails;
