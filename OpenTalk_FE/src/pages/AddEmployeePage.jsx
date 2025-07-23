import {useState, useEffect} from "react"
import axios from "/src/api/axiosClient.jsx"
import {useNavigate} from "react-router-dom"
import "./styles/AddEmployeePage.css"
import {getAccessToken} from "../helper/auth.jsx";
import SuccessToast from "../components/SuccessToast/SuccessToast.jsx";

const AddEmployeeNew = () => {
    const [employee, setEmployee] = useState({
        fullName: "",
        email: "",
        username: "",
        password: "",
        isEnabled: true,
        companyBranch: { id: "" },
        role: "2", // default USER
        avatarUrl: "",
    })
    const [branches, setBranches] = useState([])
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    const [toastMessage, setToastMessage] = useState("")
    const [showToast, setShowToast] = useState(false)



    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const res = await axios.get("/company-branch",
                    {
                        headers: {
                            Authorization: `Bearer ${getAccessToken()}`,
                        },
                    }
                );

                setBranches(res.data)
            } catch (error) {
                console.error("Failed to fetch branches", error)
            }
        }
        fetchBranches()
    }, [])

    const validateForm = () => {
        const newErrors = {}

        if (!employee.fullName.trim()) newErrors.fullName = "Full name is required"
        if (!employee.email.trim()) newErrors.email = "Email is required"
        if (!employee.username.trim()) newErrors.username = "Username is required"
        if (!employee.password.trim()) newErrors.password = "Password is required"
        if (employee.password.length < 6) newErrors.password = "Password must be at least 6 characters"
        if (!employee.companyBranch) newErrors.companyBranch = "Company branch is required"

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (employee.email && !emailRegex.test(employee.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "companyBranch") {
            setEmployee((prev) => ({
                ...prev,
                companyBranch: { id: value },
            }));
        } else {
            setEmployee((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }));
        }

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)
        try {
            await axios.post("http://localhost:8080/api/hr/employees", employee,
                {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                    },
                }
            );
            setToastMessage("Employee created successfully!")
            setShowToast(true)
            setTimeout(() => navigate("/employee"), 1000)
        } catch (error) {
            console.error("Error creating employee:", error)
            alert("Failed to create employee.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="hrms-container">

            {/* Main Content */}
            <div className="main-content">
                <div className="header">
                    <div className="header-left">
                        <button onClick={() => navigate("/employee")} className="back-button">
                            ←
                        </button>
                        <div>
                            <h1 className="page-title">Add New Employee</h1>
                            <div className="breadcrumb">
                                <span>All Employees</span>
                                <span className="breadcrumb-separator">›</span>
                                <span className="breadcrumb-current">Add New Employee</span>
                            </div>
                        </div>
                    </div>


                </div>

                {/* Form Container */}
                <div className="form-container">
                    <div className="form-header">
                        <h2 className="form-title">Employee Information</h2>
                        <p className="form-subtitle">Fill in the details to create a new employee account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="employee-form">
                        {/* Profile Section */}
                        <div className="form-section">
                            <h3 className="section-title">Profile Information</h3>

                            <div className="profile-upload-section">
                                <div className="avatar-upload">
                                    <div className="avatar-preview">
                                        {employee.avatarUrl ? (
                                            <img src={employee.avatarUrl || "/placeholder.svg"} alt="Avatar"
                                                 className="avatar-image"/>
                                        ) : (
                                            <div className="avatar-placeholder">
                                                <span className="avatar-icon">👤</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="upload-info">
                                        <h4>Profile Picture</h4>
                                        <p>Add a profile picture for the employee</p>
                                    </div>
                                </div>
                            </div>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">
                                        Full Name <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-input ${errors.fullName ? "error" : ""}`}
                                        name="fullName"
                                        value={employee.fullName}
                                        onChange={handleChange}
                                        placeholder="Enter full name"
                                    />
                                    {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Email Address <span className="required">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className={`form-input ${errors.email ? "error" : ""}`}
                                        name="email"
                                        value={employee.email}
                                        onChange={handleChange}
                                        placeholder="Enter email address"
                                    />
                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Avatar URL</label>
                                    <input
                                        type="url"
                                        className="form-input"
                                        name="avatarUrl"
                                        value={employee.avatarUrl}
                                        onChange={handleChange}
                                        placeholder="https://example.com/avatar.jpg"
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Company Branch <span className="required">*</span>
                                    </label>
                                    <select
                                        className={`form-select ${errors.companyBranch ? "error" : ""}`}
                                        name="companyBranch"
                                        value={employee.companyBranch.id}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select a branch</option>
                                        {branches.map((branch) => (
                                            <option key={branch.id} value={branch.id}>
                                                {branch.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.companyBranch && <span className="error-message">{errors.companyBranch}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Account Section */}
                        <div className="form-section">
                            <h3 className="section-title">Account Credentials</h3>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">
                                        Username <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-input ${errors.username ? "error" : ""}`}
                                        name="username"
                                        value={employee.username}
                                        onChange={handleChange}
                                        placeholder="Enter username"
                                    />
                                    {errors.username && <span className="error-message">{errors.username}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Password <span className="required">*</span>
                                    </label>
                                    <input
                                        type="password"
                                        className={`form-input ${errors.password ? "error" : ""}`}
                                        name="password"
                                        value={employee.password}
                                        onChange={handleChange}
                                        placeholder="Enter password (min 6 characters)"
                                    />
                                    {errors.password && <span className="error-message">{errors.password}</span>}
                                </div>

                                <div className="form-group form-group-full">
                                    <div className="checkbox-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                className="checkbox-input"
                                                name="isEnabled"
                                                checked={employee.isEnabled}
                                                onChange={handleChange}
                                            />
                                            <span className="checkbox-custom"></span>
                                            <span className="checkbox-text">
                        <strong>Enable Account</strong>
                        <small>Allow this employee to access the system</small>
                      </span>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="form-actions">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/employee")}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <span>✓</span>
                                        Create Employee
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
            <SuccessToast
                message={toastMessage}
                isVisible={showToast}
                type="success"
                onClose={() => setShowToast(false)}
            />
        </div>
    )
}

export default AddEmployeeNew
