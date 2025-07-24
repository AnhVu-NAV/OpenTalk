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
export const getListCronjob = async () => {
  const res = await axiosClient.get(`/cron/all`);
  return res.data;
};

export const saveCronjob = async ({ cronjobKey, cronjobValue }) => {
  const params = new URLSearchParams({
    key: cronjobKey,
    expression: cronjobValue,
  }).toString();

  const res = await axiosClient.put(`/cron/update?${params}`);
  return res.data;
};


// API Material
export const uploadMaterial = async (file, userId, meetingId) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('userId', userId);
  formData.append('meetingId', meetingId);

  const response = await axiosClient.post('/files/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const getMaterials = async (meetingId) => {
  const response = await axiosClient.get(`/materials`, {
    params: { meetingId },
  });
  
  return response.data;
};

export const deleteMaterial = async (materialId) => {
  const response = await axiosClient.delete(`/materials/${materialId}`);
  
  return response.data;
};