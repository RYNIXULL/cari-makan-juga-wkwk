const express = require('express');
const router = express.Router();
const favoritesController = require('./favorites.controller');
const authMiddleware = require('../../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/', favoritesController.getFavorites);
router.post('/', favoritesController.addFavorite);
router.delete('/:mealId', favoritesController.removeFavorite);

module.exports = router;
