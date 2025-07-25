import styles from "./ConfirmModal.module.css"

function ConfirmModal({ show, title, message, onCancel, onConfirm }) {
    if (!show) return null

    return (
        <div className={styles.modalOverlay} onClick={onCancel}>
            <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h4 className={styles.modalTitle}>{title || "Confirm"}</h4>
                    <button className={styles.closeButton} onClick={onCancel}>
                        ×
                    </button>
                </div>
                <div className={styles.modalBody}>
                    <div>{message || "Are you sure?"}</div>
                </div>
                <div className={styles.modalFooter}>
                    <button className={`${styles.button} ${styles.cancelButton}`} onClick={onCancel}>
                        Cancel
                    </button>
                    <button className={`${styles.button} ${styles.confirmButton}`} onClick={onConfirm}>
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal
