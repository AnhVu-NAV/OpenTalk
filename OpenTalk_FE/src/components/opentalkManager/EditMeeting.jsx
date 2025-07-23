import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { Button, Form, Modal } from "react-bootstrap";
import MeetingMaterialModal from "./MeetingMaterial";
import {
  updateMeeting,
  getMeetingById,
  getCompanyBranches,
  generateCheckinCode,
  getCheckinCode,
} from "../../services/opentalkManagerService";
import SuccessDialog from "./SuccessModal";

const statusOptions = [
  "WAITING_TOPIC",
  "WAITING_HOST_REGISTER",
  "WAITING_HOST_SELECTION",
  "UPCOMING",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
  "POSTPONED"
];

function EditMeeting() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const meetingFromState = location.state?.meeting;

  // Form state
  const [form, setForm] = useState(null);
  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);

  // Attendance code state
  const [showExpireModal, setShowExpireModal] = useState(false);
  const [expireMinutes, setExpireMinutes] = useState(15);
  const [genCodeLoading, setGenCodeLoading] = useState(false);
  const [attendanceCodeInfo, setAttendanceCodeInfo] = useState({ code: "", expiresAt: "" });
  const [attendanceCodeLoading, setAttendanceCodeLoading] = useState(true);

  const codeTimeout = useRef(null);

  // Material files (UI only, không gửi backend)
  const [showMaterial, setShowMaterial] = useState(false);
  const [files, setFiles] = useState([]);

  // Topic, host giữ nguyên (mock)
  const topics = [];
  const hosts = [];

  // --- Attendance code: Fetch & setup auto-clear ---
  const fetchAttendanceCode = useCallback(async () => {
    setAttendanceCodeLoading(true);
    try {
      const res = await getCheckinCode(id);
      const data = res.data;
      if (data?.checkinCode && data?.expiresAt) {
        setAttendanceCodeInfo({
          code: data.checkinCode,
          expiresAt: data.expiresAt,
        });
        setupExpireTimeout(data.expiresAt);
      } else {
        setAttendanceCodeInfo({ code: "", expiresAt: "" });
      }
    } catch {
      setAttendanceCodeInfo({ code: "", expiresAt: "" });
    } finally {
      setAttendanceCodeLoading(false);
    }
  }, [id]);

  const setupExpireTimeout = (expiresAtStr) => {
    if (codeTimeout.current) clearTimeout(codeTimeout.current);
    if (!expiresAtStr) return;
    const expiresAt = new Date(expiresAtStr).getTime();
    const now = Date.now();
    const ms = expiresAt - now;
    if (ms > 0) {
      codeTimeout.current = setTimeout(() => {
        setAttendanceCodeInfo({ code: "", expiresAt: "" });
      }, ms);
    } else {
      setAttendanceCodeInfo({ code: "", expiresAt: "" });
    }
  };

  // Fetch form + attendance code khi vào trang
  useEffect(() => {
    let didCancel = false;
    async function fetchData() {
      let meetingObj = meetingFromState;
      if (!meetingObj) {
        const res = await getMeetingById(id);
        meetingObj = res.data;
      }
      setForm({
        ...meetingObj,
        topic: meetingObj.topic?.id || "",
        host: meetingObj.host?.id || "",
        companyBranch: meetingObj.companyBranch?.id || "",
        scheduledDate: meetingObj.scheduledDate?.slice(0, 16),
        attendanceCode: meetingObj.attendanceCode || "",
        duration: meetingObj.duration || "",
      });
      if (!didCancel) fetchAttendanceCode();
    }
    fetchData();

    return () => {
      didCancel = true;
      if (codeTimeout.current) clearTimeout(codeTimeout.current);
    };
  }, [id, meetingFromState, fetchAttendanceCode]);

  // Fetch branch list
  useEffect(() => {
    setBranchesLoading(true);
    getCompanyBranches()
      .then(res => setBranches(res.data || []))
      .catch(() => setBranches([]))
      .finally(() => setBranchesLoading(false));
  }, []);

  // Khi generate code, show modal
  const handleGenerateCode = () => setShowExpireModal(true);

  // Khi xác nhận generate, gọi API generate xong gọi lại GET để update UI
  const handleConfirmGenerate = async () => {
    setGenCodeLoading(true);
    try {
      await generateCheckinCode(id, expireMinutes);
      await fetchAttendanceCode();
      setShowExpireModal(false);
    } catch {
      alert("Failed to generate code.");
    } finally {
      setGenCodeLoading(false);
    }
  };

  // Xử lý form change
  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  // Material
  const handleFileChange = (e) => {
    const filesArr = Array.from(e.target.files).map(file => ({ name: file.name }));
    setFiles(prev => [...prev, ...filesArr]);
  };
  const handleDeleteFile = (idx) => setFiles(prev => prev.filter((_, i) => i !== idx));
  const handleShowMaterial = () => setShowMaterial(true);
  const handleCloseMaterial = () => setShowMaterial(false);

  // Submit update
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
      await updateMeeting(id, meetingData);
      setShowSuccess(true);
    } catch (err) {
      console.error("Error updating meeting:", err);
    }
  };
  const handleSuccessClose = () => {
    setShowSuccess(false);
    navigate("/opentalk/manager");
  };

  if (!form) return <div className="p-4">Loading...</div>;

  return (
    <div className="addmeeting-bg-enterprise">
      <div className="addmeeting-container py-3">
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
        <h2 className="addmeeting-title mb-3">Edit Meeting</h2>
        <Form onSubmit={handleSubmit} autoComplete="off" className="addmeeting-form-enterprise">
          {/* Row: Meeting Title + Scheduled Date */}
          <div className="addmeeting-grid-row mb-2">
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
              {statusOptions.map(stt => (
                <option key={stt} value={stt}>{stt}</option>
              ))}
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
          {/* Attendance Code */}
          <Form.Group className="mb-3">
          <Form.Label className="form-label-enterprise">Attendance Code</Form.Label>
          <Form.Control
            type="text"
            value={attendanceCodeLoading ? "Loading..." : attendanceCodeInfo.code}
            readOnly
            isInvalid={attendanceCodeLoading}
          />
          {/* Hiển thị ngày hết hạn nếu có */}
          {attendanceCodeInfo.expiresAt && attendanceCodeInfo.code && !attendanceCodeLoading && (
            <div className="text-muted mt-1" style={{ fontSize: 13 }}>
              Expire at: <b>{new Date(attendanceCodeInfo.expiresAt).toLocaleString()}</b>
            </div>
          )}

          {/* Phần Generate chỉ xuất hiện khi ONGOING */}
          {form.status === "ONGOING" && (
            <div className="gen-attendance-card mt-2 d-flex align-items-center justify-content-between">
              <div style={{ width: "100%" }}>
                <div className="fw-semibold" style={{ color: "#18926e", fontSize: 16 }}>
                  <i className="bi bi-magic me-2"></i>
                  Generating Attendance Code
                </div>
                <div className="text-muted" style={{ fontSize: 13 }}>
                  Generate a unique code for this meeting. Click the button to auto-generate.
                </div>
              </div>
              <Button
                size="sm"
                className="btn-gen-code"
                type="button"
                onClick={handleGenerateCode}
                style={{ minHeight: 44, minWidth: 120 }}
                disabled={attendanceCodeLoading || genCodeLoading}
              >
                <i className="bi bi-lightning-charge-fill me-1"></i> {genCodeLoading ? "Generating..." : "Generate"}
              </Button>
            </div>
          )}
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
        {/* Modal chọn expire */}
        <Modal show={showExpireModal} onHide={() => setShowExpireModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Set Expiry Time</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>Valid Minutes</Form.Label>
              <Form.Control
                type="number"
                min={1}
                max={120}
                value={expireMinutes}
                onChange={e => setExpireMinutes(Number(e.target.value))}
                disabled={genCodeLoading}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowExpireModal(false)} disabled={genCodeLoading}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleConfirmGenerate} disabled={genCodeLoading}>
              {genCodeLoading ? "Generating..." : "Confirm"}
            </Button>
          </Modal.Footer>
        </Modal>
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
        message="Meeting updated successfully!"
      />
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
      />
    </div>
  );
}

export default EditMeeting;
