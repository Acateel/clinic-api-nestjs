import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Item from "./Item";

const Services = () => {
  return (
    <section className="mt-5">
      <Container>
        <div className="text-center">
          <h1>Our Services</h1>
          <p className="mb-0">
            World-class care for everyone. Our health System offers
          </p>
          <p>unmatched, expert health care.</p>
        </div>
        <Row className="row-cols-1 row-cols-md-3 g-4">
          <Col>
            <Item index={1} title="Cancer Care" />
          </Col>
          <Col>
            <Item index={2} title="Labor & Delivery" />
          </Col>
          <Col>
            <Item index={3} title="Heart & Vascular" />
          </Col>
          <Col>
            <Item index={4} title="Mental Health" />
          </Col>
          <Col>
            <Item index={5} title="Neurology" />
          </Col>
          <Col>
            <Item index={6} title="Burn Treatment" />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Services;
