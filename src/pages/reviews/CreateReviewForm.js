import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import StarRatingInput from '../../components/StarRatingInput';
import styles from '../../styles/Forms.module.css'

const CreateReviewForm = ({ bookId, show, handleClose, initialReview }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (initialReview) {
      setRating(initialReview.rating);
      setComment(initialReview.comment);
    } else {
      setRating(0);
      setComment('');
    }
  }, [initialReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (initialReview) {
        await axios.put(`/reviews/${initialReview.id}/`, {
          rating,
          comment,
          book: bookId,
        });
      } else {
        await axios.post('/reviews/', {
          rating,
          comment,
          book: bookId,
        });
      }

      handleClose();
      window.location.reload();
    } catch (error) {
      console.error("Error saving review:", error);
    }
  };

  const handleStarRatingChange = (value) => {
    setRating(value);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Body>
        <h1>{initialReview ? 'Edit Review' : 'Create Review'}</h1>
        <p className="text-muted small">Let other users know exactly what you think about this book!</p>
        <hr />
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="reviewRating">
            <Form.Label>Rating</Form.Label>
            <StarRatingInput
              initialRating={rating}
              onSubmit={handleStarRatingChange}
              locked={false}
            />
          </Form.Group>
          <Form.Group controlId="reviewComment" className="mt-3">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </Form.Group>
          <Button className={`w-100 mt-3 ${styles.pinkBtn}`} type="submit">
            {initialReview ? 'Update' : 'Submit'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateReviewForm;
