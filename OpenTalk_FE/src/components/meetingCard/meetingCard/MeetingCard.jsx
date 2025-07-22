import React from "react";
import "./MeetingCard.css";

const MeetingCard = ({
    title,
    time,
    description,
    participants,
    extraCount,
    actionLabel = 'Join Meeting',
    onAction,
    isDisabledButton = false,
    showButton = true,
    onView,
}) => {
    return (
        <div className="meeting-card" onClick={onView}>
            <div className="meeting-icon">
                <span role="img" aria-label="video">📹</span>
            </div>

            <h3>{title}</h3>
            <span className="meeting-time">{time}</span>

            <p className="meeting-description">{description}</p>

            <div className="meeting-participants">
                {participants.slice(0, 3).map((avatar, idx) => (
                    <img key={idx} src={avatar} alt={`user-${idx}`} />
                ))}
                {extraCount > 0 && <div className="extra-count">+{extraCount}</div>}
            </div>

            {showButton && (
                <button
                    disabled={isDisabledButton}
                    className="join-button"
                    onClick={(e) => {
                        e.stopPropagation();
                        if (onAction) onAction();
                    }}
                >
                    {actionLabel}
                </button>
            )}
        </div>
    );
};

export default MeetingCard;
