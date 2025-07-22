import { FiDownload, FiPlus } from "react-icons/fi";
import { Form, Row, Col } from "react-bootstrap";

function HostRequestHeader({ onAddNew }) {
  return (
    <div className="py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontSize: 32 }}>OpenTalk Host Request</h2>
          <div className="text-muted" style={{ fontSize: 18 }}>Manage Host Register Requests</div>
        </div>
      </div>

      <Row className="align-items-center mb-3 g-2">
        <Col xs={12} md={3}>
          <Form.Control type="text" placeholder="Search meetings" />
        </Col>
      </Row>
    </div>
  );
}
export default HostRequestHeader;
