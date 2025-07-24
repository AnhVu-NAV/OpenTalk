import { useEffect, useState } from "react"
import styles from "./styles/module/HRDashboard.module.css"
import axios from "../api/axiosClient.jsx"

const HRDashboard = () => {
    const [dateRange, setDateRange] = useState("thisMonth")
    const [dashboardData, setDashboardData] = useState(null)

    useEffect(() => {
        axios
            .get("/hr/dashboard")
            .then((res) => {
                setDashboardData(res.data)
            })
            .catch((err) => {
                console.error("Error fetching dashboard data:", err)
            })
    }, [])

    if (!dashboardData) return <div>Loading dashboard...</div>

    return (
        <div className={styles.dashboardContainer}>
            {/* Main Content */}
            <div className={styles.mainContent}>
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.headerLeft}>
                        <h1 className={styles.pageTitle}>HR & Meeting Dashboard</h1>
                        <p className={styles.pageSubtitle}>Overview of HR metrics and meeting analytics</p>
                    </div>

                    <div className={styles.headerRight}>
                        <div className={styles.dateFilter}>
                            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className={styles.dateSelect}>
                                <option value="today">Today</option>
                                <option value="thisWeek">This Week</option>
                                <option value="thisMonth">This Month</option>
                                <option value="thisQuarter">This Quarter</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className={styles.overviewCards}>
                    <div className={styles.overviewCard}>
                        <div className={`${styles.cardIcon} ${styles.employees}`}>👥</div>
                        <div className={styles.cardContent}>
                            <h3>{dashboardData.totalEmployees}</h3>
                            <p>Total Employees</p>
                            <span className={`${styles.trend} ${styles.positive}`}>+5.2%</span>
                        </div>
                    </div>

                    <div className={styles.overviewCard}>
                        <div className={`${styles.cardIcon} ${styles.meetings}`}>📹</div>
                        <div className={styles.cardContent}>
                            <h3>{dashboardData.totalMeetings}</h3>
                            <p>Total Meetings</p>
                            <span className={`${styles.trend} ${styles.positive}`}>+12.8%</span>
                        </div>
                    </div>

                    <div className={styles.overviewCard}>
                        <div className={`${styles.cardIcon} ${styles.attendance}`}>📊</div>
                        <div className={styles.cardContent}>
                            <h3>{isNaN(dashboardData.attendanceRate) ? "0%" : `${dashboardData.attendanceRate}%`}</h3>
                            <p>Attendance Rate</p>
                            <span className={`${styles.trend} ${styles.negative}`}>-2.1%</span>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className={styles.chartsSection}>
                    {/* Attendance Chart */}
                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <h3>Monthly Attendance Trends</h3>
                            <div className={styles.chartActions}>
                                <button className={styles.chartBtn}>📊 View Details</button>
                            </div>
                        </div>
                        <div className={styles.chartContent}>
                            <div className={styles.attendanceChart}>
                                {Object.entries(dashboardData.monthlyAttendanceTrends).map(([month, attendance], index) => (
                                    <div key={index} className={styles.chartBar}>
                                        <div
                                            className={styles.bar}
                                            style={{ height: `${attendance}%` }}
                                            title={`${month}: ${attendance}%`}
                                        ></div>
                                        <span className={styles.barLabel}>{month.slice(0, 3)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Department Meetings */}
                    <div className={styles.chartCard}>
                        <div className={styles.chartHeader}>
                            <h3>Department Meeting Stats</h3>
                            <div className={styles.chartActions}>
                                <button className={styles.chartBtn}>📈 Export</button>
                            </div>
                        </div>
                        <div className={styles.chartContent}>
                            <div className={styles.departmentStats}>
                                {dashboardData.branchMeetingStats &&
                                    Object.entries(dashboardData.branchMeetingStats).map(([department, stats], index) => (
                                        <div key={index} className={styles.deptStat}>
                                            <div className={styles.deptInfo}>
                                                <span className={styles.deptName}>{department}</span>
                                                <span className={styles.deptMeetings}>{stats.meetings || 0} meetings</span>
                                            </div>
                                            <div className={styles.deptProgress}>
                                                <div className={styles.progressBar}>
                                                    <div className={styles.progressFill} style={{ width: `${stats.attendance || 0}%` }}></div>
                                                </div>
                                                <span className={styles.progressText}>{stats.attendance || 0}%</span>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className={styles.bottomSection}>
                    {/* Recent Meetings */}
                    <div className={`${styles.sectionCard} ${styles.recentMeetings}`}>
                        <div className={styles.sectionHeader}>
                            <h3>Recent Meetings</h3>
                            <button className={styles.sectionBtn}>View All</button>
                        </div>
                        <div className={styles.meetingsList}>
                            {(dashboardData.recentMeetings || []).map((meeting, index) => {
                                const date = new Date(meeting.scheduledDate)
                                const formattedDate = date.toLocaleDateString()
                                const formattedTime = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

                                return (
                                    <div key={meeting.id} className={styles.meetingItem}>
                                        <div className={styles.meetingInfo}>
                                            <h4>{meeting.meetingName}</h4>
                                            <p>
                                                {formattedDate} at {formattedTime}
                                            </p>
                                            <span className={styles.meetingHost}>Host: {meeting.host?.fullName || "Unknown"}</span>
                                            <br />
                                            <span className={styles.meetingTopic}>Topic: {meeting.topic?.title || "No topic"}</span>
                                            <br />
                                            <span className={styles.meetingBranch}>Branch: {meeting.companyBranch?.name}</span>
                                        </div>
                                        <div className={styles.meetingMeta}>
                                            <span className={styles.duration}>{meeting.duration} mins</span>
                                            <span className={`${styles.meetingStatus} ${meeting.status?.toLowerCase()}`}>
                        {meeting.status}
                      </span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HRDashboard
