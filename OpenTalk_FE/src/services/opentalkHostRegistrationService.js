import axiosClient from '../api/axiosClient.jsx';
import { getAccessToken } from '../helper/auth.jsx';

export const getMeetingRequestCounts = (meetingIds) => {
    const token = getAccessToken();
    return axiosClient.post("/hosts/request-counts", meetingIds, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const getHostRegistrationsByMeetingId = (openTalkMeetingId) => {
    const token = getAccessToken();
    return axiosClient.get(`/hosts/register/${openTalkMeetingId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
    });
};

export const approveHostRegistration = (registrationId) => {
    const token = getAccessToken();
    return axiosClient.post(`/hosts/approve/${registrationId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};

export const rejectHostRegistration = (registrationId) => {
    const token = getAccessToken();
    return axiosClient.post(`/hosts/reject/${registrationId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};


