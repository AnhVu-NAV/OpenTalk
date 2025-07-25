import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Table from "../components/opentalkManager/Table"
import OpenTalkPagination from "../components/opentalkManager/Pagination"
import DeleteModal from "../components/deleteModal/DeleteModal"
import { getMeetings, deleteMeeting, getCompanyBranches } from "../services/opentalkManagerService"
import styles from "./styles/module/OpenTalkManager.module.css"

const statuses = [
  "WAITING_TOPIC",
  "WAITING_HOST_REGISTER",
  "WAITING_HOST_SELECTION",
  "UPCOMING",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
  "POSTPONED",
]

function OpenTalkManagerPage() {
  // Dữ liệu bảng
  const [meetings, setMeetings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Phân trang
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Modal xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState(null)

  // Filter INPUT (người dùng nhập)
  const [inputName, setInputName] = useState("")
  const [inputBranch, setInputBranch] = useState("")
  const [inputStatus, setInputStatus] = useState("")
  const [inputDate, setInputDate] = useState("")
  const [inputFromDate, setInputFromDate] = useState("")
  const [inputToDate, setInputToDate] = useState("")

  // Filter THỰC THI (dùng gửi API)
  const [filter, setFilter] = useState({
    name: "",
    branch: "",
    status: "",
    date: "",
    fromDate: "",
    toDate: "",
  })

  // Branches
  const [branches, setBranches] = useState([])
  const [branchesLoading, setBranchesLoading] = useState(true)

  const navigate = useNavigate()

  // Lấy branch từ API
  useEffect(() => {
    setBranchesLoading(true)
    getCompanyBranches()
        .then((res) => setBranches(res.data || []))
        .catch(() => setBranches([]))
        .finally(() => setBranchesLoading(false))
  }, [])

  // Fetch meetings khi page hoặc filter đổi
  useEffect(() => {
    setLoading(true)
    setError(null)

    const params = {
      page: page - 1,
      name: filter.name || undefined,
      companyBranchId: filter.branch || undefined,
      status: filter.status || undefined,
      date: filter.date || undefined,
      fromDate: filter.fromDate || undefined,
      toDate: filter.toDate || undefined,
    }

    Object.keys(params).forEach((key) => params[key] === undefined && delete params[key])

    getMeetings(params)
        .then((res) => {
          if (Array.isArray(res.data)) {
            setMeetings(res.data)
            setTotalPages(1)
          } else if (res.data && Array.isArray(res.data.content)) {
            setMeetings(res.data.content)
            setTotalPages(res.data.totalPages || 1)
          } else {
            setMeetings([])
            setTotalPages(1)
          }
        })
        .catch(() => {
          setMeetings([])
          setTotalPages(1)
          setError("Không lấy được dữ liệu cuộc họp")
        })
        .finally(() => setLoading(false))
  }, [page, filter])

  const handleClearFilter = () => {
    setInputName("")
    setInputBranch("")
    setInputStatus("")
    setInputDate("")
    setInputFromDate("")
    setInputToDate("")

    setFilter({
      name: "",
      branch: "",
      status: "",
      date: "",
      fromDate: "",
      toDate: "",
    })
  }

  // Xử lý Search (copy input sang filter, reset page về 1)
  const handleSearch = () => {
    setPage(1)
    setFilter({
      name: inputName,
      branch: inputBranch,
      status: inputStatus,
      date: inputDate,
      fromDate: inputFromDate,
      toDate: inputToDate,
    })
  }

  // Xem chi tiết
  const handleViewDetail = (meeting) => {
    navigate(`/meeting/meeting-detail/${meeting.id}`, { state: { meeting } })
  }

  // Xử lý xóa
  const handleDeleteMeeting = (meeting) => {
    setSelectedMeeting(meeting)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!selectedMeeting) return
    try {
      await deleteMeeting(selectedMeeting.id)
      setMeetings((prev) => prev.filter((m) => m.id !== selectedMeeting.id))
      setShowDeleteModal(false)
      setSelectedMeeting(null)
    } catch (err) {
      setShowDeleteModal(false)
      setSelectedMeeting(null)
    }
  }

  // Thêm mới
  const handleGoToAddNew = () => {
    navigate("/meeting/add-meeting")
  }

  return (
      <div className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          {/* Header Section */}
          <div className={styles.headerSection}>
            <div className={styles.titleArea}>
              <div className={styles.titleIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M8 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M16 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M3 10H21" stroke="currentColor" strokeWidth="2" />
                  <path d="M8 14H10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M14 14H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className={styles.titleContent}>
                <h1 className={styles.pageTitle}>OpenTalk Manager</h1>
                <p className={styles.pageSubtitle}>Quản lý và theo dõi tất cả các cuộc họp OpenTalk</p>
              </div>
            </div>
            <button className={styles.addButton} onClick={handleGoToAddNew}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <path d="M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Tạo cuộc họp mới
            </button>
          </div>

          {/* Filter Section */}
          <div className={styles.filterSection}>
            <div className={styles.filterGrid}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Tên cuộc họp</label>
                <input
                    type="text"
                    placeholder="Tìm kiếm theo tên..."
                    value={inputName}
                    onChange={(e) => setInputName(e.target.value)}
                    className={styles.filterInput}
                />
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Chi nhánh</label>
                <select
                    value={inputBranch}
                    onChange={(e) => setInputBranch(e.target.value)}
                    className={styles.filterSelect}
                    disabled={branchesLoading}
                >
                  <option value="">Tất cả chi nhánh</option>
                  {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Trạng thái</label>
                <select
                    value={inputStatus}
                    onChange={(e) => setInputStatus(e.target.value)}
                    className={styles.filterSelect}
                >
                  <option value="">Tất cả trạng thái</option>
                  {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status.replace(/_/g, " ")}
                      </option>
                  ))}
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Từ ngày</label>
                <input
                    type="date"
                    value={inputFromDate}
                    onChange={(e) => setInputFromDate(e.target.value)}
                    className={styles.filterInput}
                />
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Đến ngày</label>
                <input
                    type="date"
                    value={inputToDate}
                    onChange={(e) => setInputToDate(e.target.value)}
                    className={styles.filterInput}
                />
              </div>
            </div>

            <div className={styles.filterActions}>
              <button className={styles.clearButton} onClick={handleClearFilter}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M3 6H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path
                      d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                  />
                  <path
                      d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                  />
                </svg>
                Xóa bộ lọc
              </button>
              <button className={styles.searchButton} onClick={handleSearch}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                  <path d="M21 21L16.65 16.65" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Tìm kiếm
              </button>
            </div>
          </div>

          {/* Content Section */}
          <div className={styles.contentSection}>
            {loading ? (
                <div className={styles.loadingState}>
                  <div className={styles.loadingSpinner}></div>
                  <p>Đang tải dữ liệu...</p>
                </div>
            ) : error ? (
                <div className={styles.errorState}>
                  <div className={styles.errorIcon}>⚠️</div>
                  <h3>Có lỗi xảy ra</h3>
                  <p>{error}</p>
                  <button className={styles.retryButton} onClick={() => window.location.reload()}>
                    Thử lại
                  </button>
                </div>
            ) : meetings.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyIcon}>📅</div>
                  <h3>Không có cuộc họp nào</h3>
                  <p>Chưa có cuộc họp nào được tạo. Hãy tạo cuộc họp đầu tiên!</p>
                  <button className={styles.createFirstButton} onClick={handleGoToAddNew}>
                    Tạo cuộc họp đầu tiên
                  </button>
                </div>
            ) : (
                <Table
                    meetings={Array.isArray(meetings) ? meetings : []}
                    onView={handleViewDetail}
                    onDelete={handleDeleteMeeting}
                />
            )}
          </div>

          {/* Pagination */}
          {!loading && !error && meetings.length > 0 && (
              <div className={styles.paginationSection}>
                <OpenTalkPagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
          )}
        </div>

        <DeleteModal
            isOpen={showDeleteModal}
            title="Xóa cuộc họp"
            message={
              selectedMeeting
                  ? `Bạn có chắc chắn muốn xóa cuộc họp "${selectedMeeting.meetingName}"? Hành động này không thể hoàn tác.`
                  : ""
            }
            onCancel={() => setShowDeleteModal(false)}
            onConfirm={handleConfirmDelete}
        />
      </div>
  )
}

export default OpenTalkManagerPage
