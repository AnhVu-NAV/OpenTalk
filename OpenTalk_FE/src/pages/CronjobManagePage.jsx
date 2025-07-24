import CronJobComponent from "../components/cronjob/CronjobComponent"
import styles from "./styles/module/CronjobManagePage.module.css"

const CronjobManagePage = () => {
    return (
        <div className={styles.cronjobManagePageContainer} style={{ background: "#f5f7fa" }}>
            <div
                style={{
                    maxWidth: 900,
                    margin: "40px auto",
                    padding: 32,
                    background: "#fff",
                    borderRadius: 14,
                    boxShadow: "0 2px 16px 0 rgba(0,0,0,0.06)",
                }}
            >
                <h2 style={{ fontWeight: 700, fontSize: 28, marginBottom: 16, color: "#234c38" }}>Cronjob Management</h2>
                <CronJobComponent />
            </div>
        </div>
    )
}

export default CronjobManagePage
