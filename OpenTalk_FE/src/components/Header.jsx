import { useEffect, useState } from "react"
import { FaBell, FaMoon, FaSun } from "react-icons/fa"
import { getCurrentUser, clearTokens } from "../helper/auth"
import { useNavigate } from "react-router-dom"
import axiosClient from "../api/axiosClient"
import styles from "./Header.module.css"

function Header({ onToggleSidebar, sidebarCollapsed }) {
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const [user, setUser] = useState(null)
    const [darkMode, setDarkMode] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const current = getCurrentUser()
        console.log("Loaded user:", current)
        setUser(current)
    }, [])

    const handleLogout = async () => {
        try {
            const accessToken = localStorage.getItem("accessToken")

            await axiosClient.post("/auth/logout", null, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            })
        } catch (err) {
            console.error("Logout failed or token expired: " + err)
        } finally {
            clearTokens()
            navigate("/login")
        }
    }

    const toggleDarkMode = () => {
        setDarkMode(!darkMode)
        // Add dark mode implementation here
    }

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                {/* Mobile menu toggle */}
                <button className={styles.mobileMenuToggle} onClick={onToggleSidebar} aria-label="Toggle sidebar">
                    <span className={styles.hamburger}></span>
                    <span className={styles.hamburger}></span>
                    <span className={styles.hamburger}></span>
                </button>
                {/*Search bar - hidden on mobile*/}
                <div className={styles.searchContainer}>
                    <input className={styles.searchInput} type="hidden" placeholder="Search here..." />
                </div>

                {/* Logo - only show on mobile when sidebar is collapsed */}
                <div className={`${styles.mobileLogo} ${sidebarCollapsed ? styles.show : ""}`}>
                    <div className={styles.logoIcon}></div>
                    <span className={styles.logoText}>OpenTalk</span>
                </div>



                {/* Right side actions */}
                <div className={styles.headerActions}>
                    {/*/!* Notifications *!/*/}
                    {/*<button className={styles.iconButton}>*/}
                    {/*    <FaBell className={styles.icon} />*/}
                    {/*    <span className={styles.notificationBadge}>13</span>*/}
                    {/*</button>*/}

                    {/*/!* Dark mode toggle *!/*/}
                    {/*<button className={styles.iconButton} onClick={toggleDarkMode} aria-label="Toggle dark mode">*/}
                    {/*    {darkMode ? <FaSun className={styles.icon} /> : <FaMoon className={styles.icon} />}*/}
                    {/*</button>*/}

                    {/* User dropdown */}
                    <div className={styles.userDropdown}>
                        <button
                            className={styles.userButton}
                            onClick={() => setDropdownOpen(!dropdownOpen)}
                            aria-expanded={dropdownOpen}
                        >
                            <img
                                src="https://randomuser.me/api/portraits/men/32.jpg"
                                alt="User avatar"
                                className={styles.userAvatar}
                            />
                            <span className={styles.userName}>{user?.fullName || user?.username || "Unknown"}</span>
                            <svg
                                className={`${styles.dropdownArrow} ${dropdownOpen ? styles.rotated : ""}`}
                                viewBox="0 0 16 16"
                                fill="currentColor"
                            >
                                <path d="M7.247 11.14 2.451 5.658C2.08 5.243 2.345 4.5 2.882 4.5h10.236c.537 0 .802.743.43 1.158l-4.796 5.482a1 1 0 0 1-1.505 0z" />
                            </svg>
                        </button>

                        {dropdownOpen && (
                            <div className={styles.dropdownMenu}>
                                <a href="/account" className={styles.dropdownItem}>
                                    Profile
                                </a>
                                {/*<a href="#" className={styles.dropdownItem}>*/}
                                {/*    Settings*/}
                                {/*</a>*/}
                                <div className={styles.dropdownDivider}></div>
                                <button className={styles.dropdownItem} onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header
