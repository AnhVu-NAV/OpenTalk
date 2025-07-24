import axiosClient from './axiosClient';

const authApi = {
    login: (data) => axiosClient.post('/auth/login', data),
    register: (data) => axiosClient.post('/auth/register', data),
    logout: (token) => axiosClient.post('/auth/logout', {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }),
    refresh: (refreshToken) => axiosClient.post('/auth/refresh', {}, {
        headers: {
            Authorization: `Bearer ${refreshToken}`
        }
    }),
    forgetPassword: (email) => axiosClient.post('/auth/forgot-password', { email }),
    resetPassword: (data) => axiosClient.post('/auth/reset-password', data)
};

export default authApi;