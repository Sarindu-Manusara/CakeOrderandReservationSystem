import express from 'express';
import { createCustomCake, getCustomCakes, getAllCustomCakes, deleteCustomCake, updateCustomCake } from '../controllers/customCakeController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createCustomCake)
  .get(protect, getCustomCakes);

  router.route('/all').get(protect, getAllCustomCakes);

  router.route('/:id').delete(protect, admin , deleteCustomCake);

  router.route('/:id').put(protect, admin , updateCustomCake);

export default router;