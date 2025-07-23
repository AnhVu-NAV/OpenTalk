import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layouts/MainLayout";
import AuthGuard from "./components/common/AuthGuard";

// Auth
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";

// Dashboard & Overview
import DashBoard from "./pages/DashBoard";
function Overview() {
    return <h2>Overview Page</h2>;
}

// Meetings
import MeetingListPage from "./pages/MeetingListPage";
import MeetingDetailPage from "./pages/MeetingDetailPage";
import PollApp from "./pages/PollMeeting";
import CreatePoll from "./pages/CreatePoll";
import OpenTalkManagerPage from "./pages/OpenTalkManager";
import OpenTalkHostRequestPage from "./pages/OpenTalkHostRequest";

// Attendance
import AttendanceAdminPage from "./pages/AttendanceAdminPage";
import UserAttendanceTab from "./pages/UserAttendanceTab";

// Employee
import EmployeePage from "./pages/EmployeePage";
import AddEmployeeNew from "./pages/AddEmployeePage";
import EditEmployeePage from "./pages/EditEmployeePage";

// Suggest / Topics
import SuggestTopic from "./pages/SuggestTopic";
import ProposalDetail from "./components/proposalTopic/ProposalDetail";
import TopicProposalCategory from "./pages/TopicProposalCategory";

// Host Frequency Report & Org
import HostFrequencyReport from "./pages/HostFrequencyReport";
import OrganizationListPage from "./pages/OrganizationListPage";

// Others
import SalaryPage from "./pages/SalaryPage";
import UserProfilePage from "./pages/UserProfilePage";
import TestPage from "./pages/test";
import AttendancePage from "./pages/AttendancePage.jsx";
import TopicHub from "./pages/TopicHub.jsx";

// Optional Pages
function Message() { return <h2>Message Page</h2>; }
function Project() { return <OpenTalkManagerPage />; }
function Ticket() { return <OpenTalkHostRequestPage />; }
function Notice() { return <SuggestTopic />; }
function Account() { return <UserProfilePage />; }
function Setting() { return <h2>Settings Page</h2>; }

function App() {
    return (
        <Router>
            <Routes>
                {/* Public */}
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />

                {/* Protected */}
                <Route element={<AuthGuard />}>
                    <Route element={<Layout />}>
                        {/* Overview / Dashboard */}
                        <Route path="/" element={<Overview />} />
                        <Route path="/dashboard" element={<DashBoard />} />

                        {/* Meeting routes */}
                        <Route path="/meeting" element={<MeetingListPage />} />
                        <Route path="/meeting/detail/:id" element={<MeetingDetailPage />} />
                        <Route path="/poll-meeting" element={<TopicHub />} />
                        {/*<Route path="/poll/create" element={<CreatePoll />} />*/}
                        <Route path="/opentalk/manager" element={<OpenTalkManagerPage />} />
                        <Route path="/opentalk/request" element={<OpenTalkHostRequestPage />} />

                        {/* Attendance */}
                        <Route path="/attendance" element={<AttendancePage />} />
                        <Route path="/attendance/admin" element={<AttendanceAdminPage />} />
                        <Route path="/attendance/user/:id" element={<UserAttendanceTab />} />

                        {/* Employee */}
                        <Route path="/employee" element={<EmployeePage />} />
                        <Route path="/employee/add" element={<AddEmployeeNew />} />
                        <Route path="/employee/edit/:id" element={<EditEmployeePage />} />


                        {/* Suggest / Topics */}
                        <Route path="/suggest-topic" element={<SuggestTopic />} />
                        <Route path="/topicProposal" element={<TopicProposalCategory />} />
                        <Route path="/topic/:id" element={<ProposalDetail />} />
                        <Route path="/topic-proposal-category" element={<TopicProposalCategory />} />
                        <Route path="/meeting" element={<MeetingListPage />} />
                        <Route path="/project/meeting-details/:id" element={<MeetingDetailPage />} />
                        {/* Reports & Org */}
                        <Route path="/hostfrequencyreport" element={<HostFrequencyReport />} />
                        <Route path="/organization" element={<OrganizationListPage />} />

                        {/* Others */}
                        <Route path="/message" element={<Message />} />
                        <Route path="/project" element={<Project />} />
                        <Route path="/ticket" element={<Ticket />} />
                        <Route path="/notice" element={<Notice />} />
                        <Route path="/account" element={<Account />} />
                        <Route path="/settings" element={<Setting />} />
                        <Route path="/salary" element={<SalaryPage />} />
                        <Route path="/test" element={<TestPage />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
