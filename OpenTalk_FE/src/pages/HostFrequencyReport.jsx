import { useEffect, useState } from "react"
import styles from "./styles/module/HostFrequencyReport.module.css"
import axios from "../api/axiosClient.jsx"
import { getAccessToken } from "../helper/auth.jsx"

const HostFrequencyReport = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)
    const [data, setData] = useState([])
    const [error, setError] = useState()

    const fetchData = async () => {
        try {
            const res = await axios.get("/hosts/native-query/frequency", {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
            })
            setData(res.data)
            setError(null)
        } catch (err) {
            console.error(err)
            setError("Không tải được dữ liệu")
        }
    }
    useEffect(() => {
        fetchData()
    }, [])

    const filteredData = data.filter(
        (employee) =>
            employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.branchName.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    const totalRecords = 60 // Mock total records
    const totalPages = Math.ceil(totalRecords / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedData = filteredData.slice(startIndex, startIndex + itemsPerPage)

    return (
        <div className={styles.hrmsContainer}>
            {/* Main Content */}
            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.pageTitle}>Host Frequency Report</h1>
                        <p className={styles.pageSubtitle}>Summary of Opentalk Hosting Activities</p>
                    </div>
                </div>

                {/* Content Search */}
                <div className={styles.contentSearch}>
                    <div className={styles.contentSearchContainer}>
                        <input
                            type="text"
                            className={styles.contentSearchInput}
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className={styles.contentSearchIcon}>🔍</span>
                    </div>
                </div>

                {/* Table */}
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>Employee Name</th>
                            <th>Designation</th>
                            <th>Sessions Hosted</th>
                            <th>Last Hosted</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedData.map((employee) => (
                            <tr key={employee.userId}>
                                <td>
                                    <div className={styles.employeeInfo}>
                                        <img src={"/placeholder.svg"} className={styles.employeeAvatar} />
                                        <span className={styles.employeeName}>{employee.fullName}</span>
                                    </div>
                                </td>
                                <td>{employee.branchName}</td>
                                <td>
                                    <span className={styles.sessionsCount}>{employee.approvedCount}</span>
                                </td>
                                <td>
                    <span>
                      {employee.lastApprovedAt &&
                          new Date(employee.lastApprovedAt).toLocaleDateString("vi-VN", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                          })}
                    </span>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className={styles.paginationContainer}>
                        <div className={styles.paginationLeft}>
                            <span className={styles.paginationShowing}>Showing</span>
                            <select
                                className={styles.paginationSelect}
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>

                        <div className={styles.paginationInfo}>Showing 1 to 10 out of 60 records</div>

                        <div className={styles.paginationRight}>
                            <button
                                className={styles.paginationBtn}
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                            >
                                ‹
                            </button>

                            {[1, 2, 3, 4].map((page) => (
                                <button
                                    key={page}
                                    className={`${styles.paginationBtn} ${currentPage === page ? styles.active : ""}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                className={styles.paginationBtn}
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                            >
                                ›
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HostFrequencyReport
