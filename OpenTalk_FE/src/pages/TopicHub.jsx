import { useState, useEffect } from "react"
import { FaSearch, FaPlus, FaEdit, FaTrash, FaEye, FaFilter, FaDownload } from "react-icons/fa"
import "./styles/TopicHub.css"

const TopicHub = () => {
    const [selectedCategory, setSelectedCategory] = useState("all")
    const [searchTerm, setSearchTerm] = useState("")
    const [topics, setTopics] = useState([])
    const [loading, setLoading] = useState(false)
    const [selectedTopics, setSelectedTopics] = useState([])

    // Mock data for categories
    const categories = [
        { id: "all", name: "All Topics", count: 45 },
        { id: "technology", name: "Technology", count: 12 },
        { id: "leadership", name: "Leadership", count: 8 },
        { id: "innovation", name: "Innovation", count: 15 },
        { id: "teamwork", name: "Team Building", count: 6 },
        { id: "productivity", name: "Productivity", count: 4 },
        { id: "communication", name: "Communication", count: 7 },
        { id: "career", name: "Career Development", count: 9 },
        { id: "wellness", name: "Wellness", count: 5 },
        { id: "finance", name: "Finance", count: 3 },
        { id: "marketing", name: "Marketing", count: 8 },
    ]

    // Mock data for topics
    const mockTopics = [
        {
            id: "TOPIC001",
            title: "Introduction to React Hooks",
            category: "Technology",
            author: "John Doe",
            status: "Published",
            createdDate: "15/01/2024",
            lastModified: "20/01/2024",
            views: 245,
            likes: 18,
        },
        {
            id: "TOPIC002",
            title: "Effective Leadership in Remote Teams",
            category: "Leadership",
            author: "Sarah Wilson",
            status: "Draft",
            createdDate: "18/01/2024",
            lastModified: "22/01/2024",
            views: 156,
            likes: 12,
        },
        {
            id: "TOPIC003",
            title: "Innovation Strategies for 2024",
            category: "Innovation",
            author: "Mike Chen",
            status: "Published",
            createdDate: "20/01/2024",
            lastModified: "25/01/2024",
            views: 389,
            likes: 31,
        },
        {
            id: "TOPIC004",
            title: "Building High-Performance Teams",
            category: "Team Building",
            author: "Emily Rodriguez",
            status: "Under Review",
            createdDate: "22/01/2024",
            lastModified: "26/01/2024",
            views: 198,
            likes: 15,
        },
        {
            id: "TOPIC005",
            title: "Time Management Techniques",
            category: "Productivity",
            author: "David Kim",
            status: "Published",
            createdDate: "25/01/2024",
            lastModified: "28/01/2024",
            views: 312,
            likes: 24,
        },
    ]

    useEffect(() => {
        setTopics(mockTopics)
    }, [])

    const filteredTopics = topics.filter((topic) => {
        const matchesCategory =
            selectedCategory === "all" ||
            topic.category.toLowerCase() === categories.find((cat) => cat.id === selectedCategory)?.name.toLowerCase()
        const matchesSearch =
            topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            topic.author.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesCategory && matchesSearch
    })

    const handleSelectTopic = (topicId) => {
        setSelectedTopics((prev) => (prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]))
    }

    const handleSelectAll = () => {
        if (selectedTopics.length === filteredTopics.length) {
            setSelectedTopics([])
        } else {
            setSelectedTopics(filteredTopics.map((topic) => topic.id))
        }
    }

    const getStatusBadge = (status) => {
        const statusConfig = {
            Published: { class: "status-published", text: "Published" },
            Draft: { class: "status-draft", text: "Draft" },
            "Under Review": { class: "status-review", text: "Under Review" },
            Archived: { class: "status-archived", text: "Archived" },
        }

        const config = statusConfig[status] || { class: "status-default", text: status }
        return <span className={`status-badge ${config.class}`}>{config.text}</span>
    }

    return (
        <div className="topic-hub">
            {/* Sidebar */}
            <div className="topic-sidebar">
                <div className="sidebar-header">
                    <h2>Topic Categories</h2>
                    <button className="add-category-btn">
                        <FaPlus />
                    </button>
                </div>

                <div className="search-container">
                    <FaSearch className="search-icon" />
                    <input
                        type="text"
                        className="search-input"
                        placeholder="Search categories..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="category-list">
                    {categories.map((category, index) => (
                        <div
                            key={category.id}
                            className={`category-item ${selectedCategory === category.id ? "active" : ""}`}
                            onClick={() => setSelectedCategory(category.id)}
                        >
                            <div className="category-number">{index + 1}</div>
                            <div className="category-info">
                                <div className="category-name">{category.name}</div>
                                <div className="category-count">({category.count})</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                <div className="sidebar-pagination">
                    <button className="page-btn">«</button>
                    <button className="page-btn">‹</button>
                    <button className="page-btn active">1</button>
                    <button className="page-btn">2</button>
                    <button className="page-btn">3</button>
                    <button className="page-btn">4</button>
                    <button className="page-btn">›</button>
                    <button className="page-btn">»</button>
                    <select className="page-size">
                        <option value="10">10</option>
                        <option value="25">25</option>
                        <option value="50">50</option>
                    </select>
                </div>
            </div>

            {/* Main Content */}
            <div className="topic-main">
                {/*<div className="main-header">*/}
                {/*    <div className="header-title">*/}
                {/*        <h1>Topic Management - {categories.find((cat) => cat.id === selectedCategory)?.name || "All Topics"}</h1>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*/!* Topic Form Section *!/*/}
                {/*<div className="topic-form-section">*/}
                {/*    <div className="form-row">*/}
                {/*        <div className="form-group">*/}
                {/*            <label>Category Filter</label>*/}
                {/*            <select*/}
                {/*                className="form-select"*/}
                {/*                value={selectedCategory}*/}
                {/*                onChange={(e) => setSelectedCategory(e.target.value)}*/}
                {/*            >*/}
                {/*                {categories.map((category) => (*/}
                {/*                    <option key={category.id} value={category.id}>*/}
                {/*                        {category.name}*/}
                {/*                    </option>*/}
                {/*                ))}*/}
                {/*            </select>*/}
                {/*        </div>*/}
                {/*        <div className="form-group">*/}
                {/*            <label>Status</label>*/}
                {/*            <select className="form-select">*/}
                {/*                <option value="">All Status</option>*/}
                {/*                <option value="published">Published</option>*/}
                {/*                <option value="draft">Draft</option>*/}
                {/*                <option value="review">Under Review</option>*/}
                {/*            </select>*/}
                {/*        </div>*/}
                {/*        <div className="form-group">*/}
                {/*            <label>Author</label>*/}
                {/*            <input type="text" className="form-input" placeholder="Filter by author..." />*/}
                {/*        </div>*/}
                {/*        <div className="form-group">*/}
                {/*            <label>Date Range</label>*/}
                {/*            <input type="date" className="form-input" />*/}
                {/*        </div>*/}
                {/*    </div>*/}

                {/*    <div className="form-actions">*/}
                {/*        <button className="btn btn-primary">*/}
                {/*            <FaFilter /> Apply Filters*/}
                {/*        </button>*/}
                {/*        <button className="btn btn-success">*/}
                {/*            <FaPlus /> Add New Topic*/}
                {/*        </button>*/}
                {/*        <button className="btn btn-outline">*/}
                {/*            <FaDownload /> Export*/}
                {/*        </button>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*/!* Topics Table *!/*/}
                {/*<div className="topics-table-container">*/}
                {/*    <table className="topics-table">*/}
                {/*        <thead>*/}
                {/*        <tr>*/}
                {/*            <th>*/}
                {/*                <input*/}
                {/*                    type="checkbox"*/}
                {/*                    checked={selectedTopics.length === filteredTopics.length && filteredTopics.length > 0}*/}
                {/*                    onChange={handleSelectAll}*/}
                {/*                />*/}
                {/*            </th>*/}
                {/*            <th>Topic ID</th>*/}
                {/*            <th>Title</th>*/}
                {/*            <th>Category</th>*/}
                {/*            <th>Author</th>*/}
                {/*            <th>Status</th>*/}
                {/*            <th>Created Date</th>*/}
                {/*            <th>Views</th>*/}
                {/*            <th>Likes</th>*/}
                {/*            <th>Actions</th>*/}
                {/*        </tr>*/}
                {/*        </thead>*/}
                {/*        <tbody>*/}
                {/*        {filteredTopics.map((topic) => (*/}
                {/*            <tr key={topic.id} className={selectedTopics.includes(topic.id) ? "selected" : ""}>*/}
                {/*                <td>*/}
                {/*                    <input*/}
                {/*                        type="checkbox"*/}
                {/*                        checked={selectedTopics.includes(topic.id)}*/}
                {/*                        onChange={() => handleSelectTopic(topic.id)}*/}
                {/*                    />*/}
                {/*                </td>*/}
                {/*                <td className="topic-id">{topic.id}</td>*/}
                {/*                <td className="topic-title">*/}
                {/*                    <div className="title-content">*/}
                {/*                        <strong>{topic.title}</strong>*/}
                {/*                        <small>Last modified: {topic.lastModified}</small>*/}
                {/*                    </div>*/}
                {/*                </td>*/}
                {/*                <td className="topic-category">{topic.category}</td>*/}
                {/*                <td className="topic-author">{topic.author}</td>*/}
                {/*                <td className="topic-status">{getStatusBadge(topic.status)}</td>*/}
                {/*                <td className="topic-date">{topic.createdDate}</td>*/}
                {/*                <td className="topic-views">{topic.views}</td>*/}
                {/*                <td className="topic-likes">{topic.likes}</td>*/}
                {/*                <td className="topic-actions">*/}
                {/*                    <button className="action-btn view-btn" title="View">*/}
                {/*                        <FaEye />*/}
                {/*                    </button>*/}
                {/*                    <button className="action-btn edit-btn" title="Edit">*/}
                {/*                        <FaEdit />*/}
                {/*                    </button>*/}
                {/*                    <button className="action-btn delete-btn" title="Delete">*/}
                {/*                        <FaTrash />*/}
                {/*                    </button>*/}
                {/*                </td>*/}
                {/*            </tr>*/}
                {/*        ))}*/}
                {/*        </tbody>*/}
                {/*    </table>*/}
                {/*</div>*/}

            {/*    /!* Table Footer *!/*/}
            {/*    <div className="table-footer">*/}
            {/*        <div className="selected-info">*/}
            {/*            {selectedTopics.length > 0 && <span>{selectedTopics.length} topics selected</span>}*/}
            {/*        </div>*/}
            {/*        <div className="table-pagination">*/}
            {/*<span>*/}
            {/*  Showing {filteredTopics.length} of {topics.length} topics*/}
            {/*</span>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            </div>
        </div>
    )
}

export default TopicHub
