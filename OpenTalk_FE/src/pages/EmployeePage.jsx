import {useState, useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {FaSearch, FaDownload, FaPlus, FaEye, FaTrash, FaChevronLeft, FaChevronRight, FaFilter} from "react-icons/fa"
import axios from "/src/api/axiosClient.jsx"
import DeleteModal from "../components/deleteModal/DeleteModal.jsx"
import {getAccessToken} from "../helper/auth"
import styles from "./styles/module/EmployeePage.module.css"
import SuccessToast from "../components/SuccessToast/SuccessToast.jsx"

const getStatusClass = (status) => {
    const statusMap = {
        Active: "statusActive",
        "On Boarding": "statusOnboarding",
        Probation: "statusProbation",
        "On Leave": "statusLeave",
    }
    return `${styles.statusBadge} ${styles[statusMap[status]] || styles.statusBadge}`
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
    const [totalItems, setTotalItems] = useState(0)
    const itemsPerPage = 8


    const navigate = useNavigate()

    useEffect(() => {
        const fetchEmployees = async () => {
            setLoading(true)
            try {
                const params = {
                    page: currentPage - 1,
                    size: itemsPerPage,
                    email: searchTerm || "",
                    isEnable: statusFilter === "Activated" ? true : statusFilter === "Inactivated" ? false : undefined,
                    companyBranchId: officeFilter || undefined,
                }

                const res = await axios.get("/hr/employees", {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                    },
                    params,
                })

                setEmployees(res.data.content)
                setTotalItems(res.data.totalElements)
            } catch (error) {
                console.error("Error fetching employees:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchEmployees()
    }, [searchTerm, statusFilter, officeFilter, currentPage])

    const totalPages = Math.ceil(totalItems / itemsPerPage)
    const paginatedEmployees = employees

    const uniqueOffices = [...new Set(employees.map((e) => e.companyBranch?.name).filter(Boolean))]
    const uniqueStatuses = [...new Set(employees.map((e) => e.isEnabled).filter(Boolean))]
    console.log(uniqueStatuses)
    const roleMap = {
        1: "Meeting Manager",
        2: "Employee",
        3: "HR",
    }


    const handleConfirmDelete = async () => {
        try {
            await axios.delete(`/hr/employees/${selectedEmployee.id}`, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
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
            const response = await axios.get("/hr/export/", {
                params: {status: statusFilter, companyBranchId: officeFilter},
                responseType: "blob",
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                }, // vì server trả file Excel
            })
            // tạo link ẩn để download
            const blob = new Blob([response.data])
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.setAttribute("download", "employees.xlsx")
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (err) {
            console.error("Export thất bại:", err)
        }
    }

    if (loading) {
        return (
            <div className={styles.hrmsContainer}>
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinnerLarge}></div>
                    <p>Loading employees...</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.hrmsContainer}>
            {/* Main Content */}
            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.pageTitle}>All Employees</h1>
                        <p className={styles.pageSubtitle}>Manage your team members and their information</p>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>👥</div>
                        <div className={styles.statContent}>
                            <h3>{totalItems}</h3>
                            <p>Total Employees</p>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>✅</div>
                        <div className={styles.statContent}>
                            <h3>{employees.filter((e) => e.isEnabled).length}</h3>
                            <p>Active</p>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>🚫</div>
                        <div className={styles.statContent}>
                            <h3>{employees.filter((e) => !e.isEnabled).length}</h3>
                            <p>Disabled Accounts</p>
                        </div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statIcon}>🧑‍💼</div>
                        <div className={styles.statContent}>
                            <h3>{employees.filter((e) => e.role === 2).length}</h3>
                            <p>Employees</p>
                        </div>
                    </div>
                </div>

                {/* Action Bar */}
                <div className={styles.actionBar}>
                    <div className={styles.actionSearch}>
                        <FaSearch className={styles.actionSearchIcon}/>
                        <input
                            type="text"
                            className={styles.actionSearchInput}
                            placeholder="Search employees..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className={styles.actionButtons}>
                        <button className={`${styles.btn} ${styles.btnOutline}`} onClick={handleExport}>
                            <FaDownload/>
                            Export
                        </button>
                        <button onClick={() => navigate("/employee/add")}
                                className={`${styles.btn} ${styles.btnPrimary}`}>
                            <FaPlus/>
                            Add Employee
                        </button>
                        <button className={`${styles.btn} ${styles.btnOutline}`}>
                            <FaFilter/>
                            Filter
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className={styles.filtersRow}>
                    <div className={styles.filterGroup}>
                        <select
                            className={styles.filterSelect}
                            value={officeFilter}
                            onChange={(e) => setOfficeFilter(e.target.value)}
                        >
                            <option value="">All Offices</option>
                            {uniqueOffices.map((office) => (
                                <option key={office} value={office}>
                                    {office}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterGroup}>
                        <select
                            className={styles.filterSelect}
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="">All Status</option>
                            <option value="Activated">Activated</option>
                            <option value="Inactivated">Disabled</option>
                        </select>
                    </div>


                    {(officeFilter || statusFilter || searchTerm) && (
                        <button
                            className={styles.clearFiltersBtn}
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
                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                        <tr>
                            <th>
                                <input type="checkbox" className={styles.checkbox}/>
                            </th>
                            <th>Employee</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Office</th>
                            <th>Role</th>
                            <th>Account</th>
                            <th>Actions</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedEmployees.map((emp) => (
                            <tr key={emp.id}>
                                <td>
                                    <input type="checkbox" className={styles.checkbox}/>
                                </td>
                                <td>
                                    <div className={styles.employeeInfo}>
                                        <div className={styles.employeeAvatar}>
                                            {emp.avatarUrl ? (
                                                <img
                                                    src={emp.avatarUrl}
                                                    alt={emp.fullName}
                                                    className={styles.avatarImage}
                                                />
                                            ) : (
                                                <div className={styles.avatarPlaceholder}>
                                                    {emp.fullName?.charAt(0)?.toUpperCase() || "?"}
                                                </div>
                                            )}
                                        </div>
                                        <div className={styles.employeeDetails}>
                                            <div className={styles.employeeName}>{emp.fullName}</div>
                                            <div className={styles.employeeId}>ID: {emp.id}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className={styles.emailCell}>{emp.email}</div>
                                </td>
                                <td>
                                    <div className={styles.usernameCell}>{emp.username}</div>
                                </td>
                                <td>
                                    <div className={styles.officeCell}>{emp.companyBranch?.name || "N/A"}</div>
                                </td>
                                <td>
                                    <div className={styles.roleCell}>{roleMap[emp.role] || "Unknown"}</div>
                                </td>
                                <td>
                    <span className={`${styles.accountBadge} ${emp.isEnabled ? styles.enabled : styles.disabled}`}>
                        {emp.isEnabled ? "Activated" : "Disabled"}
                    </span>
                                </td>
                                <td>
                                    <div className={styles.actionButtons}>
                                        <button
                                            onClick={() => navigate(`/employee/edit/${emp.id}`)}
                                            className={`${styles.actionBtn} ${styles.actionBtnView}`}
                                            title="View Employee"
                                        >
                                            <FaEye/>
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedEmployee(emp)
                                                setShowDelete(true)
                                            }}
                                            className={`${styles.actionBtn} ${styles.actionBtnDelete}`}
                                            title="Delete Employee"
                                        >
                                            <FaTrash/>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className={styles.paginationContainer}>
                        <div className={styles.paginationInfo}>
                            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} results
                        </div>

                        <div className={styles.paginationControls}>
                            <button
                                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                disabled={currentPage === 1}
                                className={styles.paginationBtn}
                            >
                                <FaChevronLeft/>
                            </button>

                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`${styles.paginationNumber} ${currentPage === i + 1 ? styles.active : ""}`}
                                >
                                    {i + 1}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                disabled={currentPage === totalPages}
                                className={styles.paginationBtn}
                            >
                                <FaChevronRight/>
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

                <SuccessToast message={toastMessage} isVisible={showToast} type="success"
                              onClose={() => setShowToast(false)}/>
            </div>
        </div>
    )
}

export default EmployeePage
