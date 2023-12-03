import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import styles from "./Header.module.scss";

const Header = () => {
  const [show, setShow] = useState(false);
  const toggleShow = () => setShow((current) => !current);

  return (
    <header>
      <Navbar className={styles.navbar} fixed="top">
        <Container>
          <Navbar.Brand href="#">
            <img src="logo.png" alt="logo" />
          </Navbar.Brand>
          <Offcanvas show={show} onHide={toggleShow} responsive="md">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Responsive offcanvas</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav>
                <Nav.Item>
                  <Nav.Link href="#">Home</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="#">Services</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="#">Find a doctor</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link href="#">Contact</Nav.Link>
                </Nav.Item>
              </Nav>
            </Offcanvas.Body>
          </Offcanvas>
          <div>
            <Button>Log in</Button>
            <Button
              className="d-md-none ms-2"
              variant="outline-secondary"
              onClick={toggleShow}
            >
              <span className="navbar-toggler-icon"></span>
            </Button>
          </div>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
