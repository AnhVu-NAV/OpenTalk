import React from "react";
import "./MeetingCard.css";

const MeetingCard = ({
    meeting,
    participants,
    extraCount,
    actionLabel = 'Join Meeting',
    onAction,
    isDisabledButton = false,
    showButton = true,
    displayLink = true,
    onView,
}) => {
    return (
        <div className="meeting-card" onClick={onView}>
            <div className="meeting-icon">
                <span role="img" aria-label="video">📹</span>
            </div>

            <h3>{meeting.meetingName}</h3>
            <span className="meeting-time">{meeting.scheduledDate}</span>

            {displayLink && <p className="meeting-description">{meeting.meetingLink}</p>}

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
