require('dotenv').config();
const express = require('express');
const cors = require('cors');
const errorHandler = require('./src/middleware/errorHandler');

const authRoutes = require('./src/modules/auth/auth.routes');
const foodsRoutes = require('./src/modules/foods/foods.routes');
const favoritesRoutes = require('./src/modules/favorites/favorites.routes');
const cartRoutes = require('./src/modules/cart/cart.routes');
const ordersRoutes = require('./src/modules/orders/orders.routes');
const adminRoutes = require('./src/modules/admin/admin.routes');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/foods', foodsRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin', adminRoutes);
// Global Error Handler
app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`[Server] Running beautifully on http://localhost:${PORT}`);
  });
}

module.exports = app;
