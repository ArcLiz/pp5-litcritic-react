import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Card, Button, Row, Col, Form } from "react-bootstrap";
import styles from "../../styles/ReaderList.module.css";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Asset from "../../components/Asset";

const ReaderList = () => {
  const [profiles, setProfiles] = useState({ results: [], next: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get(`/profiles/?page=${page}`);
        if (page === 1) {
          setProfiles({ results: response.data.results, next: response.data.next });
        } else {
          setProfiles((prevProfiles) => ({
            results: [...prevProfiles.results, ...response.data.results],
            next: response.data.next,
          }));
        }
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };
    fetchProfiles();
  }, [page]);

  const handleSearchChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
  };

  useEffect(() => {
    const fetchFilteredProfiles = async () => {
      try {
        const response = await axios.get(`/profiles/?search=${searchTerm}`);
        setSearchResults(response.data.results);
      } catch (error) {
        console.error("Error fetching filtered profiles:", error);
      }
    };

    const timer = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        fetchFilteredProfiles();
      } else {
        setSearchResults([]);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchMoreData = () => {
    if (profiles.next) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const resultsToShow = searchTerm ? searchResults : profiles.results;

  return (
    <Container className={styles.mainContainer}>
      <Row className="justify-content-center">
        <Col sm={10} className="text-center">
          <h1>Lit Critics</h1>
          <hr />
          <p className="small text-muted">
            “There is no friend as loyal as a book.” - Ernest Hemingway
          </p>
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
      <InfiniteScroll
        dataLength={resultsToShow.length}
        next={fetchMoreData}
        hasMore={!!profiles.next}
        loader={<Asset spinner />}
        style={{ overflow: 'hidden' }}
      >
        <Row>
          {resultsToShow.map((profile) => (
            <Col key={profile.id} lg={3} md={4} sm={6} xs={12} className={styles.profileCard}>
              <Card className={styles.card}>
                <div className={styles.imageContainer}>
                  <Card.Img variant="top" src={profile.image} className={styles.profileImage} />
                </div>
                <Card.Body>
                  <Card.Title>{profile.name ? profile.name : "..."}</Card.Title>
                  <Card.Text>@{profile.owner}</Card.Text>
                  <Button
                    as={Link}
                    to={`/readers/${profile.id}`}
                    className={styles.viewProfileBtn}
                  >
                    View Profile
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </InfiniteScroll>
    </Container>
  );
};

export default ReaderList;