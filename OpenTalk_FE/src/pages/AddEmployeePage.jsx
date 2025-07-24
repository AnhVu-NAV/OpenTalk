import { useState, useEffect } from "react"
import axios from "/src/api/axiosClient.jsx"
import { useNavigate } from "react-router-dom"
import styles from "./styles/module/AddEmployeePage.module.css"
import { getAccessToken } from "../helper/auth.jsx"
import SuccessToast from "../components/SuccessToast/SuccessToast.jsx"

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
                const res = await axios.get("/company-branch", {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                    },
                })

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
        const { name, value, type, checked } = e.target

        if (name === "companyBranch") {
            setEmployee((prev) => ({
                ...prev,
                companyBranch: { id: value },
            }))
        } else {
            setEmployee((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
            }))
        }

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!validateForm()) return

        setLoading(true)
        try {
            await axios.post("http://localhost:8080/api/hr/employees", employee, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            })
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
        <div className={styles.hrmsContainer}>
            {/* Main Content */}
            <div className={styles.mainContent}>
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <button onClick={() => navigate("/employee")} className={styles.backButton}>
                            ←
                        </button>
                        <div>
                            <h1 className={styles.pageTitle}>Add New Employee</h1>
                            <div className={styles.breadcrumb}>
                                <span>All Employees</span>
                                <span className={styles.breadcrumbSeparator}>›</span>
                                <span className={styles.breadcrumbCurrent}>Add New Employee</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Container */}
                <div className={styles.formContainer}>
                    <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>Employee Information</h2>
                        <p className={styles.formSubtitle}>Fill in the details to create a new employee account</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.employeeForm}>
                        {/* Profile Section */}
                        <div className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>Profile Information</h3>

                            <div className={styles.profileUploadSection}>
                                <div className={styles.avatarUpload}>
                                    <div className={styles.avatarPreview}>
                                        {employee.avatarUrl ? (
                                            <img src={employee.avatarUrl || "/placeholder.svg"} alt="Avatar" className={styles.avatarImage} />
                                        ) : (
                                            <div className={styles.avatarPlaceholder}>
                                                <span className={styles.avatarIcon}>👤</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className={styles.uploadInfo}>
                                        <h4>Profile Picture</h4>
                                        <p>Add a profile picture for the employee</p>
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
                                        value={employee.fullName}
                                        onChange={handleChange}
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
                                        value={employee.email}
                                        onChange={handleChange}
                                        placeholder="Enter email address"
                                    />
                                    {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>Avatar URL</label>
                                    <input
                                        type="url"
                                        className={styles.formInput}
                                        name="avatarUrl"
                                        value={employee.avatarUrl}
                                        onChange={handleChange}
                                        placeholder="https://example.com/avatar.jpg"
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>
                                        Company Branch <span className={styles.required}>*</span>
                                    </label>
                                    <select
                                        className={`${styles.formSelect} ${errors.companyBranch ? styles.error : ""}`}
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
                                    {errors.companyBranch && <span className={styles.errorMessage}>{errors.companyBranch}</span>}
                                </div>
                            </div>
                        </div>

                        {/* Account Section */}
                        <div className={styles.formSection}>
                            <h3 className={styles.sectionTitle}>Account Credentials</h3>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>
                                        Username <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className={`${styles.formInput} ${errors.username ? styles.error : ""}`}
                                        name="username"
                                        value={employee.username}
                                        onChange={handleChange}
                                        placeholder="Enter username"
                                    />
                                    {errors.username && <span className={styles.errorMessage}>{errors.username}</span>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>
                                        Password <span className={styles.required}>*</span>
                                    </label>
                                    <input
                                        type="password"
                                        className={`${styles.formInput} ${errors.password ? styles.error : ""}`}
                                        name="password"
                                        value={employee.password}
                                        onChange={handleChange}
                                        placeholder="Enter password (min 6 characters)"
                                    />
                                    {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
                                </div>

                                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                                    <div className={styles.checkboxGroup}>
                                        <label className={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                className={styles.checkboxInput}
                                                name="isEnabled"
                                                checked={employee.isEnabled}
                                                onChange={handleChange}
                                            />
                                            <span className={styles.checkboxCustom}></span>
                                            <span className={styles.checkboxText}>
                        <strong>Enable Account</strong>
                        <small>Allow this employee to access the system</small>
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
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className={styles.loadingSpinner}></span>
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
            <SuccessToast message={toastMessage} isVisible={showToast} type="success" onClose={() => setShowToast(false)} />
        </div>
    )
}

export default AddEmployeeNew
