import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MeetingCard from '../components/meetingCard/meetingCard/MeetingCard';
import { FaSearch, FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import { getCompanyBranches } from '../api/companyBranch';
import { OpenTalkMeetingStatus } from '../constants/enums/openTalkMeetingStatus';
import meetingMockData from '../api/__mocks__/data/meetingMockData';
import './styles/HostMeetingListPage.css';
import { getCurrentUser } from '../helper/auth';
import { User } from 'lucide-react';
import { getMeetingDetailsForHost } from '../api/meeting';

const mockBranches = [
    { id: 1, name: 'Branch A' },
    { id: 2, name: 'Branch B' },
    { id: 3, name: 'Branch C' },
    { id: 4, name: 'Branch D' },
];

const HostMeetingListPage = () => {
    const navigate = useNavigate();
    const [meetings, setMeetings] = useState([]);
    const [branches, setBranches] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [branchFilter, setBranchFilter] = useState('');
    const [activeTab, setActiveTab] = useState(OpenTalkMeetingStatus.COMPLETED);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const tabs = [
        { id: OpenTalkMeetingStatus.COMPLETED, label: 'History' },
        { id: OpenTalkMeetingStatus.UPCOMING, label: 'Upcoming' },
        { id: OpenTalkMeetingStatus.ONGOING, label: 'Ongoing' },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getMeetingDetailsForHost(searchTerm, branchFilter, getCurrentUser()?.username);
                console.log('Fetched host meetings:', data);
                setMeetings(Array.isArray(data) ? data : meetingMockData);
            } catch (e) {
                console.error(e);
                setMeetings(meetingMockData);
            }

            try {
                const branchData = await getCompanyBranches();
                setBranches(Array.isArray(branchData) ? branchData : mockBranches);
            } catch (e) {
                console.error(e);
                setBranches(mockBranches);
            }
        };

        fetchData();
    }, [searchTerm, branchFilter]);

    const handleJoin = (link) => {
        if (link) {
            window.open(link, '_blank');
        }
    };

    const filteredMeetings = meetings.filter((m) => {
        switch (activeTab) {
            case OpenTalkMeetingStatus.COMPLETED:
                return m.status === OpenTalkMeetingStatus.COMPLETED;
            case OpenTalkMeetingStatus.UPCOMING:
                return m.status === OpenTalkMeetingStatus.UPCOMING;
            case OpenTalkMeetingStatus.ONGOING:
                return m.status === OpenTalkMeetingStatus.ONGOING;
            default:
                return true;
        }
    });

    const totalPages = Math.ceil(filteredMeetings.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedMeetings = filteredMeetings.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="host-meeting-page">
            <div className="host-meeting-filters">
                <div className="host-meeting-search-container">
                    <FaSearch className="host-meeting-search-icon" />
                    <input
                        type="text"
                        className="host-meeting-search-input"
                        placeholder="Search Meeting"
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                    />
                </div>
                <div className="host-meeting-select-container">
                    <select
                        className="host-meeting-select"
                        value={branchFilter}
                        onChange={(e) => {
                            setBranchFilter(e.target.value);
                            setCurrentPage(1);
                        }}
                    >
                        <option value="">All Branches</option>
                        {branches.map((b) => (
                            <option key={b.id ?? b.name} value={b.id}>
                                {b.name}
                            </option>
                        ))}
                    </select>
                    <FaChevronDown className="host-meeting-select-icon" />
                </div>
            </div>

            <div className="host-meeting-tabs-header">
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => {
                            setActiveTab(t.id);
                            setCurrentPage(1);
                        }}
                        className={`host-meeting-tab-button ${activeTab === t.id ? 'active' : ''}`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            <div className="host-meeting-list-container">
                {paginatedMeetings.map((m) => (
                    <MeetingCard
                        key={m.id}
                        meeting={m}
                        participants={[]}
                        extraCount={0}
                        displayLink={m.status !== OpenTalkMeetingStatus.COMPLETED}
                        showButton={false}
                        actionLabel={''}
                        isDisabledButton={true}
                        onAction={() => {}}
                        onView={() => navigate(`/host-meeting/${m.id}`, { state: { meetingList: meetings, onTab: activeTab } })}
                    />
                ))}
            </div>

            <div className="host-meeting-pagination">
                <div className="host-meeting-pagination-info">
                    Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredMeetings.length)} of {filteredMeetings.length} results
                </div>
                <div className="host-meeting-pagination-buttons">
                    <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="host-meeting-pagination-btn"
                    >
                        <FaChevronLeft />
                    </button>
                    {[...Array(totalPages)].map((_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => setCurrentPage(i + 1)}
                            className={`host-meeting-pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="host-meeting-pagination-btn"
                    >
                        <FaChevronRight />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HostMeetingListPage;