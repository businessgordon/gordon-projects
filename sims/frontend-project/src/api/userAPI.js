import api from './api';

export const userAPI = {
  register: (username, password, confirmPassword) =>
    api.post('/users/register', { username, password, confirmPassword }),

  login: (username, password) =>
    api.post('/users/login', { username, password }),

  logout: () =>
    api.post('/users/logout'),

  getCurrentUser: () =>
    api.get('/users/me')
};
