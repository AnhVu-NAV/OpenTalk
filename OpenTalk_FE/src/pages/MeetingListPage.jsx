import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MeetingCard from '../components/meetingCard/meetingCard/MeetingCard';
import { FaSearch, FaChevronDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { getMeetingDetails, registerHost } from '../api/meeting';
import { getCompanyBranches } from '../api/companyBranch';
import { OpenTalkMeetingStatus } from '../constants/enums/openTalkMeetingStatus';
import meetingMockData from '../api/__mocks__/data/meetingMockData';
import './styles/MeetingListPage.css';
import { getCurrentUser } from '../helper/auth';
import { User } from 'lucide-react';

const mockBranches = [
  { id: 1, name: 'Branch A' },
  { id: 2, name: 'Branch B' },
  { id: 3, name: 'Branch C' },
  { id: 4, name: 'Branch D' },
];

const MeetingListPage = () => {
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
    { id: OpenTalkMeetingStatus.WAITING_HOST_REGISTER, label: 'Waiting Host To Register' },
    { id: OpenTalkMeetingStatus.UPCOMING, label: 'Upcoming' },
    { id: OpenTalkMeetingStatus.ONGOING, label: 'Ongoing' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getMeetingDetails(searchTerm, branchFilter);
        console.log('Fetched meetings:', data);
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

  const handleRegisterHost = (meetingId) => {
    const currentUserInfo = getCurrentUser();
    if (currentUserInfo) {
      registerHost({
        user: currentUserInfo,
        meeting: {
          id: meetingId
        }
      });
      setMeetings((prevMeetings) => {
        return prevMeetings.map((m) => {
          if (m.id === meetingId) {
            return { ...m, registeredHostUserIds: [...m.registeredHostUserIds, currentUserInfo.id] };
          }
          return m;
        });
      });
    }
  }

  function isAlreadyRegiteredHost(meetingId) {
    return activeTab === OpenTalkMeetingStatus.WAITING_HOST_REGISTER &&
      meetings.some(m => m.id === meetingId && m.registeredHostUserIds?.includes(getCurrentUser()?.id));
  }

  const filteredMeetings = meetings.filter((m) => {
    switch (activeTab) {
      case OpenTalkMeetingStatus.COMPLETED:
        return m.status === OpenTalkMeetingStatus.COMPLETED;
      case OpenTalkMeetingStatus.WAITING_HOST_REGISTER:
        return m.status === OpenTalkMeetingStatus.WAITING_HOST_REGISTER;
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
    <div className="meeting-page">
      <div className="filters">
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search topic"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div className="select-container">
          <select
            className="select"
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
          <FaChevronDown className="select-icon" />
        </div>
      </div>

      <div className="tabs-header">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => {
              setActiveTab(t.id);
              setCurrentPage(1);
            }}
            className={`tab-button ${activeTab === t.id ? 'active' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="meeting-list-container">
        {paginatedMeetings.map((m) => (
          <MeetingCard
            key={m.id}
            title={m.meetingName}
            time={m.scheduledDate}
            meetLink={m.meetingLink}
            participants={[]}
            extraCount={0}
            displayLink={m.status !== OpenTalkMeetingStatus.COMPLETED}
            showButton={
              activeTab === OpenTalkMeetingStatus.WAITING_HOST_REGISTER || activeTab === OpenTalkMeetingStatus.ONGOING
            }
            actionLabel={
              activeTab === OpenTalkMeetingStatus.WAITING_HOST_REGISTER ? 'Register Host' : 'Join Meeting'
            }
            isDisabledButton={isAlreadyRegiteredHost(m.id)}
            onAction={() => {
              if (activeTab === OpenTalkMeetingStatus.ONGOING) {
                handleJoin(m.meetingLink);
              } else if (activeTab === OpenTalkMeetingStatus.WAITING_HOST_REGISTER) {
                handleRegisterHost(m.id);
                alert('Your host request has been sent successfully.');
              }
            }}
            onView={() => navigate(`/meeting/${m.id}`, { state: { meetingList: meetings, onTab: activeTab } })}
          />
        ))}
      </div>

      <div className="pagination">
        <div className="pagination-info">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredMeetings.length)} of {filteredMeetings.length} results
        </div>
        <div className="pagination-buttons">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            <FaChevronLeft />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`pagination-number ${currentPage === i + 1 ? 'active' : ''}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            <FaChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingListPage;
