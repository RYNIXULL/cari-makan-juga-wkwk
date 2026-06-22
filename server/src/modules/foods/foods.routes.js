const express = require('express');
const router = express.Router();
const foodsController = require('./foods.controller');

// GET /api/foods/search?q=query
router.get('/search', foodsController.searchFoods);

// GET /api/foods/:id
router.get('/:id', foodsController.getFoodById);

module.exports = router;
