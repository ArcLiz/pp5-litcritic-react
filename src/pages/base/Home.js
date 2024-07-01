import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NewestUsers from '../readers/NewestUsers'
import PopularUsers from '../readers/PopularUsers'
import PopularBooks from '../../components/PopularBooks'
import Quote from '../../assets/quote.png'
import styles from '../../styles/Home.module.css'

const Home = () => {
  return (
      <Container className={styles.mainContainer}>
          <Row className="mb-4 justify-content-center">
              <Col md={10}>
                  <div className="text-center">
                      <h1>LitCrit</h1>
                      <hr />
                      <p className="small text-muted">Your go-to place for honest and insightful book reviews.</p>
                      <Button as={Link} to="/books" className={styles.homeBtn}>Browse All Books</Button>
                  </div>
              </Col>
          </Row>
          <Row className="mb-4 justify-content-center">
              <Col lg={10}>
                  <PopularBooks />
              </Col>
          </Row>
          
          <Row className="mb-4 justify-content-center">
              <Col lg={5} className="mt-4">
                  <PopularUsers />
              </Col>
              <Col lg={5} className="mt-4">
                  <NewestUsers />
              </Col>
          </Row>
          <Row className="mb-4 justify-content-center">
              
          </Row>
          <Row>
              <Col>
                  <div className="text-center">
                      <img className="m-3" width="70%" src={Quote} alt="book quote by C.S. Lewis" />
                  </div>
              </Col>
          </Row>

      </Container>
  );
};

export default Home;
