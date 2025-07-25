import { useEffect, useState } from "react"
import {
  getHostRegistrationsByMeetingId,
  approveHostRegistration,
  rejectHostRegistration,
} from "../../services/opentalkHostRegistrationService"
import ConfirmModal from "./ConfirmModal"
import styles from "./HostRequestModal.module.css"

function RequestsModal({ show, onHide, meetingId, meetingTitle, onAfterAction }) {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [confirm, setConfirm] = useState({ show: false, type: "", id: null, name: "" })

  // Fetch requests
  useEffect(() => {
    if (show && meetingId) {
      setLoading(true)
      getHostRegistrationsByMeetingId(meetingId)
          .then((res) => setRequests(res.data || []))
          .catch(() => setRequests([]))
          .finally(() => setLoading(false))
    }
  }, [show, meetingId])

  const handleApprove = (id, name) => setConfirm({ show: true, type: "approve", id, name })
  const handleReject = (id, name) => setConfirm({ show: true, type: "reject", id, name })

  // Khi xác nhận ở ConfirmModal
  const handleConfirmAction = () => {
    setProcessing(true)
    const apiCall =
        confirm.type === "approve" ? approveHostRegistration(confirm.id) : rejectHostRegistration(confirm.id)

    apiCall
        .then(() => {
          setConfirm({ show: false, type: "", id: null })
          onHide()
          if (typeof onAfterAction === "function") {
            setTimeout(() => {
              onAfterAction()
            }, 0)
          }
        })
        .catch(() => {
          alert("Operation failed")
        })
        .finally(() => {
          setProcessing(false)
        })
  }

  if (!show) return null

  return (
      <>
        <div className={styles.modalOverlay} onClick={onHide}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h4 className={styles.modalTitle}>Requests for "{meetingTitle}"</h4>
            </div>
            <div className={styles.modalBody}>
              {loading ? (
                  <div className={styles.loadingContainer}>
                    <div className={styles.spinner}></div>
                  </div>
              ) : requests.length === 0 ? (
                  <p className={styles.emptyMessage}>No requests yet.</p>
              ) : (
                  <ul className={styles.requestsList}>
                    {requests.map((req) => (
                        <li key={req.id} className={styles.requestItem}>
                          <div className={styles.userInfo}>
                            <div className={styles.userName}>{req.user?.fullName || req.user?.username || "Unknown"}</div>
                            <div className={styles.userDetails}>
                              <span className={styles.userEmail}>{req.user?.email || "-"}</span>
                              <span className={styles.separator}>·</span>
                              <span className={styles.userBranch}>{req.user?.companyBranch?.name || "-"}</span>
                            </div>
                          </div>
                          <div className={styles.actionButtons}>
                            <button
                                className={`${styles.actionButton} ${styles.approveButton}`}
                                disabled={processing}
                                onClick={() => handleApprove(req.id, req.user?.fullName)}
                            >
                              Approve
                            </button>
                            <button
                                className={`${styles.actionButton} ${styles.rejectButton}`}
                                disabled={processing}
                                onClick={() => handleReject(req.id, req.user?.fullName)}
                            >
                              Reject
                            </button>
                          </div>
                        </li>
                    ))}
                  </ul>
              )}
            </div>
            <div className={styles.modalFooter}>
              <button className={styles.closeButton} onClick={onHide}>
                Close
              </button>
            </div>
          </div>
        </div>

        {/* Confirm dialog */}
        <ConfirmModal
            show={confirm.show}
            title={confirm.type === "approve" ? "Approve Host Request" : "Reject Host Request"}
            message={
              confirm.type === "approve" ? (
                  <>
                    Are you sure you want to <b>APPROVE</b> this request of <br />"<b>{confirm.name}</b>"?
                  </>
              ) : (
                  <>
                    Are you sure you want to <b>REJECT</b> this request of <br />"<b>{confirm.name}</b>"?
                  </>
              )
            }
            onCancel={() => setConfirm({ show: false, type: "", id: null, name: "" })}
            onConfirm={handleConfirmAction}
        />
      </>
  )
}

export default RequestsModal
