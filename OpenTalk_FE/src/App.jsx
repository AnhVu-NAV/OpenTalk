import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layouts/MainLayout";
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";
import DashBoard from "./pages/DashBoard.jsx";
import AuthGuard from "./components/common/AuthGuard";
import MeetingList from "./pages/test.jsx";
import OpenTalkManagerPage from "./pages/OpenTalkManager";
import OpenTalkHostRequestPage from "./pages/OpenTalkHostRequest";
import AddMeeting from "./components/opentalkManager/AddNewMeeting.jsx";
import MeetingDetail from "./components/opentalkManager/MeetingDetail.jsx";
import EditMeeting from "./components/opentalkManager/EditMeeting.jsx";
import CustomTextEditor from "./components/textEdit/RichTextEditor.jsx";
import TiptapEditor from "./components/textEdit/TiptapEditor.jsx";
import NoticeCard from "./components/noticeCard/NoticeCard.jsx";
import EmployeePage from "./pages/EmployeePage.jsx";
import EditEmployeePage from "./pages/EditEmployeePage.jsx";
import AddEmployeeNew from "./pages/AddEmployeePage.jsx";
import HostFrequencyReport from "./pages/HostFrequencyReport.jsx";
import ProposalDetail from "./components/proposalTopic/ProposalDetail.jsx";
import OrganizationListPage from "./pages/OrganizationListPage.jsx";
import MeetingDetailPage from "./pages/MeetingDetailPage.jsx";
import MeetingListPage from "./pages/MeetingListPage.jsx";
import PollApp from "./pages/PollMeeting.jsx";
import CreatePoll from "./pages/CreatePoll.jsx";
import TopicProposalCategory from "./pages/TopicProposalCategory.jsx";
import SuggestTopic from "./pages/SuggestTopic.jsx";
import AttendancePage from "./pages/AttendancePage.jsx";
import TopicHub from "./pages/TopicHub.jsx";

// Tạo các component placeholder tương ứng từng route
function Overview() {
    return <h2>Overview Page</h2>;
}
function Meeting() {
    return <MeetingListPage />;
}

function Message() {
    return <h2>Message Page</h2>;
}

function Project() {
    return <OpenTalkManagerPage />;
}

function Ticket() {
    return <OpenTalkHostRequestPage />;
}

function Employee() {
    return <EmployeePage />;
}

function Attendance() {
    return <AttendancePage />;
}

function Notice() {

    return <SuggestTopic />;
}

function HostFrequency() {
    return <HostFrequencyReport />;
}

function Organization() {
    return <h2>Organization Page</h2>;
}

function Account() {
    return <h2>Account Page</h2>;
}

function Setting() {
    return <h2>Setting Page</h2>;
}

function Test() {
    const handleEdit = () => alert("Edit clicked!");
    const handleDelete = () => alert("Deleted!");
    return (
        <div style={{ padding: "40px" }}>
            <NoticeCard
                title="Notice Title"
                author="Name"
                date="29/8/2023"
                content="Lorem Ipsum is simply dummy text of the printing and typesetting industry..."
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
}


function App() {
    return (
        <Router>
            <Routes>
                {/* public */}
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />

                {/* protected */}
                <Route element={<AuthGuard />}>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Overview />} />
                        <Route path="/setting" element={<Setting />} />
                        <Route path="/dashboard" element={<DashBoard />} />
                        <Route path="/meeting" element={<Meeting />} />
                        <Route path="/meeting/:id" element={<MeetingDetailPage />} />
                        <Route path="/message" element={<Message />} />
                        <Route path="/project" element={<Project />} />
                        <Route path="/ticket" element={<Ticket />} />
                        <Route path="/topicProposal" element={<TopicProposalCategory />} />
                        <Route path="/employee" element={<Employee />} />
                        <Route path="/employee/add" element={<AddEmployeeNew />} />
                        <Route path="/employee/edit/:id" element={<EditEmployeePage />} />
                        <Route path="/attendance" element={<Attendance />} />
                        <Route path="/notice" element={<Notice />} />
                        <Route path="/hostfrequencyreport" element={<HostFrequency />} />
                        <Route path="/organization" element={<OrganizationListPage />} />
                        <Route path="/suggestTopic" element={<SuggestTopic />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/topic/:id" element={<ProposalDetail />} />
                        <Route path="/test" element={<TopicHub />} />
                        <Route path="/createPoll" element={<CreatePoll />} />
                        <Route path="/project/new-meeting" element={<AddMeeting />} />
                        <Route path="/project/meeting-details/:id" element={<MeetingDetail />} />
                        <Route path="/project/edit-meeting/:id" element={<EditMeeting />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );

}

export default App