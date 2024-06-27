import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Row, Col, Form, Container } from "react-bootstrap";
import { Link } from "react-router-dom";
import styles from "../../styles/AdminBooks.module.css";

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

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
    const results = books.filter((book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(results);
  }, [searchTerm, books]);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleDelete = async (bookId) => {
    const confirmed = window.confirm("Are you sure you want to delete this book?");
    if (confirmed) {
      try {
        await axios.delete(`/books/${bookId}/`);
        setBooks(books.filter((book) => book.id !== bookId));
        setSearchResults(searchResults.filter((book) => book.id !== bookId));
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  return (
    <Container className={styles.mainContainer}>
      <Row className="mb-4 justify-content-center">
        <Col md={8}>
          <div className="text-center">
            <h1>Admin Book Management</h1>
            <Button as={Link} to="/books" variant="primary" className={`${styles.backBtn} mb-3`}>
              Back to Book List
            </Button>
            <hr />
            <p className="small text-muted">
              Manage your book library from this admin panel.
            </p>
          </div>
        </Col>
      </Row>
      <Form className="mb-3">
        <Form.Control
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={handleChange}
        />
      </Form>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Reviews</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {searchResults.map((book) => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.reviews_count}</td>
              <td>
            <Button as={Link} to={`/admin/books/edit/${book.id}`} className={`${styles.editBtn} me-2`}>
                  <i class="fa-solid fa-pen-to-square"></i>
                </Button>
                <Button className={`${styles.deleteBtn} me-2`} onClick={() => handleDelete(book.id)}>
                  <i class="fa-solid fa-trash"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default AdminBooks;
