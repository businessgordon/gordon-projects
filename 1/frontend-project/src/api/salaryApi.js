import axiosClient from './axiosClient';

export const createSalary = (salaryData) => axiosClient.post('/salaries', salaryData);
export const getSalaries = (month) => axiosClient.get('/salaries', { params: { month } });
export const updateSalary = (id, salaryData) => axiosClient.put(`/salaries/${id}`, salaryData);
export const deleteSalary = (id) => axiosClient.delete(`/salaries/${id}`);
export const getPayrollReport = () => axiosClient.get('/reports');
