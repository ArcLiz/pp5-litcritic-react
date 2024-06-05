import React, { useState } from 'react';
import { Form, Button, Modal } from 'react-bootstrap';
import axios from 'axios';
import StarRatingInput from '../../components/StarRatingInput';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import { useProfileData } from '../../contexts/ProfileDataContext';

const CreateReviewForm = ({ bookId, show, handleClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const currentUser = useCurrentUser();
  const { fetchProfileById } = useProfileData();

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/reviews/create/', {
        book: bookId,
        rating,
        comment,
      });
      // Uppdatera profildatan efter att ha skapat en recension
      if (currentUser) {
        await fetchProfileById(currentUser.profile_id);
      }
      handleClose();
    } catch (error) {
      console.error('Error creating review:', error);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Review</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="reviewRating">
            <Form.Label>Rating</Form.Label>
            <StarRatingInput
              initialRating={5} // Initialt betyg: 5 stjärnor
              onSubmit={(value) => setRating(value)}
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
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateReviewForm;
