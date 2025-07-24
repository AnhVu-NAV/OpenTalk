import {useEffect, useState} from "react"
import "./styles/HRDashboard.css"
import axios from "../api/axiosClient.jsx";

const HRDashboard = () => {
    const [dateRange, setDateRange] = useState("thisMonth")
    const [dashboardData, setDashboardData] = useState(null)

    useEffect(() => {
        axios.get("/hr/dashboard")
            .then((res) => {
                setDashboardData(res.data)
            })
            .catch((err) => {
                console.error("Error fetching dashboard data:", err)
            })
    }, [])

    if (!dashboardData) return <div>Loading dashboard...</div>

    return (
        <div className="dashboard-container">

            {/* Main Content */}
            <div className="main-content">
                {/* Header */}
                <div className="header">
                    <div className="header-left">
                        <h1 className="page-title">HR & Meeting Dashboard</h1>
                        <p className="page-subtitle">Overview of HR metrics and meeting analytics</p>
                    </div>

                    <div className="header-right">
                        <div className="date-filter">
                            <select value={dateRange} onChange={(e) => setDateRange(e.target.value)} className="date-select">
                                <option value="today">Today</option>
                                <option value="thisWeek">This Week</option>
                                <option value="thisMonth">This Month</option>
                                <option value="thisQuarter">This Quarter</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="overview-cards">
                    <div className="overview-card">
                        <div className="card-icon employees">👥</div>
                        <div className="card-content">
                            <h3>{dashboardData.totalEmployees}</h3>
                            <p>Total Employees</p>
                            <span className="trend positive">+5.2%</span>
                        </div>
                    </div>

                    <div className="overview-card">
                        <div className="card-icon meetings">📹</div>
                        <div className="card-content">
                            <h3>{dashboardData.totalMeetings}</h3>
                            <p>Total Meetings</p>
                            <span className="trend positive">+12.8%</span>
                        </div>
                    </div>

                    <div className="overview-card">
                        <div className="card-icon attendance">📊</div>
                        <div className="card-content">
                            <h3>{isNaN(dashboardData.attendanceRate) ? '0%' : `${dashboardData.attendanceRate}%`}</h3>
                            <p>Attendance Rate</p>
                            <span className="trend negative">-2.1%</span>
                        </div>
                    </div>

                    {/*<div className="overview-card">*/}
                    {/*    <div className="card-icon projects">🎯</div>*/}
                    {/*    <div className="card-content">*/}
                    {/*        <h3>{dashboardData.overview.activeProjects}</h3>*/}
                    {/*        <p>Active Projects</p>*/}
                    {/*        <span className="trend positive">+8.4%</span>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>

                {/* Charts Section */}
                <div className="charts-section">
                    {/* Attendance Chart */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>Monthly Attendance Trends</h3>
                            <div className="chart-actions">
                                <button className="chart-btn">📊 View Details</button>
                            </div>
                        </div>
                        <div className="chart-content">
                            <div className="attendance-chart">
                                {Object.entries(dashboardData.monthlyAttendanceTrends).map(([month, attendance], index) => (
                                    <div key={index} className="chart-bar">
                                        <div
                                            className="bar"
                                            style={{ height: `${attendance}%` }}
                                            title={`${month}: ${attendance}%`}
                                        ></div>
                                        <span className="bar-label">{month.slice(0, 3)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Department Meetings */}
                    <div className="chart-card">
                        <div className="chart-header">
                            <h3>Department Meeting Stats</h3>
                            <div className="chart-actions">
                                <button className="chart-btn">📈 Export</button>
                            </div>
                        </div>
                        <div className="chart-content">
                            <div className="department-stats">
                                {dashboardData.branchMeetingStats && Object.entries(dashboardData.branchMeetingStats).map(([department, stats], index) => (
                                    <div key={index} className="dept-stat">
                                        <div className="dept-info">
                                            <span className="dept-name">{department}</span>
                                            <span className="dept-meetings">{stats.meetings || 0} meetings</span>
                                        </div>
                                        <div className="dept-progress">
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${stats.attendance || 0}%` }}></div>
                                            </div>
                                            <span className="progress-text">{stats.attendance || 0}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="bottom-section">
                    {/* Recent Meetings */}
                    <div className="section-card recent-meetings">
                        <div className="section-header">
                            <h3>Recent Meetings</h3>
                            <button className="section-btn">View All</button>
                        </div>
                        <div className="meetings-list">
                            {(dashboardData.recentMeetings || []).map((meeting, index) => {
                                const date = new Date(meeting.scheduledDate)
                                const formattedDate = date.toLocaleDateString()
                                const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

                                return (
                                    <div key={meeting.id} className="meeting-item">
                                        <div className="meeting-info">
                                            <h4>{meeting.meetingName}</h4>
                                            <p>{formattedDate} at {formattedTime}</p>
                                            <span className="meeting-host">Host: {meeting.host?.fullName || "Unknown"}</span><br />
                                            <span className="meeting-topic">Topic: {meeting.topic?.title || "No topic"}</span><br />
                                            <span className="meeting-branch">Branch: {meeting.companyBranch?.name}</span>
                                        </div>
                                        <div className="meeting-meta">
                                            <span className="duration">{meeting.duration} mins</span>
                                            <span className={`meeting-status ${meeting.status?.toLowerCase()}`}>{meeting.status}</span>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Top Hosts */}
                    {/*<div className="section-card top-hosts">*/}
                    {/*    <div className="section-header">*/}
                    {/*        <h3>Top Meeting Hosts</h3>*/}
                    {/*        <button className="section-btn">View All</button>*/}
                    {/*    </div>*/}
                    {/*    <div className="hosts-list">*/}
                    {/*        {dashboardData.topHosts.map((host, index) => (*/}
                    {/*            <div key={index} className="host-item">*/}
                    {/*                <div className="host-rank">#{index + 1}</div>*/}
                    {/*                <img src="/placeholder.svg?height=40&width=40" alt={host.name} className="host-avatar" />*/}
                    {/*                <div className="host-info">*/}
                    {/*                    <h4>{host.name}</h4>*/}
                    {/*                    <p>{host.sessions} sessions</p>*/}
                    {/*                </div>*/}
                    {/*                <div className="host-rating">*/}
                    {/*                    <span className="rating">⭐ {host.rating}</span>*/}
                    {/*                </div>*/}
                    {/*            </div>*/}
                    {/*        ))}*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                </div>
            </div>
        </div>
    )
}

export default HRDashboard
