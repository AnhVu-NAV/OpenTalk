import React, { useState, useEffect } from 'react';
import CustomTextEditor from "../components/textEdit/RichTextEditor.jsx";
import '../css/SuggestTopic.css'
import {getCurrentUser, getAccessToken} from "../helper/auth.jsx";
import axios from '/src/api/axiosClient.jsx';


import {AiOutlineCalendar, AiOutlineEye, AiOutlineFileText, AiOutlineFlag} from "react-icons/ai";
import TopicProposal from "../components/common/TopicProposalCard.jsx";
const SuggestTopic = () => {
    const [topicUser, setTopicUser] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const user = getCurrentUser();
        if (!user) {
            console.error('Chưa tìm thấy user, bạn cần login trước!');
            setLoading(false);
            return;
        }

        const userId = user.id;
        const token = getAccessToken();

        axios.get(`/topic-idea/suggestedBy/1`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(res => {
                setTopicUser(res.data);
            })
            .catch(err => {
                console.error('Lỗi khi fetch suggested topics:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleSubmitTopic = async ({ title, content }) => {
        const token = getAccessToken();
        const user = getCurrentUser();
        if (!user) return;

        try {
            const res = await axios.post(
                "/topic-idea",
                {
                    title: title,
                    description: content,
                    suggestedBy: { id: user.id } // giả định backend nhận object hoặc chỉ id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log("Topic suggested successfully:", res.data);
            alert("Topic submitted!");
        } catch (err) {
            console.error("Error submitting topic:", err);
            alert("Error submitting topic!");
        }
    };
    return (
        <div className="page-wrapper">
            <div className="page-header">
                <p className="page-subtitle">Idea Suggestion</p>
                <h1 className="page-title">Suggest New Topic</h1>
            </div>
            <div className="layout">
                {/* Editor bên trái */}
                <div className="layout__main">
                    <CustomTextEditor onSubmit={handleSubmitTopic} />
                </div>
                {/* Card bên phải */}
                <aside className="layout__sidebar">
                    <div className="action-card">
                        <div className="action-card__header">Actions</div>
                        <ul className="action-card__list">
                            <li className="action-card__item">
                  <span className="action-card__label">
                    <AiOutlineFlag className="action-card__icon"/>
                    <strong>Status:</strong> Draft
                  </span>
                                
                            </li>
                            <li className="action-card__item">
                  <span className="action-card__label">
                    <AiOutlineEye className="action-card__icon"/>
                    <strong>Visibility:</strong> Public
                  </span>
                                
                            </li>
                            <li className="action-card__item">
                  <span className="action-card__label">
                    <AiOutlineCalendar className="action-card__icon"/>
                    <strong>Schedule:</strong> Now
                  </span>
                                
                            </li>
                            <li className="action-card__item action-card__item--last">
                  <span className="action-card__label">
                    <AiOutlineFileText className="action-card__icon"/>
                    <strong>Readability:</strong> Ok
                  </span>
                            </li>
                        </ul>
                        <div className="action-card__footer">
                            <button className="btn btn--draft">Save Draft</button>
                        </div>
                    </div>
                </aside>
            </div>
            {topicUser.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "18px", color: "#666" }}>
                    You have not suggest before.
                </div>
            ) : (
                <div className="category-list">
                    {topicUser.map(post => (
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

    );
};

export default SuggestTopic;
