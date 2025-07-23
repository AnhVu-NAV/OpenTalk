import React from "react";
import { FaStar } from 'react-icons/fa';
import { OpenTalkMeetingStatus } from '../../../constants/enums/openTalkMeetingStatus';
import "./MeetingCard.css";

const MeetingCard = ({
    meeting,
    participants,
    extraCount,
    actionLabel = 'Join Meeting',
    onAction,
    isDisabledButton = false,
    showButton = true,
    onView,
}) => {
    // Function to format date and time from scheduledDate
    const formatDateTime = (scheduledDate) => {
        if (!scheduledDate) return { date: '', time: '' };
        
        try {
            let dateObj;
            
            // Check if scheduledDate contains time (ISO format or includes 'T')
            if (scheduledDate.includes('T') || scheduledDate.includes(' ')) {
                dateObj = new Date(scheduledDate);
            } else {
                // If only date is provided, add a default time (e.g., 09:00)
                dateObj = new Date(scheduledDate + 'T09:00:00');
            }
            
            // Format date as dd/mm/yyyy
            const date = dateObj.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            
            // Format time as HH:MM
            const time = dateObj.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            });
            
            return { date, time };
        } catch (error) {
            console.error('Error formatting date:', error);
            return { date: scheduledDate, time: '' };
        }
    };
    
    const { date, time } = formatDateTime(meeting.scheduledDate);
    return (
        <div className="meeting-card" onClick={onView}>
            <div className="meeting-card-header">
                <div className="meeting-icon">
                    <span role="img" aria-label="video">📹</span>
                </div>
                
                {meeting.status === OpenTalkMeetingStatus.COMPLETED && meeting.avgRating && (
                    <div className="meeting-rating">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar key={i} className={i < meeting.avgRating ? 'filled' : ''} />
                        ))}
                    </div>
                )}
            </div>

            <div className="meeting-title-section">
                <h3>{meeting.meetingName}</h3>
                <span className={`meeting-status ${meeting.status?.toLowerCase()}`}>
                    {meeting.status}
                </span>
            </div>
            <div className="meeting-datetime">
                <span className="meeting-date">Date: {date}</span>
                <span className="meeting-time">Time: {time}</span>
            </div>

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
