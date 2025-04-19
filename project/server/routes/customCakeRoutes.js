import express from 'express';
import { createCustomCake, getCustomCakes, getAllCustomCakes } from '../controllers/customCakeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createCustomCake)
  .get(protect, getCustomCakes);

  router.route('/all').get(protect, getAllCustomCakes);

export default router;