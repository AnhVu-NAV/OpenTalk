import StatusBadge from './StatusBadge';
import { FiEye, FiMoreVertical, FiEdit2, FiTrash2 } from "react-icons/fi";
import { useState, useRef, useEffect } from "react";

function OpenTalkRow({ meeting, onView, onEdit, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Đóng menu khi click ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Định dạng ngày nếu cần
  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleString("en-GB", { hour12: false }); // "dd/mm/yyyy, hh:mm:ss"
    } catch {
      return dateStr;
    }
  };

  return (
    <tr>
      <td>{meeting.id}</td>
      <td>{meeting.meetingTitle}</td>
      <td>{meeting.topic}</td>
      <td>{meeting.host}</td>
      <td>{meeting.companyBranch}</td>
      <td>{formatDate(meeting.scheduledDate)}</td>
      <td>
        {meeting.meetingUrl ? (
          <a href={meeting.meetingUrl} target="_blank" rel="noopener noreferrer" style={{color: "#18926e", fontWeight: 500}}>
            Link
          </a>
        ) : "-"}
      </td>
      <td>
        <StatusBadge status={meeting.status} />
      </td>
      <td>{meeting.attendanceCode}</td>
      <td>
        <div className="d-flex align-items-center gap-2 position-relative">
          <button
            className="icon-btn"
            title="View"
            onClick={() => onView(meeting)}
          >
            <FiEye size={18} />
          </button>
          <button
            className="icon-btn"
            title="More"
            onClick={() => setShowMenu(v => !v)}
          >
            <FiMoreVertical size={18} />
          </button>

          {/* Dropdown menu */}
          {showMenu && (
            <div className="action-menu" ref={menuRef}>
              <button className="menu-item" onClick={() => { setShowMenu(false); onEdit && onEdit(meeting); }}>
                <FiEdit2 className="me-2" /> Edit
              </button>
              <button className="menu-item text-danger" onClick={() => { setShowMenu(false); onDelete && onDelete(meeting); }}>
                <FiTrash2 className="me-2" /> Delete
              </button>
            </div>
          )}
        </div>
      </td>
      <style>{`
          .icon-btn {
            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 5px;
            transition: background 0.1s, border 0.1s;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }
          .icon-btn:hover {
            background: #f3f6fa;
            border: 1.5px solid #a3a3a3;
          }
          .action-menu {
            position: absolute;
            right: 0;
            top: 36px;
            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.08);
            min-width: 120px;
            z-index: 10;
            padding: 4px 0;
          }
          .menu-item {
            background: none;
            border: none;
            width: 100%;
            padding: 10px 16px;
            text-align: left;
            font-size: 15px;
            color: #222;
            display: flex;
            align-items: center;
            gap: 8px;
            cursor: pointer;
            transition: background 0.15s;
          }
          .menu-item:hover {
            background: #f3f6fa;
          }
          .menu-item.text-danger {
            color: #e53935;
          }
        `}</style>
    </tr>
  );
}

export default OpenTalkRow;
