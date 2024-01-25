import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

const Footer = () => {
  return (
    <footer className="mt-5">
      <Container>
        <Row>
          <Col>
            <img src="logo.png" alt="logo" />
            <p>Copyright all rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
