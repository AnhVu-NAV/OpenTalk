import axiosClient from './axiosClient';

export const getRecentMeetingsWithStatus = async (userId, companyBranchId) => {
  const res = await axiosClient.get("/opentalk-meeting/recent-with-status", {
    params: { userId, companyBranchId },
  });
  return res.data;
};

export const submitCheckin = async (userId, checkinCode) => {
    const response = await axiosClient.post("/attendance/checkin", {
      userId,
      checkinCode,
    });
    return response.data;
  };