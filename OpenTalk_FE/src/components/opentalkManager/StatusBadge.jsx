import classNames from 'classnames';

// Định nghĩa mapping cho từng status của MeetingStatus enum
const statusClassMap = {
  WAITING_TOPIC: "badge-soft-secondary",
  WAITING_HOST_REGISTER: "badge-soft-info",
  WAITING_HOST_SELECTION: "badge-soft-warning",
  UPCOMING: "badge-soft-primary",
  ONGOING: "badge-soft-success",
  COMPLETED: "badge-soft-dark",
  CANCELLED: "badge-soft-danger",
  POSTPONED: "badge-soft-warning"
};

function beautifyStatus(status) {
  // Chuyển "WAITING_HOST_REGISTER" thành "Waiting Host Register"
  if (!status) return "";
  return status
    .toLowerCase()
    .split("_")
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function StatusBadge({ status }) {
  return (
    <>
      <span
        className={classNames(
          'badge-custom',
          statusClassMap[status] || 'badge-soft-secondary'
        )}
      >
        {beautifyStatus(status)}
      </span>
      <style>{`
        .badge-custom {
          display: inline-block;
          padding: 4px 18px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 9999px;
          letter-spacing: 0.02em;
          min-width: 110px;
          text-align: center;
          border: none;
        }
        .badge-soft-success {
          background: #e6f7ec !important;
          color: #26a75d !important;
        }
        .badge-soft-warning {
          background: #fff8e0 !important;
          color: #f8bb37 !important;
        }
        .badge-soft-info {
          background: #e9f3fa !important;
          color: #2793e6 !important;
        }
        .badge-soft-danger {
          background: #fdeaea !important;
          color: #f44336 !important;
        }
        .badge-soft-secondary {
          background: #edeef0 !important;
          color: #6c757d !important;
        }
        .badge-soft-primary {
          background: #ecf5fd !important;
          color: #2371c6 !important;
        }
        .badge-soft-dark {
          background: #eeeeee !important;
          color: #222 !important;
        }
      `}</style>
    </>
  );
}

export default StatusBadge;
