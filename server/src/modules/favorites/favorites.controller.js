const prisma = require('../../lib/prisma');

exports.getFavorites = async (req, res, next) => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ status: 'success', data: favorites });
  } catch (error) {
    next(error);
  }
};

exports.addFavorite = async (req, res, next) => {
  try {
    const { mealId } = req.body;
    if (!mealId) return res.status(400).json({ status: 'fail', message: 'mealId harus disertakan' });

    const existing = await prisma.favorite.findFirst({
      where: { userId: req.user.id, mealId }
    });

    if (existing) {
      return res.status(400).json({ status: 'fail', message: 'Makanan sudah ada di daftar favorit' });
    }

    const favorite = await prisma.favorite.create({
      data: { userId: req.user.id, mealId }
    });

    res.status(201).json({ status: 'success', data: favorite });
  } catch (error) {
    next(error);
  }
};

exports.removeFavorite = async (req, res, next) => {
  try {
    const { mealId } = req.params;
    
    await prisma.favorite.deleteMany({
      where: { userId: req.user.id, mealId }
    });

    res.status(200).json({ status: 'success', message: 'Dihapus dari favorit' });
  } catch (error) {
    next(error);
  }
};
