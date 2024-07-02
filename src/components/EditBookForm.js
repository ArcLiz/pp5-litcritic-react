import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { WithContext as ReactTags } from 'react-tag-input';
import axios from 'axios';
import styles from '../styles/Forms.module.css';
import { useCurrentUser } from '../contexts/CurrentUserContext';

const EditBookForm = () => {
  const { id } = useParams();
  const history = useHistory();
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
  const [loading, setLoading] = useState(true);
  const currentUser = useCurrentUser();

  useEffect(() => {
    const genresSuggestions = ['Fantasy', 'Science Fiction', 'Romance', 'Mystery', 'Thriller'];
    setSuggestions(genresSuggestions.map(genre => ({ id: genre, text: genre })));
  }, []);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const { data } = await axios.get(`/books/${id}/`);
        setFormData({
          title: data.title,
          author: data.author,
          description: data.description,
          genres: data.genres,
          series: data.series || '',
          series_number: data.series_number || '',
        });
        setTags(data.genres.map(genre => ({ id: genre, text: genre })));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    };

    fetchBook();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, cover_image: e.target.files[0] });
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
      formDataToSend.append('series', formData.series);
      formDataToSend.append('series_number', formData.series_number);

      formData.genres.forEach(genre => {
        formDataToSend.append('genres', genre);
      });

      if (formData.cover_image) {
        formDataToSend.append('cover_image', formData.cover_image);
      }

      console.log('Request data:', formDataToSend);

      const response = await axios.put(`/books/${id}/`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Book updated:', response.data);
      history.push(`/books/${id}`);
    } catch (error) {
      console.error('Error updating book:', error);
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  const isAdmin = currentUser?.is_admin;

  return (
    <Container>
      {isAdmin ? (
        <div className={`${styles.mainContainer}`}>
          <h1 className="mb-4 text-center">Edit Book</h1>
          {errors.non_field_errors && (
            <Alert variant="danger">{errors.non_field_errors}</Alert>
          )}
          <p className="text-muted small text-center">
            Edit the details of <strong>{formData.title}</strong> below.<br />
            Make sure that all details are accurate, including the book's cover image.
          </p>
          <hr />
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
              Save Changes
            </Button>
          </Form>
          <hr />
          <p className="text-center mb-0"><i className="fa-solid fa-book-open-reader"></i></p>
        </div>
      ) : (
        <Alert variant="danger" className="text-center">
          You don't have permission to view this page.
        </Alert>
      )}
    </Container>
  );
};

export default EditBookForm;
