import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Row, Col, Form, Container } from "react-bootstrap";
import styles from "../../styles/BookList.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext"
import { Link } from "react-router-dom/cjs/react-router-dom";

const BooksList = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const currentUser = useCurrentUser();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get("/books/");
        setBooks(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, []);


  useEffect(() => {
    const results = books.filter((book) => {
      const title = book.title ? book.title.toLowerCase() : '';
      const author = book.author ? book.author.toLowerCase() : '';
      const series = book.series ? book.series.toLowerCase() : '';
      const genres = book.genres ? book.genres.map(genre => genre.toLowerCase()) : [];

      return (
        title.includes(searchTerm.toLowerCase()) ||
        author.includes(searchTerm.toLowerCase()) ||
        series.includes(searchTerm.toLowerCase()) ||
        genres.some(genre => genre.includes(searchTerm.toLowerCase()))
      );
    });
    setSearchResults(results);
  }, [searchTerm, books]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Container className={styles.mainContainer}>     
      <Row className="mb-4 justify-content-center">
        <Col sm={10} className="text-center">
            <h1>Book Library</h1>
            <hr />
            <p className="small text-muted">Your go-to place for honest and insightful book reviews.</p>
            {currentUser && currentUser.is_admin && (
            <Button as={Link} to="/admin/books" className={`${styles.panelBtn} p-0`}>
              <i className="fa-solid fa-user-tie p-0"></i>
            </Button>
          )}
        </Col>

      </Row>
      <Form className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleChange}
        />
      </Form>
      <Row>
        {searchResults.map((book) => (
          <Col key={book.id} xs={12} lg={6} className="mb-4">
            <div className={styles.bookItem}>
              <a href={`/books/${book.id}`} className={styles.bookLink}>
                <div className={styles.bookImageContainer}>
                  <img
                    src={book.cover_image}
                    alt={book.title}
                    className={styles.bookImage}
                  />
                </div>
                <div className={styles.bookDetails}>
                  <h5>{book.title}</h5>
                  <p>
                    <strong>By:</strong> {book.author}
                  </p>
                  <p className={styles.bookComment}>
                    {book.description.substring(0, 150)}
                    {book.description.length > 150 ? "..." : ""}
                  </p>
                </div>
              </a>
            </div>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default BooksList;
