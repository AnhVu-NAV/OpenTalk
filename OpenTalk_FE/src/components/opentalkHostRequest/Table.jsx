import Row from "./Row"
import styles from "./Table.module.css"

function Table({ meetings, requestCounts = {}, onView, onEdit, onDelete, onRequestClick }) {
  return (
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
          <tr>
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
                  requestCount={requestCounts[meeting.id] || 0}
                  onRequestClick={() => onRequestClick(meeting)}
                  isLast={idx === meetings.length - 1}
              />
          ))}
          </tbody>
        </table>
      </div>
  )
}

export default Table
