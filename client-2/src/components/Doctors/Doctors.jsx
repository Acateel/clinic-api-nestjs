import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Doctor from "../Doctor/Doctor";

const Doctors = () => {
  return (
    <section className="mt-5">
      <Container>
        <h1>Our great doctors</h1>
        <p className="mb-0">
          World-class care for everyone. Our health System offers
        </p>
        <p>unmatched, expert health care.</p>
        <Row className="g-3 row-cols-1 row-cols-md-3">
          <Col>
            <Doctor />
          </Col>
          <Col>
            <Doctor />
          </Col>
          <Col>
            <Doctor />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Doctors;
