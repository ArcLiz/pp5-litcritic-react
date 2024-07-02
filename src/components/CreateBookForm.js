import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Image } from 'react-bootstrap';
import { WithContext as ReactTags } from 'react-tag-input';
import axios from 'axios';
import styles from '../styles/Forms.module.css';
import tagStyles from '../styles/Tags.module.css'
import defaultCover from '../assets/nocover.png'

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
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(defaultCover);
  const imageFile = useRef();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      const file = e.target.files[0];
      setFormData({ ...formData, cover_image: file });
      setImagePreview(URL.createObjectURL(file));
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
      <Modal.Header>
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
          <Form.Group controlId="author" className="mt-3">
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="cover_image" className="mt-3 text-center">
            {/* <Form.Label>Cover Image</Form.Label> */}
              <div className="mx-auto">
                {imagePreview && (
                  <Image className={styles.coverImagePreview} src={imagePreview} fluid />
                )}
              </div>
              <Form.Label htmlFor="cover_image" className={`${styles.greenBtn} btn my-auto`}>
                Change Image
              </Form.Label>
                <Form.File
                  name="cover_image"
                  onChange={handleFileChange}
                  ref={imageFile}
                  className="d-none"
                />
          </Form.Group>
          <Form.Group controlId="description" className="mt-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="series" className="mt-3">
            <Form.Label>Series</Form.Label>
            <Form.Control
              type="text"
              name="series"
              value={formData.series}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="series_number" className="mt-3">
            <Form.Label>Series Number</Form.Label>
            <Form.Control
              type="number"
              name="series_number"
              value={formData.series_number}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="genres" className="mt-3">
            <div className={`w-100 ${tagStyles.tagContainer}`}>
            <ReactTags
                tags={tags}
                handleDelete={handleDelete}
                handleAddition={handleAddition}
                handleDrag={handleDrag}
                handleTagClick={handleTagClick}
                classNames={{
                  tags: tagStyles['react-tags'], 
                  tagInput: tagStyles['react-tags__tag-input'],
                  tag: tagStyles['react-tags__selected-tag'],
                  remove: tagStyles['react-tags__remove'],
                  suggestions: tagStyles['react-tags__suggestions'],
                  activeSuggestion: tagStyles['react-tags__suggestions--active'],
                }}
                placeholder="Add genre(s)"
              />
              </div>
          </Form.Group>
          <Button className={`w-100 mt-3 ${styles.pinkBtn}`} type="submit">
            Create Book
          </Button>
        </Form>
        {errors?.non_field_errors?.map((error, index) => (
          <div key={index} className="text-danger mt-2">{error}</div>
        ))}
      </Modal.Body>
    </Modal>
  );
};

export default CreateBookModal;
