import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { getAccessToken } from "../helper/auth.jsx"
import "./styles/EditEmployeePage.css"
import SuccessToast from "../components/SuccessToast/SuccessToast.jsx";

const ROLE_MAP = {
    1: "Admin",
    2: "User",
    3: "HR",
}

const EditEmployeePage = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState({})
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        username: "",
        avatarUrl: "",
        isEnabled: true,
        role: 2,
        companyBranchId: null,
    })
    const [branchName, setBranchName] = useState("")
    const [toastMessage, setToastMessage] = useState("")
    const [showToast, setShowToast] = useState(false)

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                setLoading(true)
                const res = await axios.get(`http://localhost:8080/api/hr/employees/${id}`, {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                    },
                })
                const user = res.data
                setFormData({
                    fullName: user.fullName || "",
                    email: user.email || "",
                    username: user.username || "",
                    avatarUrl: user.avatarUrl || "",
                    isEnabled: user.isEnabled ?? true,
                    role: user.role.roleId,
                    companyBranchId: user.companyBranchId || null,
                })

                // Fetch branch name by ID
                if (user.companyBranchId) {
                    const branchRes = await axios.get("http://localhost:8080/api/company-branch", {
                        headers: {
                            Authorization: `Bearer ${getAccessToken()}`,
                        },
                    })
                    const found = branchRes.data.find((branch) => branch.id === user.companyBranchId)
                    setBranchName(found ? found.name : "")
                }
            } catch (error) {
                console.error("Error loading employee:", error)
                alert("Failed to load employee data")
            } finally {
                setLoading(false)
            }
        }
        fetchEmployee()
    }, [id])

    const validateForm = () => {
        const newErrors = {}

        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
        if (!formData.email.trim()) newErrors.email = "Email is required"
        if (!formData.username.trim()) newErrors.username = "Username is required"

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }))

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }))
        }
    }

    const handleSave = async () => {
        if (!validateForm()) return

        try {
            setSaving(true)
            await axios.put(`http://localhost:8080/api/hr/employees/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            })
            setToastMessage("Employee updated successfully!")
            setShowToast(true)
            setTimeout(() => navigate("/employee"), 1000)
        } catch (error) {
            console.error("Failed to update employee", error)
            alert("Failed to update employee!")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="hrms-container">
                <div className="loading-container">
                    <div className="loading-spinner-large"></div>
                    <p>Loading employee data...</p>
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
                        <button onClick={() => navigate("/employee")} className="back-button">
                            ←
                        </button>
                        <div>
                            <h1 className="page-title">Edit Employee</h1>
                            <div className="breadcrumb">
                                <span>All Employees</span>
                                <span className="breadcrumb-separator">›</span>
                                <span className="breadcrumb-current">Edit Employee</span>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Form Container */}
                <div className="form-container">
                    <div className="form-header">
                        <h2 className="form-title">Employee Information</h2>
                        <p className="form-subtitle">Update employee details and account settings</p>
                    </div>

                    <div className="employee-form">
                        {/* Profile Section */}
                        <div className="form-section">
                            <h3 className="section-title">Profile Information</h3>

                            <div className="profile-display-section">
                                <div className="avatar-display">
                                    <div className="avatar-preview">
                                        {formData.avatarUrl ? (
                                            <img src={formData.avatarUrl || "/placeholder.svg"} alt="Avatar" className="avatar-image" />
                                        ) : (
                                            <div className="avatar-placeholder">
                                                <span className="avatar-icon">👤</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="profile-info">
                                        <h4>{formData.fullName || "Employee Name"}</h4>
                                        <p>{ROLE_MAP[formData.role] || "Role"}</p>
                                        <span className={`status-badge ${formData.isEnabled ? "active" : "inactive"}`}>
                      {formData.isEnabled ? "Active" : "Inactive"}
                    </span>
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
                                        value={formData.fullName}
                                        onChange={handleInputChange}
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
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter email address"
                                    />
                                    {errors.email && <span className="error-message">{errors.email}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">
                                        Username <span className="required">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`form-input ${errors.username ? "error" : ""}`}
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        placeholder="Enter username"
                                    />
                                    {errors.username && <span className="error-message">{errors.username}</span>}
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Avatar URL</label>
                                    <input
                                        type="url"
                                        className="form-input"
                                        name="avatarUrl"
                                        value={formData.avatarUrl}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com/avatar.jpg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* System Information Section */}
                        <div className="form-section">
                            <h3 className="section-title">System Information</h3>

                            <div className="form-grid">
                                <div className="form-group">
                                    <label className="form-label">Role</label>
                                    <div className="readonly-field">
                                        <input
                                            type="text"
                                            className="form-input readonly"
                                            value={ROLE_MAP[formData.role] || "Unknown"}
                                            disabled
                                        />
                                        <span className="readonly-icon">🔒</span>
                                    </div>
                                    <small className="field-note">Role cannot be changed from this form</small>
                                </div>

                                <div className="form-group">
                                    <label className="form-label">Company Branch</label>
                                    <div className="readonly-field">
                                        <input
                                            type="text"
                                            className="form-input readonly"
                                            value={branchName || "No branch assigned"}
                                            disabled
                                        />
                                        <span className="readonly-icon">🔒</span>
                                    </div>
                                    <small className="field-note">Branch assignment requires admin privileges</small>
                                </div>

                                <div className="form-group form-group-full">
                                    <div className="checkbox-group">
                                        <label className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                className="checkbox-input"
                                                name="isEnabled"
                                                checked={formData.isEnabled}
                                                onChange={handleInputChange}
                                            />
                                            <span className="checkbox-custom"></span>
                                            <span className="checkbox-text">
                        <strong>Account Status</strong>
                        <small>
                          {formData.isEnabled
                              ? "Account is active and user can access the system"
                              : "Account is disabled and user cannot access the system"}
                        </small>
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
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button type="button" className="btn btn-primary" onClick={handleSave} disabled={saving}>
                                {saving ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <span>💾</span>
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
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

export default EditEmployeePage
