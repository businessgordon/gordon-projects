import axiosClient from './axiosClient';

export const createEmployee = (employeeData) => axiosClient.post('/employees', employeeData);
export const getEmployees = () => axiosClient.get('/employees');
export const updateEmployee = (employeeNumber, employeeData) => axiosClient.put(`/employees/${employeeNumber}`, employeeData);
export const deleteEmployee = (employeeNumber) => axiosClient.delete(`/employees/${employeeNumber}`);
