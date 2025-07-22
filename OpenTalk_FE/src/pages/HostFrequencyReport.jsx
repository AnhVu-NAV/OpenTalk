import {useEffect, useState} from "react"
import "./styles/HostFrequencyReport.css"
import axios from "../api/axiosClient.jsx"
import {getAccessToken} from "../helper/auth.jsx";

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
        <div className="hrms-container">
            {/* Main Content */}
            <div className="main-content">
                <div className="header">
                    <div className="header-left">
                        <h1 className="page-title">Host Frequency Report</h1>
                        <p className="page-subtitle">Summary of Opentalk Hosting Activities</p>
                    </div>
                </div>

                {/* Content Search */}
                <div className="content-search">
                    <div className="content-search-container">
                        <input
                            type="text"
                            className="content-search-input"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="content-search-icon">🔍</span>
                    </div>
                </div>

                {/* Table */}
                <div className="table-container">
                    <table className="table">
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
                                    <div className="employee-info">
                                        <img
                                            src={"/placeholder.svg"}
                                            className="employee-avatar"
                                        />
                                        <span className="employee-name">{employee.fullName}</span>
                                    </div>
                                </td>
                                <td>{employee.branchName}</td>
                                <td>
                                    <span className="sessions-count">{employee.approvedCount}</span>
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
                    <div className="pagination-container">
                        <div className="pagination-left">
                            <span className="pagination-showing">Showing</span>
                            <select
                                className="pagination-select"
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>

                        <div className="pagination-info">Showing 1 to 10 out of 60 records</div>

                        <div className="pagination-right">
                            <button
                                className="pagination-btn"
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                            >
                                ‹
                            </button>

                            {[1, 2, 3, 4].map((page) => (
                                <button
                                    key={page}
                                    className={`pagination-btn ${currentPage === page ? "active" : ""}`}
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </button>
                            ))}

                            <button
                                className="pagination-btn"
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
