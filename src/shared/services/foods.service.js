import api from './api';

export const foodsService = {
  search: (query) => api.get(`/foods/search?q=${query}`),
  getById: (id) => api.get(`/foods/${id}`),
};
