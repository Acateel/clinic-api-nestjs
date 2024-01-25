import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";

const Treatment = () => {
  return (
    <section className="mt-5">
      <Container>
        <Row className="align-items-center row-cols-1 row-cols-md-2">
          <Col>
            <h1>Get virtual treatment anytyme.</h1>
            <ol>
              <li>Schedule the appointment directly.</li>
              <li>Search for your physician here and contact their office.</li>
              <li>
                View our physicians who are accepting new patients, use the
                online scheduling tool to select an appointment time.
              </li>
            </ol>
          </Col>
          <Col>
            <Image
              src="feature-img.png"
              className="ms-auto d-block"
              fluid
              alt="about"
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Treatment;
