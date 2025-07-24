import { useState, useEffect } from "react"
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaFilter, FaDownload } from "react-icons/fa"
import "./styles/TopicHub.css"
import axios from "../api/axiosClient.jsx";
import {getAccessToken} from "../helper/auth.jsx";
import PollApp from "./PollMeeting.jsx";

const TopicHub = () => {
    const [selectedCategory, setSelectedCategory] = useState()
    const [meetingName, setMeetingName] = useState("")
    const [loading, setLoading] = useState(false)
    const[categories, setCategories] = useState([])

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
        fetchMeeting();
    },[meetingName])


    return (
        <div className="topic-hub">
            {/* Sidebar */}
            <div className="topic-sidebar">
                <div className="sidebar-header">
                    <h2>OpenTalk Meeting</h2>
                </div>

                <div className="search-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search meeting..."
                        value={meetingName}
                        onChange={(e) => setMeetingName(e.target.value)}
                    />
                </div>

                <div className="category-list">
                    {categories.map((category, index) => (
                        <div
                            key={category.id}
                            className={`category-item ${selectedCategory === category.id ? "active" : ""}`}
                            onClick={() => setSelectedCategory(category)}
                        >
                            <div className="category-number">{index + 1}</div>
                            <div className="category-info">
                                <div className="category-name">{category.meetingName}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="topic-main">
                {selectedCategory ? (
                    <PollApp
                        meeting={selectedCategory}
                    />
                ) : (
                    <div className="empty-state">Chọn một meeting để xem Poll nhé!</div>
                )}
            </div>
        </div>
    )
}

export default TopicHub
