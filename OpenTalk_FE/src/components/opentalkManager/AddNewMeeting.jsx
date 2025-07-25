import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import MeetingMaterialModal from "./MeetingMaterial"
import { createMeeting, getCompanyBranches, getTopics } from "../../services/opentalkManagerService"
import SuccessDialog from "./SuccessModal"
import styles from "./AddNewMeeting.module.css"

function AddMeeting() {
  const [form, setForm] = useState({
    meetingName: "",
    scheduledDate: "",
    meetingLink: "",
    status: "WAITING_TOPIC", // Luôn mặc định WAITING_TOPIC
    topic: "",
    host: "",
    duration: "",
    companyBranch: "",
    attendanceCode: "",
  })

  const [showMaterial, setShowMaterial] = useState(false)
  const [files, setFiles] = useState([])
  const [branches, setBranches] = useState([])
  const [branchesLoading, setBranchesLoading] = useState(true)
  const [showSuccess, setShowSuccess] = useState(false)
  const [topicEditable, setTopicEditable] = useState(false)
  const [topics, setTopics] = useState([])
  const [topicsLoading, setTopicsLoading] = useState(false)

  const hosts = []
  const navigate = useNavigate()

  useEffect(() => {
    setBranchesLoading(true)
    getCompanyBranches()
        .then((res) => setBranches(res.data || []))
        .catch(() => setBranches([]))
        .finally(() => setBranchesLoading(false))
  }, [])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

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

  // Meeting Material handlers
  const handleFileChange = (e) => {
    const filesArr = Array.from(e.target.files).map((file) => ({ name: file.name }))
    setFiles((prev) => [...prev, ...filesArr])
  }

  const handleDeleteFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleShowMaterial = () => setShowMaterial(true)
  const handleCloseMaterial = () => setShowMaterial(false)

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
      await createMeeting(meetingData)
      setShowSuccess(true)
    } catch (err) {
      console.error("Error creating meeting:", err)
    }
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    navigate("/opentalk/manager")
  }

  return (
      <div className={styles.container}>
        <div className={styles.contentWrapper}>
          <div className={styles.backSection} onClick={() => navigate(-1)}>
            <span className={styles.backArrow}>←</span>
            <span className={styles.backText}>Back</span>
          </div>

          <h2 className={styles.title}>Add New Meeting</h2>

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
                  disabled={!topicEditable || topicsLoading || topics.length === 0}
                  className={styles.formSelect}
              >
                <option value="">-- Topic will be assigned later --</option>
                {topics.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.title}
                    </option>
                ))}
              </select>
              {!topicEditable && (
                  <button type="button" className={styles.manualButton} onClick={handleManualChooseTopic}>
                    ✏️ Manual Choose Topic
                  </button>
              )}
              {topicsLoading && topicEditable && <div className={styles.loadingText}>Loading topics...</div>}
            </div>

            {/* Host */}
            <div className={styles.formGroup}>
              <label className={styles.formLabel}>Host</label>
              <select
                  name="host"
                  value={form.host}
                  onChange={handleChange}
                  required
                  disabled={hosts.length === 0}
                  className={styles.formSelect}
              >
                <option value="">-- Host will be assigned later --</option>
                {hosts.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.fullName || user.username}
                    </option>
                ))}
              </select>
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
              <input name="status" value={form.status} type="text" disabled className={styles.formControl} />
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
            message="Meeting added successfully!"
        />
      </div>
  )
}

export default AddMeeting
