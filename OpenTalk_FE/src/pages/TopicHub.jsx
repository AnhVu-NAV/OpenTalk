import { useState, useEffect } from "react"
import { FaSearch } from "react-icons/fa"
import styles from "./styles/module/TopicHub.module.css"
import axios from "../api/axiosClient.jsx"
import { getAccessToken } from "../helper/auth.jsx"
import PollApp from "./PollMeeting.jsx"

const TopicHub = () => {
    const [selectedCategory, setSelectedCategory] = useState()
    const [meetingName, setMeetingName] = useState("")
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState([])

    const fetchMeeting = async () => {
        try {
            const res = await axios.get("/opentalk-meeting/all", {
                params: {name: meetingName},
                headers: { Authorization: `Bearer ${getAccessToken()}` },
            })
            setCategories(res.data || [])

        } catch (err) {
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMeeting()
    }, [meetingName])

    return (
        <div className={styles.topicHub}>
            {/* Sidebar */}
            <div className={styles.topicHubSidebar}>
                <div className={styles.topicHubSidebarHeader}>
                    <h2>OpenTalk Meeting</h2>
                </div>

                <div className={styles.topicHubSearchContainer}>
                    <FaSearch className={styles.topicHubSearchIcon} />
                    <input
                        type="text"
                        className={styles.topicHubSearchInput}
                        placeholder="Search meeting..."
                        value={meetingName}
                        onChange={(e) => setMeetingName(e.target.value)}
                    />
                </div>

                <div className={styles.topicHubCategoryList}>
                    {categories.map((category, index) => (
                        <div
                            key={category.id}
                            className={`${styles.topicHubCategoryItem} ${selectedCategory === category.id ? styles.active : ""}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            <div className={styles.topicHubCategoryNumber}>{index + 1}</div>
                            <div className={styles.topicHubCategoryInfo}>
                                <div className={styles.topicHubCategoryName}>{category.meetingName}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className={styles.topicHubMain}>
                {selectedCategory ? (
                    <PollApp meeting={selectedCategory} />
                ) : (
                    <div className={styles.topicHubEmptyState}>Chọn một meeting để xem Poll nhé!</div>
                )}
            </div>
        </div>
    )
}

export default TopicHub
