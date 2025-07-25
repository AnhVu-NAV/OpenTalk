import { useEffect, useState } from "react"
import axios from "../api/axiosClient.jsx"
import UserAttendanceTab from "./UserAttendanceTab"
import styles from "./styles/module/UserProfilePage.module.css"
import { getCurrentUser } from "../helper/auth.jsx"
import { useNavigate } from "react-router-dom"


const UserProfilePage = ({ userId }) => {
    const [user, setUser] = useState(null)
    const [activeTab, setActiveTab] = useState("profile")
    const [avatarBgColor, setAvatarBgColor] = useState("hsl(0, 70%, 85%)")
    const getRandomPastelColor = () => {
        const hue = Math.floor(Math.random() * 360)
        return `hsl(${hue}, 70%, 85%)` // pastel màu sáng
    }
    const navigate = useNavigate()

    const handleEditClick = () => {
        navigate("/edit-profile")
    }

    useEffect(() => {
        if (!user?.avatarUrl) {
            setAvatarBgColor(getRandomPastelColor())
        }
    }, [user])

    useEffect(() => {
        const current = getCurrentUser()
        console.log("Loaded user:", current)
        setUser(current)
    }, [])

    useEffect(() => {
        const current = getCurrentUser()
        axios
            .get(`/users/${current.id}`)
            .then((res) => setUser(res.data.result))
            .catch((err) => console.error("User fetch error", err))
    }, [userId])

    if (!user) {
        return (
            <div className={styles.profileLoadingContainer}>
                <div className={styles.profileLoadingSpinner}></div>
                <p>Loading user profile...</p>
            </div>
        )
    }

    const tabs = [
        // { id: "profile", label: "Profile", icon: "👤" },
        { id: "personal", label: "Personal Information", icon: "📋" },
        { id: "professional", label: "Professional Information", icon: "💼" },
        { id: "attendance", label: "Attendance", icon: "📅" },
        { id: "documents", label: "Documents", icon: "📄" },
        { id: "access", label: "Account Access", icon: "🔐" },
    ]

    return (
        <div className={styles.userProfilePage}>
            {/* Main Content */}
            <div className={styles.profileMain}>
                {/* Header */}
                <div className={styles.profileHeader}>
                    <div className={styles.profileHeaderTop}>
                        <div className={styles.profileBreadcrumb}>
                            <span>All Employee</span>
                            <span className={styles.profileSeparator}>›</span>
                            <span>{user.fullName}</span>
                        </div>
                    </div>

                    <div className={styles.profileUserHeader}>
                        <div className={styles.profileUserInfoSection}>
                            {user.avatarUrl ? (
                                <img
                                    src={user.avatarUrl}
                                    alt="User Avatar"
                                    className={styles.profileUserAvatar}
                                />
                            ) : (
                                <div
                                    className={styles.profileAvatarFallback}
                                    style={{ backgroundColor: avatarBgColor }}
                                >
                                    {user.fullName?.charAt(0).toUpperCase() || "U"}
                                </div>
                            )}
                            <div className={styles.profileUserDetails}>
                                <h1>{user.fullName}</h1>
                                <div className={styles.profileUserMeta}>
                                    <div className={styles.profileMetaItem}>
                                        <span className={styles.profileMetaIcon}>💼</span>
                                        <span>{user.role || "Project Manager"}</span>
                                    </div>
                                    <div className={styles.profileMetaItem}>
                                        <span className={styles.profileMetaIcon}>✉️</span>
                                        <span>{user.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className={styles.profileEditBtn} onClick={handleEditClick}>
                            <span className={styles.profileEditIcon}>✏️</span>
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className={styles.profileTabNavigation}>
                    <div className={styles.profileMainTabs}>
                        {tabs.slice(0, 4).map((tab) => (
                            <button
                                key={tab.id}
                                className={`${styles.profileTabBtn} ${activeTab === tab.id ? styles.active : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className={styles.profileTabIcon}>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className={styles.profileSecondaryTabs}>
                        {tabs.slice(4).map((tab) => (
                            <button
                                key={tab.id}
                                className={`${styles.profileTabBtn} ${styles.secondary} ${activeTab === tab.id ? styles.active : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className={styles.profileTabIcon}>{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className={styles.profileTabContent}>
                    {(activeTab === "profile" || activeTab === "personal") && (
                        <div className={styles.profileForm}>
                            <div className={styles.profileFormRow}>
                                <div className={styles.profileFormGroup}>
                                    <label>First Name</label>
                                    <div className={styles.profileFormValue}>{user.fullName?.split(" ")[0] || "Brooklyn"}</div>
                                </div>
                                <div className={styles.profileFormGroup}>
                                    <label>Last Name</label>
                                    <div className={styles.profileFormValue}>
                                        {user.fullName?.split(" ").slice(1).join(" ") || "Simmons"}
                                    </div>
                                </div>
                            </div>
                            <div className={styles.profileFormRow}>
                                <div className={styles.profileFormGroup}>
                                    <label>Mobile Number</label>
                                    <div className={styles.profileFormValue}>{user.mobile || "(702) 555-0122"}</div>
                                </div>
                                <div className={styles.profileFormGroup}>
                                    <label>Email Address</label>
                                    <div className={styles.profileFormValue}>{user.email}</div>
                                </div>
                            </div>
                            <div className={styles.profileFormRow}>
                                <div className={styles.profileFormGroup}>
                                    <label>Date of Birth</label>
                                    <div className={styles.profileFormValue}>{user.dob || "July 14, 1995"}</div>
                                </div>
                                <div className={styles.profileFormGroup}>
                                    <label>Marital Status</label>
                                    <div className={styles.profileFormValue}>{user.maritalStatus || "Married"}</div>
                                </div>
                            </div>
                            <div className={styles.profileFormRow}>
                                <div className={styles.profileFormGroup}>
                                    <label>Gender</label>
                                    <div className={styles.profileFormValue}>{user.gender || "Female"}</div>
                                </div>
                                <div className={styles.profileFormGroup}>
                                    <label>Nationality</label>
                                    <div className={styles.profileFormValue}>{user.nationality || "America"}</div>
                                </div>
                            </div>
                            <div className={styles.profileFormRow}>
                                <div className={styles.profileFormGroup}>
                                    <label>Address</label>
                                    <div className={styles.profileFormValue}>{user.address || "2464 Royal Ln. Mesa, New Jersey"}</div>
                                </div>
                                <div className={styles.profileFormGroup}>
                                    <label>City</label>
                                    <div className={styles.profileFormValue}>{user.city || "California"}</div>
                                </div>
                            </div>
                            <div className={styles.profileFormRow}>
                                <div className={styles.profileFormGroup}>
                                    <label>State</label>
                                    <div className={styles.profileFormValue}>{user.state || "United State"}</div>
                                </div>
                                <div className={styles.profileFormGroup}>
                                    <label>Zip Code</label>
                                    <div className={styles.profileFormValue}>{user.zipCode || "35624"}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "professional" && (
                        <div className={styles.profileProfessionalInfo}>
                            <div className={styles.profileFormRow}>
                                <div className={styles.profileFormGroup}>
                                    <label>Employee ID</label>
                                    <div className={styles.profileFormValue}>EMP001</div>
                                </div>
                                <div className={styles.profileFormGroup}>
                                    <label>Department</label>
                                    <div className={styles.profileFormValue}>Project Management</div>
                                </div>
                            </div>
                            <div className={styles.profileFormRow}>
                                <div className={styles.profileFormGroup}>
                                    <label>Position</label>
                                    <div className={styles.profileFormValue}>Project Manager</div>
                                </div>
                                <div className={styles.profileFormGroup}>
                                    <label>Join Date</label>
                                    <div className={styles.profileFormValue}>January 15, 2020</div>
                                </div>
                            </div>
                            <div className={styles.profileFormRow}>
                                <div className={styles.profileFormGroup}>
                                    <label>Salary</label>
                                    <div className={styles.profileFormValue}>$75,000</div>
                                </div>
                                <div className={styles.profileFormGroup}>
                                    <label>Manager</label>
                                    <div className={styles.profileFormValue}>Robert Allen</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "attendance" && <UserAttendanceTab userId={userId} />}

                    {activeTab === "documents" && (
                        <div className={styles.profileDocumentsSection}>
                            <div className={styles.profileDocumentItem}>
                                <span className={styles.profileDocIcon}>📄</span>
                                <span className={styles.profileDocName}>Resume.pdf</span>
                                <span className={styles.profileDocDate}>Uploaded: Jan 15, 2020</span>
                                <button className={styles.profileDocAction}>Download</button>
                            </div>
                            <div className={styles.profileDocumentItem}>
                                <span className={styles.profileDocIcon}>📄</span>
                                <span className={styles.profileDocName}>Contract.pdf</span>
                                <span className={styles.profileDocDate}>Uploaded: Jan 15, 2020</span>
                                <button className={styles.profileDocAction}>Download</button>
                            </div>
                        </div>
                    )}

                    {activeTab === "access" && (
                        <div className={styles.profileAccessSection}>
                            <div className={styles.profileAccessItem}>
                                <label>System Access</label>
                                <div className={`${styles.profileAccessStatus} ${styles.active}`}>Active</div>
                            </div>
                            <div className={styles.profileAccessItem}>
                                <label>Last Login</label>
                                <div className={styles.profileAccessValue}>Today, 09:30 AM</div>
                            </div>
                            <div className={styles.profileAccessItem}>
                                <label>Password Last Changed</label>
                                <div className={styles.profileAccessValue}>30 days ago</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserProfilePage
