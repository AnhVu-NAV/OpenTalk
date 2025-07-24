import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from "axios"
import { getAccessToken } from "../helper/auth.jsx"
import styles from "./styles/module/EditEmployeePage.module.css"
import SuccessToast from "../components/SuccessToast/SuccessToast.jsx"

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
            <div className={styles.hrmsContainer}>
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinnerLarge}></div>
                    <p>Loading employee data...</p>
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
                        <button onClick={() => navigate("/employee")} className={styles.backButton}>
                            ←
                        </button>
                        <div>
                            <h1 className={styles.pageTitle}>Edit Employee</h1>
                            <div className={styles.breadcrumb}>
                                <span>All Employees</span>
                                <span className={styles.breadcrumbSeparator}>›</span>
                                <span className={styles.breadcrumbCurrent}>Edit Employee</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Container */}
                <div className={styles.formContainer}>
                    <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>Employee Information</h2>
                        <p className={styles.formSubtitle}>Update employee details and account settings</p>
                    </div>

                    <div className={styles.employeeForm}>
                        {/* Profile Section */}
                        <div className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>Profile Information</h3>

                            <div className={styles.profileDisplaySection}>
                                <div className={styles.avatarDisplay}>
                                    <div className={styles.avatarPreview}>
                                        {formData.avatarUrl ? (
                                            <img src={formData.avatarUrl || "/placeholder.svg"} alt="Avatar" className={styles.avatarImage} />
                                        ) : (
                                            <div className={styles.avatarPlaceholder}>
                                                <span className={styles.avatarIcon}>👤</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.profileInfo}>
                                        <h4>{formData.fullName || "Employee Name"}</h4>
                                        <p>{ROLE_MAP[formData.role] || "Role"}</p>
                                        <span className={`${styles.statusBadge} ${formData.isEnabled ? styles.active : styles.inactive}`}>
                      {formData.isEnabled ? "Active" : "Inactive"}
                    </span>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>
                                        Full Name <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`${styles.formInput} ${errors.fullName ? styles.error : ""}`}
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Enter full name"
                                    />
                                    {errors.fullName && <span className={styles.errorMessage}>{errors.fullName}</span>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>
                                        Email Address <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        type="email"
                                        className={`${styles.formInput} ${errors.email ? styles.error : ""}`}
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter email address"
                                    />
                                    {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>
                                        Username <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`${styles.formInput} ${errors.username ? styles.error : ""}`}
                                        name="username"
                                        value={formData.username}
                                        onChange={handleInputChange}
                                        placeholder="Enter username"
                                    />
                                    {errors.username && <span className={styles.errorMessage}>{errors.username}</span>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Avatar URL</label>
                                    <input
                                        type="url"
                                        className={styles.formInput}
                                        name="avatarUrl"
                                        value={formData.avatarUrl}
                                        onChange={handleInputChange}
                                        placeholder="https://example.com/avatar.jpg"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* System Information Section */}
                        <div className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>System Information</h3>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Role</label>
                                    <div className={styles.readonlyField}>
                                        <input
                                            type="text"
                                            className={`${styles.formInput} ${styles.readonly}`}
                                            value={ROLE_MAP[formData.role] || "Unknown"}
                                            disabled
                                        />
                                        <span className={styles.readonlyIcon}>🔒</span>
                                    </div>
                                    <small className={styles.fieldNote}>Role cannot be changed from this form</small>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Company Branch</label>
                                    <div className={styles.readonlyField}>
                                        <input
                                            type="text"
                                            className={`${styles.formInput} ${styles.readonly}`}
                                            value={branchName || "No branch assigned"}
                                            disabled
                                        />
                                        <span className={styles.readonlyIcon}>🔒</span>
                                    </div>
                                    <small className={styles.fieldNote}>Branch assignment requires admin privileges</small>
                                </div>

                                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                                    <div className={styles.checkboxGroup}>
                                        <label className={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                className={styles.checkboxInput}
                                                name="isEnabled"
                                                checked={formData.isEnabled}
                                                onChange={handleInputChange}
                                            />
                                            <span className={styles.checkboxCustom}></span>
                                            <span className={styles.checkboxText}>
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
                        <div className={styles.formActions}>
                            <button
                                type="button"
                                className={`${styles.btn} ${styles.btnSecondary}`}
                                onClick={() => navigate("/employee")}
                                disabled={saving}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                className={`${styles.btn} ${styles.btnPrimary}`}
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <span className={styles.loadingSpinner}></span>
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
            <SuccessToast message={toastMessage} isVisible={showToast} type="success" onClose={() => setShowToast(false)} />
        </div>
    )
}

export default EditEmployeePage
