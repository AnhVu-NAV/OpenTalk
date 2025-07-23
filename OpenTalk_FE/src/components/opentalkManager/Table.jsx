import Row from './Row';

function Table({ meetings, onView, onEdit, onDelete }) {
  return (
    <div id="table-meeting-wrapper">
      <table className="table align-middle mb-0 custom-table">
        <thead>
          <tr className="table-header-light">
            <th>ID</th>
            <th>Meeting Title</th>
            <th>Topic</th>
            <th>Host</th>
            <th>Company Branch</th>
            <th>Scheduled Date</th>
            <th>Meeting URL</th>
            <th>Status</th>
            <th>Duration</th>
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
              isLast={idx === meetings.length - 1}
            />
          ))}
        </tbody>
      </table>
      <style>{`
        #table-meeting-wrapper .custom-table thead .table-header-light th {
          background: #f7f8fa !important;
          color: #a6948a !important;
          font-weight: 600 !important;
          font-size: 15px !important;
          border-bottom: none !important;
          letter-spacing: 0.01em;
        }

        #table-meeting-wrapper .custom-table th,
        #table-meeting-wrapper .custom-table td {
          border: none !important;
          padding-top: 18px !important;
          padding-bottom: 18px !important;
        }

        #table-meeting-wrapper .custom-table tbody tr {
          background: #fff !important;
          border-bottom: 1px solid #ececec !important;
        }

        #table-meeting-wrapper .custom-table tbody tr:last-child {
          border-bottom: none !important;
        }
      `}</style>
    </div>
  );
}
export default Table;
