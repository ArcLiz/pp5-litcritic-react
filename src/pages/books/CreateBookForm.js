import React, { useState, useRef } from 'react';
import { Modal, Button, Form, Image, Alert } from 'react-bootstrap';
import { WithContext as ReactTags } from 'react-tag-input';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';
import styles from '../../styles/Forms.module.css';
import tagStyles from '../../styles/Tags.module.css';
import defaultCover from '../../assets/nocover.png';
import { axiosReq } from '../../api/axiosDefaults';

const CreateBookModal = ({ show, handleClose }) => {
  const initialFormData = {
    title: '',
    author: '',
    cover_image: null,
    description: '',
    genres: [],
    series: '',
    series_number: '',
  };
  const [formData, setFormData] = useState(initialFormData);

  const [tags, setTags] = useState([]);
  const [errors, setErrors] = useState({});
  const [alerts, setAlerts ] = useState({});
  const [imagePreview, setImagePreview] = useState(defaultCover);
  const [isSeries, setIsSeries] = useState(false);
  const imageFile = useRef();
  const history = useHistory();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        setAlerts({ image: 'Please select a valid image file (JPEG, PNG, GIF, WEBP).' });
        setImagePreview(defaultCover);
        setFormData({ ...formData, cover_image: null });
        imageFile.current.value = '';
        return;
      }

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
    // console.log('The tag at index ' + index + ' was clicked');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAlerts = {};

    if (!formData.title) {
      newAlerts.title = "Title is required.";
    }
    if (!formData.author) {
      newAlerts.author = "Author is required.";
    }
    if (!formData.description) {
      newAlerts.description = "Description is required.";
    }

    if (Object.keys(newAlerts).length > 0) {
      setAlerts(newAlerts);
      return;
    }
  
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
  
      const response = await axiosReq.post('/books/create/', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setFormData(initialFormData);
        setTags([]);
        setImagePreview(defaultCover);
        setIsSeries(false);
        history.push(`/books/${response.data.id}`);
        handleClose();
      } else {
      }
  
    } catch (error) {
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
        <Form onSubmit={handleSubmit} noValidate>
        {alerts.title && <Alert variant="danger">{alerts.title}</Alert>}
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
          {alerts.author && <Alert variant="danger">{alerts.author}</Alert>}
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
            <div className="mx-auto">
              {imagePreview && (
                <Image className={styles.coverImagePreview} src={imagePreview} fluid />
              )}
            </div>
            <Form.Label htmlFor="cover_image" className={`${styles.greenBtn} btn mt-2 my-auto`}>
              Upload Image
            </Form.Label>
            <Form.File
              name="cover_image"
              onChange={handleFileChange}
              ref={imageFile}
              className="d-none"
            />
            {alerts.image && <Alert variant="danger">{alerts.image}</Alert>}
          </Form.Group>
          {alerts.description && <Alert variant="danger">{alerts.description}</Alert>}
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
          <Form.Group controlId="isSeries" className="mt-3">
            <Form.Label>Is this book a part of a series?</Form.Label>
            <Form.Check
              type="radio"
              label="Yes"
              name="isSeries"
              id="isSeriesYes"
              checked={isSeries}
              onChange={() => setIsSeries(true)}
            />
            <Form.Check
              type="radio"
              label="No"
              name="isSeries"
              id="isSeriesNo"
              checked={!isSeries}
              onChange={() => setIsSeries(false)}
            />
          </Form.Group>
          {isSeries && (
            <>
              <Form.Group controlId="series" className="mt-3">
                <Form.Label>Name of Series</Form.Label>
                <Form.Control
                  type="text"
                  name="series"
                  value={formData.series}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group controlId="series_number" className="mt-3">
                <Form.Label>The Books # in the Series</Form.Label>
                <Form.Control
                  type="number"
                  name="series_number"
                  value={formData.series_number}
                  onChange={handleInputChange}
                />
              </Form.Group>
            </>
          )}
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
            <p className="text-muted small ps-1">Add genre(s) by pressing Enter between each</p>
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
