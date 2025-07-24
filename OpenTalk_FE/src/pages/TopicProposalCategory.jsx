import { useEffect, useRef, useState } from "react"
import axios from "/src/api/axiosClient.jsx"
import styles from "./styles/module/TopicProposalCategory.module.css"
import TopicProposal from "../components/common/TopicProposalCard.jsx"
import { getAccessToken, getCurrentUser } from "../helper/auth.jsx"
import ProposalDetail from "../components/proposalTopic/ProposalDetail.jsx"
import "bootstrap/dist/css/bootstrap.min.css"
import CustomModal from "../components/CustomModal/CustomModal.jsx"
import SuccessToast from "../components/SuccessToast/SuccessToast.jsx"
import { Modal, Button, Form, Spinner } from "react-bootstrap"
import { FaSearch, FaPlus, FaFilter, FaChevronLeft, FaChevronRight } from "react-icons/fa"

const TopicProposalCategory = () => {
    const [posts, setPosts] = useState([])
    const [totalPages, setTotalPages] = useState(0)
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState("")
    const [pageNo, setPageNo] = useState(1)
    const [pageSize] = useState(8)
    const [error, setError] = useState(null)
    const [statusOption, setStatusOptions] = useState([])
    const [title, setTitle] = useState("")
    const typingTimeoutRef = useRef(null)
    const [selectedTopicId, setSelectedTopicId] = useState(null)
    const [showDetailModal, setShowDetailModal] = useState(false)
    const [toastVisible, setToastVisible] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const [toastType, setToastType] = useState("success")

    const showToast = (msg, type = "success") => {
        setToastMessage(msg)
        setToastType(type)
        setToastVisible(true)
    }

    const [isDetailHidden, setIsDetailHidden] = useState(false)
    const [showRejectModal, setShowRejectModal] = useState(false)
    const [rejectNote, setRejectNote] = useState("")
    const [rejectError, setRejectError] = useState("")
    const [rejectSubmitting, setRejectSubmitting] = useState(false)

    const fetchTopics = async ({ pageNo, statusFilter, title }) => {
        setLoading(true)
        try {
            const res = await axios.get("/topic-idea", {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
                params: { pageNo, pageSize, status: statusFilter, title },
            })
            setPosts(res.data.content || [])
            setTotalPages(res.data.totalPages || 0)
            setError(null)
        } catch (err) {
            console.error(err)
            setError("Không tải được dữ liệu")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchTopics({ pageNo, statusFilter, title })
    }, [pageNo, statusFilter])

    useEffect(() => {
        axios
            .get("/topic-idea/admin/status", {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
            })
            .then((res) => setStatusOptions(res.data))
    }, [])

    const handleTitleChange = (e) => {
        const newTitle = e.target.value
        setTitle(newTitle)
        setPageNo(1)

        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
        }

        typingTimeoutRef.current = setTimeout(() => {
            fetchTopics({ pageNo: 1, statusFilter, title: newTitle })
        }, 500)
    }

    useEffect(() => {
        return () => clearTimeout(typingTimeoutRef.current)
    }, [])

    const handleViewDetail = (id) => {
        setSelectedTopicId(id)
        setShowDetailModal(true)
    }

    const handleCloseModal = () => {
        setShowDetailModal(false)
        setSelectedTopicId(null)
        fetchTopics({ pageNo, statusFilter, title })
    }

    const handleRejectSubmit = async () => {
        setRejectError("")
        if (rejectNote.trim().length < 5) {
            setRejectError("Lý do phải ≥ 5 ký tự.")
            return
        }
        try {
            setRejectSubmitting(true)
            const user = getCurrentUser()
            await axios.put(
                `/topic-idea/admin/decision`,
                {
                    decision: "rejected",
                    remark: rejectNote.trim(),
                    topicId: selectedTopicId,
                    userId: user.id,
                },
                { headers: { Authorization: `Bearer ${getAccessToken()}` } },
            )
            setShowRejectModal(false)
            setIsDetailHidden(false)
            showToast("Từ chối thành công!", "success")
            handleCloseModal()
        } catch (err) {
            console.error(err)
            setRejectError("Gửi yêu cầu từ chối thất bại. Thử lại.")
            showToast("Từ chối thất bại. Thử lại.", "error")
        } finally {
            setRejectSubmitting(false)
        }
    }

    if (loading) {
        return (
            <div className={styles.topicProposalContainer}>
                <div className={styles.topicLoadingContainer}>
                    <div className={styles.topicLoadingSpinner}></div>
                    <p>Loading topics...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className={styles.topicProposalContainer}>
                <div className={styles.topicErrorContainer}>
                    <div className={styles.topicErrorIcon}>⚠️</div>
                    <p>{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.topicProposalContainer}>
            {/* Header */}
            <div className={styles.topicPageHeader}>
                <div className={styles.topicHeaderContent}>
                    <h1 className={styles.pageTitle}>Topic Proposals</h1>
                    <p className={styles.topicPageSubtitle}>Manage and review topic proposals from team members</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className={styles.topicStatsGrid}>
                <div className={styles.topicStatCard}>
                    <div className={styles.topicStatIcon}>📝</div>
                    <div className={styles.topicStatContent}>
                        <h3>{posts.length}</h3>
                        <p>Total Proposals</p>
                    </div>
                </div>
                <div className={styles.topicStatCard}>
                    <div className={styles.topicStatIcon}>✅</div>
                    <div className={styles.topicStatContent}>
                        <h3>{posts.filter((p) => p.status === "approved").length}</h3>
                        <p>Approved</p>
                    </div>
                </div>
                <div className={styles.topicStatCard}>
                    <div className={styles.topicStatIcon}>⏳</div>
                    <div className={styles.topicStatContent}>
                        <h3>{posts.filter((p) => p.status === "pending").length}</h3>
                        <p>Pending</p>
                    </div>
                </div>
                <div className={styles.topicStatCard}>
                    <div className={styles.topicStatIcon}>❌</div>
                    <div className={styles.topicStatContent}>
                        <h3>{posts.filter((p) => p.status === "rejected").length}</h3>
                        <p>Rejected</p>
                    </div>
                </div>
            </div>

            {/* Action Bar */}
            <div className={styles.topicActionBar}>
                <div className={styles.topicSearchContainer}>
                    <FaSearch className={styles.topicSearchIcon} />
                    <input
                        type="text"
                        className={styles.topicSearchInput}
                        placeholder="Search by title..."
                        value={title}
                        onChange={handleTitleChange}
                    />
                </div>

                <div className={styles.topicActionButtons}>
                    <button className={`${styles.topicBtn} ${styles.topicBtnPrimary}`}>
                        <FaPlus />
                        Add New
                    </button>
                    <div className={styles.topicFilterGroup}>
                        <FaFilter className={styles.topicFilterIcon} />
                        <select
                            className={styles.topicStatusFilter}
                            value={statusFilter}
                            onChange={(e) => {
                                setStatusFilter(e.target.value)
                                setPageNo(1)
                            }}
                        >
                            <option value="">All Status</option>
                            {statusOption.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Content */}
            {posts.length === 0 ? (
                <div className={styles.topicEmptyState}>
                    <div className={styles.topicEmptyIcon}>📋</div>
                    <h3>No topics found</h3>
                    <p>Try adjusting your search criteria or add a new topic proposal</p>
                </div>
            ) : (
                <div className={styles.topicProposalsGrid}>
                    {posts.map((post) => (
                        <TopicProposal
                            key={post.id}
                            id={post.id}
                            title={post.title}
                            description={post.description}
                            authorName={post.suggestedBy.fullName}
                            date={post.createdAt}
                            avatarUrl="https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg"
                            status={post.status}
                            onClickDetail={handleViewDetail}
                        />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className={styles.topicPaginationContainer}>
                    <div className={styles.topicPaginationInfo}>
                        Page {pageNo} of {totalPages}
                    </div>
                    <div className={styles.topicPaginationControls}>
                        <button
                            className={styles.topicPaginationBtn}
                            onClick={() => setPageNo((prev) => prev - 1)}
                            disabled={pageNo === 1}
                        >
                            <FaChevronLeft />
                        </button>

                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i + 1}
                                className={`${styles.topicPaginationNumber} ${pageNo === i + 1 ? styles.active : ""}`}
                                onClick={() => setPageNo(i + 1)}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            className={styles.topicPaginationBtn}
                            onClick={() => setPageNo((prev) => prev + 1)}
                            disabled={pageNo === totalPages}
                        >
                            <FaChevronRight />
                        </button>
                    </div>
                </div>
            )}

            {/* Modals */}
            <CustomModal isOpen={showDetailModal && !isDetailHidden} onClose={handleCloseModal}>
                {selectedTopicId && (
                    <ProposalDetail
                        id={selectedTopicId}
                        onClose={handleCloseModal}
                        showToast={showToast}
                        onOpenRejectModal={() => {
                            setRejectNote("")
                            setRejectError("")
                            setIsDetailHidden(true)
                            setShowRejectModal(true)
                        }}
                    />
                )}
            </CustomModal>

            <SuccessToast
                message={toastMessage}
                isVisible={toastVisible}
                type={toastType}
                onClose={() => setToastVisible(false)}
            />

            <Modal
                show={showRejectModal}
                onHide={() => {
                    if (!rejectSubmitting) {
                        setShowRejectModal(false)
                        setIsDetailHidden(false)
                    }
                }}
                centered
                backdrop="static"
                className="reject-modal"
            >
                <Modal.Header closeButton={!rejectSubmitting}>
                    <Modal.Title>Reject Proposal</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>
                            Reason for rejection <span className="required">*</span>
                        </Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={4}
                            placeholder="Enter reason (minimum 5 characters)..."
                            value={rejectNote}
                            disabled={rejectSubmitting}
                            onChange={(e) => setRejectNote(e.target.value)}
                        />
                    </Form.Group>
                    {rejectError && <div className="alert alert-danger">{rejectError}</div>}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setShowRejectModal(false)
                            setIsDetailHidden(false)
                        }}
                        disabled={rejectSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleRejectSubmit} disabled={rejectSubmitting}>
                        {rejectSubmitting ? <Spinner animation="border" size="sm" /> : "Confirm Reject"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default TopicProposalCategory
