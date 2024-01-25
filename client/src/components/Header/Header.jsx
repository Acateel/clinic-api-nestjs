import { useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Link } from "react-router-dom";
import LoginModal from "../LoginModal/LoginModal";
import styles from "./Header.module.scss";

const Header = () => {
  const links = [
    { href: "#", name: "Home" },
    { href: "#", name: "Services" },
    { href: "find-a-doctor", name: "Find a doctor" },
    { href: "#", name: "Contact" },
  ];

  const [show, setShow] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isOpenedModal, setIsOpenedModal] = useState(false);

  const handleToggleShow = () => setShow((current) => !current);

  return (
    <header>
      <Navbar className={styles.navbar} fixed="top">
        <Container>
          <Navbar.Brand href="#">
            <img src="logo.png" alt="logo" />
          </Navbar.Brand>
          <Offcanvas show={show} onHide={handleToggleShow} responsive="md">
            <Offcanvas.Header closeButton>
              <Offcanvas.Title>Responsive offcanvas</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav onSelect={setActiveIndex} activeKey={activeIndex}>
                {links.map((link, index) => (
                  <Nav.Item key={index}>
                    <Nav.Link as={Link} to={link.href} eventKey={index}>
                      {link.name}
                    </Nav.Link>
                  </Nav.Item>
                ))}
              </Nav>
            </Offcanvas.Body>
          </Offcanvas>
          <div>
            <Button onClick={() => setIsOpenedModal((current) => !current)}>
              Log in
            </Button>
            <Button
              className="d-md-none ms-2"
              variant="outline-secondary"
              onClick={handleToggleShow}
            >
              <span className="navbar-toggler-icon"></span>
            </Button>
          </div>
        </Container>
      </Navbar>
      <LoginModal {...{ isOpenedModal, setIsOpenedModal }} />
    </header>
  );
};

export default Header;
