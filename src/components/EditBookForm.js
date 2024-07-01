import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Container, Form, Button, Alert } from 'react-bootstrap';
import styles from "../styles/Forms.module.css";
import { useCurrentUser } from "../contexts/CurrentUserContext";

const EditBookForm = () => {
  const { id } = useParams();
  const history = useHistory();
  const [book, setBook] = useState({
    title: '',
    author: '',
    description: '',
    cover_image: null
  });
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState({});
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(`/books/${id}/`);
        setBook(response.data);
        setImage(response.data.cover_image);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching book:', error);
      }
    };

    fetchBook();
  }, [id]);

  // handleImageChange and subsequent form group is adapted from Thomas Wharton's FragTube project

  const handleImageChange = (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      setImage(URL.createObjectURL(file));
      handleChange(e);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setBook((prevBook) => ({
      ...prevBook,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', book.title);
    formData.append('author', book.author);
    formData.append('description', book.description);
    
    if (book.cover_image instanceof File) {
      formData.append('cover_image', book.cover_image);
    }
  
    try {
      const response = await axios.put(`/books/${id}/`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setBook(response.data);
      history.push('/admin/books');
    } catch (error) {
      console.error('Error updating book:', error);
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      }
    }
  }

  if (loading) return <div>Loading...</div>;

  const isAdmin = currentUser?.is_admin;

  return (
    <Container>
      {isAdmin ? (
        <>
      <Row className="justify-content-center mt-2">
        <Col xs={12} md={8} lg={6} className={`${styles.mainContainer}`}>
          <h1 className="mb-4 text-center">Edit Book</h1>
          {errors.non_field_errors && (
            <Alert variant="danger">{errors.non_field_errors}</Alert>
          )}
          <p className="text-muted small text-center">
            Edit the details of <strong>{book.title}</strong> below.<br />
            Make sure that all details are accurate, including the book's cover image.
          </p>
          <hr />
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formTitle">
              <Form.Label className="mt-2 ms-1 mb-0">Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={book.title}
                onChange={handleChange}
                required
              />
              {errors.title && (
                <Alert variant="danger">{errors.title}</Alert>
              )}
            </Form.Group>

            <Form.Group controlId="formAuthor">
              <Form.Label className="mt-2 ms-1 mb-0">Author</Form.Label>
              <Form.Control
                type="text"
                name="author"
                value={book.author}
                onChange={handleChange}
                required
              />
              {errors.author && (
                <Alert variant="danger">{errors.author}</Alert>
              )}
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label className="mt-2 ms-1 mb-0">Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={book.description}
                onChange={handleChange}
                required
                rows={7}
              />
              {errors.description && (
                <Alert variant="danger">{errors.description}</Alert>
              )}
            </Form.Group>

            <Form.Group>
              {image && (
                <figure className="text-center mb-3">
                  <img src={image} alt="Preview" height="150px" className={`${styles.coverImagePreview} mt-3`} />
                </figure>
              )}
              <div className="text-center">
                <Form.Label
                  className={`${styles.greenBtn} btn my-auto`}
                  htmlFor="cover_image"
                >
                  Change the image
                </Form.Label>
              </div>
              <Form.Control
                type="file"
                id="cover_image"
                name="cover_image"
                onChange={handleImageChange}
                className="d-none"
              />
              {errors.cover_image && (
                <Alert variant="danger">{errors.cover_image}</Alert>
              )}
            </Form.Group>

            <Button variant="primary" type="submit" className={`${styles.pinkBtn} mt-3 w-100`}>
              Save Changes
            </Button>
          </Form>
          <hr />
          <p className="text-center mb-0"><i className="fa-solid fa-book-open-reader"></i></p>
        </Col>
      </Row>
      </>
    ) : (
      <Alert variant="danger" className="text-center">
        You sneaky sneak! You don't have permission to view this page.
      </Alert>
    )}

    </Container>
  );
};

export default EditBookForm;
