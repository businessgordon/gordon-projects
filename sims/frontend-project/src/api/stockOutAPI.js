import api from './api';

export const stockOutAPI = {
  getAllStockOut: () =>
    api.get('/stockout'),

  getStockOutById: (id) =>
    api.get(`/stockout/${id}`),

  createStockOut: (data) =>
    api.post('/stockout', data),

  updateStockOut: (id, data) =>
    api.put(`/stockout/${id}`, data),

  deleteStockOut: (id) =>
    api.delete(`/stockout/${id}`)
};
