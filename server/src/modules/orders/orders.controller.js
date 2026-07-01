const prisma = require('../../lib/prisma');

// Shipping cost lookup
const SHIPPING_COSTS = {
  regular: 10000,
  express: 20000,
  same_day: 35000
};

const PRICE_PER_ITEM = 25000;

// Valid state transitions for ORDER OWNER (user)
const USER_TRANSITIONS = {
  pending_payment: ['cancelled'],
  delivered: ['completed']
};

/**
 * POST /orders/checkout - Create a new order
 */
exports.createOrder = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { items, shippingAddress, shippingMethod, paymentMethod, notes } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ status: 'fail', message: 'Keranjang belanja kosong.' });
    }
    if (!shippingAddress || shippingAddress.trim() === '') {
      return res.status(400).json({ status: 'fail', message: 'Alamat pengiriman harus diisi.' });
    }
    if (!paymentMethod) {
      return res.status(400).json({ status: 'fail', message: 'Metode pembayaran harus dipilih.' });
    }

    const shippingCost = SHIPPING_COSTS[shippingMethod] || SHIPPING_COSTS.regular;
    const subtotal = items.reduce((sum, item) => sum + (PRICE_PER_ITEM * item.quantity), 0);
    const total = subtotal + shippingCost;

    const result = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          total,
          status: 'pending_payment',
          paymentMethod: paymentMethod || 'transfer_bank',
          shippingMethod: shippingMethod || 'regular',
          shippingCost,
          shippingAddress: shippingAddress.trim(),
          notes: notes || null,
          items: {
            create: items.map(item => ({
              mealId: item.id || item.mealId,
              mealName: item.name || item.mealName,
              mealImage: item.image || item.strMealThumb || item.mealImage || '',
              quantity: item.quantity
            }))
          }
        },
        include: { items: true }
      });

      return order;
    });

    res.status(201).json({
      status: 'success',
      message: 'Pesanan berhasil dibuat. Silakan lakukan pembayaran.',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /orders/:id/pay - Simulate payment
 */
exports.simulatePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findUnique({ where: { id } });

    if (!order || order.userId !== userId) {
      return res.status(404).json({ status: 'fail', message: 'Pesanan tidak ditemukan.' });
    }

    if (order.status !== 'pending_payment') {
      return res.status(400).json({
        status: 'fail',
        message: `Pesanan tidak bisa dibayar. Status saat ini: ${order.status}`
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        status: 'paid',
        paidAt: new Date()
      },
      include: { items: true }
    });

    res.status(200).json({
      status: 'success',
      message: 'Pembayaran berhasil!',
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /orders/:id/cancel - Cancel an order (only from pending_payment)
 */
exports.cancelOrder = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findUnique({ where: { id } });

    if (!order || order.userId !== userId) {
      return res.status(404).json({ status: 'fail', message: 'Pesanan tidak ditemukan.' });
    }

    if (order.status !== 'pending_payment') {
      return res.status(400).json({
        status: 'fail',
        message: `Pesanan tidak bisa dibatalkan. Status saat ini: ${order.status}`
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: 'cancelled' }
    });

    res.status(200).json({
      status: 'success',
      message: 'Pesanan berhasil dibatalkan.',
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /orders/:id/confirm - Confirm order received (only from delivered)
 */
exports.confirmReceived = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const order = await prisma.order.findUnique({ where: { id } });

    if (!order || order.userId !== userId) {
      return res.status(404).json({ status: 'fail', message: 'Pesanan tidak ditemukan.' });
    }

    if (order.status !== 'delivered') {
      return res.status(400).json({
        status: 'fail',
        message: `Pesanan belum sampai. Status saat ini: ${order.status}`
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: 'completed' }
    });

    res.status(200).json({
      status: 'success',
      message: 'Pesanan telah selesai. Terima kasih!',
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /orders - Get all orders for current user
 */
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

/**
 * GET /orders/:id - Get single order detail
 */
exports.getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: true, user: { select: { id: true, name: true, email: true } } }
    });

    if (!order || order.userId !== req.user.id) {
      return res.status(404).json({ status: 'fail', message: 'Pesanan tidak ditemukan.' });
    }

    res.status(200).json({ status: 'success', data: order });
  } catch (error) {
    next(error);
  }
};
