import React from "react";
import Row from "./Row";

function Table({ meetings, onView, onEdit, onDelete, onRequestClick }) {
  return (
    <div>
      <table className="table align-middle mb-0 custom-table">
        <thead>
          <tr className="table-header-light">
            <th>ID</th>
            <th>Meeting Title</th>
            <th>Topic</th>
            <th>Company Branch</th>
            <th>Scheduled Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {meetings.map((meeting, idx) => (
            <Row
              key={meeting.id}
              meeting={meeting}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              requestCount={meeting.requestCount || 0}
              onRequestClick={() => onRequestClick(meeting)}
              isLast={idx === meetings.length - 1}
            />
          ))}
        </tbody>
      </table>

      <style>{`
        .custom-table thead.table-header-light th {
          background: #f7f8fa !important;
          color: #a6948a !important;
          font-weight: 600 !important;
          font-size: 15px !important;
          border-bottom: none !important;
          letter-spacing: 0.01em;
        }
        .custom-table th, .custom-table td {
          border: none !important;
          padding-top: 18px !important;
          padding-bottom: 18px !important;
        }
        .custom-table tbody tr {
          background: #fff !important;
          border-bottom: 1px solid #ececec !important;
        }
        .custom-table tbody tr:last-child {
          border-bottom: none !important;
        }
      `}</style>
    </div>
  );
}

export default Table;
