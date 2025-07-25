import { useState, useEffect, useCallback, useRef } from "react"
import Table from "../components/opentalkHostRequest/Table"
import OpenTalkPagination from "../components/opentalkManager/Pagination"
import RequestsModal from "../components/opentalkHostRequest/HostRequestModal"
import { getMeetings } from "../services/opentalkManagerService"
import { getMeetingRequestCounts } from "../services/opentalkHostRegistrationService"
import styles from "./styles/module/OpenTalkHostRequest.module.css"

function OpenTalkHostRequestPage() {
  const [meetings, setMeetings] = useState([])
  const [requestCounts, setRequestCounts] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  // Modal state
  const [showReqModal, setShowReqModal] = useState(false)
  const [currentMeetingId, setCurrentMeetingId] = useState(null)
  const [currentTitle, setCurrentTitle] = useState("")

  // Reload flag (dùng ref để tránh re-render ko cần thiết)
  const shouldReload = useRef(false)

  // Fetch meetings
  const reloadMeetings = useCallback(() => {
    setLoading(true)
    setError(null)

    getMeetings({ page: page - 1, status: "WAITING_HOST_REGISTER" })
        .then((res) => {
          let list = []
          if (res.data && Array.isArray(res.data.content)) {
            list = res.data.content
            setMeetings(list)
            setTotalPages(res.data.totalPages || 1)
          } else {
            setMeetings([])
            setTotalPages(1)
          }
          if (list.length > 0) {
            const ids = list.map((m) => m.id)
            getMeetingRequestCounts(ids)
                .then((res2) => setRequestCounts(res2.data || {}))
                .catch(() => setRequestCounts({}))
          } else {
            setRequestCounts({})
          }
        })
        .catch(() => {
          setError("Không lấy được dữ liệu")
          setMeetings([])
          setTotalPages(1)
          setRequestCounts({})
        })
        .finally(() => setLoading(false))
  }, [page])

  // Fetch lại mỗi khi page thay đổi
  useEffect(() => {
    reloadMeetings()
  }, [page, reloadMeetings])

  // Khi modal đóng và cần reload, fetch lại list (dùng ref tránh lặp vô hạn)
  useEffect(() => {
    if (!showReqModal && shouldReload.current) {
      reloadMeetings()
      shouldReload.current = false
    }
  }, [showReqModal, reloadMeetings])

  // Mở request modal
  const handleRequestClick = (meeting) => {
    setCurrentMeetingId(meeting.id)
    setCurrentTitle(meeting.meetingTitle || meeting.meetingName || "")
    setShowReqModal(true)
  }

  const handleAfterAction = () => {
    setShowReqModal(false) // Đóng request modal
    shouldReload.current = true // Trigger reload ở useEffect
  }

  return (
      <div className={styles.pageContainer}>
        <div className={styles.contentWrapper}>
          {/* Header Section */}
          <div className={styles.headerSection}>
            <div className={styles.titleArea}>
              <div className={styles.titleIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                      d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8"
                      stroke="currentColor"
                      strokeWidth="2"
                  />
                  <rect x="8" y="2" width="8" height="4" rx="1" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 11V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M9 14H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className={styles.titleContent}>
                <h1 className={styles.pageTitle}>Yêu cầu Host OpenTalk</h1>
                <p className={styles.pageSubtitle}>Quản lý các yêu cầu đăng ký làm host cho cuộc họp OpenTalk</p>
              </div>
            </div>
            <div className={styles.statsArea}>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>{meetings.length}</div>
                <div className={styles.statLabel}>Cuộc họp chờ host</div>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>
                  {Object.values(requestCounts).reduce((sum, count) => sum + count, 0)}
                </div>
                <div className={styles.statLabel}>Tổng yêu cầu</div>
              </div>
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
                  <div className={styles.emptyIcon}>📋</div>
                  <h3>Không có yêu cầu nào</h3>
                  <p>Hiện tại không có cuộc họp nào đang chờ đăng ký host.</p>
                </div>
            ) : (
                <div className={styles.tableContainer}>
                  <Table meetings={meetings} requestCounts={requestCounts} onRequestClick={handleRequestClick} />
                </div>
            )}
          </div>

          {/* Pagination */}
          {!loading && !error && meetings.length > 0 && (
              <div className={styles.paginationSection}>
                <OpenTalkPagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
          )}
        </div>

        <RequestsModal
            show={showReqModal}
            onHide={() => setShowReqModal(false)}
            meetingId={currentMeetingId}
            meetingTitle={currentTitle}
            onAfterAction={handleAfterAction}
        />
      </div>
  )
}

export default OpenTalkHostRequestPage
