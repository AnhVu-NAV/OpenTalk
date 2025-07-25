import { useEffect, useState } from "react"
import styles from "./styles/module/AttendanceAdminPage.module.css"
import { FaSearch, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import axios from "../api/axiosClient.jsx"

const AttendanceAdminPage = () => {
    const [attendances, setAttendances] = useState([])
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchAttendances()
    }, [])

    const fetchAttendances = async () => {
        setLoading(true)
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
        } finally {
            setLoading(false)
        }
    }

    // Filter data based on search
    const filtered = attendances.filter(
        (a) =>
            a.fullName.toLowerCase().includes(search.toLowerCase()) ||
            a.role.toLowerCase().includes(search.toLowerCase()) ||
            a.type.toLowerCase().includes(search.toLowerCase()),
    )

    // Pagination logic
    const totalItems = filtered.length
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentItems = filtered.slice(startIndex, endIndex)

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page)
        }
    }

    const handleItemsPerPageChange = (e) => {
        setItemsPerPage(Number.parseInt(e.target.value))
        setCurrentPage(1) // Reset to first page
    }

    const renderPaginationButtons = () => {
        const buttons = []
        const maxVisiblePages = 5

        // Previous button
        buttons.push(
            <li key="prev" className={`${styles.pageItem} ${currentPage === 1 ? styles.disabled : ""}`}>
                <button
                    className={styles.pageLink}
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                >
                    <FaChevronLeft />
                </button>
            </li>,
        )

        // Page numbers
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
        const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
            buttons.push(
                <li key={i} className={`${styles.pageItem} ${currentPage === i ? styles.active : ""}`}>
                    <button className={styles.pageLink} onClick={() => handlePageChange(i)}>
                        {i}
                    </button>
                </li>,
            )
        }

        // Next button
        buttons.push(
            <li key="next" className={`${styles.pageItem} ${currentPage === totalPages ? styles.disabled : ""}`}>
                <button
                    className={styles.pageLink}
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                >
                    <FaChevronRight />
                </button>
            </li>,
        )

        return buttons
    }

    return (
        <div className={`container mt-4 ${styles.attendanceWrapper}`}>
            <div className={styles.headerSection}>
                <h2 className="fw-bold">Attendance Management</h2>
                <div className={styles.searchBox}>
                    <FaSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Search employee, role, or type..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
            </div>

            {loading ? (
                <div className="text-center py-5">
                    <div className="spinner-border text-success" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
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
                        {currentItems.map((a) => (
                            <tr key={a.userId}>
                                <td data-label="Employee Name">
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
                                <td data-label="Role">{a.role}</td>
                                <td data-label="Type">{a.type}</td>
                                <td data-label="Check In Time">{a.checkinTime}</td>
                                <td data-label="Status">
                    <span className={`badge rounded-pill ${a.status === "Late" ? "bg-danger" : "bg-success"}`}>
                      {a.status}
                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {filtered.length === 0 && <div className={styles.emptyState}>No attendance records found.</div>}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className={styles.paginationWrapper}>
                            <div className={styles.paginationInfo}>
                                Showing <strong>{startIndex + 1}</strong> to <strong>{Math.min(endIndex, totalItems)}</strong> of{" "}
                                <strong>{totalItems}</strong> results
                            </div>

                            <ul className={styles.pagination}>{renderPaginationButtons()}</ul>

                            <div className={styles.pageSizeSelector}>
                                <span>Show:</span>
                                <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={20}>20</option>
                                    <option value={50}>50</option>
                                </select>
                                <span>per page</span>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default AttendanceAdminPage
