import { FiInbox } from "react-icons/fi";

function OpenTalkRow({ meeting, onRequestClick, requestCount = 0 }) {
  // Định dạng ngày nếu cần
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("en-GB", { hour12: false });
    } catch {
      return dateStr;
    }
  };

  return (
    <tr>
      <td>{meeting.id}</td>
      <td>{meeting.meetingTitle}</td>
      <td>{meeting.topic}</td>
      <td>{meeting.companyBranch}</td>
      <td>{formatDate(meeting.scheduledDate)}</td>
      <td>
        <div className="d-flex align-items-center gap-2 position-relative">
          {/* Nút request */}
          <button
            className="icon-btn notification-btn"
            title="View Requests"
            onClick={() => onRequestClick(meeting)}
            style={{ position: "relative" }}
          >
            <FiInbox size={24} />
            {requestCount > 0 && (
              <span className="request-badge">{requestCount}</span>
            )}
          </button>
        </div>
        <style>{`
          .icon-btn {
            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 6px 8px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            position: relative;
          }
          .icon-btn:hover {
            background: #e3f2fd;
            border: 1.5px solid #90caf9;
          }
          .request-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #f44336;
            color: #fff;
            font-size: 14px;
            font-weight: bold;
            border-radius: 50%;
            min-width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 2px solid #fff;
            z-index: 1;
            box-shadow: 0 0 3px rgba(0,0,0,0.07);
            pointer-events: none;
          }
        `}</style>
      </td>
    </tr>
  );
}

export default OpenTalkRow;
