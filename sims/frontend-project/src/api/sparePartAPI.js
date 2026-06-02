import api from './api';

export const sparePartAPI = {
  getAllSpareParts: () =>
    api.get('/spareparts'),

  getSparePartById: (id) =>
    api.get(`/spareparts/${id}`),

  createSparePart: (data) =>
    api.post('/spareparts', data),

  updateSparePart: (id, data) =>
    api.put(`/spareparts/${id}`, data),

  deleteSparePart: (id) =>
    api.delete(`/spareparts/${id}`)
};
