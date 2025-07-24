import { useEffect, useState, useCallback } from "react"
import "./ProposalDetail.css"
import {FaBuilding, FaCalendarAlt, FaUser, FaTimes, FaCheck, FaPlus} from "react-icons/fa"
import { getAccessToken, getCurrentUser } from "../../helper/auth.jsx"
import axios from "/src/api/axiosClient.jsx"
import { Modal, Button, Form, Spinner } from "react-bootstrap"
import {useNavigate} from "react-router-dom";

const ProposalDetail = ({ id, pollId, onClose, showToast, onOpenRejectModal, meetingId, needAdd }) => {
    const [data, setData] = useState(null)
    const [successMsg, setSuccessMsg] = useState("")
    const [errorMsg, setErrorMsg] = useState("")
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [rejectNote, setRejectNote] = useState("")
    const [rejectSubmitting, setRejectSubmitting] = useState(false)
    const [rejectError, setRejectError] = useState("")
    const user = getCurrentUser()
    const [approveSubmitting, setApproveSubmitting] = useState(false)
    const [toastVisible, setToastVisible] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [opentalkMeeting, setOntalkMeeting] = useState(null)
    const navigate = useNavigate();
    const fetchData = useCallback(async () => {
        try {
            console.log("Fetching data in ProposalDetail...")
            console.log(pollId)
            const res = await axios.get(`/topic-idea/${id}`, {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
            })
            setData(res.data)
        } catch (err) {
            console.error(err)
            setErrorMsg("Không tải được dữ liệu.")
        }
    }, [id]);

    useEffect(() => {
        fetchData()
    }, [fetchData])


    const closeRejectModal = () => {
        if (!rejectSubmitting) {
            setShowRejectModal(false)
            setRejectError("")
        }
    }

    const handleRejectSubmit = async () => {
        setRejectError("")
        if (rejectNote.trim().length < 5) {
            setRejectError("Lý do phải ≥ 5 ký tự.")
            return
        }
        try {
            console.log()
            setRejectSubmitting(true)
            await axios.put(
                `/topic-idea/admin/decision`,
                {
                    decision: "rejected",
                    remark: rejectNote.trim(),
                    topicId: data.id,
                    userId: user.id,
                },
                { headers: { Authorization: `Bearer ${getAccessToken()}` } },
            )
            setSuccessMsg("Đã từ chối thành công!")
            setShowRejectModal(false)
            if (typeof showToast === "function") {
                showToast("Từ chối thành công!", "success")
            }
        } catch (err) {
            console.error(err)
            setRejectError("Gửi yêu cầu từ chối thất bại. Thử lại.")
            if (typeof showToast === "function") {
                showToast("Từ chối thất bại. Thử lại.", "error")
            }
        } finally {
            setRejectSubmitting(false)
        }
    }

    const handleApprove = async () => {
        setErrorMsg("")
        setSuccessMsg("")
        try {
            setApproveSubmitting(true)
            await axios.put(
                `/topic-idea/admin/decision`,
                {
                    decision: "approved",
                    remark: null,
                    topicId: data.id,
                    userId: user.id,
                },
                { headers: { Authorization: `Bearer ${getAccessToken()}` } },
            )
            setSuccessMsg("Đã phê duyệt thành công!")
            if (typeof showToast === "function") {
                showToast("Phê duyệt thành công!", "success")
            }
        } catch (err) {
            console.error(err)
            setErrorMsg("Phê duyệt thất bại. Thử lại.")
            if (typeof showToast === "function") {
                showToast("Phê duyệt thất bại. Thử lại.", "error")
            }
        } finally {
            setApproveSubmitting(false)
        }
    }

    const handleAdd = async (topicId, pollId) => {
        try {
            console.log("Start adding topic to poll"+pollId)
            await axios.post(
                `/topic-poll?topicId=${topicId}&pollId=${pollId}`,null,
                { headers: { Authorization: `Bearer ${getAccessToken()}` }}
             )
            if (typeof onClose === "function") {
                onClose();  // Đóng modal trước khi điều hướng
            }
            navigate(`/poll/create/${meetingId}`);
        } catch (err) {
            console.error(err)
            setErrorMsg("Đã có lỗi khi thêm mới lưạ chọn.")
        }

    }

    useEffect(() => {
        if (successMsg) {
            const timeout = setTimeout(() => {
                if (typeof onClose === "function") {
                    onClose()
                }
            }, 500)
            return () => clearTimeout(timeout)
        }
    }, [successMsg])

    const getStatusBadge = (status) => {
        const statusConfig = {
            approved: { class: "status-approved", icon: "✅", text: "Approved" },
            rejected: { class: "status-rejected", icon: "❌", text: "Rejected" },
            pending: { class: "status-pending", icon: "⏳", text: "Pending" },
            discussed: { class: "status-pending", icon: "🗣️", text: "Pending" },
        }

        const config = statusConfig[status] || { class: "status-default", icon: "📋", text: status }

        return (
            <span className={`status-badge ${config.class}`}>
        <span className="status-icon">{config.icon}</span>
                {config.text}
      </span>
        )
    }

    if (!data) {
        return (
            <div className="proposal-detail-loading">
                <div className="loading-spinner"></div>
                <p>Loading proposal details...</p>
            </div>
        )
    }

    return (
        <div className={`proposal-detail-container ${showRejectModal ? "blur-background" : ""}`}>
            {/* Header */}
            <div className="proposal-header">
                <div className="header-content">
                    <h1 className="proposal-title">{data.title}</h1>
                    {data.status && getStatusBadge(data.status)}
                </div>
                <button className="close-btn" onClick={onClose}>
                    <FaTimes />
                </button>
            </div>

            {/* Proposal Info */}
            <div className="proposal-info-grid">
                <div className="info-card">
                    <div className="info-icon">
                        <FaUser />
                    </div>
                    <div className="info-content">
                        <h4>Assignee</h4>
                        <div className="assignee-info">
                            <img
                                src="https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg"
                                alt={data?.evalutedBy?.fullName}
                                className="assignee-avatar"
                            />
                            <span>{data?.evalutedBy?.fullName || "Not assigned"}</span>
                        </div>
                    </div>
                </div>

                <div className="info-card">
                    <div className="info-icon">
                        <FaCalendarAlt />
                    </div>
                    <div className="info-content">
                        <h4>Created Date</h4>
                        <p>{data?.updatedAt && new Date(data.updatedAt).toLocaleDateString("vi-VN")}</p>
                    </div>
                </div>

                <div className="info-card">
                    <div className="info-icon">
                        <FaBuilding />
                    </div>
                    <div className="info-content">
                        <h4>Branch</h4>
                        <p>{data.suggestedBy.companyBranch.name}</p>
                    </div>
                </div>
                {opentalkMeeting && (<div className="info-card">
                    <div className="info-icon">
                        <FaBuilding />
                    </div>

                        <Link
                            to={`/meetings/${opentalkMeeting.id}`}
                            className="info-content"
                            style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                            <h4>Meeting discuss</h4>
                            <p>{data.suggestedBy.companyBranch.name}</p>
                        </Link>

                </div> )}
            </div>

            {/* Description Section */}
            <div className="description-section">
                <h3 className="section-title">About This Topic</h3>
                <div className="description-card">
                    <div className="author-info">
                        <img
                            src="https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg"
                            alt={data.suggestedBy.fullName}
                            className="author-avatar"
                        />
                        <div className="author-details">
                            <h4>{data.suggestedBy.fullName}</h4>
                            <p>Topic Proposer</p>
                        </div>
                    </div>
                    <div
                        className="description-content"
                        dangerouslySetInnerHTML={{ __html: data.description }}
                    ></div>
                </div>
            </div>

            {/* Remark */}
            {data?.status === "rejected" && (
            <div className="description-section">
                <h3 className="section-title">Reject reason</h3>
                <div className="description-card">
                    <div className="author-info">
                        <div className="author-details">
                            <h4>{data.remark}</h4>
                        </div>
                    </div>
                </div>
            </div>
            )}
            {/* Action Buttons */}
                <div className="action-buttons">
                    <button className="btn btn-reject" onClick={onOpenRejectModal} disabled={approveSubmitting}>
                        <FaTimes />
                        Reject
                    </button>
                    {data?.status === "pending" && (
                    <button className="btn btn-approve" onClick={handleApprove} disabled={rejectSubmitting || approveSubmitting}>
                        {approveSubmitting ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            <>
                                <FaCheck />
                                Approve
                            </>
                        )}
                    </button>)}
                </div>

            {needAdd && (
                <div className="action-buttons">
                    <button className="btn btn-approve" onClick={() => handleAdd(data.id, pollId)}>
                        {approveSubmitting ? (
                            <Spinner animation="border" size="sm" />
                        ) : (
                            <>
                                <FaPlus />
                                Add to Poll
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Reject Modal */}
            <Modal
                show={showRejectModal}
                onHide={closeRejectModal}
                centered
                backdrop="static"
                className="modern-reject-modal"
            >
                <Modal.Header closeButton={!rejectSubmitting}>
                    <Modal.Title>
                        <FaTimes className="modal-icon" />
                        Reject Proposal
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Reason for rejection <span className="required">*</span>
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Please provide a detailed reason (minimum 5 characters)..."
                            value={rejectNote}
                            disabled={rejectSubmitting}
                            onChange={(e) => setRejectNote(e.target.value)}
                            className="modern-textarea"
                        />
                    </Form.Group>
                    {rejectError && (
                        <div className="error-alert">
                            <span className="error-icon">⚠️</span>
                            {rejectError}
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="outline-secondary"
                        onClick={closeRejectModal}
                        disabled={rejectSubmitting}
                        className="modern-btn-secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleRejectSubmit}
                        disabled={rejectSubmitting}
                        className="modern-btn-danger"
                    >
                        {rejectSubmitting ? (
                            <>
                                <Spinner animation="border" size="sm" />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <FaTimes />
                                Confirm Reject
                            </>
                        )}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default ProposalDetail;
