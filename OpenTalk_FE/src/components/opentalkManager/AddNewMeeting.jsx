import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import MeetingMaterialModal from "./MeetingMaterial";
import { createMeeting, getCompanyBranches  } from "../../services/opentalkManagerService"; 
import SuccessDialog from "./SuccessModal";

function AddMeeting() {
  const [form, setForm] = useState({
    meetingName: "",
    scheduledDate: "",
    meetingLink: "",
    status: "",
    topic: "",
    host: "",
    duration: "",
    companyBranch: "",
    attendanceCode: "",
  });

  // Material files (UI only, không gửi backend ở bước này)
  const [showMaterial, setShowMaterial] = useState(false);
  const [files, setFiles] = useState([]); // [{ name: "file1.pdf" }, ...]

  // State cho lookup company branches
  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(true);

  const [showSuccess, setShowSuccess] = useState(false);

  // Topic, host giữ nguyên (mock)
  const topics = [];
  const hosts = [];

  const navigate = useNavigate();

  // Fetch company branches khi load page
  useEffect(() => {
    setBranchesLoading(true);
    getCompanyBranches()
      .then(res => setBranches(res.data || []))
      .catch(() => setBranches([]))
      .finally(() => setBranchesLoading(false));
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Attendance code generator
  const handleGenerateCode = () => {
    const random = Math.random().toString(36).substr(2, 8).toUpperCase();
    setForm((prev) => ({ ...prev, attendanceCode: random }));
  };

  // Meeting Material handlers (upload/delete)
  const handleFileChange = (e) => {
    const filesArr = Array.from(e.target.files).map(file => ({ name: file.name }));
    setFiles((prev) => [...prev, ...filesArr]);
  };
  const handleDeleteFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleShowMaterial = () => setShowMaterial(true);
  const handleCloseMaterial = () => setShowMaterial(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const meetingData = {
      meetingName: form.meetingName,
      scheduledDate: form.scheduledDate,
      meetingLink: form.meetingLink,
      status: form.status,
      topic: form.topic ? { id: form.topic } : null,
      host: form.host ? { id: form.host } : null,
      duration: form.duration ? parseFloat(form.duration) : null,
      companyBranch: form.companyBranch ? { id: form.companyBranch } : null,
      // attendanceCode và files KHÔNG gửi backend
    };
    try {
      await createMeeting(meetingData);
      setShowSuccess(true);
    } catch (err) {
      console.error("Error creating meeting:", err);
    }
  };
  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/opentalk/manager");
  };

  return (
    <div className="addmeeting-bg-enterprise">
      <div className="addmeeting-container py-3">
        {/* ...phần đầu giữ nguyên */}
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
          {/* Row: Meeting Title + Scheduled Date */}
          <div className="addmeeting-grid-row mb-2">
            {/* Meeting Title */}
            <Form.Group>
              <Form.Label className="form-label-enterprise">Meeting Title</Form.Label>
              <Form.Control
                name="meetingName"
                value={form.meetingName}
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
              <Form.Control
                type="datetime-local"
                name="scheduledDate"
                value={form.scheduledDate}
                onChange={handleChange}
                required
                size="sm"
              />
            </Form.Group>
          </div>

          {/* Topic */}
          <Form.Group className="mb-2">
            <Form.Label className="form-label-enterprise">Topic</Form.Label>
            <Form.Select
              name="topic"
              value={form.topic}
              onChange={handleChange}
              required
              disabled={topics.length === 0}
            >
              <option value="">-- Select Topic --</option>
              {topics.map(topic => (
                <option key={topic.id} value={topic.id}>{topic.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          {/* Host */}
          <Form.Group className="mb-2">
            <Form.Label className="form-label-enterprise">Host</Form.Label>
            <Form.Select
              name="host"
              value={form.host}
              onChange={handleChange}
              required
              disabled={hosts.length === 0}
            >
              <option value="">-- Select Host --</option>
              {hosts.map(user => (
                <option key={user.id} value={user.id}>{user.fullName || user.username}</option>
              ))}
            </Form.Select>
          </Form.Group>
          {/* Company Branch */}
          <Form.Group className="mb-2">
            <Form.Label className="form-label-enterprise">Company Branch</Form.Label>
            <Form.Select
              name="companyBranch"
              value={form.companyBranch}
              onChange={handleChange}
              required
              disabled={branchesLoading}
            >
              <option value="">-- Select Branch --</option>
              {branches.map(branch => (
                <option key={branch.id} value={branch.id}>{branch.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
          {/* Meeting URL */}
          <Form.Group className="mb-2">
            <Form.Label className="form-label-enterprise">Meeting URL</Form.Label>
            <Form.Control
              name="meetingLink"
              value={form.meetingLink}
              onChange={handleChange}
              placeholder="Enter meeting URL"
              autoComplete="off"
              size="sm"
            />
          </Form.Group>
          {/* Status */}
          <Form.Group className="mb-2">
          <Form.Label className="form-label-enterprise">Status</Form.Label>
          <Form.Select name="status" value={form.status} onChange={handleChange} size="sm" required>
            <option value="">-- Select Status --</option>
            <option value="WAITING_TOPIC">WAITING_TOPIC</option>
            <option value="WAITING_HOST_REGISTER">WAITING_HOST_REGISTER</option>
            <option value="WAITING_HOST_SELECTION">WAITING_HOST_SELECTION</option>
            <option value="UPCOMING">UPCOMING</option>
            <option value="ONGOING">ONGOING</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="CANCELLED">CANCELLED</option>
            <option value="POSTPONED">POSTPONED</option>
          </Form.Select>
        </Form.Group>

          {/* Duration */}
          <Form.Group className="mb-3">
            <Form.Label className="form-label-enterprise">Duration (hours)</Form.Label>
            <Form.Control
              name="duration"
              type="number"
              min={1}
              value={form.duration}
              onChange={handleChange}
              placeholder="Enter duration (minutes)"
              autoComplete="off"
              size="sm"
              required
            />
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
      <SuccessDialog
        show={showSuccess}
        onClose={handleSuccessClose}
        title="Success"
        message="Meeting added successfully!"
      />
      {/* <style>{`
        .addmeeting-bg-enterprise {
          background: #fafbfc;
        }
        .addmeeting-grid-row {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
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
        .form-control:disabled, .form-control[readonly], .form-select:disabled {
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
      `}</style> */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />
    </div>
  );
}

export default AddMeeting;
