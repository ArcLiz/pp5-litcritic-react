import React, {useState, useEffect} from "react";
import axios from "axios";
import {Container, Card, Button, Row, Col, Form} from "react-bootstrap";
import styles from "../../styles/ReaderList.module.css"
import { Link } from "react-router-dom/cjs/react-router-dom";

const ReaderList = () => {
  const [profiles, setProfiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get("/profiles/");
        setProfiles(response.data.results);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };
    fetchProfiles();
  }, []);

  useEffect(() => {
    const results = profiles.filter((profile) => profile.owner.toLowerCase().includes(searchTerm.toLowerCase()));
    setSearchResults(results);
  }, [searchTerm, profiles]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Container className={styles.mainContainer}>
      <Row className="justify-content-center">
      <Col sm={10} className="text-center">
            <h1>Lit Critics</h1>
            <hr />
            <p className="small text-muted">“There is no friend as loyal as a book.” - Ernest Hemingway</p>
        </Col>

      </Row>
      <Form className="d-flex justify-content-between mb-2">
        <Form.Control
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="mr-2"
        />
      </Form>
      <Row>
        {searchResults.map((profile) => (
          <Col key={profile.id} lg={3} md={4} sm={6} xs={12} className={styles.profileCard}>
            <Card className={styles.card}>
              <div className={styles.imageContainer}>
                <Card.Img variant="top" src={profile.image} className={styles.profileImage} />
              </div>
              <Card.Body>
              <Card.Title>{profile.name ? profile.name : '...'}</Card.Title>
                <Card.Text>@{profile.owner}</Card.Text>

                <Button as={Link} to={`/readers/${profile.id}`} variant="primary" className={styles.viewProfileBtn}>
                  View Profile
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ReaderList;