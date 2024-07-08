import React from "react";
import { BrowserRouter as Router, Route, Switch, useLocation } from "react-router-dom";
import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import "./api/axiosDefaults";
import "./styles/CustomDropdown.css";
import SignInForm from "./pages/auth/SignInForm";
import SignUpForm from "./pages/auth/SignUpForm";
import BooksList from "./pages/books/BookList";
import ReaderList from "./pages/readers/ReaderList";
import ReaderPage from "./pages/readers/ReaderPage";
import BookDetails from "./pages/books/BookDetails";
import Home from "./pages/base/Home";
import AdminPanel from "./pages/admin/AdminPanel";
import EditBookForm from "./pages/books/EditBookForm";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Router>
      <MainContainer />
    </Router>
  );
}

const MainContainer = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');
  const appClass = isAdminPath ? styles.GreenApp : styles.App;

  return (
    <div className={appClass}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route exact path="/" render={() => <Home />} />
          <Route exact path="/signin" render={() => <SignInForm/> } />
          <Route exact path="/signup" render={() => <SignUpForm/>} />
          <Route exact path="/books" render={() => <BooksList/>} />
          <Route exact path="/books/:id" render={() => <BookDetails />} />
          <Route exact path="/readers" render={() => <ReaderList/> } />
          <Route exact path="/readers/:id" render={() => <ReaderPage /> } />
          <Route exact path="/admin" render={() => <AdminPanel /> } />
          <Route exact path="/admin/books/edit/:id" render={() => <EditBookForm /> } />
          <Route render={() => <NotFound />} />
        </Switch>
      </Container>
    </div>
  );
};

export default App;
