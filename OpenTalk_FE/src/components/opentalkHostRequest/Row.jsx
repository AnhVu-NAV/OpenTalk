import styles from "./Row.module.css"

function OpenTalkRow({ meeting, onRequestClick, requestCount = 0 }) {
    const formatDate = (dateStr) => {
        if (!dateStr) return "-"
        try {
            const d = new Date(dateStr)
            return d.toLocaleString("en-GB", { hour12: false })
        } catch {
            return dateStr
        }
    }

    return (
        <tr className={styles.row}>
            <td className={styles.cell}>
                <span className={styles.meetingTitle}>{meeting.meetingTitle || meeting.meetingName || "-"}</span>
            </td>
            <td className={styles.cell}>
                <span className={styles.topicName}>{meeting.topic?.name || meeting.topic?.title || "-"}</span>
            </td>
            <td className={styles.cell}>
                <span className={styles.branchName}>{meeting.companyBranch?.name || meeting.companyBranch || "-"}</span>
            </td>
            <td className={styles.cell}>
                <span className={styles.scheduledDate}>{formatDate(meeting.scheduledDate)}</span>
            </td>
            <td className={styles.cell}>
                <div className={styles.actions}>
                    <button
                        className={`${styles.iconBtn} ${styles.notificationBtn}`}
                        title="View Requests"
                        onClick={() => onRequestClick(meeting)}
                    >
                        📥{requestCount > 0 && <span className={styles.requestBadge}>{requestCount}</span>}
                    </button>
                </div>
            </td>
        </tr>
    )
}

export default OpenTalkRow
