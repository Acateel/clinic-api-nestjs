import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Stack from "react-bootstrap/Stack";

const LoginModal = ({ isOpenedModal, setIsOpenedModal }) => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <Modal
      centered
      show={isOpenedModal}
      onHide={() => setIsOpenedModal((current) => !current)}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Hello! <span className="text-primary">Wellcome</span> back
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form action="#" onSubmit={handleSubmit}>
          <Stack gap={3}>
            <Form.Group>
              <Form.Control type="email" placeholder="Enter email" />
            </Form.Group>
            <Form.Group>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <Button type="submit">Login</Button>
          </Stack>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        Dont have an account? <a href="#">Register</a>
      </Modal.Footer>
    </Modal>
  );
};

export default LoginModal;
