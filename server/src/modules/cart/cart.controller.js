const prisma = require('../../lib/prisma');

// Helper to get or create cart for user
const getOrCreateCart = async (userId) => {
  let cart = await prisma.cart.findFirst({ where: { userId }, include: { items: true } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId }, include: { items: true } });
  }
  return cart;
};

exports.getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    res.status(200).json({ status: 'success', data: cart });
  } catch (error) {
    next(error);
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const { mealId, mealName, mealImage, quantity = 1 } = req.body;
    const cart = await getOrCreateCart(req.user.id);

    const existingItem = cart.items.find(item => item.mealId === String(mealId));

    if (existingItem) {
      const updatedItem = await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity }
      });
      return res.status(200).json({ status: 'success', data: updatedItem });
    }

    const newItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        mealId: String(mealId),
        mealName,
        mealImage,
        quantity
      }
    });

    res.status(201).json({ status: 'success', data: newItem });
  } catch (error) {
    next(error);
  }
};

exports.updateCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    const updatedItem = await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity }
    });

    res.status(200).json({ status: 'success', data: updatedItem });
  } catch (error) {
    next(error);
  }
};

exports.removeCartItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    await prisma.cartItem.delete({ where: { id: itemId } });
    res.status(200).json({ status: 'success', message: 'Item dihapus dari keranjang' });
  } catch (error) {
    next(error);
  }
};
