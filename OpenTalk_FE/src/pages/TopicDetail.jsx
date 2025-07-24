import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ProposalDetail from "/src/components/proposalTopic/ProposalDetail.jsx"
import axios from "/src/api/axiosClient.jsx"
import { getAccessToken } from "../helper/auth.jsx"
import styles from "./styles/module/TopicDetail.module.css"

const TopicDetail = () => {
    const { id } = useParams()
    const [data, setData] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`/topic-idea/${id}`, {
                    headers: { Authorization: `Bearer ${getAccessToken()}` },
                })
                setData(response.data)
            } catch (error) {
                console.error("Error fetching topic details:", error)
            }
        }

        fetchData()
    }, [id])

    if (!data) {
        return (
            <div className={styles.topicDetailContainer}>
                <div className={styles.loadingContainer}>
                    <div className={styles.loadingSpinner}></div>
                    <p>Loading...</p>
                </div>
            </div>
        )
    }

    return (
        <div className={styles.topicDetailContainer}>
            <div className={styles.detailWrapper}>
                <div className={styles.detailHeader}>
                    <h1 className={styles.detailTitle}>Topic Details</h1>
                    <p className={styles.detailSubtitle}>View and manage topic proposal</p>
                </div>
                <div className={styles.detailContent}>
                    <ProposalDetail />
                </div>
            </div>
        </div>
    )
}

export default TopicDetail
