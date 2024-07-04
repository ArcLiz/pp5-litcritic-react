import React, { useState } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import logo from "../assets/lit-logo-new-full.png";
import logoSmall from "../assets/lit-logo-new.png";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import { useCurrentUser, useSetCurrentUser } from "../contexts/CurrentUserContext";
import Avatar from "./Avatar";
import axios from "axios";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";
import CreateBookForm from "../pages/books/CreateBookForm";

const NavBar = () => {
  const currentUser = useCurrentUser();
  const setCurrentUser = useSetCurrentUser();
  const [showCreateBookModal, setShowCreateBookModal] = useState(false);

  const handleCloseCreateBookModal = () => setShowCreateBookModal(false);
  const handleShowCreateBookModal = () => setShowCreateBookModal(true);

  const { expanded, setExpanded, ref } = useClickOutsideToggle();

  const handleSignOut = async () => {
    try {
      await axios.post("dj-rest-auth/logout/");
      setCurrentUser(null);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      <Navbar expanded={expanded} className={` p-0 ${styles.NavBar}`} expand="md" fixed="top">
        <Container >
          <NavLink to="/">
            <Navbar.Brand className="d-none d-lg-block">
              <img className="m-0" src={logo} alt="logo" height="50" />
            </Navbar.Brand>
            <Navbar.Brand className="d-block d-lg-none">
            <img className="m-0" src={logoSmall} alt="logo" height="50" />
            </Navbar.Brand>
          </NavLink>
          {currentUser && (
            <Button variant="link" className={styles.NavButton} onClick={handleShowCreateBookModal}>
              <i className="fa-solid fa-feather"></i>
              Add book
            </Button>
          )}
          <Navbar.Toggle ref={ref} onClick={() => setExpanded(!expanded)} aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto text-left">
              {currentUser ? (
                <>
                  <NavLink className={`text-start text-lg-center mx-2 ${styles.NavLink}`} activeClassName={styles.Active} exact to="/">
                  <span className="d-flex d-md-block align-items-center">
                    <i className="fa-solid fa-home pb-0"></i><p className="m-0 p-0 small">Home</p>
                  </span>
                  </NavLink>
                  <NavLink className={`text-start text-lg-center mx-2 ${styles.NavLink}`} activeClassName={styles.Active} to="/books">
                  <span className="d-flex d-md-block align-items-center">
                    <i className="fa-solid fa-book pb-0"></i><p className="m-0 p-0 small">Books</p>
                  </span>
                  </NavLink>
                  <NavLink className={`text-start text-lg-center mx-2 ${styles.NavLink}`} activeClassName={styles.Active} to="/readers">
                  <span className="d-flex d-md-block align-items-center">
                    <i className="fa-solid fa-book-open-reader pb-0"></i><p className=" m-0 p-0 small">Readers</p>
                    </span>
                  </NavLink>
                  {currentUser.is_admin && (
                    <NavLink className={`text-start text-lg-center mx-2 ${styles.NavLink}`} activeClassName={styles.Active} to="/admin">
                      <span className="d-flex d-md-block align-items-center">
                      <i className="fa-solid fa-user-shield pb-0"></i><p className=" m-0 p-0 small">Admin</p>
                      </span>
                    </NavLink>
                  )}
                  <NavLink className={`text-start text-lg-center mx-2 ${styles.NavLink}`} to="/" onClick={handleSignOut}>
                  <span className="d-flex d-md-block align-items-center">
                    <i className="fas fa-sign-out-alt pb-0"></i><p className=" m-0 p-0 small">Sign Out</p>
                    </span>
                  </NavLink>
                  <NavLink className={`d-none d-md-block text-start text-lg-center mx-2 ${styles.NavLink}`} to={`/readers/${currentUser?.pk}`}>
                  <span className="d-flex d-md-block align-items-center p-0">
                    <Avatar src={currentUser?.profile_image} height={33}/><p className="m-0 p-0 small">Profile</p>
                    </span>
                  </NavLink>
                  <NavLink className={`d-block d-md-none text-start text-lg-center ps-0 mx-2 ${styles.NavLink}`} to={`/readers/${currentUser?.pk}`}>
                    <Avatar src={currentUser?.profile_image} text='Profile' height={35}/>
                  </NavLink>
                </>
              ) : (
                <>
                  <NavLink className={styles.NavLink} activeClassName={styles.Active} to="/signin">
                    <i className="fas fa-sign-in-alt"></i>Sign in
                  </NavLink>
                  <NavLink to="/signup" className={styles.NavLink} activeClassName={styles.Active}>
                    <i className="fas fa-user-plus"></i>Sign up
                  </NavLink>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <CreateBookForm show={showCreateBookModal} handleClose={handleCloseCreateBookModal} />
    </>
  );
};

export default NavBar;
