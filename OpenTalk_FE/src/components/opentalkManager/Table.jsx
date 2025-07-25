import Row from "./Row"
import styles from "./Table.module.css"

function Table({ meetings, onView, onEdit, onDelete }) {
    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                <tr>
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
        </div>
    )
}

export default Table
