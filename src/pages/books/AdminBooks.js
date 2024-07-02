import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Row, Col, Form, Container, Alert } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import styles from "../../styles/AdminBooks.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const currentUser = useCurrentUser();
  const history = useHistory();

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

  const isAdmin = currentUser?.is_admin;

  return (
    <Container className={styles.mainContainer}>
      {isAdmin ? (
        <>
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
                <th>Cover</th>
                <th>Title</th>
                <th>Author</th>
                <th>Description</th>
                <th>Reviews</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((book) => (
                <tr key={book.id}>
                  <td>{book.cover_image.includes('nocover_dhpojf') ? <>
                      <i className="fa-regular fa-circle-xmark" style={{color: "red", fontSize: "120%", padding: "0"}}></i>
                    </> : <>
                      <i className="fa-regular fa-circle-check" style={{color: "green", fontSize: "120%", padding: "0"}}></i>
                    </>}
                  </td>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>
                    <div className={styles.toolTip}>
                      {book.description.length > 40
                        ? `${book.description.substring(0, 40)}...`
                        : book.description}
                      <span className={styles.toolTiptext}>
                        {book.description}<br/><br />
                        {book.genres && book.genres.length > 0 ? (
                          <>
                            <strong>Genres:</strong> {book.genres.join(', ')}<br/>
                          </>
                        ) : (
                          <>
                          <em>No Genre Information</em> <br />
                          </>
                        )}
                        {book.series ? (
                          <>
                            <strong>Series:</strong> {book.series} #{book.series_number}<br/>
                          </>
                        ) : (
                          <>
                          <em>No Series Information</em> <br />
                          </>
                        )}
                      </span>
                    </div>
                  </td>
                  <td>{book.reviews_count}</td>
                  <td>
                    <span onClick={() => history.push(`/admin/books/edit/${book.id}`)} className={`${styles.editBtn} me-2`}>
                      <i className="fa-solid fa-pen-to-square"></i>
                    </span>
                    <span className={`${styles.deleteBtn} me-2`} onClick={() => handleDelete(book.id)}>
                      <i className="fa-solid fa-trash"></i>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      ) : (
        <Alert variant="danger" className="text-center">
          You sneaky sneak! You don't have permission to view this page.
        </Alert>
      )}
    </Container>
  );
};

export default AdminBooks;
