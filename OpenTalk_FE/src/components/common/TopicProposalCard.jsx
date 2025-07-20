import React from 'react';
import '/src/css/TopicProposalCard.css';
import {FaBars} from 'react-icons/fa';
import {useNavigate} from "react-router-dom";

const statusStyles = {
    pending: 'status--pending',
    approved: 'status--approved',
    rejected: 'status--rejected',
    discussed: 'status--discussed',
};
const TopicProposalCard = ({id,  title, description, authorName, date, avatarUrl, status  }) => {
    const statusClass = statusStyles[status] || '';
    const statusLabel = status ? status.charAt(0).toUpperCase() + status.slice(1) : '';
    const handleClick = () => {
        // Navigate to the TopicDetail page with the given id
        window.location.href = `/topic/${id}`
    };
    return (
        <div className="proposal-card">
            <div className="proposal-card__content">
                <h3 className="proposal-card__title">{title}</h3>
                <p className="proposal-card__excerpt">{description}</p>
                {status && (
                    <div className={`proposal-card__status ${statusClass}`}>{statusLabel}</div>
                )}
            </div>
            <div className="proposal-card__footer">
                <div className="proposal-card__author">
                    <img
                        className="proposal-card__avatar"
                        src={avatarUrl}
                        alt={authorName}
                    />
                    <div>
                        <div className="proposal-card__name">{authorName}</div>
                        <div className="proposal-card__date">{date}</div>
                    </div>
                </div>
                <button className="proposal-card__bookmark"  onClick={handleClick}>
                    <FaBars className="proposal-card__bookmark-icon" />
                    <span>Detail</span>
                </button>
            </div>
        </div>
    )
};

export default TopicProposalCard;
