import api from './api';

export const stockInAPI = {
  getAllStockIn: () =>
    api.get('/stockin'),

  getStockInById: (id) =>
    api.get(`/stockin/${id}`),

  createStockIn: (data) =>
    api.post('/stockin', data)
};
