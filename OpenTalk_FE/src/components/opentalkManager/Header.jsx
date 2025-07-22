import { FiDownload, FiPlus } from "react-icons/fi";
import { Form, Row, Col } from "react-bootstrap";

function OpenTalkHeader({ onAddNew }) {
  return (
    <div className="py-4">
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h2 className="fw-bold mb-1" style={{ fontSize: 32 }}>OpenTalk Meeting</h2>
          <div className="text-muted" style={{ fontSize: 18 }}>Manage your Meetings</div>
        </div>
        <div className="d-flex gap-3">
          <button className="btn btn-light rounded-4 shadow-sm py-2 px-4 fw-semibold d-flex align-items-center gap-2" style={{ fontSize: 18 }}>
            <FiDownload size={20} /> Download
          </button>
          <button className="btn btn-dark rounded-4 shadow-sm py-2 px-4 fw-semibold d-flex align-items-center gap-2" style={{ fontSize: 18 }} onClick={onAddNew}>
            <FiPlus size={20} /> Add New
          </button>
        </div>
      </div>

      <Row className="align-items-center mb-3 g-2">
        <Col xs={12} md={3}>
          <Form.Control type="text" placeholder="Search meetings" />
        </Col>
        <Col xs={4} md={2}>
          <Form.Select>
            <option>All Branches</option>
          </Form.Select>
        </Col>
        <Col xs={4} md={2}>
          <Form.Select>
            <option>All Hosts</option>
          </Form.Select>
        </Col>
        <Col xs={4} md={2}>
          <Form.Select>
            <option>All Status</option>
          </Form.Select>
        </Col>
      </Row>
    </div>
  );
}
export default OpenTalkHeader;
