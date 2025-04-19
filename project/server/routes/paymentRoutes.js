import express from 'express';
import {
  processPayment,
  getPaymentDetails,
  refundPayment,
  getPayments
} from '../controllers/paymentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, processPayment)
  .get(protect, admin, getPayments);

router.route('/:id')
  .get(protect, getPaymentDetails);

router.route('/:id/refund')
  .post(protect, admin, refundPayment);

export default router;