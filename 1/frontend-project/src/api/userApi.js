import axiosClient from './axiosClient';

export const loginUser = (credentials) => axiosClient.post('/auth/login', credentials);
export const logoutUser = () => axiosClient.post('/auth/logout');
export const registerUser = (credentials) => axiosClient.post('/auth/register', credentials);
