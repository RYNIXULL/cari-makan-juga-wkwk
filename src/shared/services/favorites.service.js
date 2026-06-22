import api from './api';

export const favoritesService = {
  getFavorites: () => api.get('/favorites'),
  addFavorite: (mealId) => api.post('/favorites', { mealId }),
  removeFavorite: (mealId) => api.delete(`/favorites/${mealId}`),
};
