import { useEffect, useState } from "react"
import styles from "./styles/module/AttendancePage.module.css"
import { FaSearch } from "react-icons/fa"
import axios from "../api/axiosClient.jsx"

const AttendancePage = () => {
    const [attendances, setAttendances] = useState([])
    const [search, setSearch] = useState("")

    useEffect(() => {
        fetchAttendances()
    }, [])

    const fetchAttendances = async () => {
        try {
            const res = await axios.get("/attendance/summary", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
                },
            })

            // Nếu res.data là object chứa data
            if (Array.isArray(res.data)) {
                setAttendances(res.data)
            } else if (Array.isArray(res.data.data)) {
                setAttendances(res.data.data)
            } else {
                setAttendances([]) // fallback
            }
        } catch (err) {
            console.error("Failed to fetch attendances", err)
            setAttendances([]) // tránh undefined
        }
    }

    const filtered = attendances.filter((a) => a.fullName.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className={`container mt-4 ${styles.attendanceWrapper}`}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="fw-bold">Attendance</h2>
                <div className={styles.searchBox}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search employee..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            <table className={`table table-hover align-middle ${styles.customTable}`}>
                <thead>
                <tr>
                    <th>Employee Name</th>
                    <th>Role</th>
                    <th>Type</th>
                    <th>Check In Time</th>
                    <th>Status</th>
                </tr>
                </thead>
                <tbody>
                {filtered.map((a) => (
                    <tr key={a.userId}>
                        <td>
                            <div className="d-flex align-items-center gap-2">
                                <img
                                    src={a.avatarUrl || "/default-avatar.png"}
                                    className="rounded-circle"
                                    alt="avatar"
                                    width={35}
                                    height={35}
                                />
                                <span>{a.fullName}</span>
                            </div>
                        </td>
                        <td>{a.role}</td>
                        <td>{a.type}</td>
                        <td>{a.checkinTime}</td>
                        <td>
                <span className={`badge rounded-pill ${a.status === "Late" ? "bg-danger" : "bg-success"}`}>
                  {a.status}
                </span>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            {filtered.length === 0 && <div className="text-center text-muted">No attendance found.</div>}
        </div>
    )
}

export default AttendancePage
