import { useState, useEffect } from "react"
import { FaUsers, FaCalendarAlt, FaQrcode, FaCheck, FaChevronDown } from "react-icons/fa"
import "./styles/AttendancePage.css"
import SuccessToast from "../components/SuccessToast/SuccessToast.jsx"

const AttendancePage = () => {
    const [sessions, setSessions] = useState([])
    const [selectedSession, setSelectedSession] = useState("")
    const [attendanceCode, setAttendanceCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [toastVisible, setToastVisible] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [toastType, setToastType] = useState("success")
    const [showQRScanner, setShowQRScanner] = useState(false)

    const mockSessions = [
        { id: 1, title: "OpenTalk #12 — Growth Mindset", date: "2024-01-15", time: "14:00" },
        { id: 2, title: "OpenTalk #13 — Leadership Skills", date: "2024-01-22", time: "14:00" },
        { id: 3, title: "OpenTalk #14 — Innovation Workshop", date: "2024-01-29", time: "14:00" },
        { id: 4, title: "OpenTalk #15 — Team Building", date: "2024-02-05", time: "14:00" },
    ]

    useEffect(() => {
        // Simulate API call to fetch sessions
        setSessions(mockSessions)
        if (mockSessions.length > 0) {
            setSelectedSession(mockSessions[0].id.toString())
        }
    }, [])

    const showToast = (message, type = "success") => {
        setToastMessage(message)
        setToastType(type)
        setToastVisible(true)
    }

    const handleSubmitAttendance = async () => {
        if (!selectedSession) {
            showToast("Vui lòng chọn buổi học", "error")
            return
        }

        if (!attendanceCode.trim()) {
            showToast("Vui lòng nhập mã điểm danh", "error")
            return
        }

        if (attendanceCode.trim().length < 6) {
            showToast("Mã điểm danh phải có ít nhất 6 ký tự", "error")
            return
        }

        try {
            setSubmitting(true)

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500))

            // Mock success response
            const selectedSessionData = sessions.find((s) => s.id.toString() === selectedSession)
            showToast(`Điểm danh thành công cho ${selectedSessionData?.title}!`, "success")

            // Reset form
            setAttendanceCode("")
        } catch (error) {
            console.error("Attendance submission failed:", error)
            showToast("Điểm danh thất bại. Vui lòng thử lại.", "error")
        } finally {
            setSubmitting(false)
        }
    }

    const handleQRScan = () => {
        // Simulate QR code scanning
        setShowQRScanner(true)
        setTimeout(() => {
            setAttendanceCode("OTP2020507")
            setShowQRScanner(false)
            showToast("Đã quét mã QR thành công!", "success")
        }, 2000)
    }

    return (
        <div className="attendance-page">
            <div className="attendance-background">
                <div className="background-pattern"></div>
            </div>

            <div className="attendance-container">
                <div className="attendance-card">
                    {/* Header */}
                    <div className="attendance-header">
                        <div className="header-icon">
                            <FaUsers />
                        </div>
                        <h1 className="attendance-title">Điểm danh buổi OpenTalk</h1>
                        <p className="attendance-subtitle">Xác nhận tham gia buổi học của bạn</p>
                    </div>

                    {/* Session Selection */}
                    <div className="form-section">
                        <label className="form-label">Chọn buổi học</label>
                        <div className="select-container">
                            <FaCalendarAlt className="select-icon" />
                            <select
                                className="session-select"
                                value={selectedSession}
                                onChange={(e) => setSelectedSession(e.target.value)}
                            >
                                <option value="">Chọn buổi học...</option>
                                {sessions.map((session) => (
                                    <option key={session.id} value={session.id.toString()}>
                                        {session.title}
                                    </option>
                                ))}
                            </select>
                            <FaChevronDown className="select-arrow" />
                        </div>
                    </div>

                    {/* Attendance Code */}
                    <div className="form-section">
                        <label className="form-label">Mã điểm danh</label>
                        <div className="code-input-container">
                            <input
                                type="text"
                                className="code-input"
                                placeholder="VD: OTP2020507"
                                value={attendanceCode}
                                onChange={(e) => setAttendanceCode(e.target.value.toUpperCase())}
                                maxLength={20}
                            />
                            <button className="qr-button" onClick={handleQRScan} disabled={showQRScanner} title="Quét mã QR">
                                {showQRScanner ? (
                                    <div className="qr-scanning">
                                        <div className="scanning-animation"></div>
                                    </div>
                                ) : (
                                    <FaQrcode />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button
                        className={`submit-button ${submitting ? "submitting" : ""}`}
                        onClick={handleSubmitAttendance}
                        disabled={submitting || !selectedSession || !attendanceCode.trim()}
                    >
                        {submitting ? (
                            <>
                                <div className="submit-spinner"></div>
                                <span>Đang xác nhận...</span>
                            </>
                        ) : (
                            <>
                                <FaCheck />
                                <span>Xác nhận điểm danh</span>
                            </>
                        )}
                    </button>

                    {/* Additional Info */}
                    <div className="info-section">
                        <div className="info-item">
                            <div className="info-icon">💡</div>
                            <p>Mã điểm danh sẽ được công bố tại buổi học</p>
                        </div>
                        <div className="info-item">
                            <div className="info-icon">📱</div>
                            <p>Bạn có thể quét mã QR để nhập nhanh</p>
                        </div>
                        <div className="info-item">
                            <div className="info-icon">⏰</div>
                            <p>Điểm danh chỉ có hiệu lực trong thời gian buổi học</p>
                        </div>
                    </div>
                </div>

                {/* Recent Sessions */}
                <div className="recent-sessions">
                    <h3 className="recent-title">Buổi học gần đây</h3>
                    <div className="sessions-list">
                        {sessions.slice(0, 3).map((session) => (
                            <div key={session.id} className="session-item">
                                <div className="session-info">
                                    <h4>{session.title}</h4>
                                    <p>
                                        {new Date(session.date).toLocaleDateString("vi-VN")} - {session.time}
                                    </p>
                                </div>
                                <div className="session-status">
                                    <span className="status-badge completed">Đã tham gia</span>
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
