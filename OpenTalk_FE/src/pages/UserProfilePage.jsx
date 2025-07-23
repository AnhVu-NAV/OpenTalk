"use client"

import { useEffect, useState } from "react"
import axios from "../api/axiosClient.jsx"
import UserAttendanceTab from "./UserAttendanceTab"
import "./styles/UserProfilePage.css"
import { getCurrentUser } from "../helper/auth.jsx"

const UserProfilePage = ({ userId }) => {
    const [user, setUser] = useState(null)
    const [activeTab, setActiveTab] = useState("profile")

    useEffect(() => {
        const current = getCurrentUser()
        console.log("Loaded user:", current)
        setUser(current)
    }, [])

    useEffect(() => {
        const current = getCurrentUser()
        axios
            .get(`/users/${current.id}`)
            .then((res) => setUser(res.data))
            .catch((err) => console.error("User fetch error", err))
    }, [userId])

    if (!user) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading user profile...</p>
            </div>
        )
    }

    const tabs = [
        { id: "profile", label: "Profile", icon: "👤" },
        { id: "personal", label: "Personal Information", icon: "📋" },
        { id: "professional", label: "Professional Information", icon: "💼" },
        { id: "attendance", label: "Attendance", icon: "📅" },
        { id: "documents", label: "Documents", icon: "📄" },
        { id: "access", label: "Account Access", icon: "🔐" },
    ]

    return (
        <div className="user-profile-page">

            {/* Main Content */}
            <div className="profile-main">
                {/* Header */}
                <div className="profile-header">
                    <div className="header-top">
                        <div className="breadcrumb">
                            <span>All Employee</span>
                            <span className="separator">›</span>
                            <span>{user.fullName}</span>
                        </div>
                    </div>

                    <div className="user-header">
                        <div className="user-info-section">
                            <img src={user.avatarUrl || "/default-avatar.png"} alt="User Avatar" className="user-avatar" />
                            <div className="user-details">
                                <h1 className="user-name">{user.fullName}</h1>
                                <div className="user-meta">
                                    <div className="meta-item">
                                        <span className="meta-icon">💼</span>
                                        <span>{user.role || "Project Manager"}</span>
                                    </div>
                                    <div className="meta-item">
                                        <span className="meta-icon">✉️</span>
                                        <span>{user.email}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <button className="edit-profile-btn">
                            <span className="edit-icon">✏️</span>
                            Edit Profile
                        </button>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="tab-navigation">
                    <div className="main-tabs">
                        {tabs.slice(0, 4).map((tab) => (
                            <button
                                key={tab.id}
                                className={`tab-btn ${activeTab === tab.id ? "active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className="tab-icon">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                    <div className="secondary-tabs">
                        {tabs.slice(4).map((tab) => (
                            <button
                                key={tab.id}
                                className={`tab-btn secondary ${activeTab === tab.id ? "active" : ""}`}
                                onClick={() => setActiveTab(tab.id)}
                            >
                                <span className="tab-icon">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tab Content */}
                <div className="tab-content">
                    {(activeTab === "profile" || activeTab === "personal") && (
                        <div className="profile-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>First Name</label>
                                    <div className="form-value">{user.fullName?.split(" ")[0] || "Brooklyn"}</div>
                                </div>
                                <div className="form-group">
                                    <label>Last Name</label>
                                    <div className="form-value">{user.fullName?.split(" ").slice(1).join(" ") || "Simmons"}</div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Mobile Number</label>
                                    <div className="form-value">{user.mobile || "(702) 555-0122"}</div>
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <div className="form-value">{user.email}</div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Date of Birth</label>
                                    <div className="form-value">{user.dob || "July 14, 1995"}</div>
                                </div>
                                <div className="form-group">
                                    <label>Marital Status</label>
                                    <div className="form-value">{user.maritalStatus || "Married"}</div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Gender</label>
                                    <div className="form-value">{user.gender || "Female"}</div>
                                </div>
                                <div className="form-group">
                                    <label>Nationality</label>
                                    <div className="form-value">{user.nationality || "America"}</div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Address</label>
                                    <div className="form-value">{user.address || "2464 Royal Ln. Mesa, New Jersey"}</div>
                                </div>
                                <div className="form-group">
                                    <label>City</label>
                                    <div className="form-value">{user.city || "California"}</div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>State</label>
                                    <div className="form-value">{user.state || "United State"}</div>
                                </div>
                                <div className="form-group">
                                    <label>Zip Code</label>
                                    <div className="form-value">{user.zipCode || "35624"}</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "professional" && (
                        <div className="professional-info">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Employee ID</label>
                                    <div className="form-value">EMP001</div>
                                </div>
                                <div className="form-group">
                                    <label>Department</label>
                                    <div className="form-value">Project Management</div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Position</label>
                                    <div className="form-value">Project Manager</div>
                                </div>
                                <div className="form-group">
                                    <label>Join Date</label>
                                    <div className="form-value">January 15, 2020</div>
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Salary</label>
                                    <div className="form-value">$75,000</div>
                                </div>
                                <div className="form-group">
                                    <label>Manager</label>
                                    <div className="form-value">Robert Allen</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "attendance" && <UserAttendanceTab userId={userId} />}

                    {activeTab === "documents" && (
                        <div className="documents-section">
                            <div className="document-item">
                                <span className="doc-icon">📄</span>
                                <span className="doc-name">Resume.pdf</span>
                                <span className="doc-date">Uploaded: Jan 15, 2020</span>
                                <button className="doc-action">Download</button>
                            </div>
                            <div className="document-item">
                                <span className="doc-icon">📄</span>
                                <span className="doc-name">Contract.pdf</span>
                                <span className="doc-date">Uploaded: Jan 15, 2020</span>
                                <button className="doc-action">Download</button>
                            </div>
                        </div>
                    )}

                    {activeTab === "access" && (
                        <div className="access-section">
                            <div className="access-item">
                                <label>System Access</label>
                                <div className="access-status active">Active</div>
                            </div>
                            <div className="access-item">
                                <label>Last Login</label>
                                <div className="access-value">Today, 09:30 AM</div>
                            </div>
                            <div className="access-item">
                                <label>Password Last Changed</label>
                                <div className="access-value">30 days ago</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserProfilePage
