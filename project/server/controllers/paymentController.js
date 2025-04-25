import Payment from '../models/paymentModel.js';
import Order from '../models/orderModel.js';

// @desc    Process payment for an order
// @route   POST /api/payments
// @access  Private
const processPayment = async (req, res) => {
  try {
    const {
      orderId,
      paymentMethod,
      cardNumber,
      expiryDate,
      cvv
    } = req.body;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (order.isPaid) {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    // In a real application, you would integrate with a payment processor here
    // For demo purposes, we'll simulate a successful payment
    const payment = new Payment({
      order: orderId,
      user: req.user._id,
      amount: order.totalPrice,
      paymentMethod,
      status: 'completed',
      transactionId: `txn_${Date.now()}`,
      cardLast4: cardNumber.slice(-4),
      metadata: {
        expiryDate,
        orderId: order._id.toString()
      }
    });

    const savedPayment = await payment.save();

    // Update order status
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: savedPayment.transactionId,
      status: savedPayment.status,
      update_time: savedPayment.updatedAt.toISOString(),
      email_address: req.user.email
    };

    await order.save();

    res.status(200).json(savedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get payment details
// @route   GET /api/payments/:id
// @access  Private
const getPaymentDetails = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('order')
      .populate('user', 'name email');

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Check if user owns the payment or is admin
    if (payment.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Refund payment
// @route   POST /api/payments/:id/refund
// @access  Private/Admin
const refundPayment = async (req, res) => {
  try {
    const { reason } = req.body;
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    if (payment.status === 'refunded') {
      return res.status(400).json({ message: 'Payment is already refunded' });
    }

    // In a real application, you would integrate with a payment processor here
    // For demo purposes, we'll simulate a successful refund
    payment.status = 'refunded';
    payment.refundReason = reason;

    const updatedPayment = await payment.save();

    // Update order status
    const order = await Order.findById(payment.order);
    if (order) {
      order.isPaid = false;
      order.paymentResult = {
        ...order.paymentResult,
        status: 'refunded'
      };
      await order.save();
    }

    res.json(updatedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private/Admin
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({})
      .populate('order')
      .populate('user', 'name email')
      .sort('-createdAt');

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a payment
// @route   DELETE /api/payments/:id
// @access  Private/Admin
const deletePayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id);

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Also roll back order status if payment was completed
    const order = await Order.findById(payment.order);
    if (order && payment.status === 'completed') {
      order.isPaid = false;
      order.paymentResult = {};
      await order.save();
    }

    await payment.deleteOne();

    res.json({ message: 'Payment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export {
  processPayment,
  getPaymentDetails,
  refundPayment,
  getPayments,
  deletePayment
};