import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import {
    FaHome,
    FaVideo,
    FaEnvelope,
    FaProjectDiagram,
    FaTicketAlt,
    FaUsers,
    FaRegCalendarCheck,
    FaRegNewspaper,
    FaFileAlt,
    FaBuilding,
    FaUserCircle,
    FaCog,
    FaRegLightbulb,
    FaPoll,
    FaChevronDown,
    FaChevronRight,
} from "react-icons/fa"
import { getCurrentUser } from "../helper/auth"
import styles from "./Sidebar.module.css"

const menuSections = [
    {
        title: "Dashboard",
        items: [
            { label: "Dashboard", icon: <FaHome />, path: "/admin/dashboard", roles: ["HR", "MEETING_MANAGER"] },
            { label: "Overview", icon: <FaHome />, path: "/user/home", roles: ["USER"] },
        ],
    },
    {
        title: "Meetings",
        items: [
            { label: "Meetings", icon: <FaVideo />, path: "/meeting", roles: ["USER"] },
            { label: "Host Meeting", icon: <FaVideo />, path: "/host-meeting", roles: ["USER"] },
            { label: "OpenTalk Requests", icon: <FaEnvelope />, path: "/opentalk/request", roles: ["HR", "MEETING_MANAGER"] },
            { label: "OpenTalk Manager", icon: <FaVideo />, path: "/opentalk/manager", roles: ["HR", "MEETING_MANAGER"] },
            {
                label: "Poll Meeting",
                icon: <FaProjectDiagram />,
                path: "/poll-meeting",
                roles: ["HR", "USER", "MEETING_MANAGER"],
            },
        ],
    },
    {
        title: "Attendance",
        items: [
            {
                label: "Attendance",
                icon: <FaRegCalendarCheck />,
                path: "/attendance",
                roles: ["USER"],
            },
            {
                label: "Manager Attendance",
                icon: <FaRegCalendarCheck />,
                path: "/attendance/admin",
                roles: ["HR", "MEETING_MANAGER"],
            },
        ],
    },
    {
        title: "People & Organization",
        items: [
            { label: "Employee", icon: <FaUsers />, path: "/employee", roles: ["HR", "MEETING_MANAGER"] },
            { label: "Organization", icon: <FaBuilding />, path: "/organization", roles: ["HR", "MEETING_MANAGER"] },
        ],
    },
    {
        title: "Topics & Suggestions",
        items: [
            {
                label: "Suggest Topic",
                icon: <FaRegNewspaper />,
                path: "/suggest-topic",
                roles: ["USER"],
            },
            { label: "Topic Hub", icon: <FaPoll />, path: "/topic", roles: ["HR", "USER", "MEETING_MANAGER"] },
            {
                label: "Topic Proposal",
                icon: <FaRegLightbulb />,
                path: "/topicProposal",
                roles: ["HR", "USER", "MEETING_MANAGER"],
            },
        ],
    },
    {
        title: "Reports & Management",
        items: [
            {
                label: "Host Frequency Report",
                icon: <FaFileAlt />,
                path: "/hostfrequencyreport",
                roles: ["HR", "MEETING_MANAGER"],
            },
            { label: "Salary", icon: <FaCog />, path: "/salary", roles: ["HR"] },
        ],
    },
    {
        title: "Account",
        items: [{ label: "Account", icon: <FaUserCircle />, path: "/account", roles: ["HR", "USER", "MEETING_MANAGER"] }],
    },
    {
        title: "Cronjob Configuration",
        items: [{ label: "Cronjob Configuration", icon: <FaUserCircle />, path: "/cronjob", roles: ["MEETING_MANAGER"] }],
    },
]

function Sidebar({ collapsed, onToggle }) {
    const navigate = useNavigate()
    const [user, setUser] = useState(null)
    const [expandedSections, setExpandedSections] = useState({})

    useEffect(() => {
        const current = getCurrentUser()
        console.log("User role:", current?.role)
        setUser(current)

        // Initialize expanded sections
        const initialExpanded = {}
        menuSections.forEach((section, index) => {
            initialExpanded[index] = true // Start with all sections expanded
        })
        setExpandedSections(initialExpanded)
    }, [])

    const roleMap = {
        1: "MEETING_MANAGER",
        2: "USER",
        3: "HR",
    }

    const toggleSection = (sectionIndex) => {
        if (collapsed) return // Don't toggle when sidebar is collapsed

        setExpandedSections((prev) => ({
            ...prev,
            [sectionIndex]: !prev[sectionIndex],
        }))
    }

    const userRole = roleMap[user?.role]

    return (
        <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
            {/* Sidebar Header */}
            <div className={styles.sidebarHeader}>
                <div className={styles.logoContainer}>
                    <div className={styles.logoIcon}></div>
                    {!collapsed && <span className={styles.logoText}>OpenTalk</span>}
                </div>

                {!collapsed && (
                    <div className={styles.userInfo}>
                        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="User avatar" className={styles.userAvatar} />
                        <div className={styles.userDetails}>
                            <span className={styles.userNameSidebar}>{user?.fullName || user?.username || "Unknown"}</span>
                            <span className={styles.userRole}>{userRole || "User"}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Menu */}
            <nav className={styles.navigation}>
                {menuSections.map((section, sectionIndex) => {
                    const visibleItems = section.items.filter((item) => item.roles.includes(userRole))

                    if (visibleItems.length === 0) return null

                    return (
                        <div key={sectionIndex} className={styles.menuSection}>
                            {!collapsed && (
                                <button className={styles.sectionHeader} onClick={() => toggleSection(sectionIndex)}>
                                    <span className={styles.sectionTitle}>{section.title}</span>
                                    {expandedSections[sectionIndex] ? (
                                        <FaChevronDown className={styles.sectionIcon} />
                                    ) : (
                                        <FaChevronRight className={styles.sectionIcon} />
                                    )}
                                </button>
                            )}

                            <div
                                className={`${styles.menuItems} ${
                                    collapsed || expandedSections[sectionIndex] ? styles.expanded : styles.collapsed
                                }`}
                            >
                                {visibleItems.map((item) => (
                                    <NavLink
                                        key={item.label}
                                        to={item.path}
                                        className={({ isActive }) => `${styles.menuItem} ${isActive ? styles.active : ""}`}
                                        title={collapsed ? item.label : ""}
                                    >
                                        <span className={styles.menuIcon}>{item.icon}</span>
                                        {!collapsed && <span className={styles.menuLabel}>{item.label}</span>}
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    )
                })}
            </nav>

            {/* Collapse Toggle Button */}
            <button
                className={styles.collapseButton}
                onClick={onToggle}
                title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                <FaChevronRight className={`${styles.collapseIcon} ${collapsed ? styles.rotated : ""}`} />
            </button>
        </aside>
    )
}

export default Sidebar
