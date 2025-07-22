import classNames from 'classnames';

function StatusBadge({ status }) {
  const statusClassMap = {
    ACTIVE: 'badge-soft-success',
    'ON BOARDING': 'badge-soft-warning',
    PROBATION: 'badge-soft-info',
    'ON LEAVE': 'badge-soft-danger',
  };

  return (
    <>
      <span
        className={classNames(
          'badge-custom',
          statusClassMap[status] || 'badge-soft-secondary'
        )}
      >
        {status.replace('_', ' ')}
      </span>
      <style>{`
        .badge-custom {
          display: inline-block;
          padding: 4px 18px;
          font-size: 14px;
          font-weight: 600;
          border-radius: 9999px;
          letter-spacing: 0.02em;
          min-width: 80px;
          text-align: center;
          border: none;
          background: #e6f7ec;
          color: #26a75d;
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
      `}</style>
    </>
  );
}

export default StatusBadge;
