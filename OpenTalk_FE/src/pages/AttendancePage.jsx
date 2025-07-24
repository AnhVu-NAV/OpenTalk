import { useState, useEffect } from "react"
import { FaUsers, FaCheck } from "react-icons/fa"
import styles from "./styles/module/AttendancePage.module.css"
import SuccessToast from "../components/SuccessToast/SuccessToast.jsx"
import { getCurrentUser } from "../helper/auth.jsx"
import { getRecentMeetingsWithStatus, submitCheckin } from "../api/apiList.jsx"

const AttendancePage = () => {
  const [sessions, setSessions] = useState([])
  const [attendanceCode, setAttendanceCode] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [toastType, setToastType] = useState("success")

  const showToast = (message, type = "success") => {
    setToastMessage(message)
    setToastType(type)
    setToastVisible(true)
  }

  useEffect(() => {
    const fetchRecentMeetings = async () => {
      const user = getCurrentUser()
      if (!user) return

      try {
        const recent = await getRecentMeetingsWithStatus(user.id, user.companyBranch.id)
        setSessions(recent)
      } catch (err) {
        console.error("Failed to fetch recent meetings", err)
      }
    }

    fetchRecentMeetings()
  }, [])

  const handleSubmitAttendance = async () => {
    if (!attendanceCode.trim()) {
      showToast("Please enter attendance code", "error")
      return
    }

    if (attendanceCode.trim().length < 6) {
      showToast("Attendance code must be at least 6 characters", "error")
      return
    }

    const currentUser = getCurrentUser()
    if (!currentUser || !currentUser.id) {
      showToast("User not logged in", "error")
      return
    }

    try {
      setSubmitting(true)
      const result = await submitCheckin(currentUser.id, attendanceCode.trim())

      if (result === "SUCCESS") {
        showToast("Check-in successful!", "success")
        setAttendanceCode("")
      } else {
        showToast("Unexpected response from server", "error")
      }
    } catch (error) {
      const message = error?.response?.data?.message || "Check-in failed"
      if (message.includes("INVALID_OR_EXPIRED_CODE")) {
        showToast("Invalid or expired code", "error")
      } else if (message.includes("USER HAS ALREADY CHECKED IN")) {
        showToast("You have already checked in", "error")
      } else if (message.includes("USER_NOT_FOUND")) {
        showToast("User not found", "error")
      } else if (message.includes("MEETING_NOT_FOUND")) {
        showToast("Session not found", "error")
      } else {
        showToast(message, "error")
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
      <div className={styles.attendancePage}>
        <div className={styles.attendanceBackground}>
          <div className={styles.backgroundPattern}></div>
        </div>

        <div className={styles.attendanceContainer}>
          <div className={styles.attendanceCard}>
            <div className={styles.attendanceHeader}>
              <div className={styles.headerIcon}>
                <FaUsers />
              </div>
              <h1 className={styles.attendanceTitle}>OpenTalk Attendance</h1>
              <p className={styles.attendanceSubtitle}>Confirm your participation</p>
            </div>

            <div className={styles.formSection}>
              <label className={styles.formLabel}>Attendance Code</label>
              <div className={styles.codeInputContainer}>
                <input
                    type="text"
                    className={styles.codeInput}
                    placeholder="e.g. OTP2020507"
                    value={attendanceCode}
                    onChange={(e) => setAttendanceCode(e.target.value.toUpperCase())}
                    maxLength={20}
                />
              </div>
            </div>

            <button
                className={`${styles.submitButton} ${submitting ? styles.submitting : ""}`}
                onClick={handleSubmitAttendance}
                disabled={submitting || !attendanceCode.trim()}
            >
              {submitting ? (
                  <>
                    <div className={styles.submitSpinner}></div>
                    <span>Submitting...</span>
                  </>
              ) : (
                  <>
                    <FaCheck />
                    <span>Submit Attendance</span>
                  </>
              )}
            </button>

            <div className={styles.infoSection}>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>💡</div>
                <p>The attendance code will be announced during the session</p>
              </div>
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>⏰</div>
                <p>Attendance is only valid during the session time</p>
              </div>
            </div>
          </div>

          <div className={styles.recentSessions}>
            <h3 className={styles.recentTitle}>Recent Sessions</h3>
            <div className={styles.sessionsList}>
              {sessions.map((session) => (
                  <div key={session.id} className={styles.sessionItem}>
                    <div className={styles.sessionInfo}>
                      <h4>{session.title}</h4>
                      <p>
                        {new Date(session.scheduledDate).toLocaleDateString("en-GB")} - {session.time}
                      </p>
                    </div>
                    <div className={styles.sessionStatus}>
                  <span className={`${styles.statusBadge} ${session.attended ? styles.completed : styles.pending}`}>
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
  )
}

export default AttendancePage
