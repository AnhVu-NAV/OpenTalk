import { Modal, Button } from "react-bootstrap";

function ConfirmModal({ show, title, message, onCancel, onConfirm }) {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title || "Confirm"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>{message || "Are you sure?"}</div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="danger" onClick={onConfirm}>Confirm</Button>
      </Modal.Footer>
    </Modal>
  );
}
export default ConfirmModal;
