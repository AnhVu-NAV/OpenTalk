import React, { useEffect, useState } from "react";
import "./styles/PollMeeting.css";
import { FaQuestion } from "react-icons/fa";
import axios from "/src/api/axiosClient.jsx";
import { getAccessToken } from "../helper/auth.jsx";
import TopicProposal from "../components/common/TopicProposalCard.jsx";
import { useParams } from "react-router-dom";
import ProposalDetail from "../components/proposalTopic/ProposalDetail.jsx";
import CustomModal from "../components/CustomModal/CustomModal.jsx";
import DeleteModal from "../components/DeleteModal/DeleteModal";
import {} from "reactstrap";  // Import DeleteModal

const CreatePoll = () => {
    const [pollOption, setPollOption] = useState([]);
    const [poll, setPoll] = useState(null);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(false);
    const [pollId, setPollId] = useState(null);
    const [posts, setPosts] = useState([]);
    const [selectedTopicId, setSelectedTopicId] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [isDetailHidden, setIsDetailHidden] = useState(false);
    const [meeting , setMeeting] = useState(null);
    const [error, setError] = useState(null);
    const [enableDisplay, setEnableDisplay] = useState(false);

    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);  // State for delete modal
    const [topicToDelete, setTopicToDelete] = useState(null);  // Track topic to delete

    const { id } = useParams();

    const fetchTopics = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/topic-idea', {
                headers: { Authorization: `Bearer ${getAccessToken()}` },
                params: { status: 'approved' }
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
                console.log(id);
                const response = await axios.get(`/poll/${id}`, {
                    headers: { Authorization: `Bearer ${getAccessToken()}` }
                });
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
        const fetchMeetingData = async () => {
            try {
                const response = await axios.get(`/opentalk-meeting/${id}`);
                setMeeting(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching meeting details');
                setLoading(false);
            }
        };

        if (id) {
            fetchMeetingData();
        }
    }, []);

    useEffect(() => {
        if(!meeting) return;
        if (meeting.status === 'WAITING_TOPIC') {
            setEnableDisplay(true);
        } else {
            setEnableDisplay(false);
        }
        console.log(enableDisplay);
    }, [meeting]);

    const fetchTopicPolls = async () => {
        try {
            const response = await axios.get(`/topic-poll/${pollId}`, {
                headers: { Authorization: `Bearer ${getAccessToken()}` }
            });
            setPollOption(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!pollId) return;

        fetchTopicPolls();
    }, [pollId]);

    const handleViewDetail = (id) => {
        setSelectedTopicId(id);
        setShowDetailModal(true);
    };

    const handleSubmit = () => {
        const fetchMeeting = async () => {
            try {
                const response = await axios.put(`/opentalk-meeting/status/${id}`);
                console.log(enableDisplay);
                setMeeting(response.data);
                setLoading(false);
            } catch (err) {
                setError('Error fetching meeting details');
                setLoading(false);
            }
        };
        fetchMeeting()
    };

    // Handle delete action
    const handleDelete = (id) => {
        setTopicToDelete(id);  // Set the topic to delete
        setDeleteModalOpen(true);  // Open delete modal
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/topic-poll/${topicToDelete}`, {
                headers: { Authorization: `Bearer ${getAccessToken()}` }
            });
            setPollOption((prevOptions) => prevOptions.filter((option) => option.id !== topicToDelete));
            setDeleteModalOpen(false);  // Close the delete modal
        } catch (err) {
            console.error(err);
            setError('Error deleting topic');
            setDeleteModalOpen(false);
        }
    };

    const cancelDelete = () => {
        setDeleteModalOpen(false);  // Close the delete modal
        setTopicToDelete(null);  // Reset the topic to delete
    };

    const handleCloseModal = () => {
        setShowDetailModal(false);
        setSelectedTopicId(null);
        fetchTopics();
        fetchTopicPolls();
    };

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
                            <h2 className="poll-question-text">{`Voting discussion for `}</h2>
                        </div>

                        <div className="poll-options">
                            {pollOption.map((option) => (
                                <div key={option.id} className="poll-option">
                                    <div className="poll-option-content">
                                        <div className="poll-option-header">
                                            <div className="poll-option-label">
                                                <span className="poll-option-name">{option.topic.title}</span>
                                            </div>
                                            {enableDisplay && (<div className="poll-option-actions">
                                                <button
                                                    className="poll-option-delete"
                                                    onClick={() => handleDelete(option.id)} // Trigger delete modal
                                                >
                                                    Delete
                                                </button>
                                            </div>)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {enableDisplay && (
                            <div className="poll-submit">
                                <button
                                    className="poll-submit-button"
                                    onClick={() => handleSubmit()}
                                >
                                    Submit
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {enableDisplay && (
            <div className="poll-history">
                {posts.length === 0 ? (
                    <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "18px", color: "#666" }}>
                        No topics found.
                    </div>
                ) : (
                    <div className="category-list">
                        {posts.map((post) => (
                            <TopicProposal
                                key={post.id}
                                id={post.id}
                                title={post.title}
                                description={post.description}
                                authorName={post.suggestedBy.fullName}
                                date={post.createdAt}
                                avatarUrl="https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg"
                                status={post.status}
                                onClickDetail={handleViewDetail}
                                meetingid={id}
                            />
                        ))}
                    </div>
                )}
            </div>
            )}
            <CustomModal isOpen={showDetailModal && !isDetailHidden} onClose={handleCloseModal}>
                {selectedTopicId && (
                    <ProposalDetail
                        id={selectedTopicId}
                        onClose={handleCloseModal}
                        onOpenRejectModal={() => {
                            setIsDetailHidden(true);
                        }}
                        pollId={pollId}
                        meetingId={id}
                        needAdd={true}
                    />
                )}
            </CustomModal>

            {/* Delete Modal */}
            <DeleteModal
                isOpen={isDeleteModalOpen}
                title="Delete Topic"
                message="Are you sure you want to delete this topic from the poll?"
                onCancel={cancelDelete}
                onConfirm={confirmDelete}
            />
        </div>
    );
};

export default CreatePoll;
