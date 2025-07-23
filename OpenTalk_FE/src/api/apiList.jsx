import axiosClient from './axiosClient';


// API Attendance
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


// API Feedback
export const getAllFeedbacksByMeetingId = async (meetingId) => {
  const res = await axiosClient.get(`/feedbacks/${meetingId}`);
  return res.data;
};

export const createFeedback = async (feedbackDTO) => {
  const res = await axiosClient.post("/feedbacks", feedbackDTO);
  return res.data;
};

// API CronJob
export const getListCronjob = async (meetingId) => {
  const res = await axiosClient.get(`/feedbacks/${meetingId}`);
  return res.data;
};

export const saveCronjob = async (feedbackDTO) => {
  const res = await axiosClient.post("/feedbacks", feedbackDTO);
  return res.data;
};

export const getConfig = async (meetingId) => {
  const res = await axiosClient.get(`/feedbacks/${meetingId}`);
  return res.data;
};

export const updateConfig = async (feedbackDTO) => {
  const res = await axiosClient.post("/feedbacks", feedbackDTO);
  return res.data;
};