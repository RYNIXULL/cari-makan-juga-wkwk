import api from './api';

export const ordersService = {
  createOrder: (data) => api.post('/orders/checkout', data),
  simulatePayment: (orderId) => api.post(`/orders/${orderId}/pay`),
  cancelOrder: (orderId) => api.post(`/orders/${orderId}/cancel`),
  confirmReceived: (orderId) => api.post(`/orders/${orderId}/confirm`),
  getOrders: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`),
};
