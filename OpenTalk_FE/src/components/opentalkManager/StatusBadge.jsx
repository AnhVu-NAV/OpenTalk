import styles from "./StatusBadge.module.css"

// Định nghĩa mapping cho từng status của MeetingStatus enum
const statusClassMap = {
    WAITING_TOPIC: styles.waitingTopic,
    WAITING_HOST_REGISTER: styles.waitingHostRegister,
    WAITING_HOST_SELECTION: styles.waitingHostSelection,
    UPCOMING: styles.upcoming,
    ONGOING: styles.ongoing,
    COMPLETED: styles.completed,
    CANCELLED: styles.cancelled,
    POSTPONED: styles.postponed,
}

function beautifyStatus(status) {
    // Chuyển "WAITING_HOST_REGISTER" thành "Waiting Host Register"
    if (!status) return ""
    return status
        .toLowerCase()
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")
}

function StatusBadge({ status }) {
    const badgeClass = `${styles.badge} ${statusClassMap[status] || styles.secondary}`

    return <span className={badgeClass}>{beautifyStatus(status)}</span>
}

export default StatusBadge
