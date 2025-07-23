import React, {useEffect, useState} from "react"
import "./styles/PollMeeting.css"
import { FaQuestion } from "react-icons/fa"
import axios from "/src/api/axiosClient.jsx"
import {getAccessToken} from "../helper/auth.jsx";
import TopicProposal from "../components/common/TopicProposalCard.jsx";

const CreatePoll = (meetingId, meetingName) => {
    const[pollOption, setPollOption] = useState([]);
    const[poll, setPoll] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [error, setError]     = useState(null);
    const [pollId, setPollId] = useState(null);
    const [posts, setPosts] = useState([]);

    const fetchTopics = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/topic-idea/', {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
                params: {status: 'approved' }
            });
            setPosts(res.data.content || []);
            setError(null);
        } catch (err) {
            console.error(err);
            setError('Không tải được dữ liệu');
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchTopics();
    }, []);


    useEffect(() => {
        const fetchPoll = async () => {
            try {
                const response = await axios.get(`/poll/2`,
                    { headers: { Authorization: `Bearer ${getAccessToken()}` }});
                setPoll(response.data);
                setPollId(response.data.id);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchPoll();
    }, []);

    useEffect(() => {
        if (!pollId) return;
        const fetchTopicPolls = async () => {
            try {
                const response = await axios.get(`/topic-poll/${pollId}`,
                    { headers: { Authorization: `Bearer ${getAccessToken()}` }});
                setPollOption(response.data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchTopicPolls();
    }, [pollId]);


    return (
        <div className="poll-container">
            <div className="poll-wrapper">

                <div className="poll-card">
                    <div className="poll-card-header">
                        <div className="poll-user-info">
                            <div className="poll-avatar">MJ</div>
                            <div className="poll-user-text">
                                <span className="poll-username">@Mariam Jahangiri</span>
                                <span className="poll-description">created a poll: Which topic should we discuss?</span>
                            </div>
                        </div>
                    </div>

                    <div className="poll-content">
                        <div className="poll-question">
                            <span className="poll-question-emoji"><FaQuestion /></span>
                            <h2 className="poll-question-text">{`Voting discussion for ${meetingName}`}</h2>
                        </div>

                        <div className="poll-options">
                            {pollOption.map((option) => (
                                <div key={option.id} className="poll-option">
                                    <div className="poll-option-content">
                                        <div className="poll-option-header">
                                            <div className="poll-option-label">
                                                <span className="poll-option-name">{option.topic.title}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="poll-history">
                {posts.length === 0 ? (
                    <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "18px", color: "#666" }}>
                        No topics found.
                    </div>
                ) : (
                    <div className="category-list">
                        {posts.map(post => (
                            <TopicProposal
                                key={post.id}
                                id={post.id}
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
        </div>
    )
}

export default CreatePoll
