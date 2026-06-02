import axiosClient from './axiosClient';

export const createDepartment = (departmentData) => axiosClient.post('/departments', departmentData);
export const getDepartments = () => axiosClient.get('/departments');
export const updateDepartment = (code, data) => axiosClient.put(`/departments/${code}`, data);
export const deleteDepartment = (code) => axiosClient.delete(`/departments/${code}`);
