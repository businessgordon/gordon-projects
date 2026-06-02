import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  (process.env.NODE_ENV === 'production' ? 'http://localhost:5000/api' : '/api');

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// AUTH
export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const logout = () => API.post('/auth/logout');
export const getMe = () => API.get('/auth/me');

// SERVICES
export const getServices = () => API.get('/services');
export const createService = (data) => API.post('/services', data);
export const updateService = (code, data) => API.put(`/services/${code}`, data);
export const deleteService = (code) => API.delete(`/services/${code}`);

// CARS
export const getCars = () => API.get('/cars');
export const createCar = (data) => API.post('/cars', data);
export const updateCar = (plate, data) => API.put(`/cars/${plate}`, data);
export const deleteCar = (plate) => API.delete(`/cars/${plate}`);

// SERVICE RECORDS
export const getServiceRecords = () => API.get('/servicerecords');
export const getServiceRecord = (id) => API.get(`/servicerecords/${id}`);
export const createServiceRecord = (data) => API.post('/servicerecords', data);
export const updateServiceRecord = (id, data) => API.put(`/servicerecords/${id}`, data);
export const deleteServiceRecord = (id) => API.delete(`/servicerecords/${id}`);
export const getDailyServiceReport = (date) => API.get(`/servicerecords/report/daily?date=${date}`);

// PAYMENTS
export const getPayments = () => API.get('/payments');
export const getPayment = (id) => API.get(`/payments/${id}`);
export const createPayment = (data) => API.post('/payments', data);
export const getDailyPaymentReport = (date) => API.get(`/payments/report/daily?date=${date}`);
