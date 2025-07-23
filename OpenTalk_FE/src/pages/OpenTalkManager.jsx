import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/opentalkManager/Header";
import Table from "../components/opentalkManager/Table";
import OpenTalkPagination from "../components/opentalkManager/Pagination";
import DeleteModal from "../components/deleteModal/DeleteModal";
import {
  getMeetings,
  deleteMeeting,
  getCompanyBranches
} from "../services/opentalkManagerService";
import "./styles/OpenTalkManager.css"

const statuses = [
  "WAITING_TOPIC",
  "WAITING_HOST_REGISTER",
  "WAITING_HOST_SELECTION",
  "UPCOMING",
  "ONGOING",
  "COMPLETED",
  "CANCELLED",
  "POSTPONED"
];

function OpenTalkManagerPage() {
  // Dữ liệu bảng
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Phân trang
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal xóa
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  // Filter INPUT (người dùng nhập)
  const [inputName, setInputName] = useState("");
  const [inputBranch, setInputBranch] = useState("");
  const [inputStatus, setInputStatus] = useState("");
  const [inputDate, setInputDate] = useState("");
  const [inputFromDate, setInputFromDate] = useState("");
  const [inputToDate, setInputToDate] = useState("");

  // Filter THỰC THI (dùng gửi API)
  const [filter, setFilter] = useState({
    name: "",
    branch: "",
    status: "",
    date: "",
    fromDate: "",
    toDate: "",
  });

  // Branches
  const [branches, setBranches] = useState([]);
  const [branchesLoading, setBranchesLoading] = useState(true);

  const navigate = useNavigate();

  // Lấy branch từ API
  useEffect(() => {
    setBranchesLoading(true);
    getCompanyBranches()
      .then(res => setBranches(res.data || []))
      .catch(() => setBranches([]))
      .finally(() => setBranchesLoading(false));
  }, []);

  // Fetch meetings khi page hoặc filter đổi
  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = {
      page: page - 1,
      name: filter.name || undefined,
      companyBranchId: filter.branch || undefined,
      status: filter.status || undefined,
      date: filter.date || undefined,
      fromDate: filter.fromDate || undefined,
      toDate: filter.toDate || undefined,
    };

    Object.keys(params).forEach(
      (key) => params[key] === undefined && delete params[key]
    );

    getMeetings(params)
      .then(res => {
        if (Array.isArray(res.data)) {
          setMeetings(res.data);
          setTotalPages(1);
        } else if (res.data && Array.isArray(res.data.content)) {
          setMeetings(res.data.content);
          setTotalPages(res.data.totalPages || 1);
        } else {
          setMeetings([]);
          setTotalPages(1);
        }
      })
      .catch(() => {
        setMeetings([]);
        setTotalPages(1);
        setError("Không lấy được dữ liệu cuộc họp");
      })
      .finally(() => setLoading(false));
  }, [page, filter]);

  const handleClearFilter = () => {
  setInputName("");
  setInputBranch("");
  setInputStatus("");
  setInputDate("");
  setInputFromDate("");
  setInputToDate("");

  setFilter({
    name: "",
    branch: "",
    status: "",
    date: "",
    fromDate: "",
    toDate: "",
  });
};


  // Xử lý Search (copy input sang filter, reset page về 1)
  const handleSearch = () => {
    setPage(1);
    setFilter({
      name: inputName,
      branch: inputBranch,
      status: inputStatus,
      date: inputDate,
      fromDate: inputFromDate,
      toDate: inputToDate,
    });
  };

  // Xem chi tiết
  const handleViewDetail = (meeting) => {
    navigate(`/meeting/meeting-detail/${meeting.id}`, { state: { meeting } });
  };

  // Xử lý xóa
  const handleDeleteMeeting = (meeting) => {
    setSelectedMeeting(meeting);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMeeting) return;
    try {
      await deleteMeeting(selectedMeeting.id);
      setMeetings((prev) => prev.filter((m) => m.id !== selectedMeeting.id));
      setShowDeleteModal(false);
      setSelectedMeeting(null);
    } catch (err) {
      setShowDeleteModal(false);
      setSelectedMeeting(null);
    }
  };

  // Thêm mới
  const handleGoToAddNew = () => {
    navigate("/meeting/add-meeting");
  };

  return (
    <div
      className="bg-white rounded-4 shadow-sm p-4"
      style={{
        width: "100%",
        marginTop: 20,
        border: "1px solid #ececec"
      }}
    >
      <div className="container-fluid px-4 py-4" style={{ width: "100%", marginTop: 20 }}>
        <Header
          onAddNew={handleGoToAddNew}
          searchName={inputName}
          onChangeName={setInputName}
          selectedBranch={inputBranch}
          onChangeBranch={setInputBranch}
          branches={branches}
          branchesLoading={branchesLoading}
          selectedStatus={inputStatus}
          onChangeStatus={setInputStatus}
          statuses={statuses}
          date={inputDate}
          onChangeDate={setInputDate}
          fromDate={inputFromDate}
          onChangeFromDate={setInputFromDate}
          toDate={inputToDate}
          onChangeToDate={setInputToDate}
          onSearch={handleSearch}
          onClear={handleClearFilter}
        />

        {loading ? (
          <div>Đang tải dữ liệu...</div>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : (
          <Table
            meetings={Array.isArray(meetings) ? meetings : []}
            onView={handleViewDetail}
            onDelete={handleDeleteMeeting}
          />
        )}

        <div className="d-flex justify-content-start mt-3">
          <OpenTalkPagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      </div>
      <DeleteModal
        isOpen={showDeleteModal}
        title="Delete Meeting"
        message={
          selectedMeeting
            ? `Are you sure you want to delete meeting "${selectedMeeting.meetingName}"? This action cannot be undone.`
            : ""
        }
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default OpenTalkManagerPage;
