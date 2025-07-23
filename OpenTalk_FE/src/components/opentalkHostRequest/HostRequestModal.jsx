import React, { useEffect, useState } from "react";
import { Modal, Button, ListGroup, Spinner } from "react-bootstrap";
import { getHostRegistrationsByMeetingId, approveHostRegistration, rejectHostRegistration } from "../../services/opentalkHostRegistrationService";
import ConfirmModal from "./ConfirmModal";

function RequestsModal({ show, onHide, meetingId, meetingTitle, onAfterAction }) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [confirm, setConfirm] = useState({ show: false, type: "", id: null, name: "" });

  // Fetch requests
  useEffect(() => {
    if (show && meetingId) {
      setLoading(true);
      getHostRegistrationsByMeetingId(meetingId)
        .then(res => setRequests(res.data || []))
        .catch(() => setRequests([]))
        .finally(() => setLoading(false));
    }
  }, [show, meetingId]);

  const handleApprove = (id, name) => setConfirm({ show: true, type: "approve", id, name });
  const handleReject = (id, name) => setConfirm({ show: true, type: "reject", id, name });

  // Khi xác nhận ở ConfirmModal
  const handleConfirmAction = () => {
  setProcessing(true);
  const apiCall = confirm.type === "approve"
    ? approveHostRegistration(confirm.id)
    : rejectHostRegistration(confirm.id);

  apiCall
    .then(() => {
      setConfirm({ show: false, type: "", id: null });
      onHide(); 
        if (typeof onAfterAction === "function") {
          setTimeout(() => {
            onAfterAction(); 
          }, 0);
        }
    })
    .catch(() => {
      alert("Operation failed");
    })
    .finally(() => {
      setProcessing(false);
    });
};


  return (
    <>
      <Modal show={show} onHide={onHide} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Requests for “{meetingTitle}”</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center py-4">
              <Spinner animation="border" />
            </div>
          ) : requests.length === 0 ? (
            <p className="text-muted">No requests yet.</p>
          ) : (
            <ListGroup variant="flush">
              {requests.map((req) => (
                <ListGroup.Item key={req.id} className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="fw-bold">{req.user?.fullName || req.user?.username || "Unknown"}</div>
                    <div style={{ fontSize: 14 }}>
                      <span className="text-secondary">{req.user?.email || "-"}</span> ·{" "}
                      <span className="text-secondary">{req.user?.companyBranch?.name || "-"}</span>
                    </div>
                  </div>
                  <div className="d-flex gap-2">
                    <Button variant="outline-success" size="sm" disabled={processing}
                      onClick={() => handleApprove(req.id, req.user?.fullName)}>
                      Approve
                    </Button>
                    <Button variant="outline-danger" size="sm" disabled={processing}
                      onClick={() => handleReject(req.id, req.user?.fullName)}>
                      Reject
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
      {/* Confirm dialog */}
      <ConfirmModal
        show={confirm.show}
        title={confirm.type === "approve" ? "Approve Host Request" : "Reject Host Request"}
        message={
          confirm.type === "approve"
            ? <>Are you sure you want to <b>APPROVE</b> this request of <br/>"<b>{confirm.name}</b>"?</>
            : <>Are you sure you want to <b>REJECT</b> this request of <br/>"<b>{confirm.name}</b>"?</>
        }
        onCancel={() => setConfirm({ show: false, type: "", id: null, name: "" })}
        onConfirm={handleConfirmAction}
      />
    </>
  );
}

export default RequestsModal;
