import React, { useState } from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import logo from "../assets/logo.png";
import styles from "../styles/NavBar.module.css";
import { NavLink } from "react-router-dom";
import { useCurrentUser, useSetCurrentUser } from "../contexts/CurrentUserContext";
import Avatar from "./Avatar";
import axios from "axios";
import useClickOutsideToggle from "../hooks/useClickOutsideToggle";
import CreateBookForm from "./CreateBookForm";

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
      <Navbar expanded={expanded} className={styles.NavBar} expand="md" fixed="top">
        <Container fluid>
          <NavLink to="/">
            <Navbar.Brand>
              <img src={logo} alt="logo" height="45" />
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
                  <NavLink className={styles.NavLink} activeClassName={styles.Active} to="/books">
                    <i className="fa-solid fa-book"></i>Books
                  </NavLink>
                  <NavLink className={styles.NavLink} activeClassName={styles.Active} to="/readers">
                    <i className="fa-solid fa-book-open-reader"></i>Readers
                  </NavLink>
                  <NavLink className={styles.NavLink} to="/" onClick={handleSignOut}>
                    <i className="fas fa-sign-out-alt"></i>Sign out
                  </NavLink>
                  <NavLink className={styles.NavLink} to={`/readers/${currentUser?.pk}`}>
                    <Avatar src={currentUser?.profile_image} text="Profile" height={40} />
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
