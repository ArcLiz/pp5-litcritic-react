import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import {Route, Switch} from "react-router-dom";
import "./api/axiosDefaults";
import "./styles/CustomDropdown.css"
import SignInForm from "./pages/auth/SignInForm";
import SignUpForm from "./pages/auth/SignUpForm";
import BooksList from "./pages/books/BookList";
import ReaderList from "./pages/readers/ReaderList";
import ReaderDetails from "./pages/readers/ReaderDetails";
import BookDetails from "./pages/books/BookDetails";
import Home from "./pages/base/Home";
import AdminBooks from "./pages/books/AdminBooks";
import EditBookForm from "./components/EditBookForm";

function App() {
  return (
    <div className={styles.App}>
      <NavBar />
      <Container className={styles.Main}>
        <Switch>
          <Route exact path="/" render={() => <Home />} />
          <Route exact path="/signin" render={() => <SignInForm/> } />
          <Route exact path="/signup" render={() => <SignUpForm/>} />
          <Route exact path="/books" render={() => <BooksList/>} />
          <Route exact path="/books/:id" render={() => <BookDetails />} />
          <Route exact path="/readers" render={() => <ReaderList/> } />
          <Route exact path="/readers/:id" render={() => <ReaderDetails/> } />
          <Route exact path="/admin/books" render={() => <AdminBooks /> } />
          <Route exact path="/admin/books/edit/:id" render={() => <EditBookForm /> } />
          <Route render={() => <p>Page not found!</p>} />
        </Switch>
      </Container>
    </div>
  );
}

export default App;