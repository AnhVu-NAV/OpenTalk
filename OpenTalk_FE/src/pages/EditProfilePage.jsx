import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { getCurrentUser, getAccessToken } from "../helper/auth.jsx"
import styles from "./styles/module/EditProfilePage.module.css"

const EditProfilePage = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [errors, setErrors] = useState({})
    const [successMessage, setSuccessMessage] = useState("")
    const [passwordStrength, setPasswordStrength] = useState("")

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        username: "",
        avatarUrl: "",
        bio: "",
        phone: "",
        address: "",
        dateOfBirth: "",
        gender: "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        emailNotifications: true,
        pushNotifications: true,
    })

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true)
                const currentUser = getCurrentUser()

                if (currentUser) {
                    // Fetch detailed user data from API
                    const response = await axios.get(`http://localhost:8080/api/users/${currentUser.id}`, {
                        headers: {
                            Authorization: `Bearer ${getAccessToken()}`,
                        },
                    })

                    const userData = response.data.result || response.data
                    setFormData((prev) => ({
                        ...prev,
                        fullName: userData.fullName || "",
                        email: userData.email || "",
                        username: userData.username || "",
                        avatarUrl: userData.avatarUrl || "",
                        bio: userData.bio || "",
                        phone: userData.phone || "",
                        address: userData.address || "",
                        dateOfBirth: userData.dateOfBirth || "",
                        gender: userData.gender || "",
                        emailNotifications: userData.emailNotifications ?? true,
                        pushNotifications: userData.pushNotifications ?? true,
                    }))
                }
            } catch (error) {
                console.error("Error loading user data:", error)
                setErrors({ general: "Failed to load user data" })
            } finally {
                setLoading(false)
            }
        }

        fetchUserData()
    }, [])

    const validateForm = () => {
        const newErrors = {}

        // Basic validation
        if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
        if (!formData.email.trim()) newErrors.email = "Email is required"
        if (!formData.username.trim()) newErrors.username = "Username is required"

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
        }

        // Password validation (only if changing password)
        if (formData.newPassword || formData.currentPassword || formData.confirmPassword) {
            if (!formData.currentPassword) {
                newErrors.currentPassword = "Current password is required to change password"
            }
            if (!formData.newPassword) {
                newErrors.newPassword = "New password is required"
            } else if (formData.newPassword.length < 6) {
                newErrors.newPassword = "Password must be at least 6 characters"
            }
            if (formData.newPassword !== formData.confirmPassword) {
                newErrors.confirmPassword = "Passwords do not match"
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const calculatePasswordStrength = (password) => {
        if (!password) return ""

        let strength = 0
        if (password.length >= 8) strength++
        if (/[a-z]/.test(password)) strength++
        if (/[A-Z]/.test(password)) strength++
        if (/[0-9]/.test(password)) strength++
        if (/[^A-Za-z0-9]/.test(password)) strength++

        if (strength <= 2) return "weak"
        if (strength === 3) return "medium"
        if (strength === 4) return "strong"
        return "veryStrong"
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

        // Calculate password strength
        if (name === "newPassword") {
            setPasswordStrength(calculatePasswordStrength(value))
        }

        // Clear success message when user makes changes
        if (successMessage) {
            setSuccessMessage("")
        }
    }

    const handleFileUpload = (e) => {
        const file = e.target.files[0]
        if (file) {
            // In a real app, you would upload to a server
            // For now, we'll create a local URL
            const reader = new FileReader()
            reader.onload = (event) => {
                setFormData((prev) => ({
                    ...prev,
                    avatarUrl: event.target.result,
                }))
            }
            reader.readAsDataURL(file)
        }
    }

    const handleRemoveAvatar = () => {
        setFormData((prev) => ({
            ...prev,
            avatarUrl: "",
        }))
    }

    const handleSave = async () => {
        if (!validateForm()) return

        try {
            setSaving(true)
            const currentUser = getCurrentUser()

            // Prepare data for update
            const updateData = {
                fullName: formData.fullName,
                email: formData.email,
                username: formData.username,
                avatarUrl: formData.avatarUrl,
                bio: formData.bio,
                phone: formData.phone,
                address: formData.address,
                dateOfBirth: formData.dateOfBirth,
                gender: formData.gender,
                emailNotifications: formData.emailNotifications,
                pushNotifications: formData.pushNotifications,
            }

            // Add password change if provided
            if (formData.newPassword) {
                updateData.currentPassword = formData.currentPassword
                updateData.newPassword = formData.newPassword
            }

            await axios.put(`http://localhost:8080/api/users/${currentUser.id}`, updateData, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                },
            })

            setSuccessMessage("Profile updated successfully!")

            // Clear password fields
            setFormData((prev) => ({
                ...prev,
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            }))
            setPasswordStrength("")

            // Scroll to top to show success message
            window.scrollTo({ top: 0, behavior: "smooth" })
        } catch (error) {
            console.error("Failed to update profile:", error)
            if (error.response?.status === 400) {
                setErrors({ general: error.response.data.message || "Invalid data provided" })
            } else if (error.response?.status === 401) {
                setErrors({ currentPassword: "Current password is incorrect" })
            } else {
                setErrors({ general: "Failed to update profile. Please try again." })
            }
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className={styles.editProfileContainer}>
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinnerLarge}></div>
                    <p>Loading profile data...</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.editProfileContainer}>
            <div className={styles.mainContent}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <button onClick={() => navigate("/account")} className={styles.backButton}>
                            ←
                        </button>
                        <div>
                            <h1 className={styles.pageTitle}>Edit Profile</h1>
                            <div className={styles.breadcrumb}>
                                <span>Profile</span>
                                <span className={styles.breadcrumbSeparator}>›</span>
                                <span className={styles.breadcrumbCurrent}>Edit Profile</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Container */}
                <div className={styles.formContainer}>
                    <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>Profile Settings</h2>
                        <p className={styles.formSubtitle}>Update your personal information and account preferences</p>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className={styles.successMessage}>
                            <span>{successMessage}</span>
                        </div>
                    )}

                    {/* General Error */}
                    {errors.general && (
                        <div className={styles.errorMessage} style={{ margin: "20px 40px" }}>
                            {errors.general}
                        </div>
                    )}

                    {/* Profile Picture Section */}
                    <div className={styles.profilePictureSection}>
                        <h3 className={styles.sectionTitle}>Profile Picture</h3>
                        <div className={styles.avatarUploadContainer}>
                            <div className={styles.currentAvatar}>
                                {formData.avatarUrl ? (
                                    <img src={formData.avatarUrl || "/placeholder.svg"} alt="Profile" className={styles.avatarImage} />
                                ) : (
                                    <div className={styles.avatarPlaceholder}>
                                        <span className={styles.avatarIcon}>👤</span>
                                    </div>
                                )}
                            </div>
                            <div className={styles.avatarUploadInfo}>
                                <h4>Change Profile Picture</h4>
                                <p>Upload a new profile picture. Recommended size: 400x400px. Max file size: 5MB.</p>
                                <div className={styles.uploadButtons}>
                                    <label className={`${styles.uploadBtn} ${styles.uploadBtnPrimary}`}>
                                        📷 Upload New
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileUpload}
                                            className={styles.hiddenFileInput}
                                        />
                                    </label>
                                    {formData.avatarUrl && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveAvatar}
                                            className={`${styles.uploadBtn} ${styles.uploadBtnSecondary}`}
                                        >
                                            🗑️ Remove
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>Personal Information</h3>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    👤 Full Name <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`${styles.formInput} ${errors.fullName ? styles.error : ""}`}
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full name"
                                />
                                {errors.fullName && <span className={styles.errorMessage}>{errors.fullName}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    ✉️ Email Address <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="email"
                                    className={`${styles.formInput} ${errors.email ? styles.error : ""}`}
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email address"
                                />
                                {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>
                                    🏷️ Username <span className={styles.required}>*</span>
                                </label>
                                <input
                                    type="text"
                                    className={`${styles.formInput} ${errors.username ? styles.error : ""}`}
                                    name="username"
                                    value={formData.username}
                                    onChange={handleInputChange}
                                    placeholder="Enter your username"
                                />
                                {errors.username && <span className={styles.errorMessage}>{errors.username}</span>}
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>📱 Phone Number</label>
                                <input
                                    type="tel"
                                    className={styles.formInput}
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    placeholder="Enter your phone number"
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>🎂 Date of Birth</label>
                                <input
                                    type="date"
                                    className={styles.formInput}
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.formLabel}>⚧️ Gender</label>
                                <select className={styles.formInput} name="gender" value={formData.gender} onChange={handleInputChange}>
                                    <option value="">Select gender</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer-not-to-say">Prefer not to say</option>
                                </select>
                            </div>

                            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                                <label className={styles.formLabel}>🏠 Address</label>
                                <input
                                    type="text"
                                    className={styles.formInput}
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    placeholder="Enter your address"
                                />
                            </div>

                            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                                <label className={styles.formLabel}>📝 Bio</label>
                                <textarea
                                    className={`${styles.formInput} ${styles.formTextarea}`}
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleInputChange}
                                    placeholder="Tell us about yourself..."
                                    rows={4}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Password Change Section */}
                    <div className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>Change Password</h3>
                        <div className={styles.passwordSection}>
                            <h4 className={styles.passwordTitle}>Update Your Password</h4>
                            <div className={styles.passwordNote}>
                                <p>Leave password fields empty if you don't want to change your password.</p>
                            </div>

                            <div className={styles.formGrid}>
                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>🔒 Current Password</label>
                                    <input
                                        type="password"
                                        className={`${styles.formInput} ${errors.currentPassword ? styles.error : ""}`}
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleInputChange}
                                        placeholder="Enter current password"
                                    />
                                    {errors.currentPassword && <span className={styles.errorMessage}>{errors.currentPassword}</span>}
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>🔑 New Password</label>
                                    <input
                                        type="password"
                                        className={`${styles.formInput} ${errors.newPassword ? styles.error : ""}`}
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleInputChange}
                                        placeholder="Enter new password"
                                    />
                                    {errors.newPassword && <span className={styles.errorMessage}>{errors.newPassword}</span>}
                                    {formData.newPassword && (
                                        <div className={styles.passwordStrength}>
                                            <div className={styles.strengthLabel}>Password Strength</div>
                                            <div className={styles.strengthBar}>
                                                <div className={`${styles.strengthFill} ${styles[passwordStrength]}`}></div>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.formLabel}>🔑 Confirm New Password</label>
                                    <input
                                        type="password"
                                        className={`${styles.formInput} ${errors.confirmPassword ? styles.error : ""}`}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        placeholder="Confirm new password"
                                    />
                                    {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword}</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notification Settings */}
                    <div className={styles.formSection}>
                        <h3 className={styles.sectionTitle}>Notification Preferences</h3>
                        <div className={styles.formGrid}>
                            <div className={styles.formGroup}>
                                <div className={styles.toggleGroup}>
                                    <div className={styles.toggleLabel}>
                                        <strong>📧 Email Notifications</strong>
                                        <small>Receive notifications via email</small>
                                    </div>
                                    <label className={`${styles.toggleSwitch} ${formData.emailNotifications ? styles.active : ""}`}>
                                        <input
                                            type="checkbox"
                                            className={styles.toggleInput}
                                            name="emailNotifications"
                                            checked={formData.emailNotifications}
                                            onChange={handleInputChange}
                                        />
                                        <span className={styles.toggleSlider}></span>
                                    </label>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <div className={styles.toggleGroup}>
                                    <div className={styles.toggleLabel}>
                                        <strong>🔔 Push Notifications</strong>
                                        <small>Receive push notifications in browser</small>
                                    </div>
                                    <label className={`${styles.toggleSwitch} ${formData.pushNotifications ? styles.active : ""}`}>
                                        <input
                                            type="checkbox"
                                            className={styles.toggleInput}
                                            name="pushNotifications"
                                            checked={formData.pushNotifications}
                                            onChange={handleInputChange}
                                        />
                                        <span className={styles.toggleSlider}></span>
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
                            onClick={() => navigate("/account")}
                            disabled={saving}
                        >
                            ❌ Cancel
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
                                <>💾 Save Changes</>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfilePage
