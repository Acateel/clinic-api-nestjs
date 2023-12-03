import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";

const About = () => {
  return (
    <section className="mt-5">
      <Container>
        <Row className="row-gap-3 row-cols-1 row-cols-md-2">
          <Col>
            <Image
              src="about.png"
              fluid
              className=" d-block mx-auto"
              alt="about"
            />
          </Col>
          <Col>
            <h1>Proud to be one of the nations best</h1>
            <p>
              For 30 years in a row, U.S. News & World Report has recognized us
              as one of the best publics hospitals in the Nation and # 1 in
              Texas. Lorem ipsum dolor sit amet consectetur, adipisicing elit.
              Quas, nemo?
            </p>
            <p>
              Our best is something we strive for each day, caring for our
              patients-not looking back at what we accomplished but towards what
              we can do tomorrow. Providing the best. Lorem ipsum dolor sit
              amet, consectetur adipisicing elit. Aliquid, modi?
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default About;
