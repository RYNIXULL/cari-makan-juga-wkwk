import api from './api';

export const ordersService = {
  checkout: () => api.post('/orders/checkout'),
  getOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
};
