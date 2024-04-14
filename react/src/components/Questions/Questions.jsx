import Accordion from "react-bootstrap/Accordion";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Image from "react-bootstrap/Image";
import Row from "react-bootstrap/Row";

const Questions = () => {
  const questions = [
    {
      title: "What is your medical care?",
      text: "One Medical was founded on a better model of care one designed around patients needs that provides a higher level of quality and service affordably. We do this through innovative design, excellent customer service, and the efficient use of technology.",
    },
    {
      title: "What happens if i need to go to hospital?",
      text: "One Medical was founded on a better model of care one designed around patients needs that provides a higher level of quality and service affordably. We do this through innovative design, excellent customer service, and the efficient use of technology.",
    },
    {
      title: "What happens if i need to go to hospital?",
      text: "One Medical was founded on a better model of care one designed around patients needs that provides a higher level of quality and service affordably. We do this through innovative design, excellent customer service, and the efficient use of technology.",
    },
    {
      title: "Can i visit your medical office?",
      text: "One Medical was founded on a better model of care one designed around patients needs that provides a higher level of quality and service affordably. We do this through innovative design, excellent customer service, and the efficient use of technology.",
    },
    {
      title: "Do you provide urgent care?",
      text: "One Medical was founded on a better model of care one designed around patients needs that provides a higher level of quality and service affordably. We do this through innovative design, excellent customer service, and the efficient use of technology.",
    },
  ];

  return (
    <section className="mt-5">
      <Container>
        <Row className="align-items-center row-cols-1 row-cols-md-2">
          <Col>
            <Image
              src="faq-img.png"
              className="d-block mx-auto"
              fluid
              alt="about"
            ></Image>
          </Col>
          <Col>
            <h1 className="my-3">Most questions by our belowed patients</h1>
            <Accordion>
              {questions.map((question, index) => (
                <Accordion.Item key={index} eventKey={index}>
                  <Accordion.Header>{question.title}</Accordion.Header>
                  <Accordion.Body>{question.text}</Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Questions;
