import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import MeetingMaterialModal from "./MeetingMaterial";
import { getMeetingById, getCheckinCode } from "../../services/opentalkManagerService";
import axios from "../../api/axiosClient.jsx";
import {getAccessToken} from "../../helper/auth.jsx";

function formatDateTime(dtStr) {
  if (!dtStr) return "";
  const d = new Date(dtStr);
  return d.toLocaleString("en-GB", { hour12: false });
}

const editableStatuses = [
  "WAITING_TOPIC",
  "WAITING_HOST_REGISTER",
  "WAITING_HOST_SELECTION",
  "UPCOMING",
  "ONGOING"
];

function ViewMeetingDetails() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const[error, setError] = useState(null);

  // Lấy meeting từ navigate state nếu có
  const meetingFromState = location.state?.meeting;

  // State cho meeting detail (nếu reload hoặc vào trực tiếp từ URL)
  const [meeting, setMeeting] = useState(meetingFromState || null);
  const [loading, setLoading] = useState(!meetingFromState);

  // State cho Attendance Code động
  const [attendanceCode, setAttendanceCode] = useState(meetingFromState?.attendanceCode || "");
  const [attendanceCodeLoading, setAttendanceCodeLoading] = useState(false);

  // Meeting material (UI only)
  const [showMaterial, setShowMaterial] = useState(false);
  const [files, setFiles] = useState([]);

  // Khi vào trang, fetch detail nếu cần
  useEffect(() => {
    if (!meeting) {
      setLoading(true);
      getMeetingById(id)
        .then(res => {
          setMeeting(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id, meeting]);

  // Khi meeting thay đổi hoặc vừa fetch xong, handle attendance code
  useEffect(() => {
    if (!loading && meeting) {
      if (meeting.status === "ONGOING") {
        setAttendanceCodeLoading(true);
        getCheckinCode(meeting.id)
          .then(res => {
            if (res.data && res.data.checkinCode && res.data.expiresAt) {
              const expiresAt = new Date(res.data.expiresAt).getTime();
              if (expiresAt > Date.now()) {
                setAttendanceCode(res.data.checkinCode);
              } else {
                setAttendanceCode("");
              }
            } else {
              setAttendanceCode("");
            }
          })
          .catch(() => setAttendanceCode(""))
          .finally(() => setAttendanceCodeLoading(false));
      } else {
        setAttendanceCode(meeting.attendanceCode || "");
        setAttendanceCodeLoading(false);
      }
    }
  }, [loading, meeting]);

  if (loading || !meeting) return <div className="p-4">Loading...</div>;

  // Mapping object fields
  const topicLabel = meeting.topic?.title || "";
  const hostLabel = meeting.host?.fullName || meeting.host?.username || "";
  const branchLabel = meeting.companyBranch?.name || "";



  const handleCreatePoll = async (id) => {
    try {
      console.log(id);
      navigate(`/poll/create/${id}`);
      await axios.post(`/poll/${id}`,
          { headers: { Authorization: `Bearer ${getAccessToken()}` }},
      );

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

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
              onClick={() => {handleCreatePoll(id)}}
            >
              <i className="bi bi-bar-chart-steps me-2"></i>
              Create Poll
            </Button>
          )}
          {/* Nút Edit luôn hiện */}
          {editableStatuses.includes(meeting.status) && (
            <Button
              className="px-4 py-2 rounded-3 btn-dark-green"
              style={{ minWidth: 110, fontWeight: 500 }}
              onClick={() => navigate(`/meeting/edit-meeting/${id}`, { state: { meeting } })}
            >
              <i className="bi bi-pencil-square me-2"></i>
              Edit
            </Button>
          )}
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
              value={attendanceCodeLoading ? "Loading..." : (attendanceCode || "")}
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
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />
    </div>
  );
}

export default ViewMeetingDetails;
