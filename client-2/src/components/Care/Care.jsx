import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Item from "./Item";

const Care = () => {
  return (
    <section className="text-center mt-5">
      <Container>
        <h2>
          <p className="mb-0">Providing the best</p>
          <p>medical care</p>
        </h2>
        <p className="mb-0">World-class care for everyone.</p>
        <p>Our health System offers unmatched, expert health care</p>
        <Row className="row-gap-3 row-cols-1 row-cols-lg-3">
          <Col>
            <Item title="Find a Doctor" img="icon01.png" />
          </Col>
          <Col>
            <Item title="Find a Location" img="icon02.png" />
          </Col>
          <Col>
            <Item title="Book Appointment" img="icon03.png" />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Care;
