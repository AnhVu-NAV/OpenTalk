import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import MeetingCard from "../components/meetingCard/meetingCard/MeetingCard"
import { FaSearch, FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa"

import { getCompanyBranches } from "../api/companyBranch"
import { OpenTalkMeetingStatus } from "../constants/enums/openTalkMeetingStatus"
import meetingMockData from "../api/__mocks__/data/meetingMockData"
import styles from "./styles/module/HostMeetingListPage.module.css"
import { getCurrentUser } from "../helper/auth"
import { getMeetingDetailsForHost } from "../api/meeting"

const mockBranches = [
    { id: 1, name: "Branch A" },
    { id: 2, name: "Branch B" },
    { id: 3, name: "Branch C" },
    { id: 4, name: "Branch D" },
]

const HostMeetingListPage = () => {
    const navigate = useNavigate()
    const [meetings, setMeetings] = useState([])
    const [branches, setBranches] = useState([])
    const [searchTerm, setSearchTerm] = useState("")
    const [branchFilter, setBranchFilter] = useState("")
    const [activeTab, setActiveTab] = useState(OpenTalkMeetingStatus.COMPLETED)
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 8

    const tabs = [
        { id: OpenTalkMeetingStatus.COMPLETED, label: "History" },
        { id: OpenTalkMeetingStatus.UPCOMING, label: "Upcoming" },
        { id: OpenTalkMeetingStatus.ONGOING, label: "Ongoing" },
    ]

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getMeetingDetailsForHost(searchTerm, branchFilter, getCurrentUser()?.username)
                console.log("Fetched host meetings:", data)
                setMeetings(Array.isArray(data) ? data : meetingMockData)
            } catch (e) {
                console.error(e)
                setMeetings(meetingMockData)
            }

            try {
                const branchData = await getCompanyBranches()
                setBranches(Array.isArray(branchData) ? branchData : mockBranches)
            } catch (e) {
                console.error(e)
                setBranches(mockBranches)
            }
        }

        fetchData()
    }, [searchTerm, branchFilter])

    const handleJoin = (link) => {
        if (link) {
            window.open(link, "_blank")
        }
    }

    const filteredMeetings = meetings.filter((m) => {
        switch (activeTab) {
            case OpenTalkMeetingStatus.COMPLETED:
                return m.status === OpenTalkMeetingStatus.COMPLETED
            case OpenTalkMeetingStatus.UPCOMING:
                return m.status === OpenTalkMeetingStatus.UPCOMING
            case OpenTalkMeetingStatus.ONGOING:
                return m.status === OpenTalkMeetingStatus.ONGOING
            default:
                return true
        }
    })

    const totalPages = Math.ceil(filteredMeetings.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const paginatedMeetings = filteredMeetings.slice(startIndex, startIndex + itemsPerPage)

    return (
        <div className={styles.hostMeetingPage}>
            <div className={styles.hostMeetingFilters}>
                <div className={styles.hostMeetingSearchContainer}>
                    <FaSearch className={styles.hostMeetingSearchIcon} />
                    <input
                        type="text"
                        className={styles.hostMeetingSearchInput}
                        placeholder="Search Meeting"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value)
                            setCurrentPage(1)
                        }}
                    />
                </div>
                <div className={styles.hostMeetingSelectContainer}>
                    <select
                        className={styles.hostMeetingSelect}
                        value={branchFilter}
                        onChange={(e) => {
                            setBranchFilter(e.target.value)
                            setCurrentPage(1)
                        }}
                    >
                        <option value="">All Branches</option>
                        {branches.map((b) => (
                            <option key={b.id ?? b.name} value={b.id}>
                                {b.name}
                            </option>
                        ))}
                    </select>
                    <FaChevronDown className={styles.hostMeetingSelectIcon} />
                </div>
            </div>

            <div className={styles.hostMeetingTabsHeader}>
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => {
                            setActiveTab(t.id)
                            setCurrentPage(1)
                        }}
                        className={`${styles.hostMeetingTabButton} ${activeTab === t.id ? styles.active : ""}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className={styles.hostMeetingListContainer}>
                {paginatedMeetings.map((m) => (
                    <MeetingCard
                        key={m.id}
                        meeting={m}
                        participants={[]}
                        extraCount={0}
                        displayLink={m.status !== OpenTalkMeetingStatus.COMPLETED}
                        showButton={false}
                        actionLabel={""}
                        isDisabledButton={true}
                        onAction={() => {}}
                        onView={() => navigate(`/host-meeting/${m.id}`, { state: { meetingList: meetings, onTab: activeTab } })}
                    />
                ))}
            </div>

            <div className={styles.hostMeetingPagination}>
                <div className={styles.hostMeetingPaginationInfo}>
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredMeetings.length)} of{" "}
                    {filteredMeetings.length} results
                </div>
                <div className={styles.hostMeetingPaginationButtons}>
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={styles.hostMeetingPaginationBtn}
                    >
                        <FaChevronLeft />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`${styles.hostMeetingPaginationNumber} ${currentPage === i + 1 ? styles.active : ""}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={styles.hostMeetingPaginationBtn}
                    >
                        <FaChevronRight />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default HostMeetingListPage
