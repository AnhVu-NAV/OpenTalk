import { useState, useEffect } from "react"
import styles from "./styles/module/UserHomeDashboard.module.css"
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
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading your dashboard...</p>
            </div>
        )
    }
    const getGreeting = () => {
        const hour = new Date().getHours()

        if (hour >= 5 && hour < 12) return "Good Morning"
        if (hour >= 12 && hour < 17) return "Good Afternoon"
        if (hour >= 17 && hour < 21) return "Good Evening"
        return "Good night"
    }

    return (
        <div className={styles.userHomeDashboard}>
            {/* Header Section */}
            <div className={styles.dashboardHeader}>
                <div className={styles.welcomeSection}>
                    <div className={styles.userGreeting}>
                        {user.avatarUrl ? (
                            <img
                                src={user.avatarUrl}
                                alt="User Avatar"
                                className={styles.userAvatarLarge}
                            />
                        ) : (
                            <div className={styles.avatarPlaceholderLarge}>
                                {user.fullName?.charAt(0)?.toUpperCase() || "?"}
                            </div>
                        )}

                        <div className={styles.greetingText}>
                            <h1>
                                {getGreeting()}, {user.fullName?.split(" ")[0] || "there"}! 👋
                            </h1>
                            <p>Ready to make today productive?</p>
                            <div className={styles.currentTime}>
                                <span className={styles.date}>{formatDate(currentTime)}</span>
                                <span className={styles.time}>{formatTime(currentTime)}</span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.quickStatus}>
                        <div className={`${styles.statusCard} ${styles.working}`}>
                            <div className={styles.statusIndicator}></div>
                            <div className={styles.statusInfo}>
                                <span className={styles.statusLabel}>Status</span>
                                <span className={styles.statusValue}>{userDashboardData.todayStats.status}</span>
                            </div>
                        </div>
                        <div className={styles.statusCard}>
                            <span className={styles.statusLabel}>Working Hours</span>
                            <span className={styles.statusValue}>{userDashboardData.todayStats.workingHours}</span>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className={styles.quickActionsGrid}>
                    {userDashboardData.quickActions.map((action) => (
                        <button key={action.id} className={`${styles.quickActionBtn} ${styles[action.color]}`}>
                            <span className={styles.actionIcon}>{action.icon}</span>
                            <span className={styles.actionTitle}>{action.title}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content Grid */}
            <div className={styles.dashboardContent}>
                {/* Today's Overview */}
                <div className={`${styles.contentCard} ${styles.todayOverview}`}>
                    <div className={styles.cardHeader}>
                        <h3>Today's Overview</h3>
                        <div className={styles.headerActions}>
                            <button className={styles.actionBtn}>📊 View Details</button>
                        </div>
                    </div>
                    <div className={styles.todayStats}>
                        <div className={styles.statItem}>
                            <div className={`${styles.statIcon} ${styles.checkin}`}>⏰</div>
                            <div className={styles.statInfo}>
                                <span className={styles.statLabel}>Check In</span>
                                <span className={styles.statValue}>{userDashboardData.todayStats.checkInTime}</span>
                            </div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={`${styles.statIcon} ${styles.break}`}>☕</div>
                            <div className={styles.statInfo}>
                                <span className={styles.statLabel}>Break Time</span>
                                <span className={styles.statValue}>{userDashboardData.todayStats.breakTime}</span>
                            </div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={`${styles.statIcon} ${styles.location}`}>📍</div>
                            <div className={styles.statInfo}>
                                <span className={styles.statLabel}>Location</span>
                                <span className={styles.statValue}>{userDashboardData.todayStats.location}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Monthly Attendance */}
                <div className={`${styles.contentCard} ${styles.attendanceSummary}`}>
                    <div className={styles.cardHeader}>
                        <h3>This Month's Attendance</h3>
                        <select
                            value={selectedPeriod}
                            onChange={(e) => setSelectedPeriod(e.target.value)}
                            className={styles.periodSelect}
                        >
                            <option value="thisMonth">This Month</option>
                            <option value="lastMonth">Last Month</option>
                            <option value="thisQuarter">This Quarter</option>
                        </select>
                    </div>
                    <div className={styles.attendanceGrid}>
                        <div className={styles.attendanceItem}>
                            <div className={styles.attendanceNumber}>{userDashboardData.thisMonth.presentDays}</div>
                            <div className={styles.attendanceLabel}>Present Days</div>
                            <div className={styles.attendanceTotal}>of {userDashboardData.thisMonth.totalWorkingDays}</div>
                        </div>
                        <div className={styles.attendanceItem}>
                            <div className={`${styles.attendanceNumber} ${styles.late}`}>{userDashboardData.thisMonth.lateDays}</div>
                            <div className={styles.attendanceLabel}>Late Days</div>
                        </div>
                        <div className={styles.attendanceItem}>
                            <div className={`${styles.attendanceNumber} ${styles.leave}`}>
                                {userDashboardData.thisMonth.leaveDays}
                            </div>
                            <div className={styles.attendanceLabel}>Leave Days</div>
                        </div>
                        <div className={styles.attendanceRate}>
                            <div className={styles.rateCircle}>
                                <svg viewBox="0 0 36 36" className={styles.circularChart}>
                                    <path
                                        className={styles.circleBg}
                                        d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <path
                                        className={styles.circle}
                                        strokeDasharray={`${userDashboardData.thisMonth.attendanceRate}, 100`}
                                        d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                                    />
                                    <text x="18" y="20.35" className={styles.percentage}>
                                        {userDashboardData.thisMonth.attendanceRate}%
                                    </text>
                                </svg>
                            </div>
                            <div className={styles.rateLabel}>Attendance Rate</div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Meetings */}
                <div className={`${styles.contentCard} ${styles.upcomingMeetings}`}>
                    <div className={styles.cardHeader}>
                        <h3>Today's Meetings</h3>
                        <button className={styles.actionBtn}>📅 View Calendar</button>
                    </div>
                    <div className={styles.meetingsList}>
                        {userDashboardData.upcomingMeetings.map((meeting) => (
                            <div key={meeting.id} className={styles.meetingItem}>
                                <div className={styles.meetingTime}>
                                    <span className={styles.time}>{meeting.time}</span>
                                    <span className={styles.duration}>{meeting.duration}</span>
                                </div>
                                <div className={styles.meetingDetails}>
                                    <h4>{meeting.title}</h4>
                                    <p>
                                        {meeting.type} • {meeting.attendees} attendees
                                    </p>
                                </div>
                                <div className={styles.meetingActions}>
                                    <button className={styles.joinBtn}>🎥 Join</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weekly Schedule */}
                <div className={`${styles.contentCard} ${styles.weeklySchedule}`}>
                    <div className={styles.cardHeader}>
                        <h3>This Week's Schedule</h3>
                    </div>
                    <div className={styles.scheduleGrid}>
                        {userDashboardData.weeklySchedule.map((day, index) => (
                            <div key={index} className={`${styles.scheduleDay} ${styles[day.status]}`}>
                                <div className={styles.dayName}>{day.day}</div>
                                <div className={styles.dayMeetings}>{day.meetings} meetings</div>
                                <div className={`${styles.dayStatus} ${styles[day.status]}`}></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activities */}
                <div className={`${styles.contentCard} ${styles.recentActivities}`}>
                    <div className={styles.cardHeader}>
                        <h3>Recent Activities</h3>
                        <button className={styles.actionBtn}>📋 View All</button>
                    </div>
                    <div className={styles.activitiesList}>
                        {userDashboardData.recentActivities.map((activity) => (
                            <div key={activity.id} className={styles.activityItem}>
                                <div className={styles.activityIcon}>{activity.icon}</div>
                                <div className={styles.activityDetails}>
                                    <span className={styles.activityTitle}>{activity.title}</span>
                                    <span className={styles.activityTime}>{activity.time}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Notifications */}
                <div className={`${styles.contentCard} ${styles.notifications}`}>
                    <div className={styles.cardHeader}>
                        <h3>Notifications</h3>
                        <span className={styles.notificationCount}>
              {userDashboardData.notifications.filter((n) => n.unread).length} new
            </span>
                    </div>
                    <div className={styles.notificationsList}>
                        {userDashboardData.notifications.map((notification) => (
                            <div
                                key={notification.id}
                                className={`${styles.notificationItem} ${notification.unread ? styles.unread : ""}`}
                            >
                                <div className={styles.notificationContent}>
                                    <h4>{notification.title}</h4>
                                    <p>{notification.message}</p>
                                    <span className={styles.notificationTime}>{notification.time}</span>
                                </div>
                                {notification.unread && <div className={styles.unreadIndicator}></div>}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserHomeDashboard
