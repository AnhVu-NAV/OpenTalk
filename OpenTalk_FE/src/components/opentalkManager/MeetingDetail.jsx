import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import MeetingMaterialModal from "./MeetingMaterial";

function formatDateTime(dtStr) {
  if (!dtStr) return "";
  const d = new Date(dtStr);
  return d.toLocaleString("en-GB", { hour12: false });
}

function ViewMeetingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  // Lấy meeting từ navigate state nếu có
  const meetingFromState = location.state?.meeting;

  // State cho meeting detail (nếu reload hoặc vào trực tiếp từ URL)
  const [meeting, setMeeting] = useState(meetingFromState || null);
  const [loading, setLoading] = useState(!meetingFromState);

  // Meeting material (UI only)
  const [showMaterial, setShowMaterial] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    // Nếu không có meeting ở state, gọi API lấy detail
    if (!meeting) {
      setLoading(true);
      // getMeetingById(id)
      //   .then(res => {
      //     setMeeting(res.data);
      //     setLoading(false);
      //   })
      //   .catch(() => setLoading(false));
    }
  }, [id, meeting]);

  if (loading || !meeting) return <div className="p-4">Loading...</div>;

  // Mapping object fields
  const topicLabel = meeting.topic?.name || "";
  const hostLabel = meeting.host?.fullName || meeting.host?.username || "";
  const branchLabel = meeting.companyBranch?.name || "";

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
          <div className="d-flex gap-2">
          {/* Nút Create Poll chỉ hiện khi WAITING_TOPIC */}
          {meeting.status === "WAITING_TOPIC" && (
            <Button
              className="px-4 py-2 rounded-3 btn-warning"
              style={{ minWidth: 110, fontWeight: 500 }}
              onClick={() => {
                // TODO: Gọi API hoặc mở modal tạo poll
              }}
            >
              <i className="bi bi-bar-chart-steps me-2"></i>
              Create Poll
            </Button>
          )}
          {/* Nút Edit luôn hiện */}
          <Button
            className="px-4 py-2 rounded-3 btn-dark-green"
            style={{ minWidth: 110, fontWeight: 500 }}
            onClick={() => navigate(`/project/edit-meeting/${id}`, { state: { meeting } })}
          >
            <i className="bi bi-pencil-square me-2"></i>
            Edit
          </Button>
        </div>
        </div>
        <h2 className="addmeeting-title mb-3">Meeting Details</h2>
        {/* FORM VIEW-ONLY */}
        <Form autoComplete="off" className="addmeeting-form-enterprise">
          <div className="addmeeting-grid-row mb-2">
            <Form.Group>
              <Form.Label className="form-label-enterprise">Meeting Title</Form.Label>
              <Form.Control
                name="meetingName"
                value={meeting.meetingName}
                readOnly
                size="sm"
                style={{ background: "#f8fafb" }}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label className="form-label-enterprise text-primary">Scheduled Date</Form.Label>
              <Form.Control
                type="text"
                name="scheduledDate"
                value={formatDateTime(meeting.scheduledDate)}
                readOnly
                size="sm"
                style={{ background: "#f8fafb" }}
              />
            </Form.Group>
          </div>
          <Form.Group className="mb-2">
            <Form.Label className="form-label-enterprise">Topic</Form.Label>
            <Form.Control
              name="topic"
              value={topicLabel}
              readOnly
              size="sm"
              style={{ background: "#f8fafb" }}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="form-label-enterprise">Host</Form.Label>
            <Form.Control
              name="host"
              value={hostLabel}
              readOnly
              size="sm"
              style={{ background: "#f8fafb" }}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="form-label-enterprise">Company Branch</Form.Label>
            <Form.Control
              name="companyBranch"
              value={branchLabel}
              readOnly
              size="sm"
              style={{ background: "#f8fafb" }}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="form-label-enterprise">Meeting URL</Form.Label>
            <Form.Control
              name="meetingLink"
              value={meeting.meetingLink}
              readOnly
              size="sm"
              style={{ background: "#f8fafb" }}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="form-label-enterprise">Status</Form.Label>
            <Form.Control
              name="status"
              value={meeting.status}
              readOnly
              size="sm"
              style={{ background: "#f8fafb" }}
            />
          </Form.Group>
          <Form.Group className="mb-2">
            <Form.Label className="form-label-enterprise">Duration (minutes)</Form.Label>
            <Form.Control
              name="duration"
              value={meeting.duration}
              readOnly
              size="sm"
              style={{ background: "#f8fafb" }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label className="form-label-enterprise">Attendance Code</Form.Label>
            <Form.Control
              name="attendanceCode"
              value={meeting.attendanceCode || ""}
              readOnly
              size="sm"
              style={{ background: "#f8fafb" }}
            />
          </Form.Group>
          <div className="d-flex justify-content-end align-items-center mt-2 gap-3">
            <Button
              className="px-4 py-2 rounded-3 btn-outline-dark-green"
              type="button"
              style={{ minWidth: 200, fontWeight: 500 }}
              onClick={() => setShowMaterial(true)}
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
        onHide={() => setShowMaterial(false)}
        files={files}
        onUpload={(e) => setFiles([...files, ...Array.from(e.target.files).map(f => ({ name: f.name }))])}
        onDelete={(idx) => setFiles(files.filter((_, i) => i !== idx))}
      />
      {/* <style>{`
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
      `}</style> */}
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />
    </div>
  );
}

export default ViewMeetingDetails;
