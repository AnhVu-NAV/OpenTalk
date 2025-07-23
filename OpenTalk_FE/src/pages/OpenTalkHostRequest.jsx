import React, { useState, useEffect, useCallback, useRef } from "react";
import Header from "../components/opentalkHostRequest/Header";
import Table from "../components/opentalkHostRequest/Table";
import OpenTalkPagination from "../components/opentalkManager/Pagination";
import RequestsModal from "../components/opentalkHostRequest/HostRequestModal";
import { getMeetings } from "../services/opentalkManagerService";
import { getMeetingRequestCounts } from "../services/opentalkHostRegistrationService";
import "./styles/OpenTalkHostRequest.css"

function OpenTalkHostRequestPage() {
  const [meetings, setMeetings] = useState([]);
  const [requestCounts, setRequestCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal state
  const [showReqModal, setShowReqModal] = useState(false);
  const [currentMeetingId, setCurrentMeetingId] = useState(null);
  const [currentTitle, setCurrentTitle] = useState("");

  // Reload flag (dùng ref để tránh re-render ko cần thiết)
  const shouldReload = useRef(false);

  // Fetch meetings
  const reloadMeetings = useCallback(() => {
    setLoading(true);
    setError(null);

    getMeetings({ page: page - 1, status: "WAITING_HOST_REGISTER" })
      .then(res => {
        let list = [];
        if (res.data && Array.isArray(res.data.content)) {
          list = res.data.content;
          setMeetings(list);
          setTotalPages(res.data.totalPages || 1);
        } else {
          setMeetings([]);
          setTotalPages(1);
        }
        if (list.length > 0) {
          const ids = list.map(m => m.id);
          getMeetingRequestCounts(ids)
            .then(res2 => setRequestCounts(res2.data || {}))
            .catch(() => setRequestCounts({}));
        } else {
          setRequestCounts({});
        }
      })
      .catch(() => {
        setError("Không lấy được dữ liệu");
        setMeetings([]);
        setTotalPages(1);
        setRequestCounts({});
      })
      .finally(() => setLoading(false));
  }, [page]);

  // Fetch lại mỗi khi page thay đổi
  useEffect(() => {
    reloadMeetings();
  }, [page, reloadMeetings]);

  // Khi modal đóng và cần reload, fetch lại list (dùng ref tránh lặp vô hạn)
  useEffect(() => {
    if (!showReqModal && shouldReload.current) {
      reloadMeetings();
      shouldReload.current = false;
    }
  }, [showReqModal, reloadMeetings]);

  // Mở request modal
  const handleRequestClick = (meeting) => {
    setCurrentMeetingId(meeting.id);
    setCurrentTitle(meeting.meetingTitle || meeting.meetingName || "");
    setShowReqModal(true);
  };

  const handleAfterAction = () => {
  setShowReqModal(false);   // Đóng request modal
  shouldReload.current = true; // Trigger reload ở useEffect
};

  return (
    <div
      className="bg-white rounded-4 shadow-sm p-4"
      style={{ width: "100%", marginTop: 20, border: "1px solid #ececec" }}
    >
      <div className="container-fluid px-4 py-4">
        <Header />
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div style={{ color: "red" }}>{error}</div>
        ) : (
          <Table
            meetings={meetings}
            requestCounts={requestCounts}
            onRequestClick={handleRequestClick}
          />
        )}
        <div className="d-flex justify-content-start mt-3">
          <OpenTalkPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
        <RequestsModal
          show={showReqModal}
          onHide={() => setShowReqModal(false)}
          meetingId={currentMeetingId}
          meetingTitle={currentTitle}
          onAfterAction={handleAfterAction}
        />
      </div>
    </div>
  );
}

export default OpenTalkHostRequestPage;
