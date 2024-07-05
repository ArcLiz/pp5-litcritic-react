import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import styles from "../../styles/BookList.module.css";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import Asset from "../../components/Asset"
import { axiosRes } from "../../api/axiosDefaults";

const BooksList = () => {
  const [books, setBooks] = useState({ results: [], next: null });
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axiosRes.get(`/books/?page=${page}`);
        if (page === 1) {
          setBooks({ results: response.data.results, next: response.data.next });
        } else {
          setBooks((prevBooks) => ({
            results: [...prevBooks.results, ...response.data.results],
            next: response.data.next
          }));
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };
    fetchBooks();
  }, [page]);

  const handleChange = (event) => {
    const searchTerm = event.target.value;
    setSearchTerm(searchTerm);
  };

  useEffect(() => {
    const fetchFilteredBooks = async () => {
      try {
        const response = await axiosRes.get(`/books/?search=${searchTerm}`);
        let sortedResults = response.data.results;

        sortedResults.sort((a, b) => {
          if (a.series && b.series) {
            if (a.series === b.series) {
              return a.series_number - b.series_number;
            }
            return a.series.localeCompare(b.series);
          } else {
            return a.title.localeCompare(b.title);
          }
        });

        setSearchResults(sortedResults);
      } catch (error) {
        console.error("Error fetching filtered books:", error);
      }
    };

    const timer = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        fetchFilteredBooks();
      } else {
        setSearchResults([]);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchMoreData = () => {
    if (books.next) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const resultsToShow = searchTerm ? searchResults : books.results;

  return (
    <Container className={styles.mainContainer}>
      <Row className="mb-4 justify-content-center">
        <Col sm={10} className="text-center">
          <h1>Book Library</h1>
          <hr />
          <p className="small text-muted">
            Your go-to place for honest and insightful book reviews.
          </p>
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
      <InfiniteScroll
        dataLength={resultsToShow.length}
        next={fetchMoreData}
        hasMore={!!books.next}
        loader={<Asset spinner />}
        style={{ overflow: 'hidden' }}
      >
        <Row>
          {resultsToShow.map((book) => (
            <Col key={book.id} xs={12} lg={6} className="mb-4">
              <div className={styles.bookItem}>
                <Link to={`/books/${book.id}`} className={styles.bookLink}>
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
                </Link>
              </div>
            </Col>
          ))}
        </Row>
      </InfiniteScroll>
    </Container>
  );
};

export default BooksList;