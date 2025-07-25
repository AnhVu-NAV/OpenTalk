import { useState, useRef, useEffect } from "react"
import StatusBadge from "./StatusBadge"
import styles from "./Row.module.css"

function OpenTalkRow({ meeting, onView, onEdit, onDelete }) {
    const [showMenu, setShowMenu] = useState(false)
    const menuRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    // Định dạng ngày nếu cần
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
                <span className={styles.meetingId}>{meeting.id}</span>
            </td>
            <td className={styles.cell}>
                <span className={styles.meetingName}>{meeting.meetingName || "-"}</span>
            </td>
            <td className={styles.cell}>
                <span className={styles.topicName}>{meeting.topic?.title || "-"}</span>
            </td>
            <td className={styles.cell}>
                <span className={styles.hostName}>{meeting.host?.fullName || meeting.host?.username || "-"}</span>
            </td>
            <td className={styles.cell}>
                <span className={styles.branchName}>{meeting.companyBranch?.name || "-"}</span>
            </td>
            <td className={styles.cell}>
                <span className={styles.scheduledDate}>{formatDate(meeting.scheduledDate)}</span>
            </td>
            <td className={styles.cell}>
                {meeting.meetingLink ? (
                    <a href={meeting.meetingLink} target="_blank" rel="noopener noreferrer" className={styles.meetingLink}>
                        Join Meeting
                    </a>
                ) : (
                    <span>-</span>
                )}
            </td>
            <td className={styles.cell}>
                <StatusBadge status={meeting.status} />
            </td>
            <td className={styles.cell}>
                <span className={styles.duration}>{meeting.duration || "-"}</span>
            </td>
            <td className={styles.cell}>
                <div className={styles.actions}>
                    <button
                        className={`${styles.iconBtn} ${styles.viewBtn}`}
                        title="View Details"
                        onClick={() => onView(meeting)}
                    >
                        👁️
                    </button>
                    <button
                        className={`${styles.iconBtn} ${styles.deleteBtn}`}
                        title="Delete Meeting"
                        onClick={() => onDelete(meeting)}
                    >
                        🗑️
                    </button>
                </div>
            </td>
        </tr>
    )
}

export default OpenTalkRow
