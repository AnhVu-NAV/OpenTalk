import React, {useEffect, useState} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {
    FaHome, FaVideo, FaEnvelope, FaProjectDiagram, FaTicketAlt, FaUsers,
    FaRegCalendarCheck, FaRegNewspaper, FaFileAlt, FaBuilding, FaUserCircle,
    FaCog, FaSignOutAlt, FaRegLightbulb, FaPoll
} from "react-icons/fa";
import {getCurrentUser, clearTokens} from "../helper/auth";

const menuItems = [
    // 1. Dashboard / Overview
    { label: "Dashboard", icon: <FaHome />, path: "/" },            // HR, MEETING_MANAGER
    { label: "Overview", icon: <FaHome />, path: "/" },             // USER

    // 2. Meetings
    { label: "Meeting", icon: <FaVideo />, path: "/meeting" },
    // { label: "Meeting Detail", icon: <FaVideo />, path: "/meeting/:id" },
    { label: "Host Meeting", icon: <FaVideo />, path: "/host-meeting" },
    // { label: "Host Meeting Detail", icon: <FaVideo />, path: "/host-meeting/:id" },
    { label: "Meetings", icon: <FaVideo />, path: "/meeting" },
    // { label: "Meeting Detail", icon: <FaVideo />, path: "/meeting/detail/:id" },
    { label: "OpenTalk Requests", icon: <FaEnvelope />, path: "/opentalk/request" },
    { label: "OpenTalk Manager", icon: <FaVideo />, path: "/opentalk/manager" },
    { label: "Poll Meeting", icon: <FaProjectDiagram />, path: "/poll-meeting" },
    { label: "Create Poll", icon: <FaProjectDiagram />, path: "/poll/create" },

    // 3. Attendance
    { label: "Attendance", icon: <FaRegCalendarCheck />, path: "/attendance" },
    { label: "Attendance (Admin)", icon: <FaRegCalendarCheck />, path: "/attendance/admin" },
    { label: "User Attendance", icon: <FaRegCalendarCheck />, path: "/attendance/user/:id" },

    // 4. Employee
    { label: "Employee", icon: <FaUsers />, path: "/employee" },

    // 5. Suggest / Topics
    { label: "Suggest Topic", icon: <FaRegNewspaper />, path: "/suggest-topic" },
    { label: "Topic Hub", icon: <FaPoll  />, path: "/topic" },
    { label: "Topic Proposal", icon: <FaRegLightbulb />, path: "/topicProposal" },

    // 6. Reports / Management
    { label: "Host Frequency Report", icon: <FaFileAlt />, path: "/hostfrequencyreport" },
    { label: "Organization", icon: <FaBuilding />, path: "/organization" },

    // 8. Salary / Ticket / Message / Test
    { label: "Salary", icon: <FaCog />, path: "/salary" },
    { label: "Ticket", icon: <FaTicketAlt />, path: "/ticket" },


    // 7. User / Account / Settings
    // { label: "User Profile", icon: <FaUserCircle />, path: "/user/:id" },
    { label: "Account", icon: <FaUserCircle />, path: "/account" },



];

const activeStyle = {
    backgroundColor: "#001B12",
    color: "white",
    fontWeight: "600",
    textDecoration: "none",
};

const inactiveStyle = {
    color: "#6c757d",
    textDecoration: "none",
};

function Sidebar() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        setUser(getCurrentUser());
    }, []);

    useEffect(() => {
        const user = getCurrentUser();
        console.log("User role:", user?.role);
        console.log("Resolved role name:", roleMap[user?.role]);
        setUser(user);
    }, []);


    const roleMap = {
        1: "HR",
        2: "USER",
        3: "MEETING_MANAGER",
        4: "ADMIN"
    };

    const visibleMenuItems = menuItems.filter(({ label }) => {
        const role = roleMap[user?.role];// Ex: "USER", "HR", "MEETING_MANAGER"

        const accessMap = {
            ADMIN: [
                "Overview", "Meeting", "Message", "Notice", "Account", "Suggest", "Attendance",
                "Employee",
                "HostFrequencyReport", "Organization", "User Profile",
                "Salary", "Settings", "Poll Meeting", "Topic Hub", "Topic Proposal", "Topic Detail", "Test", "OpenTalk Manager", "OpenTalk Requests", "Cronjob Configuration", "Host Meeting"

            ],
            HR: [
                "Overview", "Meeting", "Message", "Notice", "Account", "Suggest", "Attendance",
                "Employee","Suggest Topic",
                "HostFrequencyReport", "Organization", "User Profile",
                "Salary", "Settings", "Poll Meeting", "Topic Hub", "Topic Proposal", "Topic Detail", "Test",
                "Host Meeting"
            ],
            USER: [
                "Overview", "Meeting", "Message", "Notice", "Account", "Suggest", "Attendance",
                "User Profile",
                "Topic Hub", "Topic Proposal", "Topic Detail", "Settings", "Test",
                "Host Meeting",
                "Overview", "Meetings", "Meeting Detail", "Poll Meeting",
                "Attendance", "Suggest Topic", "Topic Hub", "Topic Proposal", "Topic Proposal Category",
                "Message", "Account", "Settings", "Test Page"
            ],
            HR: [
                "Dashboard", "Meetings", "Meeting Detail", "Attendance", "Attendance (Admin)",
                "Employee", "Host Frequency Report", "Organization", "Salary",
                "Suggest Topic", "Topic Hub", "Topic Proposal", "Topic Proposal Category",
                "Message", "Account", "Settings", "Test Page"
            ],
            MEETING_MANAGER: [
                "Overview", "Meeting", "Message", "Notice", "Account", "Suggest", "Attendance",
                "HostFrequencyReport", "Poll Meeting",
                "User Profile",
                "Topic Hub", "Topic Proposal", "Topic Detail", "Settings", "Test", "OpenTalk Manager", "OpenTalk Requests", "Cronjob Configuration", "Host Meeting",
                "Dashboard", "Meetings", "Meeting Detail", "Poll Meeting", "Create Poll",
                "OpenTalk Manager", "OpenTalk Requests", "Attendance", "Attendance (Admin)",
                "Host Frequency Report", "Suggest Topic", "Topic Hub", "Topic Proposal", "Topic Proposal Category",
                "Message", "Account", "Settings", "Test Page", "Topic Poll"
            ],
            ADMIN: [  // full quyền (tuỳ hệ thống)
                ...menuItems.map(item => item.label) // tất cả
            ]
        };

        return accessMap[role]?.includes(label);
    });

    return (
        <div className="d-flex flex-column bg-light vh-100 p-3" style={{width: 250}}>
            <nav className="nav flex-column">
                {visibleMenuItems.map(({label, icon, path}) => (
                    <NavLink
                        to={path}
                        key={label}
                        className="nav-link d-flex align-items-center gap-2 text-start rounded mb-1"
                        style={({isActive}) => (isActive ? activeStyle : inactiveStyle)}
                    >
                        <span>{icon}</span>
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            {/*<button*/}
            {/*    className="btn btn-outline-danger mt-auto d-flex align-items-center gap-2"*/}
            {/*    style={{ width: "100%" }}*/}
            {/*    onClick={() => {*/}
            {/*        clearTokens();*/}
            {/*        navigate("/login");*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <FaSignOutAlt />*/}
            {/*    Logout*/}
            {/*</button>*/}
        </div>
    );
}

export default Sidebar;
