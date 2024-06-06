import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const EditProfileForm = ({ show, handleClose, profile }) => {
  const [name, setName] = useState(profile.name);
  const [content, setContent] = useState(profile.content);
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');

  const handleEditProfile = async () => {
    try {
      if (!name || !content) {
        setError('Please fill in all fields.');
        return;
      }

      const formData = new FormData();
      formData.append('name', name);
      formData.append('content', content);
      if (image) {
        formData.append('image', image);
      }

      await axios.put(`/profiles/${profile.id}/`, formData);
      handleClose();
    } catch (error) {
      console.error('Error editing profile:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profile</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="content">
            <Form.Label>Content</Form.Label>
            <Form.Control as="textarea" rows={3} value={content} onChange={(e) => setContent(e.target.value)} />
          </Form.Group>
          <Form.Group controlId="image">
            <Form.Label>Profile Image</Form.Label>
            <Form.Control type="file" onChange={(e) => setImage(e.target.files[0])} />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleEditProfile}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditProfileForm;
