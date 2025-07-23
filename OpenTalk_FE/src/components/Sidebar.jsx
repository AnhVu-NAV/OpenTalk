import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    FaHome, FaVideo, FaEnvelope, FaProjectDiagram, FaTicketAlt, FaUsers,
    FaRegCalendarCheck, FaRegNewspaper, FaFileAlt, FaBuilding, FaUserCircle,
    FaCog, FaSignOutAlt,FaRegLightbulb
} from "react-icons/fa";
import { getCurrentUser, clearTokens } from "../helper/auth";

const menuItems = [
    { label: "Overview", icon: <FaHome />, path: "/" },
    { label: "Meeting", icon: <FaVideo />, path: "/meeting" },
    { label: "Meeting Host", icon: <FaVideo />, path: "/host-meeting" },
    { label: "Message", icon: <FaEnvelope />, path: "/message" },
    { label: "Project", icon: <FaProjectDiagram />, path: "/project" },
    { label: "Ticket", icon: <FaTicketAlt />, path: "/ticket" },
    { label: "Employee", icon: <FaUsers />, path: "/employee" },
    { label: "Attendance", icon: <FaRegCalendarCheck />, path: "/attendance" },
    { label: "Suggest", icon: <FaRegNewspaper />, path: "/suggestTopic" },
    { label: "Topic Proposal", icon: <FaRegLightbulb />, path: "/topicProposal" },
    { label: "HostFrequencyReport", icon: <FaFileAlt />, path: "/hostfrequencyreport" },
    { label: "Organization", icon: <FaBuilding />, path: "/organization" },
    { label: "Account", icon: <FaUserCircle />, path: "/account" },
    { label: "Setting", icon: <FaCog />, path: "/setting" },
    { label: "Test", icon: <FaCog />, path: "/test" },
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

    const roleMap = {
        1: "MEETING_MANAGER",
        2: "USER"
    };

    const visibleMenuItems = menuItems.filter(({ label }) => {
        const role = roleMap[user?.role];

        if (role === "ADMIN") {
            return ["Overview", "Meeting", "Message", "Notice", "Account", "Suggest", "Attendance"].includes(label);
        }

        if (role === "MEETING_MANAGER") {
            return ["Overview", "Meeting", "Message", "Notice", "Account", "Suggest", "Attendance", "Organization", "Meeting Host"].includes(label);
        }

        return false;
    });

    return (
        <div className="d-flex flex-column bg-light vh-100 p-3" style={{ width: 250 }}>
            <nav className="nav flex-column">
                {visibleMenuItems.map(({ label, icon, path }) => (
                    <NavLink
                        to={path}
                        key={label}
                        className="nav-link d-flex align-items-center gap-2 text-start rounded mb-1"
                        style={({ isActive }) => (isActive ? activeStyle : inactiveStyle)}
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
