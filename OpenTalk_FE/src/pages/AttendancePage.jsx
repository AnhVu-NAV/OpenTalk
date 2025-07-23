import { useState, useEffect } from "react";
import { FaUsers, FaCalendarAlt, FaQrcode, FaCheck } from "react-icons/fa";
import "./styles/AttendancePage.css";
import SuccessToast from "../components/SuccessToast/SuccessToast.jsx";
import { getCurrentUser } from "../helper/auth.jsx";
import { getRecentMeetingsWithStatus, submitCheckin } from "../api/apiList.jsx";


const AttendancePage = () => {
  const [sessions, setSessions] = useState([]);
  const [attendanceCode, setAttendanceCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");

  const showToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);
  };

  useEffect(() => {
    const fetchRecentMeetings = async () => {
      const user = getCurrentUser();
      if (!user) return;

      try {
        const recent = await getRecentMeetingsWithStatus(
          user.id,
          user.companyBranch.id
        );
        setSessions(recent);
      } catch (err) {
        console.error("Failed to fetch recent meetings", err);
      }
    };

    fetchRecentMeetings();
  }, []);

  const handleSubmitAttendance = async () => {
    if (!attendanceCode.trim()) {
      showToast("Please enter attendance code", "error");
      return;
    }

    if (attendanceCode.trim().length < 6) {
      showToast("Attendance code must be at least 6 characters", "error");
      return;
    }

    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.id) {
      showToast("User not logged in", "error");
      return;
    }

    try {
      setSubmitting(true);
      const result = await submitCheckin(currentUser.id, attendanceCode.trim());

      if (result === "SUCCESS") {
        showToast("Check-in successful!", "success");
        setAttendanceCode("");
      } else {
        showToast("Unexpected response from server", "error");
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Check-in failed";
      if (message.includes("INVALID_OR_EXPIRED_CODE")) {
        showToast("Invalid or expired code", "error");
      } else if (message.includes("USER HAS ALREADY CHECKED IN")) {
        showToast("You have already checked in", "error");
      } else if (message.includes("USER_NOT_FOUND")) {
        showToast("User not found", "error");
      } else if (message.includes("MEETING_NOT_FOUND")) {
        showToast("Session not found", "error");
      } else {
        showToast(message, "error");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="attendance-page">
      <div className="attendance-background">
        <div className="background-pattern"></div>
      </div>

      <div className="attendance-container">
        <div className="attendance-card">
          <div className="attendance-header">
            <div className="header-icon">
              <FaUsers />
            </div>
            <h1 className="attendance-title">OpenTalk Attendance</h1>
            <p className="attendance-subtitle">Confirm your participation</p>
          </div>

          <div className="form-section">
            <label className="form-label">Attendance Code</label>
            <div className="code-input-container">
              <input
                type="text"
                className="code-input"
                placeholder="e.g. OTP2020507"
                value={attendanceCode}
                onChange={(e) =>
                  setAttendanceCode(e.target.value.toUpperCase())
                }
                maxLength={20}
              />
            </div>
          </div>

          <button
            className={`submit-button ${submitting ? "submitting" : ""}`}
            onClick={handleSubmitAttendance}
            disabled={submitting || !attendanceCode.trim()}
          >
            {submitting ? (
              <>
                <div className="submit-spinner"></div>
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <FaCheck />
                <span>Submit Attendance</span>
              </>
            )}
          </button>

          <div className="info-section">
            <div className="info-item">
              <div className="info-icon">💡</div>
              <p>The attendance code will be announced during the session</p>
            </div>
            <div className="info-item">
              <div className="info-icon">⏰</div>
              <p>Attendance is only valid during the session time</p>
            </div>
          </div>
        </div>

        <div className="recent-sessions">
          <h3 className="recent-title">Recent Sessions</h3>
          <div className="sessions-list">
            {sessions.map((session) => (
              <div key={session.id} className="session-item">
                <div className="session-info">
                  <h4>{session.title}</h4>
                  <p>
                    {new Date(session.scheduledDate).toLocaleDateString(
                      "en-GB"
                    )}{" "}
                    - {session.time}
                  </p>
                </div>
                <div className="session-status">
                  <span
                    className={`status-badge ${
                      session.attended ? "completed" : "pending"
                    }`}
                  >
                    {session.attended ? "Attended" : "Not attended"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SuccessToast
        message={toastMessage}
        isVisible={toastVisible}
        type={toastType}
        onClose={() => setToastVisible(false)}
      />
    </div>
  );
};

export default AttendancePage;
