import express from 'express';
import { createCustomCake, getCustomCakes } from '../controllers/customCakeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createCustomCake)
  .get(protect, getCustomCakes);

export default router;