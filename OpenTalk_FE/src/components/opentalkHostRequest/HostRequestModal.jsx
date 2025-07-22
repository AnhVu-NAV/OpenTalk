import React from "react";
import { Modal, Button, ListGroup } from "react-bootstrap";

function RequestsModal({ show, onHide, meetingTitle, requests }) {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Requests for “{meetingTitle}”</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {requests.length === 0 ? (
          <p className="text-muted">No requests yet.</p>
        ) : (
          <ListGroup variant="flush">
            {requests.map((req) => (
              <ListGroup.Item key={req.id}>
                {req.name}
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RequestsModal;
