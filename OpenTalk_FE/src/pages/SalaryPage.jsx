import React, {useEffect, useState} from "react";
import axios from "/src/api/axiosClient.jsx";
import "./styles/SalaryPage.css";
import {getAccessToken} from "../helper/auth.jsx";
import SuccessToast from "../components/SuccessToast/SuccessToast.jsx";
import SalaryDetailModal from "../components/SalaryModal/SalaryModal.jsx";

const SalaryPage = () => {
    const [salaries, setSalaries] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [loading, setLoading] = useState(false);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");
    const [periodStart, setPeriodStart] = useState("2025-07-01");
    const [periodEnd, setPeriodEnd] = useState("2025-07-31");

    const [selectedSalary, setSelectedSalary] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchSalaries();
    }, [currentPage, itemsPerPage]);

    const fetchSalaries = async () => {
        try {
            const res = await axios.get("/salaries", {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`
                },
                params: {
                    start: periodStart,
                    end: periodEnd,
                    page: currentPage - 1,
                    size: itemsPerPage
                }
            });
            setSalaries(res.data?.content || []);
            setTotalRecords(res.data?.totalElements || 0);
            console.log(res.data?.content);
        } catch (err) {
            console.error("Error fetching salaries", err);
            setSalaries([]);
            setTotalRecords(0);
        }
    };

    const handleCalculate = async () => {
        try {
            setLoading(true);
            await axios.post("/salaries/calculate", {
                recipientIds: [],
                periodStart,
                periodEnd
            }, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`
                }
            });
            await fetchSalaries();
            setToastMessage("Bonus calculated successfully!");
            setToastType("success");
            setToastVisible(true);
        } catch (err) {
            console.error("Error calculating bonus", err);
            setToastMessage("Failed to calculate bonus!");
            setToastType("error");
            setToastVisible(true);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = async (id) => {
        try {
            const res = await axios.get(`/salaries/${id}`, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`
                }
            });
            setSelectedSalary(res.data);
            setShowModal(true);
        } catch (err) {
            console.error("Error loading detail", err);
        }
    };

    const handleUpdateStatus = async () => {
        try {
            await axios.put(`/salaries/${selectedSalary.id}/status`, selectedSalary.status, {
                headers: {
                    Authorization: `Bearer ${getAccessToken()}`,
                    "Content-Type": "application/json"
                }
            });
            setToastMessage("Status updated successfully!");
            setToastType("success");
            setToastVisible(true);
            setShowModal(false);
            await fetchSalaries(); // refresh table
        } catch (err) {
            console.error("Error updating status", err);
            setToastMessage("Failed to update status!");
            setToastType("error");
            setToastVisible(true);
        }
    };

    const filtered = (salaries || []).filter(salary =>
        salary.recipientName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(totalRecords / itemsPerPage);

    return (
        <div className="salary-page-container">
            <div className="page-header">
                <h1>Bonus Payroll</h1>
                <p>Employee Bonus Overview</p>
            </div>

            <div className="salary-controls">
                <input
                    type="text"
                    placeholder="Search"
                    className="salary-search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <input
                    type="date"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                />
                <input
                    type="date"
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                />
                <div style={{display: "flex", gap: "10px"}}>
                    <button className="btn-export">📤 Export</button>
                    <button className="btn-calculate" onClick={handleCalculate} disabled={loading}>
                        {loading ? "Calculating..." : "➕ Calculate Bonus"}
                    </button>
                </div>
            </div>

            <div className="salary-table-wrapper">
                <table className="salary-table">
                    <thead>
                    <tr>
                        <th>Employee Name</th>
                        <th>Host Sessions</th>
                        <th>Attendance</th>
                        <th>Bonus</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filtered.length > 0 ? (
                        filtered.map((salary) => (
                            <tr key={salary.id}>
                                <td>
                                    <div className="employee-info">
                                        <img
                                            src="/placeholder.svg"
                                            alt={salary.recipientName}
                                            className="employee-avatar"
                                        />
                                        <span>{salary.recipientName}</span>
                                    </div>
                                </td>
                                <td>{salary.totalHostSessions}</td>
                                <td>{salary.totalAttendanceSessions}</td>
                                <td>${salary.bonus}</td>
                                <td>
                                    <span className={`status-badge ${salary.status?.toLowerCase()}`}>
                                      {salary.status}
                                    </span>
                                </td>
                                <td>
                                    <button onClick={() => handleViewDetail(salary.id)}>👁 View</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6" style={{textAlign: "center", padding: "1rem", color: "#666"}}>
                                🎯 Chưa có dữ liệu lương. Vui lòng nhấn "Tính thưởng".
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

                {totalRecords > 0 && (
                    <div className="pagination-controls">
                        <div>
                            Showing{" "}
                            <select
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            >
                                <option value={10}>10</option>
                                <option value={25}>25</option>
                                <option value={50}>50</option>
                            </select>
                        </div>

                        <div>
                            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                            {Math.min(currentPage * itemsPerPage, totalRecords)} of {totalRecords} records
                        </div>

                        <div>
                            <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                                    disabled={currentPage === 1}>‹
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    className={currentPage === i + 1 ? "active" : ""}
                                    onClick={() => setCurrentPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                                    disabled={currentPage === totalPages}>›
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <SuccessToast
                message={toastMessage}
                isVisible={toastVisible}
                type={toastType}
                onClose={() => setToastVisible(false)}
            />
            {showModal && (
                <SalaryDetailModal
                    salary={selectedSalary}
                    onClose={() => setShowModal(false)}
                    onStatusChange={(e) =>
                        setSelectedSalary({...selectedSalary, status: e.target.value})
                    }
                    onUpdateStatus={async () => {
                        await handleUpdateStatus();   // gọi cập nhật
                        setShowModal(false);          // đóng modal sau khi xong
                    }}
                />
            )}
        </div>
    );
};

export default SalaryPage;
