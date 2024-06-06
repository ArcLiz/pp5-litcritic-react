import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const CreateBookForm = ({ show, handleClose }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  const handleCreateBook = async () => {
    try {
      if (!title || !author || !coverImage || !description) {
        setError('Please fill in all fields.');
        return;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('author', author);
      formData.append('cover_image', coverImage);
      formData.append('description', description);

      await axios.post('/books/create/', formData);
      handleClose();
    } catch (error) {
      console.error('Error adding book:', error);
      setError('An error occurred. Please try again later.');
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton >
        <Modal.Title>Add Book</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter title" />
          </Form.Group>
          <Form.Group controlId="author">
            <Form.Label>Author</Form.Label>
            <Form.Control type="text" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Enter author" />
          </Form.Group>
          <Form.Group controlId="coverImage">
            <Form.Label className="mt-2 me-4">Cover Image</Form.Label>
            <Form.Control type="file" onChange={(e) => setCoverImage(e.target.files[0])} />
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter description" />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} >
          Close
        </Button>
        <Button variant="primary" onClick={handleCreateBook} >
          Add Book
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateBookForm;
