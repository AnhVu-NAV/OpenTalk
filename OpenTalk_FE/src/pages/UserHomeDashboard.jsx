import { useState, useEffect } from "react"
import "./styles/UserHomeDashboard.css"
import { getCurrentUser } from "../helper/auth.jsx"

const UserHomeDashboard = () => {
    const [user, setUser] = useState(null)
    const [currentTime, setCurrentTime] = useState(new Date())
    const [selectedPeriod, setSelectedPeriod] = useState("thisMonth")

    useEffect(() => {
        const current = getCurrentUser()
        setUser(current)

        // Update time every minute
        const timer = setInterval(() => {
            setCurrentTime(new Date())
        }, 60000)

        return () => clearInterval(timer)
    }, [])

    // Mock data - trong thực tế sẽ fetch từ API
    const userDashboardData = {
        profile: {
            name: "Brooklyn Simmons",
            role: "Project Manager",
            department: "Engineering",
            employeeId: "EMP001",
            avatar: "/placeholder.svg?height=80&width=80",
            joinDate: "Jan 15, 2020",
        },
        todayStats: {
            checkInTime: "09:15 AM",
            workingHours: "7h 45m",
            breakTime: "45m",
            status: "Working",
            location: "Office",
        },
        thisMonth: {
            totalWorkingDays: 22,
            presentDays: 20,
            lateDays: 2,
            leaveDays: 1,
            attendanceRate: 91,
        },
        upcomingMeetings: [
            {
                id: 1,
                title: "Daily Standup",
                time: "10:00 AM",
                duration: "30 min",
                type: "Team Meeting",
                attendees: 8,
                status: "upcoming",
            },
            {
                id: 2,
                title: "Project Review",
                time: "02:00 PM",
                duration: "1 hour",
                type: "Client Meeting",
                attendees: 5,
                status: "upcoming",
            },
            {
                id: 3,
                title: "1:1 with Manager",
                time: "04:30 PM",
                duration: "30 min",
                type: "One-on-One",
                attendees: 2,
                status: "upcoming",
            },
        ],
        recentActivities: [
            {
                id: 1,
                type: "meeting",
                title: "Completed Weekly Planning",
                time: "2 hours ago",
                icon: "📅",
            },
            {
                id: 2,
                type: "task",
                title: "Submitted Project Report",
                time: "4 hours ago",
                icon: "📄",
            },
            {
                id: 3,
                type: "attendance",
                title: "Checked in at 09:15 AM",
                time: "Today",
                icon: "✅",
            },
            {
                id: 4,
                type: "leave",
                title: "Leave request approved",
                time: "Yesterday",
                icon: "🏖️",
            },
        ],
        quickActions: [
            { id: 1, title: "Check In/Out", icon: "⏰", color: "green" },
            { id: 2, title: "Request Leave", icon: "📝", color: "blue" },
            { id: 3, title: "View Payslip", icon: "💰", color: "purple" },
            { id: 4, title: "Update Profile", icon: "👤", color: "orange" },
            { id: 5, title: "Submit Timesheet", icon: "📊", color: "teal" },
            { id: 6, title: "Book Meeting Room", icon: "🏢", color: "pink" },
        ],
        notifications: [
            {
                id: 1,
                title: "Meeting reminder",
                message: "Daily standup in 15 minutes",
                time: "5 min ago",
                type: "meeting",
                unread: true,
            },
            {
                id: 2,
                title: "Leave approved",
                message: "Your leave request for Jan 25 has been approved",
                time: "1 hour ago",
                type: "leave",
                unread: true,
            },
            {
                id: 3,
                title: "Payslip available",
                message: "Your January payslip is ready to view",
                time: "2 hours ago",
                type: "payroll",
                unread: false,
            },
        ],
        weeklySchedule: [
            { day: "Mon", meetings: 3, status: "busy" },
            { day: "Tue", meetings: 2, status: "normal" },
            { day: "Wed", meetings: 4, status: "busy" },
            { day: "Thu", meetings: 1, status: "light" },
            { day: "Fri", meetings: 2, status: "normal" },
        ],
    }

    const formatTime = (date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        })
    }

    const formatDate = (date) => {
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    if (!user) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        )
    }

    return (
        <div className="user-home-dashboard">
            {/* Header Section */}
            <div className="dashboard-header">
                <div className="welcome-section">
                    <div className="user-greeting">
                        <img
                            src={userDashboardData.profile.avatar || "/placeholder.svg"}
                            alt="User Avatar"
                            className="user-avatar-large"
                        />
                        <div className="greeting-text">
                            <h1>Good morning, {userDashboardData.profile.name.split(" ")[0]}! 👋</h1>
                            <p>Ready to make today productive?</p>
                            <div className="current-time">
                                <span className="date">{formatDate(currentTime)}</span>
                                <span className="time">{formatTime(currentTime)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="quick-status">
                        <div className="status-card working">
                            <div className="status-indicator"></div>
                            <div className="status-info">
                                <span className="status-label">Status</span>
                                <span className="status-value">{userDashboardData.todayStats.status}</span>
                            </div>
                        </div>
                        <div className="status-card">
                            <span className="status-label">Working Hours</span>
                            <span className="status-value">{userDashboardData.todayStats.workingHours}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions-grid">
                    {userDashboardData.quickActions.map((action) => (
                        <button key={action.id} className={`quick-action-btn ${action.color}`}>
                            <span className="action-icon">{action.icon}</span>
                            <span className="action-title">{action.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-content">
                {/* Today's Overview */}
                <div className="content-card today-overview">
                    <div className="card-header">
                        <h3>Today's Overview</h3>
                        <div className="header-actions">
                            <button className="action-btn">📊 View Details</button>
                        </div>
                    </div>
                    <div className="today-stats">
                        <div className="stat-item">
                            <div className="stat-icon checkin">⏰</div>
                            <div className="stat-info">
                                <span className="stat-label">Check In</span>
                                <span className="stat-value">{userDashboardData.todayStats.checkInTime}</span>
                            </div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-icon break">☕</div>
                            <div className="stat-info">
                                <span className="stat-label">Break Time</span>
                                <span className="stat-value">{userDashboardData.todayStats.breakTime}</span>
                            </div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-icon location">📍</div>
                            <div className="stat-info">
                                <span className="stat-label">Location</span>
                                <span className="stat-value">{userDashboardData.todayStats.location}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Monthly Attendance */}
                <div className="content-card attendance-summary">
                    <div className="card-header">
                        <h3>This Month's Attendance</h3>
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className="period-select"
                        >
                            <option value="thisMonth">This Month</option>
                            <option value="lastMonth">Last Month</option>
                            <option value="thisQuarter">This Quarter</option>
                        </select>
                    </div>
                    <div className="attendance-grid">
                        <div className="attendance-item">
                            <div className="attendance-number">{userDashboardData.thisMonth.presentDays}</div>
                            <div className="attendance-label">Present Days</div>
                            <div className="attendance-total">of {userDashboardData.thisMonth.totalWorkingDays}</div>
                        </div>
                        <div className="attendance-item">
                            <div className="attendance-number late">{userDashboardData.thisMonth.lateDays}</div>
                            <div className="attendance-label">Late Days</div>
                        </div>
                        <div className="attendance-item">
                            <div className="attendance-number leave">{userDashboardData.thisMonth.leaveDays}</div>
                            <div className="attendance-label">Leave Days</div>
                        </div>
                        <div className="attendance-rate">
                            <div className="rate-circle">
                                <svg viewBox="0 0 36 36" className="circular-chart">
                                    <path
                                        className="circle-bg"
                                        d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <path
                                        className="circle"
                                        strokeDasharray={`${userDashboardData.thisMonth.attendanceRate}, 100`}
                                        d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <text x="18" y="20.35" className="percentage">
                                        {userDashboardData.thisMonth.attendanceRate}%
                                    </text>
                                </svg>
                            </div>
                            <div className="rate-label">Attendance Rate</div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Meetings */}
                <div className="content-card upcoming-meetings">
                    <div className="card-header">
                        <h3>Today's Meetings</h3>
                        <button className="action-btn">📅 View Calendar</button>
                    </div>
                    <div className="meetings-list">
                        {userDashboardData.upcomingMeetings.map((meeting) => (
                            <div key={meeting.id} className="meeting-item">
                                <div className="meeting-time">
                                    <span className="time">{meeting.time}</span>
                                    <span className="duration">{meeting.duration}</span>
                                </div>
                                <div className="meeting-details">
                                    <h4>{meeting.title}</h4>
                                    <p>
                                        {meeting.type} • {meeting.attendees} attendees
                                    </p>
                                </div>
                                <div className="meeting-actions">
                                    <button className="join-btn">🎥 Join</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weekly Schedule */}
                <div className="content-card weekly-schedule">
                    <div className="card-header">
                        <h3>This Week's Schedule</h3>
                    </div>
                    <div className="schedule-grid">
                        {userDashboardData.weeklySchedule.map((day, index) => (
                            <div key={index} className={`schedule-day ${day.status}`}>
                                <div className="day-name">{day.day}</div>
                                <div className="day-meetings">{day.meetings} meetings</div>
                                <div className={`day-status ${day.status}`}></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className="content-card recent-activities">
                    <div className="card-header">
                        <h3>Recent Activities</h3>
                        <button className="action-btn">📋 View All</button>
                    </div>
                    <div className="activities-list">
                        {userDashboardData.recentActivities.map((activity) => (
                            <div key={activity.id} className="activity-item">
                                <div className="activity-icon">{activity.icon}</div>
                                <div className="activity-details">
                                    <span className="activity-title">{activity.title}</span>
                                    <span className="activity-time">{activity.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notifications */}
                <div className="content-card notifications">
                    <div className="card-header">
                        <h3>Notifications</h3>
                        <span className="notification-count">
              {userDashboardData.notifications.filter((n) => n.unread).length} new
            </span>
                    </div>
                    <div className="notifications-list">
                        {userDashboardData.notifications.map((notification) => (
                            <div key={notification.id} className={`notification-item ${notification.unread ? "unread" : ""}`}>
                                <div className="notification-content">
                                    <h4>{notification.title}</h4>
                                    <p>{notification.message}</p>
                                    <span className="notification-time">{notification.time}</span>
                                </div>
                                {notification.unread && <div className="unread-indicator"></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserHomeDashboard
