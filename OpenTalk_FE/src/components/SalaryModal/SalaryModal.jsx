import React from 'react';
import './SalaryModal.css';

const getStatusBadge = (status) => {
    switch (status) {
        case "PENDING": return "badge-pending";
        case "APPROVED": return "badge-approved";
        case "REJECTED": return "badge-rejected";
        default: return "badge-default";
    }
};

const SalaryDetailModal = ({ salary, onClose, onStatusChange, onUpdateStatus }) => {
    if (!salary) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h3>Salary Details</h3>
                <ul>
                    <li><strong>Name:</strong> {salary.recipientName}</li>
                    <li><strong>Email:</strong> {salary.recipientEmail}</li>
                    <li><strong>Period:</strong> {salary.periodStart} → {salary.periodEnd}</li>
                    <li><strong>Host Sessions:</strong> {salary.totalHostSessions}</li>
                    <li><strong>Attendance:</strong> {salary.totalAttendanceSessions}</li>
                    <li><strong>Base Salary:</strong> ${salary.baseSalary}</li>
                    <li><strong>Bonus:</strong> ${salary.bonus}</li>
                    <li><strong>Total:</strong> ${salary.totalSalary}</li>
                    <li><strong>Formula:</strong> {salary.formulaUsed}</li>
                    <li>
                        <strong>Status:</strong>{" "}
                        <span className={`status-badge ${getStatusBadge(salary.status)}`}>
              {salary.status}
            </span>
                    </li>
                    <li>
                        <strong>Update Status:</strong>{" "}
                        <select value={salary.status} onChange={onStatusChange}>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </li>
                </ul>
                <div className="modal-footer">
                    <button onClick={onClose}>Close</button>
                    <button onClick={onUpdateStatus}>Update</button>
                </div>
            </div>
        </div>
    );
};

export default SalaryDetailModal;
