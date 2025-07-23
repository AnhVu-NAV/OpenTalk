import React, { useEffect, useState } from "react";
import axios from "../api/axiosClient.jsx";
import {getCurrentUser} from "../helper/auth.jsx";

const UserAttendanceTab = ({ userId }) => {
    const [records, setRecords] = useState([]);
    const [user, setUser] = useState(null)

    useEffect(() => {
        const current = getCurrentUser()
        console.log("Loaded user:", current)
        setUser(current)
    }, [])

    useEffect(() => {
        const current = getCurrentUser()
        axios
            .get(`/attendances/user/${current.id}`)
            .then((res) => setRecords(res.data))
            .catch((err) => console.error("Attendance fetch error", err));
    }, [userId]);

    return (
        <table className="table table-hover">
            <thead>
            <tr>
                <th>Date</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Break</th>
                <th>Working Hours</th>
                <th>Status</th>
            </tr>
            </thead>
            <tbody>
            {records.map((r, i) => (
                <tr key={i}>
                    <td>{r.date}</td>
                    <td>{r.checkIn}</td>
                    <td>{r.checkOut}</td>
                    <td>{r.breakDuration} Min</td>
                    <td>{r.workingHours} Hrs</td>
                    <td>
              <span className={`badge ${r.status === "Late" ? "bg-danger" : "bg-success"}`}>
                {r.status}
              </span>
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default UserAttendanceTab;
