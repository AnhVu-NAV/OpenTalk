import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/opentalkHostRequest/Header";
import Table from "../components/opentalkHostRequest/Table";
import OpenTalkPagination from "../components/opentalkManager/Pagination";
import RequestsModal from "../components/opentalkHostRequest/HostRequestModal";

// Dữ liệu giả lập (có thể fetch từ API thực tế)
const DUMMY_MEETINGS = [
  {
    id: 1,
    meetingTitle: "OpenTalk Kick-off",
    topic: "Introduction to OpenTalk",
    host: "Pristia Candra",
    companyBranch: "Unpixel Office",
    scheduledDate: "2023-08-20T09:00:00",
    meetingUrl: "https://meet.example.com/opentalk-kickoff",
    status: "Scheduled",
    attendanceCode: "OTK123",
    requestCount: 2,
    requests: ["Alice", "Bob"]
  },
  {
    id: 2,
    meetingTitle: "Design Weekly",
    topic: "Weekly Design Sync",
    host: "Hanna Baptista",
    companyBranch: "Hanoi Branch",
    scheduledDate: "2023-08-23T14:30:00",
    meetingUrl: "https://meet.example.com/design-weekly",
    status: "Ongoing",
    attendanceCode: "DWN789",
    requestCount: 0,
    requests: []
  },
  {
    id: 3,
    meetingTitle: "Sprint Review",
    topic: "Review Sprint Progress",
    host: "Alex Nguyen",
    companyBranch: "Saigon Hub",
    scheduledDate: "2023-08-25T16:00:00",
    meetingUrl: "https://meet.example.com/sprint-review",
    status: "Finished",
    attendanceCode: "SRV456",
    requestCount: 1,
    requests: ["Charlie"]
  }
];


function OpenTalkHostRequestPage() {
  const [meetings] = useState(DUMMY_MEETINGS);
  const [page, setPage] = useState(1);
  const [totalPages] = useState(1);

  // State cho modal requests
  const [showReqModal, setShowReqModal] = useState(false);
  const [currentRequests, setCurrentRequests] = useState([]);
  const [currentTitle, setCurrentTitle] = useState("");

  // Khi click nút badge
  const handleRequestClick = (meeting) => {
    setCurrentRequests(meeting.requests);
    setCurrentTitle(meeting.meetingTitle);
    setShowReqModal(true);
  };

  return (
    <div
      className="bg-white rounded-4 shadow-sm p-4"
      style={{ width: "100%", marginTop: 20, border: "1px solid #ececec" }}
    >
      <div className="container-fluid px-4 py-4">
        <Header />
        <Table
          meetings={meetings}
          onRequestClick={handleRequestClick}
        />
        <div className="d-flex justify-content-start mt-3">
          <OpenTalkPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>

        {/* add the onHide prop so the modal can close */}
        <RequestsModal
          show={showReqModal}
          onHide={() => setShowReqModal(false)}
          meetingTitle={currentTitle}
          requests={currentRequests}
        />
      </div>
    </div>
  );
}

export default OpenTalkHostRequestPage;
