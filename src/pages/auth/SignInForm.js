import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Form, Button, Alert, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useSetCurrentUser } from "../../contexts/CurrentUserContext";
import { useRedirect } from "../../hooks/useRedirect";
import { setTokenTimestamp } from "../../utils/utils";
import styles from "../../styles/Forms.module.css";

const SignInForm = () => {
  const setCurrentUser = useSetCurrentUser();
  useRedirect("loggedIn");

  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const { username, password } = signInData;
  const history = useHistory();

  const handleChange = (event) => {
    setSignInData({
      ...signInData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data } = await axios.post("/dj-rest-auth/login/", signInData);
      setCurrentUser(data.user);
      setTokenTimestamp(data);
      history.push("/");
    } catch (err) {
      setErrors(err.response?.data);
    }
  };

  return (
    <Container>
      <Row className="justify-content-center mt-2">
        <Col xs={12} md={8} lg={6} className={styles.mainContainer}>
          <h1 className="mb-4 text-center">Welcome back!</h1>
          <p className="text-muted small">
          "A word after a word after a word is power." – Margaret Atwood
          </p>
          <hr />
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Control
                type="text"
                name="username"
                value={username}
                onChange={handleChange}
                placeholder="Enter username"
              />
              {errors.username && (
                <Alert variant="danger" className="mt-2">
                  {errors.username.map((error, idx) => (
                    <div key={idx}>{error}</div>
                  ))}
                </Alert>
              )}
            </Form.Group>

            <Form.Group controlId="password" className="my-2">
              <Form.Control
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Enter password"
              />
              {errors.password && (
                <Alert variant="danger" className="mt-2">
                  {errors.password.map((error, idx) => (
                    <div key={idx}>{error}</div>
                  ))}
                </Alert>
              )}
            </Form.Group>

            <Button variant="primary" type="submit" className={`${styles.pinkBtn} mt-3 w-100`}>
              Sign In
            </Button>

            {errors.non_field_errors && (
              <Alert variant="danger" className="mt-3">
                {errors.non_field_errors.map((error, idx) => (
                  <div key={idx}>{error}</div>
                ))}
              </Alert>
            )}

            <p className="text-end small text-muted mt-1">
              Don't have an account? <a href="/signup">Sign Up</a>
            </p>
          </Form>
          <hr />
          <p className="text-center mb-0"><i className="fa-solid fa-book-open-reader"></i></p>
        </Col>
      </Row>
    </Container>
  );
};

export default SignInForm;
