import React, { useState, useEffect } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import StarRatingInput from '../../components/StarRatingInput';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useProfileData } from '../../contexts/ProfileDataContext';

const CreateReviewForm = ({ bookId, show, handleClose, initialReview }) => {
  const [rating, setRating] = useState(initialReview ? initialReview.rating : 0);
  const [comment, setComment] = useState(initialReview ? initialReview.comment : '');
  const currentUser = useCurrentUser();
  const { fetchProfileById } = useProfileData();

  useEffect(() => {
    if (initialReview) {
      setRating(initialReview.rating);
      setComment(initialReview.comment);
    }
  }, [initialReview]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (initialReview) {
        // Update existing review
        await axios.post(`/reviews/create/`, {
          book: bookId,
          rating,
          comment,
        });
      } else {
        // Create new review
        await axios.post('/reviews/create/', {
          book: bookId,
          rating,
          comment,
        });
      }
      
      // Update profile data after creating or updating a review
      if (currentUser) {
        await fetchProfileById(currentUser.profile_id);
      }
      
      handleClose();
    } catch (error) {
      console.error('Error creating or updating review:', error);
    }
  };

  const handleStarRatingChange = (value) => {
    setRating(value);
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>{initialReview ? 'Edit Review' : 'Create Review'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="reviewRating">
            <Form.Label>Rating</Form.Label>
            <StarRatingInput
              initialRating={rating} // Uppdatera initialRating med aktuellt betyg
              onSubmit={handleStarRatingChange} // Uppdatera onSubmit för att hantera betygändringar
              locked={initialReview !== undefined}
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
          <Button variant="primary" type="submit" className="mt-3">
            {initialReview ? 'Update' : 'Submit'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateReviewForm;
