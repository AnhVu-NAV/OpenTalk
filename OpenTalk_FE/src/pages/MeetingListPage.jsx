import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import MeetingCard from "../components/meetingCard/meetingCard/MeetingCard"
import { FaSearch, FaChevronDown, FaChevronLeft, FaChevronRight } from "react-icons/fa"
import { getMeetingDetails, registerHost } from "../api/meeting"
import { getCompanyBranches } from "../api/companyBranch"
import { OpenTalkMeetingStatus } from "../constants/enums/openTalkMeetingStatus"
import meetingMockData from "../api/__mocks__/data/meetingMockData"
import styles from "./styles/module/MeetingListPage.module.css"
import { getCurrentUser } from "../helper/auth"

const mockBranches = [
  { id: 1, name: "Branch A" },
  { id: 2, name: "Branch B" },
  { id: 3, name: "Branch C" },
  { id: 4, name: "Branch D" },
]

const MeetingListPage = () => {
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
    { id: OpenTalkMeetingStatus.WAITING_HOST_REGISTER, label: "Waiting Host To Register" },
    { id: OpenTalkMeetingStatus.UPCOMING, label: "Upcoming" },
    { id: OpenTalkMeetingStatus.ONGOING, label: "Ongoing" },
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMeetingDetails(searchTerm, branchFilter)
        console.log("Fetched meetings:", data)
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

  const handleRegisterHost = (meetingId) => {
    const currentUserInfo = getCurrentUser()
    if (currentUserInfo) {
      registerHost({
        user: currentUserInfo,
        meeting: {
          id: meetingId,
        },
      })
      setMeetings((prevMeetings) => {
        return prevMeetings.map((m) => {
          if (m.id === meetingId) {
            return { ...m, registeredHostUserIds: [...m.registeredHostUserIds, currentUserInfo.id] }
          }
          return m
        })
      })
    }
  }

  function isAlreadyRegiteredHost(meetingId) {
    return (
        activeTab === OpenTalkMeetingStatus.WAITING_HOST_REGISTER &&
        meetings.some((m) => m.id === meetingId && m.registeredHostUserIds?.includes(getCurrentUser()?.id))
    )
  }

  const filteredMeetings = meetings.filter((m) => {
    switch (activeTab) {
      case OpenTalkMeetingStatus.COMPLETED:
        return m.status === OpenTalkMeetingStatus.COMPLETED
      case OpenTalkMeetingStatus.WAITING_HOST_REGISTER:
        return m.status === OpenTalkMeetingStatus.WAITING_HOST_REGISTER
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
      <div className={styles.meetingListPage}>
        <div className={styles.meetingListFilters}>
          <div className={styles.meetingListSearchContainer}>
            <FaSearch className={styles.meetingListSearchIcon} />
            <input
                type="text"
                className={styles.meetingListSearchInput}
                placeholder="Search Meeting"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
            />
          </div>
          <div className={styles.meetingListSelectContainer}>
            <select
                className={styles.meetingListSelect}
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
            <FaChevronDown className={styles.meetingListSelectIcon} />
          </div>
        </div>

        <div className={styles.meetingListTabsHeader}>
          {tabs.map((t) => (
              <button
                  key={t.id}
                  onClick={() => {
                    setActiveTab(t.id)
                    setCurrentPage(1)
                  }}
                  className={`${styles.meetingListTabButton} ${activeTab === t.id ? styles.active : ""}`}
              >
                {t.label}
              </button>
          ))}
        </div>

        <div className={styles.meetingListContainer}>
          {paginatedMeetings.map((m) => (
              <MeetingCard
                  key={m.id}
                  meeting={m}
                  participants={[]}
                  extraCount={0}
                  showButton={
                      activeTab === OpenTalkMeetingStatus.WAITING_HOST_REGISTER || activeTab === OpenTalkMeetingStatus.ONGOING
                  }
                  actionLabel={activeTab === OpenTalkMeetingStatus.WAITING_HOST_REGISTER ? "Register Host" : "Join Meeting"}
                  isDisabledButton={isAlreadyRegiteredHost(m.id)}
                  onAction={() => {
                    if (activeTab === OpenTalkMeetingStatus.ONGOING) {
                      handleJoin(m.meetingLink)
                    } else if (activeTab === OpenTalkMeetingStatus.WAITING_HOST_REGISTER) {
                      handleRegisterHost(m.id)
                      alert("Your host request has been sent successfully.")
                    }
                  }}
                  onView={() => navigate(`/meeting/${m.id}`, { state: { meetingList: meetings, onTab: activeTab } })}
              />
          ))}
        </div>

        <div className={styles.meetingListPagination}>
          <div className={styles.meetingListPaginationInfo}>
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredMeetings.length)} of{" "}
            {filteredMeetings.length} results
          </div>
          <div className={styles.meetingListPaginationButtons}>
            <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={styles.meetingListPaginationBtn}
            >
              <FaChevronLeft />
            </button>
            {[...Array(totalPages)].map((_, i) => (
                <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`${styles.meetingListPaginationNumber} ${currentPage === i + 1 ? styles.active : ""}`}
                >
                  {i + 1}
                </button>
            ))}
            <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={styles.meetingListPaginationBtn}
            >
              <FaChevronRight />
            </button>
          </div>
        </div>
      </div>
  )
}

export default MeetingListPage