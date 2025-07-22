import React, { useEffect, useState } from "react";
import { FaBell, FaMoon } from "react-icons/fa";
import { getCurrentUser, clearTokens } from "../helper/auth";
import { useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

function Header() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const current = getCurrentUser();
        console.log("Loaded user:", current);
        setUser(current);
    }, []);

    const handleLogout = async () => {
    try {
        const accessToken = localStorage.getItem("accessToken");

        await axiosClient.post("/auth/logout", null, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        });
    } catch (err) {
        console.error("Logout failed or token expired: " + err);
    } finally {
        clearTokens();
        navigate("/login");
    }
    };

    return (
        <nav className="navbar navbar-light bg-white shadow-sm px-3 d-flex justify-content-between align-items-center">
            {/* Logo */}
            <div className="d-flex align-items-center">
                <div
                    style={{
                        width: 24,
                        height: 24,
                        background: "linear-gradient(45deg, #ec4899, #10b981)",
                        borderRadius: 4,
                    }}
                ></div>
                <span className="ms-2 fw-bold text-success">OpenTalk</span>
            </div>

            {/* Search bar */}
            {/*<form className="d-flex flex-grow-1 mx-3">*/}
            {/*    <input*/}
            {/*        className="form-control rounded-pill"*/}
            {/*        type="search"*/}
            {/*        placeholder="Search here"*/}
            {/*    />*/}
            {/*</form>*/}

            {/* Right Icons */}
            <div className="d-flex align-items-center gap-3">
                <button type="button" className="btn position-relative p-0">
                    <FaBell size={18} className="text-secondary" />
                    <span
                        className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                        style={{ fontSize: "0.6rem" }}
                    >
                        13
                    </span>
                </button>
                <button type="button" className="btn p-0">
                    <FaMoon size={18} className="text-secondary" />
                </button>

                <div className="dropdown">
                    <button
                        className="btn d-flex align-items-center gap-2"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        type="button"
                        aria-expanded={dropdownOpen}
                    >
                        <img
                            src="https://randomuser.me/api/portraits/men/32.jpg"
                            alt="avatar"
                            className="rounded-circle"
                            width={32}
                            height={32}
                        />
                        <span className="d-none d-md-inline text-secondary fw-semibold">
                            {user?.fullName || user?.username || "Unknown"}
                        </span>
                        <svg
                            className={`bi bi-caret-down-fill ms-1 ${
                                dropdownOpen ? "rotate-180" : ""
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                            style={{ transition: "transform 0.3s ease" }}
                        >
                            <path d="M7.247 11.14 2.451 5.658C2.08 5.243 2.345 4.5 2.882 4.5h10.236c.537 0 .802.743.43 1.158l-4.796 5.482a1 1 0 0 1-1.505 0z" />
                        </svg>
                    </button>
                    {dropdownOpen && (
                        <ul className="dropdown-menu show dropdown-menu-end mt-2">
                            <li>
                                <a className="dropdown-item" href="#">
                                    Profile
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Settings
                                </a>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <button className="dropdown-item" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Header;
