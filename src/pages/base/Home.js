import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NewestUser from '../../components/NewestUser'
import PopularUsers from '../../components/PopularUsers'
import PopularBooks from '../../components/PopularBooks'
import Quote from '../../assets/quote.png'

const Home = () => {
  return (
      <Container fluid>
          <Row className="mb-4">
              <Col>
                  <div className="text-center">
                      <h1>Welcome to Book Reviews</h1>
                      <p className="lead">Your go-to place for honest and insightful book reviews.</p>
                      <Button as={Link} to="/books" variant="primary">Browse All Books</Button>
                  </div>
              </Col>
          </Row>
          <Row>
              <Col>
                  <PopularBooks />
              </Col>
          </Row>
          <Row>
              <Col>
                  <div className="text-center">
                      <img className="m-3" width="70%" src={Quote} />
                  </div>
              </Col>
          </Row>
          <Row className="justify-content-center">
              <Col lg={9} className="mb-4 mb-md-2">
                  <NewestUser />
              </Col>
          </Row>
          <Row className="mb-4 justify-content-center">
              <Col lg={9}>
                  <PopularUsers />
              </Col>
          </Row>

      </Container>
  );
};

export default Home;
