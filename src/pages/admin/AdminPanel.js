import React, { useState, useEffect } from 'react';
import { useCurrentUser } from '../../contexts/CurrentUserContext';
import styles from '../../App.module.css';
import { Container, Row, Alert, Col, Form } from 'react-bootstrap';
import Asset from '../../components/Asset';
import NoCurrentUser from '../../components/NoCurrentUser';
import AdminReviews from './AdminReviews';
import AdminBooks from './AdminBooks';

const AdminPanel = () => {
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState('0');
    const [loadingBooks, setLoadingBooks] = useState(false);
    const [loadingReviews, setLoadingReviews] = useState(false);
    const currentUser = useCurrentUser();

    useEffect(() => {
        if (currentUser !== undefined) {
            setLoading(false);
        }
    }, [currentUser]);

    const handleRangeChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        <Container className={styles.greenContainer}>
            {loading ? (
                <Asset spinner />
            ) : !currentUser ? (
                <NoCurrentUser />
            ) : currentUser.is_admin ? (
                <>
                    <Row className="text-center d-flex justify-content-center">
                        <Col xs={12} md={10}>
                            <h1>Admin Panel</h1>
                            <hr />
                            <p>
                                Oh hi there, almighty <strong>{currentUser.username}.</strong>
                                <br />
                                You are one of very few with access to this magical place.
                                <br />
                                Below, you will find links to manage books and reviews,
                                <br />
                                just in case you happen upon incorrect or inappropriate content.
                            </p>
                        </Col>
                    </Row>
                    <Row className="mt-4 justify-content-center text-center">
                        <Col sm={4}>
                            <Form.Group controlId="adminOptionRange">
                                <Form.Label>Choose What to Manage</Form.Label>
                                <div className="d-flex justify-content-between">
                                    <span className="text-muted small">None</span>
                                    <span className="text-muted small ms-3">Books</span>
                                    <span className="text-muted small">Reviews</span>
                                </div>
                                <Form.Control
                                    type="range"
                                    custom
                                    min="0"
                                    max="2"
                                    step="1"
                                    value={selectedOption}
                                    onChange={handleRangeChange}
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="mt-5">
                        {selectedOption === '1' && (
                            <>
                                {loadingBooks ? (
                                    <Col className="text-center">
                                        <Asset spinner />
                                    </Col>
                                ) : (
                                    <AdminBooks setLoading={setLoadingBooks} />
                                )}
                            </>
                        )}
                        {selectedOption === '2' && (
                            <>
                                {loadingReviews ? (
                                    <Col className="text-center">
                                        <Asset spinner />
                                    </Col>
                                ) : (
                                    <AdminReviews setLoading={setLoadingReviews} />
                                )}
                            </>
                        )}
                    </Row>
                </>
            ) : (
                <Alert variant="danger" className="text-center">
                    You sneaky sneak! You don't have permission to view this page.
                </Alert>
            )}
        </Container>
    );
};

export default AdminPanel;