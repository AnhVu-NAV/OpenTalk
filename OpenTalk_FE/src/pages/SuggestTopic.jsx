import { useState, useEffect } from "react"
import CustomTextEditor from "../components/textEdit/RichTextEditor.jsx"
import styles from "./styles/module/SuggestTopic.module.css"
import { getCurrentUser, getAccessToken } from "../helper/auth.jsx"
import axios from "/src/api/axiosClient.jsx"
import { AiOutlineCalendar, AiOutlineEye, AiOutlineFileText, AiOutlineFlag } from "react-icons/ai"
import TopicProposal from "../components/common/TopicProposalCard.jsx"

const SuggestTopic = () => {
    const [topicUser, setTopicUser] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const user = getCurrentUser()
        if (!user) {
            console.error("Chưa tìm thấy user, bạn cần login trước!")
            setLoading(false)
            return
        }
        const userId = user.id
        axios
            .get(`/topic-idea/suggestedBy/${userId}`, {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
            })
            .then((res) => {
                setTopicUser(res.data)
            })
            .catch((err) => {
                console.error("Lỗi khi fetch suggested topics:", err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [loading])

    const handleSubmitTopic = async ({ title, content }) => {
        const token = getAccessToken()
        const user = getCurrentUser()

        try {
            console.log(title)
            console.log(content)
            const res = await axios.post(
                "/topic-idea",
                {
                    title: title,
                    description: content,
                    status: "",
                    remark: "",
                    suggestedBy: user,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            )
            setLoading(true)
            console.log("Topic suggested successfully:", res.data)
            alert("Topic submitted!")
        } catch (err) {
            console.error("Error submitting topic:", err)
            alert("Error submitting topic!")
        }
    }

    return (
        <div className={styles.pageWrapper}>
            <div className={styles.pageHeader}>
                <p className={styles.pageSubtitle}>Idea Suggestion</p>
                <h1 className={styles.pageTitle}>Suggest New Topic</h1>
            </div>
            <div className={styles.layout}>
                {/* Editor bên trái */}
                <div className={styles.layoutMain}>
                    <CustomTextEditor onSubmit={handleSubmitTopic} />
                </div>
                {/* Card bên phải */}
                <aside className={styles.layoutSidebar}>
                    <div className={styles.actionCard}>
                        <div className={styles.actionCardHeader}>Actions</div>
                        <ul className={styles.actionCardList}>
                            <li className={styles.actionCardItem}>
                <span className={styles.actionCardLabel}>
                  <AiOutlineFlag className={styles.actionCardIcon} />
                  <strong>Status:</strong> Draft
                </span>
                            </li>
                            <li className={styles.actionCardItem}>
                <span className={styles.actionCardLabel}>
                  <AiOutlineEye className={styles.actionCardIcon} />
                  <strong>Visibility:</strong> Public
                </span>
                            </li>
                            <li className={styles.actionCardItem}>
                <span className={styles.actionCardLabel}>
                  <AiOutlineCalendar className={styles.actionCardIcon} />
                  <strong>Schedule:</strong> Now
                </span>
                            </li>
                            <li className={`${styles.actionCardItem} ${styles.actionCardItemLast}`}>
                <span className={styles.actionCardLabel}>
                  <AiOutlineFileText className={styles.actionCardIcon} />
                  <strong>Readability:</strong> Ok
                </span>
                            </li>
                        </ul>
                        <div className={styles.actionCardFooter}>
                            <button className={`${styles.btn} ${styles.btnDraft}`}>Save Draft</button>
                        </div>
                    </div>
                </aside>
            </div>
            {topicUser.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "18px", color: "#666" }}>
                    You have not suggest before.
                </div>
            ) : (
                <div className={styles.categoryList}>
                    {topicUser.map((post) => (
                        <TopicProposal
                            key={post.id}
                            title={post.title}
                            description={post.description}
                            authorName={post.suggestedBy.fullName}
                            date={post.createdAt}
                            avatarUrl="https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg"
                            status={post.status}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

export default SuggestTopic
