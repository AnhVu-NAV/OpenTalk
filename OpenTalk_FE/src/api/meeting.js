import axiosClient from './axiosClient';

const API_BASE = '/opentalk-meeting';

export const getMeetingDetails = (meetingName, branchId) =>
  axiosClient.get(`${API_BASE}/details`, { params: { meetingName, branchId } }).then(res => res.data);

export const getMeetingDetailsForHost = (meetingName, branchId, username) => axiosClient.get(`${API_BASE}/details-for-host`, { params: { meetingName, branchId, username } }).then(res => res.data);

export const registerHost = (hostRegister) => axiosClient.post(`${API_BASE}/employee/register`, hostRegister).then(res => res.data);
