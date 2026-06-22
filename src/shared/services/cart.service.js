import api from './api';

export const cartService = {
  getCart: () => api.get('/cart'),
  addToCart: (mealId, mealName, mealImage, quantity) => 
    api.post('/cart', { mealId, mealName, mealImage, quantity }),
  updateQuantity: (itemId, quantity) => 
    api.patch(`/cart/${itemId}`, { quantity }),
  removeItem: (itemId) => api.delete(`/cart/${itemId}`),
};
