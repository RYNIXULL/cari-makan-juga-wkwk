const prisma = require('../../lib/prisma');

exports.checkout = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const cart = await prisma.cart.findFirst({
      where: { userId },
      include: { items: true }
    });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ status: 'fail', message: 'Keranjang belanja kosong.' });
    }

    // Assumed fixed price for now since MealDB doesn't have prices
    const PRICE_PER_ITEM = 25000;
    const total = cart.items.reduce((sum, item) => sum + (PRICE_PER_ITEM * item.quantity), 0);

    // Create Order and OrderItems, then clear Cart in a transaction
    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          total,
          status: 'paid',
          items: {
            create: cart.items.map(item => ({
              mealId: item.mealId,
              mealName: item.mealName,
              mealImage: item.mealImage,
              quantity: item.quantity
            }))
          }
        },
        include: { items: true }
      });

      // Clear the cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return order;
    });

    res.status(201).json({
      status: 'success',
      message: 'Checkout berhasil',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    });
    res.status(200).json({ status: 'success', data: orders });
  } catch (error) {
    next(error);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true }
    });

    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ status: 'fail', message: 'Order tidak ditemukan' });
    }

    res.status(200).json({ status: 'success', data: order });
  } catch (error) {
    next(error);
  }
};
