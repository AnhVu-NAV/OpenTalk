import { useState } from "react"
import "./styles/HRDashboard.css"

const HRDashboard = () => {
    const [dateRange, setDateRange] = useState("thisMonth")
    const [selectedMetric, setSelectedMetric] = useState("all")

    // Mock data - trong thực tế sẽ fetch từ API
    const dashboardData = {
        overview: {
            totalEmployees: 245,
            totalMeetings: 128,
            attendanceRate: 87.5,
            activeProjects: 34,
        },
        meetingStats: {
            totalMeetings: 128,
            completedMeetings: 98,
            upcomingMeetings: 30,
            cancelledMeetings: 12,
            averageAttendance: 85.2,
        },
        attendanceData: [
            { month: "Jan", attendance: 88 },
            { month: "Feb", attendance: 92 },
            { month: "Mar", attendance: 85 },
            { month: "Apr", attendance: 90 },
            { month: "May", attendance: 87 },
            { month: "Jun", attendance: 94 },
        ],
        departmentMeetings: [
            { department: "Engineering", meetings: 45, attendance: 92 },
            { department: "Design", meetings: 32, attendance: 88 },
            { department: "Marketing", meetings: 28, attendance: 85 },
            { department: "HR", meetings: 23, attendance: 95 },
        ],
        recentMeetings: [
            {
                id: 1,
                title: "Weekly Standup",
                date: "2025-01-23",
                time: "09:00 AM",
                attendees: 12,
                status: "completed",
                host: "John Doe",
            },
            {
                id: 2,
                title: "Product Review",
                date: "2025-01-23",
                time: "02:00 PM",
                attendees: 8,
                status: "ongoing",
                host: "Jane Smith",
            },
            {
                id: 3,
                title: "Team Planning",
                date: "2025-01-24",
                time: "10:00 AM",
                attendees: 15,
                status: "upcoming",
                host: "Mike Johnson",
            },
        ],
        topHosts: [
            { name: "John Doe", sessions: 24, rating: 4.8 },
            { name: "Jane Smith", sessions: 18, rating: 4.6 },
            { name: "Mike Johnson", sessions: 15, rating: 4.7 },
            { name: "Sarah Wilson", sessions: 12, rating: 4.9 },
        ],
    }

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: "📊", active: true },
        { id: "employees", label: "All Employees", icon: "👥", active: false },
        { id: "departments", label: "All Departments", icon: "🏢", active: false },
        { id: "meetings", label: "Meetings", icon: "📹", active: false },
        { id: "attendance", label: "Attendance", icon: "📅", active: false },
        { id: "payroll", label: "Payroll", icon: "💰", active: false },
        { id: "reports", label: "Reports", icon: "📈", active: false },
        { id: "settings", label: "Settings", icon: "⚙️", active: false },
    ]

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

                        <div className="user-profile">
                            <img src="/placeholder.svg?height=40&width=40" alt="Robert Allen" className="user-avatar" />
                            <div className="user-info">
                                <div className="user-name">Robert Allen</div>
                                <div className="user-role">HR Manager</div>
                            </div>
                            <span>▼</span>
                        </div>
                    </div>
                </div>

                {/* Overview Cards */}
                <div className="overview-cards">
                    <div className="overview-card">
                        <div className="card-icon employees">👥</div>
                        <div className="card-content">
                            <h3>{dashboardData.overview.totalEmployees}</h3>
                            <p>Total Employees</p>
                            <span className="trend positive">+5.2%</span>
                        </div>
                    </div>

                    <div className="overview-card">
                        <div className="card-icon meetings">📹</div>
                        <div className="card-content">
                            <h3>{dashboardData.overview.totalMeetings}</h3>
                            <p>Total Meetings</p>
                            <span className="trend positive">+12.8%</span>
                        </div>
                    </div>

                    <div className="overview-card">
                        <div className="card-icon attendance">📊</div>
                        <div className="card-content">
                            <h3>{dashboardData.overview.attendanceRate}%</h3>
                            <p>Attendance Rate</p>
                            <span className="trend negative">-2.1%</span>
                        </div>
                    </div>

                    <div className="overview-card">
                        <div className="card-icon projects">🎯</div>
                        <div className="card-content">
                            <h3>{dashboardData.overview.activeProjects}</h3>
                            <p>Active Projects</p>
                            <span className="trend positive">+8.4%</span>
                        </div>
                    </div>
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
                                {dashboardData.attendanceData.map((item, index) => (
                                    <div key={index} className="chart-bar">
                                        <div
                                            className="bar"
                                            style={{ height: `${item.attendance}%` }}
                                            title={`${item.month}: ${item.attendance}%`}
                                        ></div>
                                        <span className="bar-label">{item.month}</span>
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
                                {dashboardData.departmentMeetings.map((dept, index) => (
                                    <div key={index} className="dept-stat">
                                        <div className="dept-info">
                                            <span className="dept-name">{dept.department}</span>
                                            <span className="dept-meetings">{dept.meetings} meetings</span>
                                        </div>
                                        <div className="dept-progress">
                                            <div className="progress-bar">
                                                <div className="progress-fill" style={{ width: `${dept.attendance}%` }}></div>
                                            </div>
                                            <span className="progress-text">{dept.attendance}%</span>
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
                            {dashboardData.recentMeetings.map((meeting) => (
                                <div key={meeting.id} className="meeting-item">
                                    <div className="meeting-info">
                                        <h4>{meeting.title}</h4>
                                        <p>
                                            {meeting.date} at {meeting.time}
                                        </p>
                                        <span className="meeting-host">Host: {meeting.host}</span>
                                    </div>
                                    <div className="meeting-meta">
                                        <span className="attendees-count">{meeting.attendees} attendees</span>
                                        <span className={`meeting-status ${meeting.status}`}>{meeting.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Top Hosts */}
                    <div className="section-card top-hosts">
                        <div className="section-header">
                            <h3>Top Meeting Hosts</h3>
                            <button className="section-btn">View All</button>
                        </div>
                        <div className="hosts-list">
                            {dashboardData.topHosts.map((host, index) => (
                                <div key={index} className="host-item">
                                    <div className="host-rank">#{index + 1}</div>
                                    <img src="/placeholder.svg?height=40&width=40" alt={host.name} className="host-avatar" />
                                    <div className="host-info">
                                        <h4>{host.name}</h4>
                                        <p>{host.sessions} sessions</p>
                                    </div>
                                    <div className="host-rating">
                                        <span className="rating">⭐ {host.rating}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default HRDashboard
