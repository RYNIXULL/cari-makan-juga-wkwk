const prisma = require('../../lib/prisma');

// Valid admin state transitions
const ADMIN_TRANSITIONS = {
  paid: ['processing'],
  processing: ['shipped'],
  shipped: ['delivered']
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    next(error);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: true
      },
      orderBy: { createdAt: 'desc' }
    });
    res.status(200).json({ status: 'success', data: orders });
  } catch (error) {
    next(error);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status: newStatus } = req.body;

    const order = await prisma.order.findUnique({ where: { id } });

    if (!order) {
      return res.status(404).json({ status: 'fail', message: 'Pesanan tidak ditemukan.' });
    }

    // Check if transition is valid
    const allowedTransitions = ADMIN_TRANSITIONS[order.status];

    if (!allowedTransitions || !allowedTransitions.includes(newStatus)) {
      return res.status(400).json({
        status: 'fail',
        message: `Tidak bisa mengubah status dari "${order.status}" ke "${newStatus}". Transisi yang valid: ${allowedTransitions ? allowedTransitions.join(', ') : 'tidak ada'}.`
      });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: newStatus },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: true
      }
    });

    res.status(200).json({
      status: 'success',
      message: `Status pesanan berhasil diubah ke "${newStatus}".`,
      data: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};
