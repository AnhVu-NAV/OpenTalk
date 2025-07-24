import { useEffect, useState } from "react"
import axios from "../api/axiosClient.jsx"
import styles from "./styles/module/UserAttendanceTab.module.css"
import { getCurrentUser } from "../helper/auth.jsx"

const UserAttendanceTab = ({ userId }) => {
    const [records, setRecords] = useState([])
    const [user, setUser] = useState(null)

    useEffect(() => {
        const current = getCurrentUser()
        console.log("Loaded user:", current)
        setUser(current)
    }, [])

    useEffect(() => {
        const current = getCurrentUser()
        axios
            .get(`/attendances/user/${current.id}`)
            .then((res) => setRecords(res.data))
            .catch((err) => console.error("Attendance fetch error", err))
    }, [userId])

    return (
        <div className={styles.attendanceTabContainer}>
            <table className={styles.attendanceTable}>
                <thead>
                <tr>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Break</th>
                    <th>Working Hours</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {records.length > 0 ? (
                    records.map((r, i) => (
                        <tr key={i}>
                            <td>{r.date}</td>
                            <td>{r.checkIn}</td>
                            <td>{r.checkOut}</td>
                            <td>{r.breakDuration} Min</td>
                            <td>{r.workingHours} Hrs</td>
                            <td>
                  <span
                      className={`${styles.attendanceBadge} ${r.status === "Late" ? styles.bgDanger : styles.bgSuccess}`}
                  >
                    {r.status}
                  </span>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className={styles.attendanceEmptyState}>
                            No attendance records found
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    )
}

export default UserAttendanceTab
