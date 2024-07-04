import { Row, Col, Container } from "react-bootstrap";
import btnStyles from "../styles/Forms.module.css"
import PopularUsers from "../pages/readers/PopularUsers";
import NewestUsers from "../pages/readers/NewestUsers";

const NoCurrentUser = () => {
    return (
        <Container className={btnStyles.mainContainer}>
          <Row className={`$ text-center d-flex justify-content-center`}>
            <Col md={8}>
                <h2>Oops!</h2>
                <p className="text-muted">It looks like you've stumbled upon a members-only page.</p>
                    <p className="text-muted">
                        <a href="/signin">Sign In</a> to join our community. Don't have an account? <a href="/signup">Sign Up</a>
                    </p>                 
                    <hr />
            </Col>
          </Row>
          <Row className="mt-3">
            <h5 className="text-center"> Some of our readers who are dying to hear your thoughts!</h5>
          </Row>
          <Row className="mb-4 justify-content-center">
              <Col lg={5} className="mt-4">
                  <PopularUsers />
              </Col>
              <Col lg={5} className="mt-4">
                  <NewestUsers />
              </Col>
          </Row>
          <Row className="text-center">
          <p className="mt-3">Happy reading! </p>
          <p className="mb-0"><i className="fa-solid fa-book-open-reader"></i></p>
          </Row>
        </Container>

    )
}

export default NoCurrentUser;