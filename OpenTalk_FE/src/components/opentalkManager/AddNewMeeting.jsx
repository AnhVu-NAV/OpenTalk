import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, InputGroup } from "react-bootstrap";
import MeetingMaterialModal from "./MeetingMaterial";

function AddMeeting() {
  const [form, setForm] = useState({
    title: "",
    topic: "",
    host: "",
    branch: "",
    scheduledDate: "",
    url: "",
    status: "Upcoming",
    code: "",
  });

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

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Meeting added:\n" + JSON.stringify(form, null, 2));
    navigate("/meeting");
  };

  return (
    <div className="addmeeting-bg-enterprise">
      <div className="addmeeting-container py-3">
        {/* BACK + TITLE */}
        <div className="d-flex align-items-center gap-2 mb-1">
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
        <h2 className="addmeeting-title mb-3">Add New Meeting</h2>
        {/* FORM */}
        <Form onSubmit={handleSubmit} autoComplete="off" className="addmeeting-form-enterprise">
          {/* Row 1: Meeting Title + Scheduled Date */}
          <div className="addmeeting-grid-row mb-2">
            {/* Meeting Title */}
            <Form.Group>
              <Form.Label className="form-label-enterprise">Meeting Title</Form.Label>
              <Form.Control
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter meeting title"
                autoComplete="off"
                required
                size="sm"
              />
            </Form.Group>
            {/* Scheduled Date */}
            <Form.Group>
              <Form.Label className="form-label-enterprise text-primary">Scheduled Date</Form.Label>
              <InputGroup>
                <Form.Control
                  type="date"
                  name="scheduledDate"
                  value={form.scheduledDate}
                  onChange={handleChange}
                  required
                  size="sm"
                />
                <InputGroup.Text>
                  <i className="bi bi-calendar-event" style={{ color: "#1976d2" }} />
                </InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </div>
          {/* Row 2: Other fields - full width */}
          <Form.Group className="mb-2">
            <Form.Label className="form-label-enterprise">Topic</Form.Label>
            <Form.Control
              name="topic"
              value={form.topic}
              onChange={handleChange}
              placeholder="Meeting topic"
              autoComplete="off"
              required
              size="sm"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="form-label-enterprise">Host</Form.Label>
            <Form.Control
              name="host"
              value={form.host}
              onChange={handleChange}
              placeholder="Enter host name"
              autoComplete="off"
              required
              size="sm"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="form-label-enterprise">Company Branch</Form.Label>
            <Form.Control
              name="branch"
              value={form.branch}
              onChange={handleChange}
              placeholder="Enter company branch"
              autoComplete="off"
              required
              size="sm"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="form-label-enterprise">Meeting URL</Form.Label>
            <Form.Control
              name="url"
              value={form.url}
              onChange={handleChange}
              placeholder="Enter meeting URL"
              autoComplete="off"
              size="sm"
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="form-label-enterprise">Status</Form.Label>
            <Form.Select name="status" value={form.status} onChange={handleChange} size="sm">
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
              value={form.code}
              onChange={handleChange}
              placeholder="Attendance code"
              autoComplete="off"
              size="sm"
            />

            {/* Generating Attendance Code Card */}
          <div className="gen-attendance-card mt-2">
            <div className="d-flex align-items-center justify-content-between">
              <div>
                <div className="fw-semibold" style={{ color: "#18926e", fontSize: 16 }}>
                  <i className="bi bi-magic me-2"></i>
                  Generating Attendance Code
                </div>
                <div className="text-muted" style={{ fontSize: 13 }}>
                  Generate a unique code for this meeting. Click the button to auto-generate or fetch from server.
                </div>
              </div>
              <Button
                size="sm"
                className="btn-gen-code"
                onClick={() => {
                  // TODO: Replace with your API call later
                  const random = Math.random().toString(36).substr(2, 8).toUpperCase();
                  handleChange({ target: { name: "code", value: random } });
                }}
              >
                <i className="bi bi-lightning-charge-fill me-1"></i> Generate
              </Button>
            </div>
          </div>
          </Form.Group>
          {/* Save button & Manage Meeting Material */}
          <div className="d-flex justify-content-between align-items-center mt-2 gap-3">
            <Button className="px-4 py-2 rounded-3 btn-dark-green" type="submit" style={{ minWidth: 110 }}>
              Save
            </Button>
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
        .gen-attendance-card {
          border-radius: 9px;
          background: #f4faf6;
          box-shadow: 0 1px 7px rgba(0,0,0,0.02);
          border: 1.3px solid #d1eee4;
          padding: 16px 18px 14px 18px;
        }
        .btn-gen-code {
          background: #18926e;
          border: none;
          font-weight: 500;
          font-size: 15px;
          padding: 6px 18px;
        }
        .btn-gen-code:hover, .btn-gen-code:focus {
          background: #13563f;
        }

      `}</style>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />
    </div>
  );
}

export default AddMeeting;
