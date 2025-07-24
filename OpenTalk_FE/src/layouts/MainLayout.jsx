"use client"

import { useState, useEffect } from "react"
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import { Outlet } from "react-router-dom"
import styles from "./MainLayout.module.css"

export default function MainLayout({ children }) {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
    const [sidebarVisible, setSidebarVisible] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    // Check if mobile on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth <= 768
            setIsMobile(mobile)
            if (mobile) {
                setSidebarCollapsed(false) // Don't collapse on mobile, just hide
            }
        }

        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    const toggleSidebar = () => {
        if (isMobile) {
            setSidebarVisible(!sidebarVisible)
        } else {
            setSidebarCollapsed(!sidebarCollapsed)
        }
    }

    const closeMobileSidebar = () => {
        if (isMobile) {
            setSidebarVisible(false)
        }
    }

    return (
        <div className={styles.layout}>
            {/* Mobile Overlay */}
            {isMobile && sidebarVisible && <div className={styles.overlay} onClick={closeMobileSidebar} />}

            {/* Sidebar */}
            <div className={`${styles.sidebarContainer} ${isMobile ? (sidebarVisible ? styles.show : "") : ""}`}>
                <Sidebar collapsed={!isMobile && sidebarCollapsed} onToggle={toggleSidebar} />
            </div>

            {/* Main Content */}
            <div className={`${styles.mainContainer} ${!isMobile && sidebarCollapsed ? styles.sidebarCollapsed : ""}`}>
                <Header onToggleSidebar={toggleSidebar} sidebarCollapsed={sidebarCollapsed} />

                <main className={styles.mainContent}>
                    <div className={styles.contentWrapper}>
                        <Outlet />
                        {children}
                    </div>
                </main>
            </div>
        </div>
    )
}
