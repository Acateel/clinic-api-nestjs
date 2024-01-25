import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";

const Promo = () => {
  return (
    <section style={{ marginTop: "80px" }}>
      <Container>
        <Row xs={1} lg={2}>
          <Col>
            <h1>
              <p className="m-0">We help patients</p>
              <p className="m-0">live a healthy,</p>
              <p className="m-0">longer life.</p>
            </h1>
            <p>
              Lorem, ipsum dolor sit amet consectetur adipisicing elit.
              Deserunt, fugit id? Id nisi facere, dolorem nostrum esse porro
              quisquam reprehenderit.
            </p>
            <Button>Request an Appointment</Button>
            <ul className="list-inline d-flex gap-3 mt-3">
              <li className="list-inline-item">
                <h2>30+</h2>
                <p>Years of Experience</p>
              </li>
              <li className="list-inline-item">
                <h2>15+</h2>
                <p>Clinic Location</p>
              </li>
              <li className="list-inline-item">
                <h2>100%</h2>
                <p>Patient Satisfaction</p>
              </li>
            </ul>
          </Col>
          <Col>
            <Row>
              <Col xs={7}>
                <Image src="hero-img01.png" fluid alt="doctor-1" />
              </Col>
              <Col>
                <Row className="gy-4 mt-1">
                  <Image src="hero-img02.png" fluid alt="doctor-2" />
                  <Image src="hero-img03.png" fluid alt="doctor-3" />
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Promo;
