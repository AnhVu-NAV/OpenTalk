import { useEffect, useState, useRef, useCallback } from "react"
import { useNavigate, useParams, useLocation } from "react-router-dom"
import MeetingMaterialModal from "./MeetingMaterial"
import {
  updateMeeting,
  getMeetingById,
  getCompanyBranches,
  generateCheckinCode,
  getCheckinCode,
  getTopics,
  autoSelectHost,
} from "../../services/opentalkManagerService"
import SuccessDialog from "./SuccessModal"
import styles from "./EditMeeting.module.css"

const statusOptions = [
  "WAITING_TOPIC",
  "WAITING_HOST_REGISTER",
  "WAITING_HOST_SELECTION",
  "UPCOMING",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
  "POSTPONED",
]

function EditMeeting() {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()
  const meetingFromState = location.state?.meeting

  // Form state
  const [form, setForm] = useState(null)
  const [branches, setBranches] = useState([])
  const [branchesLoading, setBranchesLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)

  // Attendance code state
  const [showExpireModal, setShowExpireModal] = useState(false)
  const [expireMinutes, setExpireMinutes] = useState(15)
  const [genCodeLoading, setGenCodeLoading] = useState(false)
  const [attendanceCodeInfo, setAttendanceCodeInfo] = useState({ code: "", expiresAt: "" })
  const [attendanceCodeLoading, setAttendanceCodeLoading] = useState(true)
  const [topicEditable, setTopicEditable] = useState(false)
  const [topics, setTopics] = useState([])
  const [topicsLoading, setTopicsLoading] = useState(false)
  const [autoHostInfo, setAutoHostInfo] = useState(null)
  const [autoHostLoading, setAutoHostLoading] = useState(false)

  const codeTimeout = useRef(null)

  // Material files (UI only, không gửi backend)
  const [showMaterial, setShowMaterial] = useState(false)
  const [files, setFiles] = useState([])

  const [hosts, setHosts] = useState([])

  // --- Attendance code: Fetch & setup auto-clear ---
  const fetchAttendanceCode = useCallback(async () => {
    setAttendanceCodeLoading(true)
    try {
      const res = await getCheckinCode(id)
      const data = res.data
      if (data?.checkinCode && data?.expiresAt) {
        setAttendanceCodeInfo({
          code: data.checkinCode,
          expiresAt: data.expiresAt,
        })
        setupExpireTimeout(data.expiresAt)
      } else {
        setAttendanceCodeInfo({ code: "", expiresAt: "" })
      }
    } catch {
      setAttendanceCodeInfo({ code: "", expiresAt: "" })
    } finally {
      setAttendanceCodeLoading(false)
    }
  }, [id])

  const handleAutoChooseHost = async () => {
    setAutoHostLoading(true)
    setAutoHostInfo(null)
    try {
      const res = await autoSelectHost(id)
      const host = res.data
      setForm((prev) => ({
        ...prev,
        host: host.id,
      }))
      if (!hosts.some((u) => u.id === host.id)) {
        setHosts((prev) => [...prev, host])
      }
    } catch (err) {
      setAutoHostInfo("No host found or error occurred!")
    } finally {
      setAutoHostLoading(false)
    }
  }

  const setupExpireTimeout = (expiresAtStr) => {
    if (codeTimeout.current) clearTimeout(codeTimeout.current)
    if (!expiresAtStr) return
    const expiresAt = new Date(expiresAtStr).getTime()
    const now = Date.now()
    const ms = expiresAt - now
    if (ms > 0) {
      codeTimeout.current = setTimeout(() => {
        setAttendanceCodeInfo({ code: "", expiresAt: "" })
      }, ms)
    } else {
      setAttendanceCodeInfo({ code: "", expiresAt: "" })
    }
  }

  // Fetch form + attendance code khi vào trang
  useEffect(() => {
    let didCancel = false
    async function fetchData() {
      let meetingObj = meetingFromState
      if (!meetingObj) {
        const res = await getMeetingById(id)
        meetingObj = res.data
      }
      setForm({
        ...meetingObj,
        topic: meetingObj.topic?.id || "",
        host: meetingObj.host?.id || "",
        companyBranch: meetingObj.companyBranch?.id || "",
        scheduledDate: meetingObj.scheduledDate?.slice(0, 16),
        attendanceCode: meetingObj.attendanceCode || "",
        duration: meetingObj.duration || "",
      })
      if (!didCancel) fetchAttendanceCode()
    }
    fetchData()

    return () => {
      didCancel = true
      if (codeTimeout.current) clearTimeout(codeTimeout.current)
    }
  }, [id, meetingFromState, fetchAttendanceCode])

  // Fetch branch list
  useEffect(() => {
    setBranchesLoading(true)
    getCompanyBranches()
        .then((res) => setBranches(res.data || []))
        .catch(() => setBranches([]))
        .finally(() => setBranchesLoading(false))
  }, [])

  // Khi generate code, show modal
  const handleGenerateCode = () => setShowExpireModal(true)

  const handleManualChooseTopic = async () => {
    setTopicEditable(true)
    setTopicsLoading(true)
    try {
      const res = await getTopics({ status: "approved" })
      setTopics(res.data.content || [])
    } catch (err) {
      setTopics([])
    } finally {
      setTopicsLoading(false)
    }
  }

  // Khi xác nhận generate, gọi API generate xong gọi lại GET để update UI
  const handleConfirmGenerate = async () => {
    setGenCodeLoading(true)
    try {
      await generateCheckinCode(id, expireMinutes)
      await fetchAttendanceCode()
      setShowExpireModal(false)
    } catch {
      alert("Failed to generate code.")
    } finally {
      setGenCodeLoading(false)
    }
  }

  // Xử lý form change
  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  // Material
  const handleFileChange = (e) => {
    const filesArr = Array.from(e.target.files).map((file) => ({ name: file.name }))
    setFiles((prev) => [...prev, ...filesArr])
  }
  const handleDeleteFile = (idx) => setFiles((prev) => prev.filter((_, i) => i !== idx))
  const handleShowMaterial = () => setShowMaterial(true)
  const handleCloseMaterial = () => setShowMaterial(false)

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault()
    const meetingData = {
      meetingName: form.meetingName,
      scheduledDate: form.scheduledDate,
      meetingLink: form.meetingLink,
      status: form.status,
      topic: form.topic ? { id: form.topic } : null,
      host: form.host ? { id: form.host } : null,
      duration: form.duration ? Number.parseFloat(form.duration) : null,
      companyBranch: form.companyBranch ? { id: form.companyBranch } : null,
      // attendanceCode và files KHÔNG gửi backend
    }
    try {
      await updateMeeting(id, meetingData)
      setShowSuccess(true)
    } catch (err) {
      console.error("Error updating meeting:", err)
    }
  }
  const handleSuccessClose = () => {
    setShowSuccess(false)
    navigate("/opentalk/manager")
  }

  if (!form) return <div className={styles.container}>Loading...</div>

  return (
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.backSection} onClick={() => navigate(-1)}>
            <span className={styles.backArrow}>←</span>
            <span className={styles.backText}>Back</span>
          </div>

          <h2 className={styles.title}>Edit Meeting</h2>

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Row: Meeting Title + Scheduled Date */}
            <div className={styles.gridRow}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Meeting Title</label>
                <input
                    name="meetingName"
                    value={form.meetingName}
                    onChange={handleChange}
                    placeholder="Enter meeting title"
                    required
                    className={styles.formControl}
                />
              </div>
              <div className={styles.formGroup}>
                <label className={`${styles.formLabel} ${styles.primary}`}>Scheduled Date</label>
                <input
                    type="datetime-local"
                    name="scheduledDate"
                    value={form.scheduledDate}
                    onChange={handleChange}
                    required
                    className={styles.formControl}
                />
              </div>
            </div>

            {/* Topic */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Topic</label>
              <select
                  name="topic"
                  value={form.topic}
                  onChange={handleChange}
                  required
                  disabled={!topicEditable || topicsLoading}
                  className={styles.formSelect}
              >
                {!topicEditable && form.topic && (
                    <option value={form.topic}>{meetingFromState?.topic?.title || "Current Topic"}</option>
                )}
                {topicEditable ? (
                    <>
                      <option value="">-- Select Topic --</option>
                      {topics.map((topic) => (
                          <option key={topic.id} value={topic.id}>
                            {topic.title}
                          </option>
                      ))}
                    </>
                ) : (
                    !form.topic && <option value="">-- Topic will be assigned later --</option>
                )}
              </select>
              {!topicEditable && !form.topic && (
                  <button type="button" className={styles.manualButton} onClick={handleManualChooseTopic}>
                    ✏️ Manual Choose Topic
                  </button>
              )}
              {topicsLoading && topicEditable && <div className={styles.loadingText}>Loading topics...</div>}
            </div>

            {/* Host */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Host</label>
              <input
                  type="text"
                  value={
                      hosts.find((u) => u.id === form.host)?.fullName || hosts.find((u) => u.id === form.host)?.username || ""
                  }
                  readOnly
                  disabled
                  className={styles.formControl}
                  placeholder="-- Host will be assigned automatically --"
              />
              <button
                  type="button"
                  className={styles.autoButton}
                  onClick={handleAutoChooseHost}
                  disabled={autoHostLoading}
              >
                🔄 {autoHostLoading ? "Selecting..." : "Automatically Choose Host"}
              </button>
            </div>

            {/* Company Branch */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Company Branch</label>
              <select
                  name="companyBranch"
                  value={form.companyBranch}
                  onChange={handleChange}
                  required
                  disabled={branchesLoading}
                  className={styles.formSelect}
              >
                <option value="">-- Select Branch --</option>
                {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                ))}
              </select>
            </div>

            {/* Meeting URL */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Meeting URL</label>
              <input
                  name="meetingLink"
                  value={form.meetingLink}
                  onChange={handleChange}
                  placeholder="Enter meeting URL"
                  className={styles.formControl}
              />
            </div>

            {/* Status */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Status</label>
              <select name="status" value={form.status} onChange={handleChange} className={styles.formSelect} required>
                <option value="">-- Select Status --</option>
                {statusOptions.map((stt) => (
                    <option key={stt} value={stt}>
                      {stt}
                    </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Duration (hours)</label>
              <input
                  name="duration"
                  type="number"
                  min={1}
                  value={form.duration}
                  onChange={handleChange}
                  placeholder="Enter duration (minutes)"
                  required
                  className={styles.formControl}
              />
            </div>

            {/* Attendance Code */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Attendance Code</label>
              <input
                  type="text"
                  value={attendanceCodeLoading ? "Loading..." : attendanceCodeInfo.code}
                  readOnly
                  className={styles.formControl}
              />
              {/* Hiển thị ngày hết hạn nếu có */}
              {attendanceCodeInfo.expiresAt && attendanceCodeInfo.code && !attendanceCodeLoading && (
                  <div className={styles.expireInfo}>
                    Expire at: <b>{new Date(attendanceCodeInfo.expiresAt).toLocaleString()}</b>
                  </div>
              )}

              {/* Phần Generate chỉ xuất hiện khi ONGOING */}
              {form.status === "ONGOING" && (
                  <div className={styles.attendanceSection}>
                    <div className={styles.attendanceHeader}>
                      <div className={styles.attendanceInfo}>
                        <div className={styles.attendanceTitle}>⚡ Generating Attendance Code</div>
                        <div className={styles.attendanceSubtitle}>
                          Generate a unique code for this meeting. Click the button to auto-generate.
                        </div>
                      </div>
                      <button
                          type="button"
                          className={styles.generateButton}
                          onClick={handleGenerateCode}
                          disabled={attendanceCodeLoading || genCodeLoading}
                      >
                        ⚡ {genCodeLoading ? "Generating..." : "Generate"}
                      </button>
                    </div>
                  </div>
              )}
            </div>

            {/* Action buttons */}
            <div className={styles.actionSection}>
              <button className={styles.saveButton} type="submit">
                Save
              </button>
              <button className={styles.materialButton} type="button" onClick={handleShowMaterial}>
                📁 Manage Meeting Material
              </button>
            </div>
          </form>
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
      </div>
  )
}

export default EditMeeting
