import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { WithContext as ReactTags } from 'react-tag-input';
import axios from 'axios';

const CreateBookModal = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    cover_image: null,
    description: '',
    genres: [],
    series: '',
    series_number: '',
  });

  const [tags, setTags] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const genresSuggestions = ['Fantasy', 'Science Fiction', 'Romance', 'Mystery', 'Thriller'];
    setSuggestions(genresSuggestions.map(genre => ({ id: genre, text: genre })));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFormData({ ...formData, cover_image: e.target.files[0] });
    }
  };

  const handleDelete = i => {
    const updatedTags = tags.filter((tag, index) => index !== i);
    setTags(updatedTags);
    setFormData({ ...formData, genres: updatedTags.map(tag => tag.text) });
  };

  const handleAddition = tag => {
    const updatedTags = [...tags, tag];
    setTags(updatedTags);
    setFormData({ ...formData, genres: updatedTags.map(tag => tag.text) });
  };

  const handleDrag = (tag, currPos, newPos) => {
    const newTags = tags.slice();
    newTags.splice(currPos, 1);
    newTags.splice(newPos, 0, tag);
    setTags(newTags);
    setFormData({ ...formData, genres: newTags.map(tag => tag.text) });
  };

  const handleTagClick = (index) => {
    console.log('The tag at index ' + index + ' was clicked');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('description', formData.description);

      if (formData.series) {
        formDataToSend.append('series', formData.series);
      }
      if (formData.series_number) {
        formDataToSend.append('series_number', formData.series_number);
      }

      formData.genres.forEach(genre => {
        formDataToSend.append('genres', genre);
      });

      if (formData.cover_image) {
        formDataToSend.append('cover_image', formData.cover_image);
      } else {
        formDataToSend.append('cover_image', '');
      }

      console.log('Request data:', formDataToSend);

      const response = await axios.post('/books/create/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Book created:', response.data);
      handleClose();
    } catch (error) {
      console.error('Error creating book:', error);
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create a New Book</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="author">
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="cover_image">
            <Form.Label>Cover Image</Form.Label>
            <Form.File
              name="cover_image"
              onChange={handleFileChange}
            />
          </Form.Group>
          <Form.Group controlId="description">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="series">
            <Form.Label>Series</Form.Label>
            <Form.Control
              type="text"
              name="series"
              value={formData.series}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="series_number">
            <Form.Label>Series Number</Form.Label>
            <Form.Control
              type="number"
              name="series_number"
              value={formData.series_number}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="genres">
            <Form.Label>Genres</Form.Label>
            <ReactTags
              tags={tags}
              suggestions={suggestions}
              handleDelete={handleDelete}
              handleAddition={handleAddition}
              handleDrag={handleDrag}
              handleTagClick={handleTagClick}
              placeholder="Add genre(s)"
            />
            <div>
              {formData.genres.map((genre, index) => (
                <span key={index}>{genre}</span>
              ))}
            </div>
          </Form.Group>
          <Button variant="primary" type="submit">
            Create Book
          </Button>
        </Form>
        {errors?.non_field_errors?.map((error, index) => (
          <div key={index} className="text-danger mt-2">{error}</div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateBookModal;
