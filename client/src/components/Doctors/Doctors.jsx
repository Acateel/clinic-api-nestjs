import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Doctor from "../Doctor/Doctor";
import Loader from "./Loader";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const url = "http://localhost:3000/api/v1/doctors";
      const response = await fetch(
        `${url}?${new URLSearchParams({ limit: 3, sort: "appointments" })}`
      );
      const json = await response.json();
      setIsLoading(false);
      setDoctors(json);
    };
    fetchData();
  }, []);

  const [isLoading, setIsLoading] = useState(true);

  return (
    <section className="mt-5">
      <Container>
        <h1>Our great doctors</h1>
        <p className="mb-0">
          World-class care for everyone. Our health System offers
        </p>
        <p>unmatched, expert health care.</p>
        <Row className="g-3 row-cols-1 row-cols-md-3">
          {isLoading
            ? [...Array(3)].map((_, index) => <Loader key={index} />)
            : doctors?.map((_, i) => (
                <Col key={i}>
                  <Doctor />
                </Col>
              ))}
        </Row>
      </Container>
    </section>
  );
};

export default Doctors;
