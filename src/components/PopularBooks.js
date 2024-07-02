import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "../styles/PopularBooks.module.css"

const PopularBooks = () => {
    const [popularBooks, setPopularBooks] = useState([]);

    useEffect(() => {
      const fetchPopularBooks = async () => {
        try {
          const response = await axios.get("/books/");
          const books = response.data.results || response.data;
  
          const sortedBooks = books.sort((a, b) => b.reviews_count - a.reviews_count);
          
          setPopularBooks(sortedBooks.slice(0, 3));
        } catch (error) {
          console.error("Error fetching popular books:", error);
        }
      };
  
      fetchPopularBooks();
    }, []);
  
    if (popularBooks.length === 0) return <div>Loading...</div>;

  return (
    <Card>
      <Card.Body>
        <Card.Title>Popular Books</Card.Title>
        <hr />
        {popularBooks.map((book) => (
            <Link to={`/books/${book.id}`} key={book.id} className={styles.bookLink}>
          <Row key={book.id} className={`${styles.bookRow} my-1`}>
            <Col xs={2} className="text-center">
              <img className={styles.coverImg} src={book.cover_image} alt={book.title} />
            </Col>
            <Col xs={10}>
              <div>
                <strong>{book.title}</strong> <em className="small">by {book.author}</em>
                <p className="small">{book.description.substring(0, 150)}
                {book.description.length > 150 ? "..." : ""}</p>
              </div>
            </Col>
          </Row>
          </Link>
        ))}
      </Card.Body>
    </Card>
  );
};

export default PopularBooks;
