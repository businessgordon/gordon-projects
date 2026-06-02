import api from './api';

// Cars
export const getCars = (search = '', page = 1, limit = 10) =>
  api.get('/cars', { params: { search, page, limit } });

export const getCar = (plateNumber) =>
  api.get(`/cars/${plateNumber}`);

export const createCar = (data) =>
  api.post('/cars', data);

export const updateCar = (plateNumber, data) =>
  api.put(`/cars/${plateNumber}`, data);

export const deleteCar = (plateNumber) =>
  api.delete(`/cars/${plateNumber}`);

// Packages
export const getPackages = (search = '') =>
  api.get('/packages', { params: { search } });

export const getPackage = (packageNumber) =>
  api.get(`/packages/${packageNumber}`);

export const createPackage = (data) =>
  api.post('/packages', data);

export const updatePackage = (packageNumber, data) =>
  api.put(`/packages/${packageNumber}`, data);

export const deletePackage = (packageNumber) =>
  api.delete(`/packages/${packageNumber}`);

// Services
export const getServices = (search = '', page = 1, limit = 10) =>
  api.get('/services', { params: { search, page, limit } });

export const getService = (recordNumber) =>
  api.get(`/services/${recordNumber}`);

export const createService = (data) =>
  api.post('/services', data);

export const updateService = (recordNumber, data) =>
  api.put(`/services/${recordNumber}`, data);

export const deleteService = (recordNumber) =>
  api.delete(`/services/${recordNumber}`);

// Payments
export const getPayments = (search = '', page = 1, limit = 10, startDate, endDate) =>
  api.get('/payments', { params: { search, page, limit, startDate, endDate } });

export const getPayment = (paymentNumber) =>
  api.get(`/payments/${paymentNumber}`);

export const createPayment = (data) =>
  api.post('/payments', data);

export const updatePayment = (paymentNumber, data) =>
  api.put(`/payments/${paymentNumber}`, data);

// Reports
export const getDailyReport = () =>
  api.get('/reports/daily');

export const getSummaryReport = (period = 'monthly') =>
  api.get('/reports/summary', { params: { period } });

export const getStats = () =>
  api.get('/reports/stats');
