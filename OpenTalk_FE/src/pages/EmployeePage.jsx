"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { FaSearch, FaDownload, FaPlus, FaEye, FaTrash, FaChevronLeft, FaChevronRight, FaFilter } from "react-icons/fa"
import axios from "/src/api/axiosClient.jsx"
import DeleteModal from "../components/deleteModal/DeleteModal.jsx"
import { getAccessToken } from "../helper/auth"
import "./styles/EmployeePage.css"

const getStatusClass = (status) => {
    const statusMap = {
        Active: "status-active",
        "On Boarding": "status-onboarding",
        Probation: "status-probation",
        "On Leave": "status-leave",
    }
    return `status-badge ${statusMap[status] || "status-badge"}`
}

const EmployeePage = () => {
    const [employees, setEmployees] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [officeFilter, setOfficeFilter] = useState(null)
    const [statusFilter, setStatusFilter] = useState(null)
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [showDelete, setShowDelete] = useState(false)
    const [selectedEmployee, setSelectedEmployee] = useState(null)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState("")
    const itemsPerPage = 8

    const navigate = useNavigate()

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const res = await axios.get("/hr/employees", {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                    },
                })
                setEmployees(res.data.content)
            } catch (error) {
                console.error("Error fetching employees:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchEmployees()
    }, [])



    const filtered = employees.filter((emp) => {
        const matchesSearch =
            emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.email?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesOffice = officeFilter ? emp.companyBranch?.name === officeFilter : true
        const matchesStatus = statusFilter ? emp.status === statusFilter : true
        return matchesSearch && matchesOffice  && matchesStatus
    })

    const totalPages = Math.ceil(filtered.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedEmployees = filtered.slice(startIndex, startIndex + itemsPerPage)

    const uniqueOffices = [...new Set(employees.map((e) => e.companyBranch?.name).filter(Boolean))]
    const uniqueStatuses = [...new Set(employees.map((e) => e.isEnabled).filter(Boolean))]
    console.log(uniqueStatuses)

    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`/hr/employees/${selectedEmployee.id}`, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`
                }
            })
            setEmployees((prev) => prev.filter((e) => e.id !== selectedEmployee.id))
            setToastMessage("Employee deleted successfully!")
            setShowToast(true)
        } catch (error) {
            console.error("Failed to delete employee", error)
            alert("Failed to delete employee.")
        } finally {
            setShowDelete(false)
        }
    }
    const handleExport = async () => {
        try {
            const response = await axios.get('/hr/export/', {
                params: { status: statusFilter, companyBranchId: officeFilter},
                responseType: 'blob',
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`
                }// vì server trả file Excel
            })
            // tạo link ẩn để download
            const blob = new Blob([response.data])
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', 'employees.xlsx')
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (err) {
            console.error('Export thất bại:', err)
        }
    }

    if (loading) {
        return (
            <div className="hrms-container">
                <div className="loading-container">
                    <div className="loading-spinner-large"></div>
                    <p>Loading employees...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="hrms-container">

            {/* Main Content */}
            <div className="main-content">
                <div className="header">
                    <div className="header-left">
                        <h1 className="page-title">All Employees</h1>
                        <p className="page-subtitle">Manage your team members and their information</p>
                    </div>

                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">👥</div>
                        <div className="stat-content">
                            <h3>{employees.length}</h3>
                            <p>Total Employees</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-content">
                            <h3>{employees.filter((e) => e.status === "Active").length}</h3>
                            <p>Active</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">🔄</div>
                        <div className="stat-content">
                            <h3>{employees.filter((e) => e.status === "On Boarding").length}</h3>
                            <p>On Boarding</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">⏸️</div>
                        <div className="stat-content">
                            <h3>{employees.filter((e) => e.status === "On Leave").length}</h3>
                            <p>On Leave</p>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="action-bar">
                    <div className="action-search">
                        <FaSearch className="action-search-icon" />
                        <input
                            type="text"
                            className="action-search-input"
                            placeholder="Search employees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="action-buttons">
                        <button className="btn btn-outline" onClick={handleExport}>
                            <FaDownload />
                            Export
                        </button>
                        <button onClick={() => navigate("/employee/add")} className="btn btn-primary">
                            <FaPlus />
                            Add Employee
                        </button>
                        <button className="btn btn-outline">
                            <FaFilter />
                            Filter
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="filters-row">
                    <div className="filter-group">
                        <select className="filter-select" value={officeFilter} onChange={(e) => setOfficeFilter(e.target.value)}>
                            <option value="">All Offices</option>
                            {uniqueOffices.map((office) => (
                                <option key={office} value={office}>
                                    {office}
                                </option>
                            ))}
                        </select>
                    </div>


                    <div className="filter-group">
                        <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                            <option value="">All Status</option>
                            {uniqueStatuses.map((status) => (
                                <option key={status} value={status}>
                                    {status ? 'Activated' : 'Inactivated'}
                                </option>
                            ))}
                        </select>
                    </div>

                    {(officeFilter  || statusFilter || searchTerm) && (
                        <button
                            className="clear-filters-btn"
                            onClick={() => {
                                setOfficeFilter("")
                                setStatusFilter("")
                                setSearchTerm("")
                            }}
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Table */}
                <div className="table-container">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>
                                <input type="checkbox" className="checkbox" />
                            </th>
                            <th>Employee</th>
                            <th>Email</th>
                            <th>Office</th>
                            <th>Status</th>
                            <th>Account</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedEmployees.map((emp) => (
                            <tr key={emp.id}>
                                <td>
                                    <input type="checkbox" className="checkbox" />
                                </td>
                                <td>
                                    <div className="employee-info">
                                        <div className="employee-avatar">
                                            {emp.avatarUrl ? (
                                                <img src={emp.avatarUrl || "/placeholder.svg"} alt={emp.fullName} className="avatar-image" />
                                            ) : (
                                                <div className="avatar-placeholder">{emp.fullName?.charAt(0)?.toUpperCase() || "?"}</div>
                                            )}
                                        </div>
                                        <div className="employee-details">
                                            <div className="employee-name">{emp.fullName}</div>
                                            <div className="employee-id">ID: {emp.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="email-cell">{emp.email}</div>
                                </td>
                                <td>
                                    <div className="office-cell">{emp.companyBranch?.name || "N/A"}</div>
                                </td>
                                <td>
                                    <span className={getStatusClass(emp.status)}>{emp.status?.toUpperCase() || "N/A"}</span>
                                </td>
                                <td>
                    <span className={`account-badge ${emp.isEnabled ? "enabled" : "disabled"}`}>
                      {emp.isEnabled ? "Activated" : "Disabled"}
                    </span>
                                </td>
                                <td>
                                    <div className="action-buttons">
                                        <button
                                            onClick={() => navigate(`/employee/edit/${emp.id}`)}
                                            className="action-btn action-btn-view"
                                            title="View Employee"
                                        >
                                            <FaEye />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedEmployee(emp)
                                                setShowDelete(true)
                                            }}
                                            className="action-btn action-btn-delete"
                                            title="Delete Employee"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="pagination-container">
                        <div className="pagination-info">
                            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filtered.length)} of {filtered.length}{" "}
                            results
                        </div>

                        <div className="pagination-controls">
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className="pagination-btn"
                            >
                                <FaChevronLeft />
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`pagination-number ${currentPage === i + 1 ? "active" : ""}`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className="pagination-btn"
                            >
                                <FaChevronRight />
                            </button>
                        </div>
                    </div>
                </div>

                <DeleteModal
                    isOpen={showDelete}
                    title="Delete Employee"
                    message={`Are you sure you want to delete ${selectedEmployee?.fullName}?`}
                    onCancel={() => setShowDelete(false)}
                    onConfirm={handleConfirmDelete}
                />
            </div>
        </div>
    )
}

export default EmployeePage
