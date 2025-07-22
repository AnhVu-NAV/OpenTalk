import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Form, InputGroup } from "react-bootstrap";
import MeetingMaterialModal from "./MeetingMaterial";

function ViewMeetingDetails({ meeting }) {
  // meeting: object chứa dữ liệu meeting để view chi tiết

  // Quản lý modal meeting material
  const [showMaterial, setShowMaterial] = useState(false);
  const [files, setFiles] = useState([
    { name: "Payslips_20 Aug.pdf" },
    { name: "Payslips_20 Oct.pdf" }
  ]);
  const handleShowMaterial = () => setShowMaterial(true);
  const handleCloseMaterial = () => setShowMaterial(false);
  const handleFileChange = (e) => {
    const filesArr = Array.from(e.target.files).map(file => ({ name: file.name }));
    setFiles((prev) => [...prev, ...filesArr]);
  };
  const handleDeleteFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const navigate = useNavigate();
  const { id } = useParams();

  // Chuyển sang trang Edit
  const handleEdit = () => {
    navigate(`/project/edit-meeting/${id}`);
  };

  // Nếu không truyền prop meeting, mock data để demo
  const detail = meeting || {
    title: "Quarterly Update",
    topic: "Business Review",
    host: "Alice Johnson",
    branch: "Main Office",
    scheduledDate: "2024-08-12",
    url: "https://meet.zoom.us/qwerty",
    status: "Ongoing",
    code: "2H8SKX1R",
  };

  return (
    <div className="addmeeting-bg-enterprise">
      <div className="addmeeting-container py-3">
        {/* BACK + TITLE + EDIT */}
        <div className="d-flex align-items-center justify-content-between mb-1">
          <div className="d-flex align-items-center gap-2">
            <span
              style={{ fontSize: 24, cursor: "pointer" }}
              onClick={() => navigate(-1)}
              className="fw-bold text-dark"
            >
              &larr;
            </span>
            <span className="fw-semibold fs-5 back-text" style={{ cursor: "pointer" }} onClick={() => navigate(-1)}>
              Back
            </span>
          </div>
          <Button
            className="px-4 py-2 rounded-3 btn-dark-green"
            style={{ minWidth: 110, fontWeight: 500 }}
            onClick={handleEdit}
          >
            <i className="bi bi-pencil-square me-2"></i>
            Edit
          </Button>
        </div>
        <h2 className="addmeeting-title mb-3">Meeting Details</h2>
        {/* FORM VIEW-ONLY */}
        <Form autoComplete="off" className="addmeeting-form-enterprise">
          {/* Row 1: Meeting Title + Scheduled Date */}
          <div className="addmeeting-grid-row mb-2">
            {/* Meeting Title */}
            <Form.Group>
              <Form.Label className="form-label-enterprise">Meeting Title</Form.Label>
              <Form.Control
                name="title"
                value={detail.title}
                readOnly
                plaintext={false}
                size="sm"
                style={{ background: "#f8fafb" }}
              />
            </Form.Group>
            {/* Scheduled Date */}
            <Form.Group>
              <Form.Label className="form-label-enterprise text-primary">Scheduled Date</Form.Label>
              <InputGroup>
                <Form.Control
                  type="date"
                  name="scheduledDate"
                  value={detail.scheduledDate}
                  readOnly
                  size="sm"
                  style={{ background: "#f8fafb" }}
                />
                <InputGroup.Text>
                  <i className="bi bi-calendar-event" style={{ color: "#1976d2" }} />
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </div>
          <Form.Group className="mb-2">
            <Form.Label className="form-label-enterprise">Topic</Form.Label>
            <Form.Control
              name="topic"
              value={detail.topic}
              readOnly
              plaintext={false}
              size="sm"
              style={{ background: "#f8fafb" }}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="form-label-enterprise">Host</Form.Label>
            <Form.Control
              name="host"
              value={detail.host}
              readOnly
              plaintext={false}
              size="sm"
              style={{ background: "#f8fafb" }}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="form-label-enterprise">Company Branch</Form.Label>
            <Form.Control
              name="branch"
              value={detail.branch}
              readOnly
              plaintext={false}
              size="sm"
              style={{ background: "#f8fafb" }}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="form-label-enterprise">Meeting URL</Form.Label>
            <Form.Control
              name="url"
              value={detail.url}
              readOnly
              plaintext={false}
              size="sm"
              style={{ background: "#f8fafb" }}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="form-label-enterprise">Status</Form.Label>
            <Form.Select name="status" value={detail.status} disabled size="sm">
              <option value="Upcoming">Upcoming</option>
              <option value="Ongoing">Ongoing</option>
              <option value="Finished">Finished</option>
              <option value="Cancelled">Cancelled</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="form-label-enterprise">Attendance Code</Form.Label>
            <Form.Control
              name="code"
              value={detail.code}
              readOnly
              plaintext={false}
              size="sm"
              style={{ background: "#f8fafb" }}
            />
          </Form.Group>
          {/* Only: Manage Meeting Material */}
          <div className="d-flex justify-content-end align-items-center mt-2 gap-3">
            <Button
              className="px-4 py-2 rounded-3 btn-outline-dark-green"
              type="button"
              style={{ minWidth: 200, fontWeight: 500 }}
              onClick={handleShowMaterial}
            >
              <i className="bi bi-folder2-open me-2"></i>
              Manage Meeting Material
            </Button>
          </div>
        </Form>
      </div>
      {/* MeetingMaterialModal popup */}
      <MeetingMaterialModal
        show={showMaterial}
        onHide={handleCloseMaterial}
        files={files}
        onUpload={handleFileChange}
        onDelete={handleDeleteFile}
      />
      <style>{`
        .addmeeting-bg-enterprise {
          background: #fafbfc;
        }
        .addmeeting-container {
          width: 100%;
          margin: 0;
          padding-left: 16px;
          padding-right: 16px;
        }
        .addmeeting-title {
          font-weight: 700;
          font-size: 2rem;
          color: #233d29;
          letter-spacing: 0.01em;
        }
        .addmeeting-grid-row {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .form-label-enterprise {
          font-weight: 600;
          font-size: 15px;
          color: #233d29;
          margin-bottom: 3px;
        }
        .form-label-enterprise.text-primary {
          color: #1976d2;
        }
        .form-control, .form-select {
          border-radius: 9px;
          font-size: 14px;
          padding-top: 6px;
          padding-bottom: 6px;
        }
        .form-control:disabled, .form-control[readonly] {
          background: #f1f3f4;
        }
        .btn-dark-green {
          background: #234c38;
          border: none;
        }
        .btn-dark-green:hover, .btn-dark-green:focus {
          background: #18926e;
        }
        .btn-outline-dark-green {
          background: #fff;
          border: 2px solid #234c38;
          color: #234c38;
          transition: 0.18s;
        }
        .btn-outline-dark-green:hover, .btn-outline-dark-green:focus {
          background: #18926e;
          color: #fff;
          border-color: #18926e;
        }
        .rounded-3 {
          border-radius: 10px !important;
        }
        .back-text {
          color: #233d29;
        }
      `}</style>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />
    </div>
  );
}

export default ViewMeetingDetails;
