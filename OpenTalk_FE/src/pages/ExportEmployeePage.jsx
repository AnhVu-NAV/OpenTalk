import { useState } from "react"
import "./styles/ExportEmployeePage.css"
import DeleteModal from "../components/deleteModal/DeleteModal.jsx";
import {FaTrash} from "react-icons/fa";
import {useNavigate} from "react-router-dom";
import FilterPopup from "../components/filterPopup/FilterPopup.jsx";

const ExportEmployeePage = () => {
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10)

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: "📊", active: false },
        { id: "employees", label: "All Employees", icon: "👥", active: false },
        { id: "departments", label: "All Departments", icon: "🏢", active: true },
        { id: "attendance", label: "Attendance", icon: "📅", active: false },
        { id: "payroll", label: "Payroll", icon: "💰", active: false },
        { id: "jobs", label: "Jobs", icon: "💼", active: false },
        { id: "candidates", label: "Candidates", icon: "👤", active: false },
        { id: "leaves", label: "Leaves", icon: "🏖️", active: false },
        { id: "holidays", label: "Holidays", icon: "🎉", active: false },
        { id: "settings", label: "Settings", icon: "⚙️", active: false },
    ]

    const mockEmployees = [
        {
            id: "345321231",
            name: "Darlene Robertson",
            designation: "Lead UI/UX Designer",
            type: "Office",
            status: "Permanent",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "987890345",
            name: "Floyd Miles",
            designation: "Lead UI/UX Designer",
            type: "Office",
            status: "Permanent",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "453367122",
            name: "Cody Fisher",
            designation: "Sr. UI/UX Designer",
            type: "Office",
            status: "Permanent",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "345321231",
            name: "Dianne Russell",
            designation: "Sr. UI/UX Designer",
            type: "Remote",
            status: "Permanent",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "453677881",
            name: "Savannah Nguyen",
            designation: "Sr. UI/UX Designer",
            type: "Office",
            status: "Permanent",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "009918765",
            name: "Jacob Jones",
            designation: "UX Designer",
            type: "Remote",
            status: "Permanent",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "238870122",
            name: "Marvin McKinney",
            designation: "UX Designer",
            type: "Remote",
            status: "Permanent",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "124335111",
            name: "Brooklyn Simmons",
            designation: "UI/UX Designer",
            type: "Office",
            status: "Permanent",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "435540099",
            name: "Kristin Watson",
            designation: "UI/UX Designer",
            type: "Office",
            status: "Permanent",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "009812890",
            name: "Kathryn Murphy",
            designation: "UI/UX Designer",
            type: "Office",
            status: "Permanent",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "671190345",
            name: "Arlene McCoy",
            designation: "UI/UX Designer",
            type: "Office",
            status: "Permanent",
            avatar: "/placeholder.svg?height=40&width=40",
        },
        {
            id: "091233412",
            name: "Devon Lane",
            designation: "UI/UX Designer",
            type: "Remote",
            status: "Permanent",
            avatar: "/placeholder.svg?height=40&width=40",
        },
    ]

    const filteredEmployees = mockEmployees.filter(
        (employee) =>
            employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
            employee.id.includes(searchTerm),
    )

    const totalRecords = 60 // Mock total records
    const totalPages = Math.ceil(totalRecords / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + itemsPerPage)
    const [showDelete, setShowDelete] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [showFilter, setShowFilter] = useState(false);

    const navigate = useNavigate()

    const handleExport = () => {
        alert("Exporting employee list...")
        // Here you would implement actual export functionality
    }

    const handleAddEmployee = () => {
        navigate("/employee/add");
        // Here you would navigate to add employee page
    }

    const handleFilter = () => {
        setShowFilter(true);
        // Here you would implement filter modal/dropdown
    }

    const handleView = (employee) => {
        alert(`View details for ${employee.name}`)
    }

    const handleEdit = (employee) => {
        alert(`Edit ${employee.name}`)
    }

    const handleConfirmDelete = () => {
        alert(`${selectedEmployee?.name} deleted.`);
        setShowDelete(false);
    };

    return (
        <div className="hrms-container">
            {/* Main Content */}
            <div className="main-content">
                <div className="header">
                    <div className="header-left">
                        <h1 className="page-title">Export Employee</h1>
                        <div className="breadcrumb">
                            <span>Employee</span>
                            <span className="breadcrumb-separator">›</span>
                            <span className="breadcrumb-current">Export Employee</span>
                        </div>
                    </div>

                </div>

                {/* Action Bar */}
                <div className="action-bar">
                    <div className="action-search">
                        <input
                            type="text"
                            className="action-search-input"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="action-search-icon">🔍</span>
                    </div>

                    <div className="action-buttons">
                        <button className="btn btn-primary" onClick={handleExport}>
                            <span>📤</span>
                            Export
                        </button>
                        <button className="btn btn-primary" onClick={handleAddEmployee}>
                            <span>➕</span>
                            Add New Employee
                        </button>
                        <button className="btn btn-outline" onClick={handleFilter}>
                            <span>🔽</span>
                            Filter
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="table-container">
                    <table className="table">
                        <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Employee Name</th>
                            <th>Designation</th>
                            <th>Type</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                        </thead>
                        <tbody>
                        {paginatedEmployees.map((employee) => (
                            <tr key={employee.id}>
                                <td>
                                    <span className="employee-id">{employee.id}</span>
                                </td>
                                <td>
                                    <div className="employee-info">
                                        <img
                                            src={employee.avatar || "/placeholder.svg"}
                                            alt={employee.name}
                                            className="employee-avatar"
                                        />
                                        <span className="employee-name">{employee.name}</span>
                                    </div>
                                </td>
                                <td>
                                    <span className="designation">{employee.designation}</span>
                                </td>
                                <td>
                    <span className={`type-badge ${employee.type === "Office" ? "type-office" : "type-remote"}`}>
                      {employee.type}
                    </span>
                                </td>
                                <td>
                                    <span className="status-badge">{employee.status}</span>
                                </td>
                                <td>
                                    <div className="action-buttons-cell">
                                        <button className="action-btn action-btn-view" onClick={() => handleView(employee)}>
                                            👁️
                                        </button>
                                        <button className="action-btn action-btn-edit" onClick={() => handleEdit(employee)}>
                                            ✏️
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedEmployee(employee);
                                                setShowDelete(true);
                                            }}
                                            className="action-btn action-btn-delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>

                    <DeleteModal
                        isOpen={showDelete}
                        title="Delete Employee"
                        message={`Are you sure you want to delete ${selectedEmployee?.name}?`}
                        onCancel={() => setShowDelete(false)}
                        onConfirm={handleConfirmDelete}
                    />

                    <FilterPopup isOpen={showFilter} onClose={() => setShowFilter(false)} />

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

export default ExportEmployeePage
