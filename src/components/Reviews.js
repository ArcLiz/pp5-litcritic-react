import React from 'react';
import {Card} from 'react-bootstrap';
import {Link} from 'react-router-dom';
import StarRating from './StarRating';
import styles from '../styles/Reviews.module.css';

const Reviews = ({review}) => {
  const {book} = review;

  return (
    <Card className={`mb-3 ${styles.reviewCard}`}>
      <Link to={`/reviews/${review.id}`} className={`text-decoration-none text-dark ${styles.reviewLink}`}>
        <div className="d-flex align-items-stretch">
          <div className={`me-3 ${styles.coverImageContainer}`}>
            {book && <img src={book.cover_image} alt={book.title} className={`img-fluid ${styles.coverImage}`} />}
          </div>
          <div className={`flex-grow-1 d-flex flex-column justify-content-between p-3 ${styles.reviewDetails}`}>
            <div>
              <Card.Title className="mb-2">{book ? book.title : 'Loading...'}</Card.Title>
              <div>
                <span className="text-secondary me-2">Rating:</span>
                <StarRating rating={review.rating} />
              </div>
              <Card.Text className="mt-3 mb-0">
                {review.comment.substring(0, 150)}
                {review.comment.length > 150 ? '...' : ''}
              </Card.Text>
            </div>
            <small className="text-muted d-block text-end">Reviewed on: {new Date(review.created_at).toLocaleDateString()}</small>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default Reviews;