import React, { useState, useEffect } from "react";
import { axiosReq } from "../../api/axiosDefaults";
import { Table, Button, Row, Col, Form, Alert } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import styles from "../../styles/AdminPages.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import InfiniteScroll from "react-infinite-scroll-component";
import Asset from "../../components/Asset";

const AdminBooks = () => {
  const [books, setBooks] = useState({ results: [], next: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [viewMode, setViewMode] = useState("large");
  const [loadingBooks, setLoadingBooks] = useState(false);
  const currentUser = useCurrentUser();
  const history = useHistory();
  const [page, setPage] = useState(1);

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
        const response = await axiosReq.get(`/books/?page=${page}`);
        if (page === 1) {
          setBooks({ results: response.data.results, next: response.data.next });
        } else {
          setBooks((prevBooks) => ({
            results: [...prevBooks.results, ...response.data.results],
            next: response.data.next,
          }));
        }
        setSearchResults(response.data.results);
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoadingBooks(false);
      }
    };
    fetchBooks();
  }, [page]);

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      setPage(1);
    }, 200);

    return () => clearTimeout(delaySearch);
  }, [searchTerm]);

  useEffect(() => {
    const fetchFilteredBooks = async () => {
      setLoadingBooks(true);
      try {
        const response = await axiosReq.get(`/books/?search=${searchTerm}&page=${page}`);
        if (page === 1) {
          setBooks({ results: response.data.results, next: response.data.next });
        } else {
          setBooks((prevBooks) => ({
            results: [...prevBooks.results, ...response.data.results],
            next: response.data.next,
          }));
        }
        setSearchResults(response.data.results);
      } catch (error) {
        console.error("Error fetching filtered books:", error);
      } finally {
        setLoadingBooks(false);
      }
    };

    if (searchTerm.trim() !== "") {
      fetchFilteredBooks();
    }
  }, [searchTerm, page]);

  const handleChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
  };

  const handleDelete = async (bookId) => {
    const confirmed = window.confirm("Are you sure you want to delete this book?");
    if (confirmed) {
      try {
        await axiosReq.delete(`/books/${bookId}/`);
        setBooks((prevBooks) => ({
          results: prevBooks.results.filter((book) => book.id !== bookId),
          next: prevBooks.next,
        }));
        setSearchResults((prevResults) => prevResults.filter((book) => book.id !== bookId));
      } catch (error) {
        console.error("Error deleting book:", error);
      }
    }
  };

  const isAdmin = currentUser?.is_admin;

  const toggleViewMode = () => {
    setViewMode(viewMode === "large" ? "small" : "large");
  };

  const fetchMoreData = async () => {
    if (books.next) {
      try {
        const response = await axiosReq.get(books.next);
        setBooks((prevBooks) => ({
          results: [...prevBooks.results, ...response.data.results],
          next: response.data.next,
        }));
      } catch (error) {
        console.error("Error fetching more books:", error);
      }
    }
  };

  const resultsToShow = searchTerm ? searchResults : books.results;

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
              placeholder="Search.."
              value={searchTerm}
              onChange={handleChange}
            />
          </Form>
          {loadingBooks ? ( 
            <div className="text-center">
              <Asset spinner />
            </div>
          ) : (
            <InfiniteScroll
              dataLength={resultsToShow.length}
              next={fetchMoreData}
              hasMore={!!books.next}
              loader={<Asset spinner />}
              scrollThreshold={0.9}
              style={{ overflow: 'hidden' }}
            >
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
                  {resultsToShow.map((book) => (
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
            </InfiniteScroll>
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