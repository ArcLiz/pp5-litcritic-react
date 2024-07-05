import React, { useState, useEffect } from "react";
import { Table, Button, Row, Col, Container, Alert } from "react-bootstrap";
import styles from "../../styles/AdminPages.module.css";
import { useCurrentUser } from "../../contexts/CurrentUserContext";
import Asset from "../../components/Asset";
import { axiosRes, axiosReq } from "../../api/axiosDefaults";

const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [viewMode, setViewMode] = useState("large");
    const [loadingReviews, setLoadingReviews] = useState(true);
    const currentUser = useCurrentUser();

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
        const fetchReviews = async () => {
            try {
                const response = await axiosRes.get("/reviews/");
                setReviews(response.data.results);
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoadingReviews(false);
            }
        };
        fetchReviews();
    }, []);

    const handleDelete = async (reviewId) => {
        const confirmed = window.confirm("Are you sure you want to delete this review?");
        if (confirmed) {
            try {
                await axiosReq.delete(`/reviews/${reviewId}/`);
                setReviews(reviews.filter((review) => review.id !== reviewId));
                setSearchResults(searchResults.filter((review) => review.id !== reviewId));
            } catch (error) {
                console.error("Error deleting review:", error);
            }
        }
    };

    const isAdmin = currentUser?.is_admin;

    const toggleViewMode = () => {
        setViewMode(viewMode === "large" ? "small" : "large");
    };

    return (
        <Container>
            {loadingReviews ? (
                <Row className="my-4 justify-content-center">
                    <Col md={8}>
                        <div className="text-center">
                            <h2>Review Management</h2>
                            <p className="small text-muted">
                                Manage all site reviews. Make sure to <em>not</em> remove anything unnecessarily.
                            </p>
                            <Asset spinner />
                        </div>
                    </Col>
                </Row>
            ) : (
                <>
                    {isAdmin ? (
                        <>
                            <Row className="d-block d-md-none">
                                <Alert variant="warning" className="text-center">
                                    Admin panel is designed for larger screens. Please choose to view either the full "large" panel or a streamlined panel suitable for small screens.<br /><br />
                                    {viewMode === "large" ? (
                                        <>
                                            <Button onClick={toggleViewMode} variant="outline-success" className={`${styles.toggleBtn} ms-2`}>
                                                Switch to Small View
                                            </Button>
                                        </>
                                    ) :
                                        <>
                                            <Button onClick={toggleViewMode} variant="outline-danger" className={`${styles.toggleBtn} ms-2`}>
                                                Switch to Large View
                                            </Button>
                                        </>}
                                </Alert>
                            </Row>
                            <Row className="my-4 justify-content-center">
                                <Col md={8}>
                                    <div className="text-center">
                                        <h2>Review Management</h2>
                                        <p className="small text-muted">
                                            Manage all site reviews. Make sure to <em>not</em> remove anything unnecessarily.
                                        </p>
                                    </div>
                                </Col>
                            </Row>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        {viewMode === "large" ? (
                                            <>
                                                <th>Book Title</th>
                                                <th>User</th>
                                                <th>Comment</th>
                                                <th>Rating</th>
                                                <th>Actions</th>
                                            </>
                                        ) : (
                                            <>
                                                <th>User</th>
                                                <th>Comment</th>
                                                <th>Actions</th>
                                            </>
                                        )}
                                    </tr>
                                </thead>
                                <tbody>
                                    {reviews.map((review) => (
                                        <tr key={review.id}>
                                            {viewMode === "large" ? (
                                                <>
                                                    <td>{review.book_detail.title}</td>
                                                    <td>{review.owner}</td>
                                                    <td className="small">{review.comment}</td>
                                                    <td className="small">{review.rating} of 5</td>
                                                    <td>
                                                        <span className={`${styles.deleteBtn} me-2`} onClick={() => handleDelete(review.id)}>
                                                            <i className="fa-solid fa-trash"></i>
                                                        </span>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td>{review.owner}</td>
                                                    <td className="small">{review.comment}</td>
                                                    <td>
                                                        <span className={`${styles.deleteBtn} me-2`} onClick={() => handleDelete(review.id)}>
                                                            <i className="fa-solid fa-trash"></i>
                                                        </span>
                                                    </td>
                                                </>
                                            )}
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
                </>
            )}
        </Container>
    );
};

export default AdminReviews;