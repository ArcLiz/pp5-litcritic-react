import React, { useEffect, useState } from "react";
import { axiosReq } from "../api/axiosDefaults";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "../styles/PopularBooks.module.css";
import Asset from "../components/Asset";

const PopularBooks = () => {
  const [popularBooks, setPopularBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularBooks = async () => {
      try {
        const response = await axiosReq.get("/books/");
        const books = response.data.results || response.data;

        const sortedBooks = books.sort((a, b) => b.reviews_count - a.reviews_count);

        setPopularBooks(sortedBooks.slice(0, 3));
      } catch (error) {
        console.error("Error fetching popular books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularBooks();
  }, []);

  return (
    <>
      <Card className="d-none d-sm-block">
        <Card.Body>
          <Card.Title>Popular Books</Card.Title>
          <hr />
          {loading ? (
            <Asset spinner />
          ) : (
            popularBooks.map((book) => (
              <Link to={`/books/${book.id}`} key={book.id} className={styles.bookLink}>
                <Row key={book.id} className={`${styles.bookRow} my-1`}>
                  <Col xs={2} className="text-center">
                    <img className={styles.coverImg} src={book.cover_image} alt={book.title} />
                  </Col>
                  <Col xs={10}>
                    <div>
                      <strong>{book.title}</strong> <em className="small">by {book.author}</em>
                      <p className="small">
                        {book.description.substring(0, 150)}
                        {book.description.length > 150 ? "..." : ""}
                      </p>
                    </div>
                  </Col>
                </Row>
              </Link>
            ))
          )}
        </Card.Body>
      </Card>
      <Card className="d-block d-md-none">
        <Card.Body>
          <Card.Title>Popular Books</Card.Title>
          <hr />
          {loading ? (
            <Asset spinner />
          ) : (
            popularBooks.map((book) => (
              <Link to={`/books/${book.id}`} key={book.id} className={styles.bookLink}>
                <Row key={book.id} className={`${styles.bookRow} my-1`}>
                  <Col xs={3} className="text-center">
                    <img className={styles.coverImg} src={book.cover_image} alt={book.title} />
                  </Col>
                  <Col xs={9}>
                    <div>
                      <p className="small m-0"><strong>{book.title}</strong></p>
                      <p className="small m-0"><em>{book.author}</em></p>
                      <p className="small m-0">
                        {book.description.substring(0, 50)}
                        {book.description.length > 50 ? "..." : ""}
                      </p>
                    </div>
                  </Col>
                </Row>
              </Link>
            ))
          )}
        </Card.Body>
      </Card>
    </>
  );
};

export default PopularBooks;