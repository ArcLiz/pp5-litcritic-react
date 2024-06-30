import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Form, Button, Container, Row, Col, Alert } from "react-bootstrap";
import { useRedirect } from "../../hooks/useRedirect";
import styles from "../../styles/SignUpForm.module.css"

const SignUpForm = () => {
  useRedirect('loggedIn');
  
  const [signUpData, setSignUpData] = useState({
    username: "",
    password1: "",
    password2: "",
  });

  const { username, password1, password2 } = signUpData;
  const [errors, setErrors] = useState({});
  const history = useHistory();

  const handleChange = (event) => {
    setSignUpData({
      ...signUpData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post("/dj-rest-auth/registration/", signUpData);
      history.push("/signin");
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-2">
        <Col xs={12} md={8} lg={6} className={styles.mainContainer}>
          <h1 className="mb-4 text-center">Join LitCrit</h1>
          <hr />
          <p className="text-muted small">Ready to share your thoughts and opinions on your favorite books?
            Join our community of passionate readers and start reviewing today!
            Signing up is your first step toward discovering new books, 
            connecting with fellow book lovers, and making your voice heard 
            in the world of literature. </p>
            <p className="text-muted small">Don’t wait – let’s dive into the world of books together!</p>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Control
                type="text"
                placeholder="Username"
                name="username"
                value={username}
                onChange={handleChange}
              />
              {errors.username && (
                <Alert variant="danger" className="mt-2">
                  {errors.username}
                </Alert>
              )}
            </Form.Group>

            <Form.Group controlId="password1" className="my-2">
              <Form.Control
                type="password"
                placeholder="Choose password"
                name="password1"
                value={password1}
                onChange={handleChange}
              />
              {errors.password1 && (
                <Alert variant="danger" className="mt-2">
                  {errors.password1}
                </Alert>
              )}
            </Form.Group>

            <Form.Group controlId="password2" className="my-2">
              <Form.Control
                type="password"
                placeholder="Confirm password"
                name="password2"
                value={password2}
                onChange={handleChange}
              />
              {errors.password2 && (
                <Alert variant="danger" className="mt-2">
                  {errors.password2}
                </Alert>
              )}
            </Form.Group>

            <Button variant="primary" type="submit" className={`${styles.regBtn} mt-3 w-100`}>
              Sign Up
            </Button>
            <p className="text-end small text-muted mt-1">Do you already have an account? <a href="/signin">Sign in</a> instead!</p>
            {errors.non_field_errors?.map((error, index) => (
              <Alert key={index} variant="danger" className="mt-2">
                {error}
              </Alert>
            ))}
          </Form>
          <hr />
          <p className="text-center mb-0"><i className="fa-solid fa-book-open-reader"></i></p>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpForm;
