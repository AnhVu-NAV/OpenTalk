import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layouts/MainLayout";
import AuthGuard from "./components/common/AuthGuard";

// Auth
import LoginForm from "./pages/LoginForm";
import RegisterForm from "./pages/RegisterForm";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// Dashboard & Overview
import DashBoard from "./pages/HRDashBoard.jsx";
import HomePage from "./pages/HomePage.jsx";

// Meetings
import MeetingListPage from "./pages/MeetingListPage";
import MeetingDetailPage from "./pages/MeetingDetailPage";
import HostMeetingListPage from "./pages/HostMeetingListPage";
import HostMeetingDetailPage from "./pages/HostMeetingDetailPage";
import CreatePoll from "./pages/CreatePoll";
import OpenTalkManagerPage from "./pages/OpenTalkManager";
import OpenTalkHostRequestPage from "./pages/OpenTalkHostRequest";
import AddNewMeeting from "./components/opentalkManager/AddNewMeeting";
import EditMeeting from "./components/opentalkManager/EditMeeting";
import ViewMeetingDetails from "./components/opentalkManager/MeetingDetail";

// Attendance
import AttendancePage from "./pages/AttendancePage";
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
import UserHomeDashboard from "./pages/UserHomeDashboard.jsx";
import CronjobManagePage from "./pages/CronjobManagePage";
import TopicHub from "./pages/TopicHub.jsx";
import EditProfilePage from "./pages/EditProfilePage.jsx";


function App() {
    return (
        <Router>
            <Routes>
                {/* Public */}
                <Route path="/login" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/forget-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/" element={<HomePage />} />

                {/* Protected */}
                <Route element={<AuthGuard />}>
                    <Route element={<Layout />}>
                        {/* Overview / Dashboard */}                     
                        <Route path="/user/home" element={<UserHomeDashboard />} />
                        <Route path="/admin/dashboard" element={<DashBoard />} />

                        {/* Meeting routes */}
                        <Route path="/meeting" element={<MeetingListPage />} />
                        <Route path="/meeting/:id" element={<MeetingDetailPage />} />
                        <Route path="/host-meeting" element={<HostMeetingListPage />} />
                        <Route path="/host-meeting/:id" element={<HostMeetingDetailPage />} />
                        <Route path="/poll-meeting" element={<TopicHub />} />
                        <Route path="/poll/create/:id" element={<CreatePoll />} />
                        <Route path="/opentalk/manager" element={<OpenTalkManagerPage />} />
                        <Route path="/opentalk/request" element={<OpenTalkHostRequestPage />} />
                        <Route path="/meeting/add-meeting" element={<AddNewMeeting />} />
                        <Route path="/meeting/meeting-detail/:id" element={<ViewMeetingDetails />} />
                        <Route path="/meeting/edit-meeting/:id" element={<EditMeeting />} />


                        {/* Attendance */}
                        <Route path="/attendance" element={<AttendancePage />} />
                        <Route path="/attendance/admin" element={<AttendanceAdminPage />} />
                        <Route path="/attendance/user/:id" element={<UserAttendanceTab />} />

                        {/* Employee */}
                        <Route path="/employee" element={<EmployeePage />} />
                        <Route path="/employee/add" element={<AddEmployeeNew />} />
                        <Route path="/employee/edit/:id" element={<EditEmployeePage />} />
                        {/* <Route path="/employee/export" element={<ExportEmployeePage />} /> */}

                        {/* Suggest / Topics */}
                        <Route path="/suggest-topic" element={<SuggestTopic />} />
                        <Route path="/topicProposal" element={<TopicProposalCategory />} />
                        <Route path="/topic" element={<TopicProposalCategory />} />
                        <Route path="/topic/:id" element={<ProposalDetail />} />
                        <Route path="/topic-proposal-category" element={<TopicProposalCategory />} />

                        {/* Reports & Org */}
                        <Route path="/hostfrequencyreport" element={<HostFrequencyReport />} />
                        <Route path="/organization" element={<OrganizationListPage />} />
                        <Route path="/cronjob" element={<CronjobManagePage />} />

                        {/* Others */}
                        <Route path="/account" element={<UserProfilePage />} />
                        <Route path="/edit-profile" element={<EditProfilePage />} />
                        <Route path="/salary" element={<SalaryPage />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
