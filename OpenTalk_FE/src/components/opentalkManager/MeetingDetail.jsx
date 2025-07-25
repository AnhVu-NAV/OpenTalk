import { useEffect, useState } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import MeetingMaterialModal from "./MeetingMaterial"
import { getMeetingById, getCheckinCode } from "../../services/opentalkManagerService"
import axios from "../../api/axiosClient.jsx"
import { getAccessToken } from "../../helper/auth.jsx"
import styles from "./MeetingDetail.module.css"

function formatDateTime(dtStr) {
  if (!dtStr) return ""
  const d = new Date(dtStr)
  return d.toLocaleString("en-GB", { hour12: false })
}

const editableStatuses = ["WAITING_TOPIC", "WAITING_HOST_REGISTER", "WAITING_HOST_SELECTION", "UPCOMING", "ONGOING"]

function ViewMeetingDetails() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const [error, setError] = useState(null)

  // Lấy meeting từ navigate state nếu có
  const meetingFromState = location.state?.meeting

  // State cho meeting detail (nếu reload hoặc vào trực tiếp từ URL)
  const [meeting, setMeeting] = useState(meetingFromState || null)
  const [loading, setLoading] = useState(!meetingFromState)

  // State cho Attendance Code động
  const [attendanceCode, setAttendanceCode] = useState(meetingFromState?.attendanceCode || "")
  const [attendanceCodeLoading, setAttendanceCodeLoading] = useState(false)

  // Meeting material (UI only)
  const [showMaterial, setShowMaterial] = useState(false)
  const [files, setFiles] = useState([])

  // Khi vào trang, fetch detail nếu cần
  useEffect(() => {
    if (!meeting) {
      setLoading(true)
      getMeetingById(id)
          .then((res) => {
            setMeeting(res.data)
            setLoading(false)
          })
          .catch(() => setLoading(false))
    }
  }, [id, meeting])

  // Khi meeting thay đổi hoặc vừa fetch xong, handle attendance code
  useEffect(() => {
    if (!loading && meeting) {
      if (meeting.status === "ONGOING") {
        setAttendanceCodeLoading(true)
        getCheckinCode(meeting.id)
            .then((res) => {
              if (res.data && res.data.checkinCode && res.data.expiresAt) {
                const expiresAt = new Date(res.data.expiresAt).getTime()
                if (expiresAt > Date.now()) {
                  setAttendanceCode(res.data.checkinCode)
                } else {
                  setAttendanceCode("")
                }
              } else {
                setAttendanceCode("")
              }
            })
            .catch(() => setAttendanceCode(""))
            .finally(() => setAttendanceCodeLoading(false))
      } else {
        setAttendanceCode(meeting.attendanceCode || "")
        setAttendanceCodeLoading(false)
      }
    }
  }, [loading, meeting])

  if (loading || !meeting) return <div className={styles.container}>Loading...</div>

  // Mapping object fields
  const topicLabel = meeting.topic?.title || ""
  const hostLabel = meeting.host?.fullName || meeting.host?.username || ""
  const branchLabel = meeting.companyBranch?.name || ""

  const handleCreatePoll = async (id) => {
    try {
      console.log(id)
      navigate(`/poll/create/${id}`)
      await axios.post(`/poll/${id}`, { headers: { Authorization: `Bearer ${getAccessToken()}` } })
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }

  return (
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          {/* BACK + TITLE + EDIT */}
          <div className={styles.headerSection}>
            <div className={styles.backSection} onClick={() => navigate(-1)}>
              <span className={styles.backArrow}>←</span>
              <span className={styles.backText}>Back</span>
            </div>
            <div className={styles.actionButtons}>
              {/* Nút Create Poll chỉ hiện khi WAITING_TOPIC */}
              {meeting.status === "WAITING_TOPIC" && (
                  <button
                      className={`${styles.actionButton} ${styles.pollButton}`}
                      onClick={() => {
                        handleCreatePoll(id)
                      }}
                  >
                    📊 Create Poll
                  </button>
              )}
              {/* Nút Edit luôn hiện */}
              {editableStatuses.includes(meeting.status) && (
                  <button
                      className={`${styles.actionButton} ${styles.editButton}`}
                      onClick={() => navigate(`/meeting/edit-meeting/${id}`, { state: { meeting } })}
                  >
                    ✏️ Edit
                  </button>
              )}
            </div>
          </div>

          <h2 className={styles.title}>Meeting Details</h2>

          {/* FORM VIEW-ONLY */}
          <form className={styles.form}>
            <div className={styles.gridRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Meeting Title</label>
                <input name="meetingName" value={meeting.meetingName} readOnly className={styles.formControl} />
              </div>
              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.primary}`}>Scheduled Date</label>
                <input
                    type="text"
                    name="scheduledDate"
                    value={formatDateTime(meeting.scheduledDate)}
                    readOnly
                    className={styles.formControl}
                />
              </div>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Topic</label>
              <input name="topic" value={topicLabel} readOnly className={styles.formControl} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Host</label>
              <input name="host" value={hostLabel} readOnly className={styles.formControl} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Company Branch</label>
              <input name="companyBranch" value={branchLabel} readOnly className={styles.formControl} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Meeting URL</label>
              <input name="meetingLink" value={meeting.meetingLink} readOnly className={styles.formControl} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Status</label>
              <input name="status" value={meeting.status} readOnly className={styles.formControl} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Duration (minutes)</label>
              <input name="duration" value={meeting.duration} readOnly className={styles.formControl} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Attendance Code</label>
              <input
                  name="attendanceCode"
                  value={attendanceCodeLoading ? "Loading..." : attendanceCode || ""}
                  readOnly
                  className={styles.formControl}
              />
            </div>
            <div className={styles.materialSection}>
              <button className={styles.materialButton} type="button" onClick={() => setShowMaterial(true)}>
                📁 Manage Meeting Material
              </button>
            </div>
          </form>
        </div>

        {/* MeetingMaterialModal popup */}
        <MeetingMaterialModal
            show={showMaterial}
            onHide={() => setShowMaterial(false)}
            files={files}
            onUpload={(e) => setFiles([...files, ...Array.from(e.target.files).map((f) => ({ name: f.name }))])}
            onDelete={(idx) => setFiles(files.filter((_, i) => i !== idx))}
        />
      </div>
  )
}

export default ViewMeetingDetails
