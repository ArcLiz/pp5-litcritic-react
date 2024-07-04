import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Row, Col, Form, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import styles from "../../styles/AdminPages.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Asset from "../../components/Asset";

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [viewMode, setViewMode] = useState("large");
  const [loadingBooks, setLoadingBooks] = useState(false);
  const currentUser = useCurrentUser();
  const history = useHistory();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setViewMode("large");
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoadingBooks(true);
      try {
        const response = await axios.get("/books/");
        setBooks(response.data);
        setSearchResults(response.data);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoadingBooks(false);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    const results = books.filter(
      (book) =>
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

  const toggleViewMode = () => {
    setViewMode(viewMode === "large" ? "small" : "large");
  };

  return (
    <>
      {isAdmin ? (
        <>
          <Row className="d-block d-md-none">
            <Alert variant="warning" className="text-center">
              Admin panel is designed for larger screens. Please choose to view either the full "large" panel or a streamlined panel suitable for small screens.<br /><br />
              {viewMode === "large" ? (
                <Button onClick={toggleViewMode} variant="outline-success" className={`${styles.toggleBtn} ms-2`}>
                  Switch to Small View
                </Button>
              ) : (
                <Button onClick={toggleViewMode} variant="outline-danger" className={`${styles.toggleBtn} ms-2`}>
                  Switch to Large View
                </Button>
              )}
            </Alert>
          </Row>
          <Row className="mb-4 justify-content-center">
            <Col md={8}>
              <div className="text-center">
                <h2>Book Management</h2>
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
          {loadingBooks ? ( 
            <div className="text-center">
              <Asset spinner />
            </div>
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  {viewMode === "large" ? (
                    <>
                      <th>Cover</th>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Description</th>
                      <th>Reviews</th>
                      <th>Actions</th>
                    </>
                  ) : (
                    <>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Actions</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {searchResults.map((book) => (
                  <tr key={book.id}>
                    {viewMode === "large" ? (
                      <>
                        <td>
                          {book.cover_image.includes('nocover_dhpojf') ? (
                            <i className="fa-regular fa-circle-xmark" style={{color: "red", fontSize: "120%", padding: "0"}}></i>
                          ) : (
                            <i className="fa-regular fa-circle-check" style={{color: "green", fontSize: "120%", padding: "0"}}></i>
                          )}
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
                      </>
                    ) : (
                      <>
                        <td>{book.title}</td>
                        <td>{book.author}</td>
                        <td>
                          <span onClick={() => history.push(`/admin/books/edit/${book.id}`)} className={`${styles.editBtn} me-2`}>
                            <i className="fa-solid fa-pen-to-square"></i>
                          </span>
                          <span className={`${styles.deleteBtn} me-2`} onClick={() => handleDelete(book.id)}>
                            <i className="fa-solid fa-trash"></i>
                          </span>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </>
      ) : (
        <Alert variant="danger" className="text-center">
          You sneaky sneak! You don't have permission to view this page.
        </Alert>
      )}
    </>
  );
};

export default AdminBooks;